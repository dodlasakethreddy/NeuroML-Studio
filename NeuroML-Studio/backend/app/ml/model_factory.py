from typing import Dict, Any
from app.ml.classification import (
    get_logistic_regression,
    get_knn,
    get_decision_tree_classifier,
    get_random_forest_classifier,
    get_svc,
    get_gaussian_nb,
    get_gradient_boosting_classifier,
    get_xgboost_classifier,
)
from app.ml.regression import (
    get_linear_regression,
    get_polynomial_regression,
    get_ridge,
    get_lasso,
    get_decision_tree_regressor,
    get_random_forest_regressor,
    get_svr,
    get_gradient_boosting_regressor,
    get_xgboost_regressor,
)

CLASSIFICATION_MAP = {
    "logistic_regression": get_logistic_regression,
    "logistic regression": get_logistic_regression,
    "knn": get_knn,
    "k-nearest neighbors": get_knn,
    "k_nearest_neighbors": get_knn,
    "decision_tree": get_decision_tree_classifier,
    "decision tree": get_decision_tree_classifier,
    "decision_tree_classifier": get_decision_tree_classifier,
    "random_forest": get_random_forest_classifier,
    "random forest": get_random_forest_classifier,
    "random_forest_classifier": get_random_forest_classifier,
    "svc": get_svc,
    "svm": get_svc,
    "support vector machine": get_svc,
    "support_vector_machine": get_svc,
    "naive_bayes": get_gaussian_nb,
    "naive bayes": get_gaussian_nb,
    "gaussian_nb": get_gaussian_nb,
    "gradient_boosting": get_gradient_boosting_classifier,
    "gradient boosting": get_gradient_boosting_classifier,
    "gradient_boosting_classifier": get_gradient_boosting_classifier,
    "xgboost": get_xgboost_classifier,
    "xgboost classifier": get_xgboost_classifier,
    "xgboost_classifier": get_xgboost_classifier,
}

REGRESSION_MAP = {
    "linear_regression": get_linear_regression,
    "linear regression": get_linear_regression,
    "polynomial_regression": get_polynomial_regression,
    "polynomial regression": get_polynomial_regression,
    "ridge": get_ridge,
    "ridge_regression": get_ridge,
    "ridge regression": get_ridge,
    "lasso": get_lasso,
    "lasso_regression": get_lasso,
    "lasso regression": get_lasso,
    "decision_tree_regressor": get_decision_tree_regressor,
    "decision tree regressor": get_decision_tree_regressor,
    "decision_tree": get_decision_tree_regressor,
    "rf_regressor": get_random_forest_regressor,
    "random_forest_regressor": get_random_forest_regressor,
    "random forest regressor": get_random_forest_regressor,
    "random_forest": get_random_forest_regressor,
    "svr": get_svr,
    "support_vector_regressor": get_svr,
    "support vector regressor": get_svr,
    "gb_regressor": get_gradient_boosting_regressor,
    "gradient_boosting_regressor": get_gradient_boosting_regressor,
    "gradient boosting regressor": get_gradient_boosting_regressor,
    "gradient_boosting": get_gradient_boosting_regressor,
    "xgboost_regressor": get_xgboost_regressor,
    "xgboost regressor": get_xgboost_regressor,
    "xgboost": get_xgboost_regressor,
}

def create_model(problem_type: str, algorithm_name: str, hyperparameters: Dict[str, Any] = None):
    """
    Factory method to instantiate a scikit-learn or XGBoost estimator
    based on the problem type and algorithm name.
    """
    if hyperparameters is None:
        hyperparameters = {}

    key = algorithm_name.strip().lower()

    if problem_type.lower() == "classification":
        if key not in CLASSIFICATION_MAP:
            # Try fuzzy key lookup
            matched = None
            for k in CLASSIFICATION_MAP:
                if k in key or key in k:
                    matched = k
                    break
            if not matched:
                raise ValueError(
                    f"Unsupported classification algorithm: '{algorithm_name}'. "
                    f"Supported algorithms: {list(set(CLASSIFICATION_MAP.keys()))}"
                )
            key = matched
        return CLASSIFICATION_MAP[key](hyperparameters)

    elif problem_type.lower() == "regression":
        if key not in REGRESSION_MAP:
            matched = None
            for k in REGRESSION_MAP:
                if k in key or key in k:
                    matched = k
                    break
            if not matched:
                raise ValueError(
                    f"Unsupported regression algorithm: '{algorithm_name}'. "
                    f"Supported algorithms: {list(set(REGRESSION_MAP.keys()))}"
                )
            key = matched
        return REGRESSION_MAP[key](hyperparameters)

    else:
        raise ValueError(f"Invalid problem type: '{problem_type}'. Must be 'Classification' or 'Regression'.")
