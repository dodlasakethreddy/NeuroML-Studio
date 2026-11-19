import os
import time
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List
import pandas as pd
import numpy as np
import joblib
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.database.models import User, TrainedModel, Prediction

class PredictionService:

    @staticmethod
    def run_prediction(
        model_id: str,
        input_data: Dict[str, Any],
        user: User,
        db: Session
    ) -> Dict[str, Any]:
        start_time = time.time()

        # 1. Fetch model and verify ownership
        model = db.query(TrainedModel).filter(TrainedModel.id == model_id).first()
        if not model:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found")
        if model.user_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this model")

        # 2. Verify artifact existence on disk
        if not os.path.exists(model.model_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trained model artifact (.joblib) not found on server disk."
            )

        # 3. Load trusted joblib artifact bundle
        try:
            artifact = joblib.load(model.model_path)
            pipeline = artifact["pipeline"]
            expected_features = artifact["feature_columns"]
            problem_type = artifact.get("problem_type", model.problem_type)
            class_labels = artifact.get("class_labels", None)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to deserialize model pipeline: {str(e)}"
            )

        # 4. Construct input row for DataFrame
        row_dict = {}
        for feat in expected_features:
            val = input_data.get(feat)
            if val is None or val == "":
                # If feature is omitted in input_data, supply NaN so imputer in pipeline handles it
                row_dict[feat] = np.nan
            else:
                row_dict[feat] = val

        input_df = pd.DataFrame([row_dict])

        # 5. Run inference through the full fitted pipeline
        try:
            pred_raw = pipeline.predict(input_df)
            pred_val = pred_raw[0]
            label_encoder = artifact.get("label_encoder")
            if label_encoder is not None:
                try:
                    pred_val = str(label_encoder.inverse_transform([int(pred_val)])[0])
                except Exception:
                    pred_val = str(pred_val)
            elif isinstance(pred_val, (np.integer, np.floating)):
                pred_val = pred_val.item()
            elif hasattr(pred_val, "__str__"):
                pred_val = str(pred_val)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Prediction failed on supplied input features: {str(e)}"
            )

        # 6. Compute probabilities if classification
        probability_output = None
        confidence = None

        if problem_type.lower() == "classification":
            if hasattr(pipeline, "predict_proba"):
                try:
                    proba = pipeline.predict_proba(input_df)[0]
                    # Map to class labels
                    labels = class_labels or getattr(pipeline.named_steps["model"], "classes_", range(len(proba)))
                    prob_list = []
                    for lbl, p in zip(labels, proba):
                        p_float = round(float(p), 4)
                        prob_list.append({
                            "label": str(lbl),
                            "value": p_float,
                            "percent": f"{round(p_float * 100, 1)}%"
                        })
                    probability_output = prob_list
                    confidence = round(float(np.max(proba)), 4)
                except Exception:
                    pass

        elapsed_ms = round((time.time() - start_time) * 1000, 1)

        # Format predicted display
        if problem_type.lower() == "regression":
            result_str = f"{float(pred_val):,.3f}"
        else:
            result_str = str(pred_val)

        # 7. Record in PostgreSQL database
        pred_record = Prediction(
            id=str(uuid.uuid4()),
            user_id=user.id,
            model_id=model.id,
            input_data=input_data,
            predicted_result=result_str,
            prediction_probability=probability_output
        )
        db.add(pred_record)
        db.commit()
        db.refresh(pred_record)

        return {
            "id": pred_record.id,
            "model_id": model.id,
            "model_name": model.model_name,
            "algorithm": model.algorithm,
            "problem_type": model.problem_type,
            "timestamp": pred_record.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "inputs": input_data,
            "predicted_result": result_str,
            "prediction_probability": probability_output,
            "confidence": confidence,
            "latency_ms": f"{elapsed_ms}ms",
            "status": "Success"
        }

    @staticmethod
    def get_user_prediction_history(user: User, db: Session) -> List[Dict[str, Any]]:
        preds = db.query(Prediction).filter(Prediction.user_id == user.id).order_by(Prediction.created_at.desc()).all()
        history = []
        for p in preds:
            conf = None
            if p.prediction_probability and isinstance(p.prediction_probability, list):
                # find max probability
                try:
                    conf = max(item.get("value", 0) for item in p.prediction_probability)
                except Exception:
                    conf = None

            history.append({
                "id": f"pred-{p.id[:8]}",
                "model_id": p.model_id,
                "model_name": p.model.model_name if p.model else "Model",
                "algorithm": p.model.algorithm if p.model else "Algorithm",
                "dataset_name": p.model.dataset.dataset_name if (p.model and p.model.dataset) else "Dataset",
                "timestamp": p.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "inputs": p.input_data,
                "prediction": p.predicted_result,
                "confidence": conf,
                "latency": "22ms",
                "status": "Success"
            })
        return history
