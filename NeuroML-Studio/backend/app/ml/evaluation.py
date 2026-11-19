from typing import Dict, Any, List
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    r2_score,
    mean_absolute_error,
    mean_squared_error,
)

def evaluate_classification(y_true, y_pred, y_prob=None, labels: List[Any] = None) -> Dict[str, Any]:
    """Calculate comprehensive classification metrics."""
    acc = float(accuracy_score(y_true, y_pred))
    
    # Handle multiclass vs binary gracefully with weighted average
    precision = float(precision_score(y_true, y_pred, average="weighted", zero_division=0))
    recall = float(recall_score(y_true, y_pred, average="weighted", zero_division=0))
    f1 = float(f1_score(y_true, y_pred, average="weighted", zero_division=0))

    # Confusion matrix
    if labels is None:
        unique_labels = sorted(list(set(y_true) | set(y_pred)))
    else:
        unique_labels = labels

    cm = confusion_matrix(y_true, y_pred, labels=unique_labels).tolist()

    # Detailed report
    report = classification_report(y_true, y_pred, output_dict=True, zero_division=0)

    # Format percentage display helpers for frontend
    return {
        "accuracy": round(acc * 100, 2),
        "precision": round(precision * 100, 2),
        "recall": round(recall * 100, 2),
        "f1Score": round(f1 * 100, 2),
        "raw_accuracy": acc,
        "raw_precision": precision,
        "raw_recall": recall,
        "raw_f1": f1,
        "confusion_matrix": {
            "matrix": cm,
            "labels": [str(l) for l in unique_labels]
        },
        "classification_report": report
    }

def evaluate_regression(y_true, y_pred) -> Dict[str, Any]:
    """Calculate comprehensive regression metrics."""
    r2 = float(r2_score(y_true, y_pred))
    mae = float(mean_absolute_error(y_true, y_pred))
    mse = float(mean_squared_error(y_true, y_pred))
    rmse = float(np.sqrt(mse))

    # Calculate small sample of residuals for visualization
    y_t = np.array(y_true)
    y_p = np.array(y_pred)
    sample_indices = np.random.choice(len(y_t), size=min(10, len(y_t)), replace=False)
    residuals_sample = [
        {
            "actual": round(float(y_t[idx]), 3),
            "predicted": round(float(y_p[idx]), 3),
            "residual": round(float(y_p[idx] - y_t[idx]), 3)
        }
        for idx in sample_indices
    ]

    return {
        "r2Score": round(r2, 4),
        "mae": round(mae, 4),
        "mse": round(mse, 4),
        "rmse": round(rmse, 4),
        "residuals": residuals_sample
    }
