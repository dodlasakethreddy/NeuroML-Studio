import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    JSON,
    Index,
)
from sqlalchemy.orm import relationship, synonym
from app.database.base import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    datasets = relationship("Dataset", back_populates="user", cascade="all, delete-orphan")
    training_jobs = relationship("TrainingJob", back_populates="user", cascade="all, delete-orphan")
    trained_models = relationship("TrainedModel", back_populates="user", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String(64), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    dataset_name = Column(String(255), nullable=False, index=True)
    file_path = Column(String(500), nullable=False)
    rows = Column(Integer, nullable=False, default=0)
    columns = Column(Integer, nullable=False, default=0)
    column_metadata = Column(JSON, nullable=False, default=list)
    uploaded_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Synonyms for flexible access
    total_rows = synonym("rows")
    total_columns = synonym("columns")
    columns_metadata = synonym("column_metadata")

    # Relationships
    user = relationship("User", back_populates="datasets")
    training_jobs = relationship("TrainingJob", back_populates="dataset", cascade="all, delete-orphan")
    trained_models = relationship("TrainedModel", back_populates="dataset", cascade="all, delete-orphan")

class TrainingJob(Base):
    __tablename__ = "training_jobs"

    id = Column(String(64), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    dataset_id = Column(String(64), ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    target_column = Column(String(255), nullable=False)
    problem_type = Column(String(50), nullable=False)  # "Classification" or "Regression"
    algorithms = Column(JSON, nullable=False, default=list)
    status = Column(String(50), nullable=False, default="Pending", index=True)  # Pending, Running, Completed, Failed
    started_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)

    # Synonym for selected_algorithms
    selected_algorithms = synonym("algorithms")

    # Relationships
    user = relationship("User", back_populates="training_jobs")
    dataset = relationship("Dataset", back_populates="training_jobs")
    trained_models = relationship("TrainedModel", back_populates="training_job", cascade="all, delete-orphan")

class TrainedModel(Base):
    __tablename__ = "trained_models"

    id = Column(String(64), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    dataset_id = Column(String(64), ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    training_job_id = Column(String(64), ForeignKey("training_jobs.id", ondelete="SET NULL"), nullable=True, index=True)
    model_name = Column(String(255), nullable=False)
    algorithm = Column(String(100), nullable=False, index=True)
    problem_type = Column(String(50), nullable=False)  # "Classification" or "Regression"
    target_column = Column(String(255), nullable=False)
    feature_columns = Column(JSON, nullable=False, default=list)
    model_path = Column(String(500), nullable=False)
    metrics = Column(JSON, nullable=False, default=dict)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="trained_models")
    dataset = relationship("Dataset", back_populates="trained_models")
    training_job = relationship("TrainingJob", back_populates="trained_models")
    predictions = relationship("Prediction", back_populates="model", cascade="all, delete-orphan")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String(64), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    model_id = Column(String(64), ForeignKey("trained_models.id", ondelete="CASCADE"), nullable=False, index=True)
    input_data = Column(JSON, nullable=False, default=dict)
    predicted_result = Column(String(255), nullable=False)
    prediction_probability = Column(JSON, nullable=True)  # float or list of probabilities
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="predictions")
    model = relationship("TrainedModel", back_populates="predictions")

# Indexes
Index("idx_user_datasets", Dataset.user_id, Dataset.uploaded_at.desc())
Index("idx_user_models", TrainedModel.user_id, TrainedModel.created_at.desc())
Index("idx_user_predictions", Prediction.user_id, Prediction.created_at.desc())
Index("idx_user_jobs", TrainingJob.user_id, TrainingJob.started_at.desc())
