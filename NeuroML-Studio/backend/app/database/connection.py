import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.database.base import Base

logger = logging.getLogger(__name__)

engine = None
SessionLocal = None

def get_engine():
    global engine, SessionLocal
    if engine is not None:
        return engine

    db_url = settings.DATABASE_URL
    if not db_url or "YOUR_TEMPORARY_POSTGRESQL_URL" in db_url:
        logger.warning("DATABASE_URL is not configured with a valid PostgreSQL URL.")
        return None

    # Handle SQLAlchemy psycopg3 driver prefix:
    # Neon and Supabase URLs typically use postgresql:// or postgres://
    # For SQLAlchemy with psycopg3, we ensure the scheme is postgresql+psycopg://
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql+psycopg://", 1)
    elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+psycopg://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

    connect_args = {}
    # Neon and cloud providers require SSL
    if "sslmode" not in db_url and "localhost" not in db_url:
        connect_args["sslmode"] = "require"

    try:
        engine = create_engine(
            db_url,
            connect_args=connect_args,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
            pool_recycle=300,
        )
        # Test connection
        with engine.connect() as conn:
            pass
        logger.info("Successfully connected to cloud PostgreSQL database.")
    except Exception as e:
        logger.error(f"Failed to connect to PostgreSQL database: {e}")
        engine = None
        raise e

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return engine

def init_db():
    try:
        eng = get_engine()
        if eng is not None:
            import app.database.models  # noqa: F401
            # Do not drop existing tables; create_all only creates tables that don't exist
            Base.metadata.create_all(bind=eng)
            logger.info("Database tables verified.")
    except Exception as e:
        logger.warning(f"Could not initialize database on startup: {e}. Check DATABASE_URL.")

def get_session() -> Session:
    global SessionLocal
    if SessionLocal is None:
        get_engine()
    if SessionLocal is None:
        raise RuntimeError("Database engine could not be initialized.")
    return SessionLocal()

def get_db():
    if SessionLocal is None:
        try:
            get_engine()
        except Exception:
            from fastapi import HTTPException, status
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection is currently unavailable. Please check your cloud PostgreSQL connection URL."
            )
    if SessionLocal is None:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection is unconfigured or unavailable."
        )

    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
