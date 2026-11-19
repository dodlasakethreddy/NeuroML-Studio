from typing import Dict, Any
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR
import xgboost as xgb

def get_linear_regression(params: Dict[str, Any]) -> LinearRegression:
    fit_intercept = bool(params.get("fit_intercept", True))
    return LinearRegression(fit_intercept=fit_intercept)

def get_polynomial_regression(params: Dict[str, Any]) -> Pipeline:
    degree = int(params.get("degree", 2))
    include_bias = bool(params.get("include_bias", False))
    return Pipeline([
        ("poly", PolynomialFeatures(degree=degree, include_bias=include_bias)),
        ("linear", LinearRegression())
    ])

def get_ridge(params: Dict[str, Any]) -> Ridge:
    alpha = float(params.get("alpha", 1.0))
    solver = str(params.get("solver", "auto"))
    return Ridge(alpha=alpha, solver=solver, random_state=42)

def get_lasso(params: Dict[str, Any]) -> Lasso:
    alpha = float(params.get("alpha", 0.1))
    max_iter = int(params.get("max_iter", 1000))
    return Lasso(alpha=alpha, max_iter=max_iter, random_state=42)

def get_decision_tree_regressor(params: Dict[str, Any]) -> DecisionTreeRegressor:
    max_depth = params.get("max_depth")
    if max_depth is not None:
        max_depth = int(max_depth)
    min_samples_split = int(params.get("min_samples_split", 2))
    return DecisionTreeRegressor(max_depth=max_depth, min_samples_split=min_samples_split, random_state=42)

def get_random_forest_regressor(params: Dict[str, Any]) -> RandomForestRegressor:
    n_estimators = int(params.get("n_estimators", 100))
    max_depth = params.get("max_depth")
    if max_depth is not None:
        max_depth = int(max_depth)
    min_samples_split = int(params.get("min_samples_split", 2))
    return RandomForestRegressor(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        random_state=42,
        n_jobs=-1
    )

def get_svr(params: Dict[str, Any]) -> SVR:
    c_val = float(params.get("C", 1.0))
    epsilon = float(params.get("epsilon", 0.1))
    kernel = str(params.get("kernel", "rbf"))
    return SVR(C=c_val, epsilon=epsilon, kernel=kernel)

def get_gradient_boosting_regressor(params: Dict[str, Any]) -> GradientBoostingRegressor:
    n_estimators = int(params.get("n_estimators", 100))
    learning_rate = float(params.get("learning_rate", 0.1))
    max_depth = int(params.get("max_depth", 3))
    return GradientBoostingRegressor(
        n_estimators=n_estimators,
        learning_rate=learning_rate,
        max_depth=max_depth,
        random_state=42
    )

def get_xgboost_regressor(params: Dict[str, Any]) -> xgb.XGBRegressor:
    n_estimators = int(params.get("n_estimators", 100))
    learning_rate = float(params.get("learning_rate", 0.1))
    max_depth = int(params.get("max_depth", 6))
    subsample = float(params.get("subsample", 0.8))
    return xgb.XGBRegressor(
        n_estimators=n_estimators,
        learning_rate=learning_rate,
        max_depth=max_depth,
        subsample=subsample,
        random_state=42
    )
