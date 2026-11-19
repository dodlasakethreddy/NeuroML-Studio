import os
import time
import uuid
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
import joblib
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder

from app.core.config import settings
from app.database.connection import get_session
from app.database.models import User, Dataset, TrainingJob, TrainedModel
from app.schemas.training import TrainingRequest
from app.ml.preprocessing import separate_feature_types, build_preprocessor
from app.ml.model_factory import create_model
from app.ml.evaluation import evaluate_classification, evaluate_regression

logger = logging.getLogger(__name__)

class TrainingService:

    @staticmethod
    def run_background_training(job_id: str, user_id: int, req: TrainingRequest):
        """Asynchronous background worker execution for training job."""
        db: Optional[Session] = None
        try:
            db = get_session()
            TrainingService.execute_training_job(job_id=job_id, user_id=user_id, req=req, db=db)
        except Exception as e:
            logger.error(f"Background training failed for job {job_id}: {e}", exc_info=True)
            if db is not None:
                try:
                    job = db.query(TrainingJob).filter(TrainingJob.id == job_id).first()
                    if job:
                        job.status = "Failed"
                        job.completed_at = datetime.now(timezone.utc)
                        job.error_message = str(e)
                        db.commit()
                except Exception as inner_e:
                    logger.error(f"Failed to record training error status: {inner_e}")
        finally:
            if db is not None:
                db.close()

    @staticmethod
    def execute_training_job(
        job_id: str,
        user_id: int,
        req: TrainingRequest,
        db: Session
    ) -> List[Dict[str, Any]]:
        """
        Executes the full training workflow:
        Preprocessing -> Model initialization -> Fit -> Evaluation -> Joblib Persistence -> Database Records.
        """
        job = db.query(TrainingJob).filter(TrainingJob.id == job_id).first()
        if not job:
            return []

        job.status = "Running"
        db.commit()

        try:
            # 1. Validate dataset
            dataset = db.query(Dataset).filter(Dataset.id == req.dataset_id).first()
            if not dataset or not os.path.exists(dataset.file_path):
                raise ValueError("Dataset not found or CSV file missing from storage.")

            # 2. Load CSV
            df = pd.read_csv(dataset.file_path)

            # 3. Validate target column
            if req.target_column not in df.columns:
                raise ValueError(f"Target column '{req.target_column}' does not exist in dataset.")

            # Drop rows where target is NaN
            df = df.dropna(subset=[req.target_column])

            # 4. Separate X and y
            y = df[req.target_column]
            
            # 5. Validate selected features
            features = [f for f in req.selected_features if f in df.columns and f != req.target_column]
            if not features:
                features = [col for col in df.columns if col != req.target_column]
            if not features:
                raise ValueError("No valid features selected for training.")

            X = df[features]

            # 6. Detect numerical and categorical columns
            num_cols, cat_cols = separate_feature_types(df, features)

            # 7. Encode target for classification and split data
            is_classification = req.problem_type.lower() == "classification"
            label_encoder = None
            class_labels = None

            if is_classification:
                label_encoder = LabelEncoder()
                # Fit on all values of y so y_test never contains unseen labels
                y_encoded = label_encoder.fit_transform(y)
                class_labels = [str(c) for c in label_encoder.classes_]
            else:
                y_encoded = y.to_numpy() if hasattr(y, 'to_numpy') else np.array(y)

            stratify = y_encoded if (is_classification and pd.Series(y_encoded).nunique() > 1 and pd.Series(y_encoded).value_counts().min() >= 2) else None

            X_train, X_test, y_train_fit, y_test_eval = train_test_split(
                X, y_encoded,
                test_size=req.test_size,
                random_state=req.random_state,
                stratify=stratify
            )
            y_test = y_test_eval

            # Storage directory for this user
            user_models_dir = os.path.join(settings.MODELS_DIR, f"user_{user_id}")
            os.makedirs(user_models_dir, exist_ok=True)

            trained_results = []

            # 8-12. Loop through selected algorithms
            for algo_identifier in req.algorithms:
                start_time = time.time()
                algo_params = (req.hyperparameters or {}).get(algo_identifier, {})

                # 8. Build preprocessor for this pipeline
                preprocessor = build_preprocessor(
                    numerical_cols=num_cols,
                    categorical_cols=cat_cols,
                    missing_strategy="median",
                    encoding_method="one_hot",
                    scaling_method="standard"
                )

                # 9. Initialize algorithm estimator
                estimator = create_model(
                    problem_type=req.problem_type,
                    algorithm_name=algo_identifier,
                    hyperparameters=algo_params
                )

                # Assemble unified Scikit-Learn Pipeline
                full_pipeline = Pipeline(steps=[
                    ("preprocessor", preprocessor),
                    ("model", estimator)
                ])

                # 10. Train model with encoded target
                full_pipeline.fit(X_train, y_train_fit)

                # 11. Evaluate model
                y_pred = full_pipeline.predict(X_test)
                
                # Check for prediction probabilities if classification
                y_prob = None
                if is_classification and hasattr(full_pipeline, "predict_proba"):
                    try:
                        y_prob = full_pipeline.predict_proba(X_test)
                    except Exception:
                        y_prob = None

                elapsed_seconds = round(time.time() - start_time, 2)
                duration_str = f"{elapsed_seconds}s"

                if is_classification:
                    metrics = evaluate_classification(
                        y_test_eval, y_pred, y_prob=y_prob, labels=list(range(len(class_labels)))
                    )
                    # Restore human-readable class names in confusion matrix & report
                    if "confusion_matrix" in metrics:
                        metrics["confusion_matrix"]["labels"] = class_labels
                    if "classification_report" in metrics and isinstance(metrics["classification_report"], dict):
                        mapped_report = {}
                        for k, v in metrics["classification_report"].items():
                            if k.isdigit() and int(k) < len(class_labels):
                                mapped_report[class_labels[int(k)]] = v
                            else:
                                mapped_report[k] = v
                        metrics["classification_report"] = mapped_report
                else:
                    metrics = evaluate_regression(y_test, y_pred)

                metrics["training_duration"] = duration_str

                # 12. Save full fitted pipeline artifact with Joblib
                model_id = str(uuid.uuid4())
                model_filename = f"{model_id}.joblib"
                model_path = os.path.join(user_models_dir, model_filename)

                artifact_bundle = {
                    "pipeline": full_pipeline,
                    "model_id": model_id,
                    "user_id": user_id,
                    "dataset_id": dataset.id,
                    "dataset_name": dataset.dataset_name,
                    "algorithm": algo_identifier,
                    "problem_type": req.problem_type,
                    "target_column": req.target_column,
                    "feature_columns": features,
                    "numerical_columns": num_cols,
                    "categorical_columns": cat_cols,
                    "class_labels": class_labels,
                    "label_encoder": label_encoder,
                    "metrics": metrics,
                    "hyperparameters": algo_params,
                    "created_at": datetime.now(timezone.utc).isoformat()
                }

                joblib.dump(artifact_bundle, model_path, compress=3)

                # 13. Save in PostgreSQL
                db_model = TrainedModel(
                    id=model_id,
                    user_id=user_id,
                    dataset_id=dataset.id,
                    training_job_id=job.id,
                    model_name=f"{algo_identifier} ({dataset.dataset_name.replace('.csv', '')})",
                    algorithm=algo_identifier,
                    problem_type=req.problem_type,
                    target_column=req.target_column,
                    feature_columns=features,
                    model_path=model_path,
                    metrics=metrics
                )
                db.add(db_model)
                db.commit()
                db.refresh(db_model)

                trained_results.append({
                    "id": db_model.id,
                    "name": db_model.model_name,
                    "algorithm": db_model.algorithm,
                    "metrics": metrics,
                    "duration": duration_str,
                    "model_path": model_path
                })

            # Update job status
            job.status = "Completed"
            job.completed_at = datetime.now(timezone.utc)
            db.commit()

            return trained_results

        except Exception as e:
            db.rollback()
            job.status = "Failed"
            job.completed_at = datetime.now(timezone.utc)
            job.error_message = str(e)
            db.commit()
            raise e

    @staticmethod
    def start_training_job(
        req: TrainingRequest,
        user: User,
        db: Session
    ) -> TrainingJob:
        job_id = str(uuid.uuid4())
        job = TrainingJob(
            id=job_id,
            user_id=user.id,
            dataset_id=req.dataset_id,
            target_column=req.target_column,
            problem_type=req.problem_type,
            algorithms=req.algorithms,
            status="Pending",
            started_at=datetime.now(timezone.utc)
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def get_job_status(
        job_id: str,
        user: User,
        db: Session
    ) -> Dict[str, Any]:
        job = db.query(TrainingJob).filter(TrainingJob.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Training job not found")
        if job.user_id != user.id:
            raise HTTPException(status_code=403, detail="Access denied to this training job")

        models = db.query(TrainedModel).filter(TrainedModel.training_job_id == job_id).all()
        models_data = []
        for m in models:
            models_data.append({
                "id": m.id,
                "name": m.model_name,
                "algorithm": m.algorithm,
                "metrics": m.metrics,
                "duration": m.metrics.get("training_duration", "1.5s"),
                "is_best": False
            })

        return {
            "job_id": job.id,
            "status": job.status,
            "dataset_id": job.dataset_id,
            "dataset_name": job.dataset.dataset_name if job.dataset else "Dataset",
            "problem_type": job.problem_type,
            "target_column": job.target_column,
            "selected_algorithms": job.algorithms,
            "started_at": job.started_at,
            "completed_at": job.completed_at,
            "error_message": job.error_message,
            "models": models_data
        }

    @staticmethod
    def get_user_training_history(user: User, db: Session) -> List[Dict[str, Any]]:
        models = (
            db.query(TrainedModel)
            .filter(TrainedModel.user_id == user.id)
            .order_by(TrainedModel.created_at.desc())
            .all()
        )
        history = []
        for m in models:
            history.append({
                "id": m.id,
                "modelName": m.model_name,
                "algorithm": m.algorithm,
                "datasetName": m.dataset.dataset_name if m.dataset else "Dataset",
                "problemType": m.problem_type,
                "target": m.target_column,
                "trainingDate": m.created_at.strftime("%b %d, %Y - %H:%M"),
                "duration": m.metrics.get("training_duration", "1.2s"),
                "metrics": m.metrics,
                "status": "Success",
                "hyperparameters": m.metrics.get("hyperparameters", {})
            })
        return history
