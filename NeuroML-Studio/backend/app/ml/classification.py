from typing import Dict, Any
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
import xgboost as xgb

def get_logistic_regression(params: Dict[str, Any]) -> LogisticRegression:
    c_val = float(params.get("C", 1.0))
    max_iter = int(params.get("max_iter", 200))
    solver = str(params.get("solver", "lbfgs"))
    return LogisticRegression(C=c_val, max_iter=max_iter, solver=solver, random_state=42)

def get_knn(params: Dict[str, Any]) -> KNeighborsClassifier:
    n_neighbors = int(params.get("n_neighbors", 5))
    weights = str(params.get("weights", "uniform"))
    metric = str(params.get("metric", "minkowski"))
    return KNeighborsClassifier(n_neighbors=n_neighbors, weights=weights, metric=metric)

def get_decision_tree_classifier(params: Dict[str, Any]) -> DecisionTreeClassifier:
    max_depth = params.get("max_depth")
    if max_depth is not None:
        max_depth = int(max_depth)
    min_samples_split = int(params.get("min_samples_split", 2))
    criterion = str(params.get("criterion", "gini"))
    return DecisionTreeClassifier(max_depth=max_depth, min_samples_split=min_samples_split, criterion=criterion, random_state=42)

def get_random_forest_classifier(params: Dict[str, Any]) -> RandomForestClassifier:
    n_estimators = int(params.get("n_estimators", 100))
    max_depth = params.get("max_depth")
    if max_depth is not None:
        max_depth = int(max_depth)
    min_samples_split = int(params.get("min_samples_split", 2))
    criterion = str(params.get("criterion", "gini"))
    return RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        criterion=criterion,
        random_state=42,
        n_jobs=-1
    )

def get_svc(params: Dict[str, Any]) -> SVC:
    c_val = float(params.get("C", 1.0))
    kernel = str(params.get("kernel", "rbf"))
    gamma = str(params.get("gamma", "scale"))
    # probability=True is essential for predicting class probabilities
    return SVC(C=c_val, kernel=kernel, gamma=gamma, probability=True, random_state=42)

def get_gaussian_nb(params: Dict[str, Any]) -> GaussianNB:
    var_smoothing = float(params.get("var_smoothing", 1e-9))
    return GaussianNB(var_smoothing=var_smoothing)

def get_gradient_boosting_classifier(params: Dict[str, Any]) -> GradientBoostingClassifier:
    n_estimators = int(params.get("n_estimators", 100))
    learning_rate = float(params.get("learning_rate", 0.1))
    max_depth = int(params.get("max_depth", 3))
    return GradientBoostingClassifier(
        n_estimators=n_estimators,
        learning_rate=learning_rate,
        max_depth=max_depth,
        random_state=42
    )

def get_xgboost_classifier(params: Dict[str, Any]) -> xgb.XGBClassifier:
    n_estimators = int(params.get("n_estimators", 100))
    learning_rate = float(params.get("learning_rate", 0.1))
    max_depth = int(params.get("max_depth", 6))
    subsample = float(params.get("subsample", 0.8))
    return xgb.XGBClassifier(
        n_estimators=n_estimators,
        learning_rate=learning_rate,
        max_depth=max_depth,
        subsample=subsample,
        random_state=42,
        eval_metric="logloss"
    )
