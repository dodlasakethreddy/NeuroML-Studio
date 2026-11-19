from typing import List, Tuple
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, OneHotEncoder, OrdinalEncoder

def build_preprocessor(
    numerical_cols: List[str],
    categorical_cols: List[str],
    missing_strategy: str = "median",
    encoding_method: str = "one_hot",
    scaling_method: str = "standard"
) -> ColumnTransformer:
    """
    Build a Scikit-Learn ColumnTransformer pipeline.
    Ensures feature transformation is fitted strictly on training data to prevent data leakage.
    """
    transformers = []

    # 1. Numerical Pipeline
    if numerical_cols:
        num_steps = []
        
        # Missing values imputation
        strategy = missing_strategy.lower()
        if strategy in ["mean", "median"]:
            num_steps.append(("imputer", SimpleImputer(strategy=strategy)))
        elif strategy == "mode":
            num_steps.append(("imputer", SimpleImputer(strategy="most_frequent")))
        elif strategy == "constant":
            num_steps.append(("imputer", SimpleImputer(strategy="constant", fill_value=0.0)))
        else:
            num_steps.append(("imputer", SimpleImputer(strategy="median")))

        # Feature scaling
        scaler = scaling_method.lower()
        if scaler == "standard":
            num_steps.append(("scaler", StandardScaler()))
        elif scaler == "minmax":
            num_steps.append(("scaler", MinMaxScaler()))
        elif scaler == "robust":
            num_steps.append(("scaler", RobustScaler()))
        # If 'none' or unlisted, no scaling step is added

        num_pipeline = Pipeline(steps=num_steps)
        transformers.append(("num", num_pipeline, numerical_cols))

    # 2. Categorical Pipeline
    if categorical_cols:
        cat_steps = []
        cat_steps.append(("imputer", SimpleImputer(strategy="most_frequent")))

        enc = encoding_method.lower()
        if enc == "one_hot":
            cat_steps.append((
                "encoder",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False)
            ))
        else:
            cat_steps.append((
                "encoder",
                OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1)
            ))

        cat_pipeline = Pipeline(steps=cat_steps)
        transformers.append(("cat", cat_pipeline, categorical_cols))

    preprocessor = ColumnTransformer(
        transformers=transformers,
        remainder="drop",
        verbose_feature_names_out=False
    )
    return preprocessor

def separate_feature_types(df: pd.DataFrame, features: List[str]) -> Tuple[List[str], List[str]]:
    """Separate features into numerical and categorical lists based on dataframe dtypes."""
    numerical = []
    categorical = []
    for col in features:
        if col not in df.columns:
            continue
        if pd.api.types.is_numeric_dtype(df[col]):
            numerical.append(col)
        else:
            categorical.append(col)
    return numerical, categorical
