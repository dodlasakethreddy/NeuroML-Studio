from typing import Dict, Any, List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.database.models import User, TrainingJob, TrainedModel

class EvaluationService:

    @staticmethod
    def compare_job_models(job_id: str, user: User, db: Session) -> Dict[str, Any]:
        job = db.query(TrainingJob).filter(TrainingJob.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Training job not found")
        if job.user_id != user.id:
            raise HTTPException(status_code=403, detail="Access denied to this training job")

        models = db.query(TrainedModel).filter(TrainedModel.training_job_id == job.id).all()
        if not models:
            raise HTTPException(status_code=400, detail="No models found for this training job.")

        is_classification = job.problem_type.lower() == "classification"

        # Sort models to identify best model
        # Classification: highest accuracy; Regression: highest r2Score
        if is_classification:
            sorted_models = sorted(
                models,
                key=lambda m: m.metrics.get("accuracy", 0.0),
                reverse=True
            )
        else:
            sorted_models = sorted(
                models,
                key=lambda m: m.metrics.get("r2Score", -999.0),
                reverse=True
            )

        best_model_obj = sorted_models[0]

        comparison_items = []
        chart_data = []

        colors = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#06B6D4"]

        for idx, m in enumerate(sorted_models):
            is_best = (m.id == best_model_obj.id)
            item = {
                "id": m.id,
                "name": m.model_name,
                "algorithm": m.algorithm,
                "metrics": m.metrics,
                "duration": m.metrics.get("training_duration", "1.0s"),
                "is_best": is_best,
                "confusion_matrix": m.metrics.get("confusion_matrix") if is_classification else None
            }
            comparison_items.append(item)

            if is_classification:
                chart_data.append({
                    "name": m.algorithm,
                    "Accuracy": m.metrics.get("accuracy", 0),
                    "Precision": m.metrics.get("precision", 0),
                    "Recall": m.metrics.get("recall", 0),
                    "F1Score": m.metrics.get("f1Score", 0),
                    "color": colors[idx % len(colors)]
                })
            else:
                r2 = m.metrics.get("r2Score", 0)
                chart_data.append({
                    "name": m.algorithm,
                    "R2Score": round(r2 * 100, 1),
                    "MAE": round(m.metrics.get("mae", 0) * 100, 1),
                    "RMSE": round(m.metrics.get("rmse", 0) * 100, 1),
                    "color": colors[idx % len(colors)]
                })

        best_model_summary = comparison_items[0] if comparison_items else None

        return {
            "training_job_id": job.id,
            "problem_type": job.problem_type,
            "dataset_name": job.dataset.dataset_name if job.dataset else "Dataset",
            "best_model": best_model_summary,
            "models": comparison_items,
            "chart_data": chart_data
        }
