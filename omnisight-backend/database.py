import os
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os


load_dotenv()
# Get DB URL from environment
SQLALCHEMY_DATABASE_URL = os.getenv("MYSQL_ADDON_URI")

# Fallback for local development
if not SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./omnisight.db"
print("-- USING DB:", SQLALCHEMY_DATABASE_URL)
# MySQL Configuration (Clever Cloud)
if SQLALCHEMY_DATABASE_URL.startswith("mysql"):
    # Ensure correct driver
    if not SQLALCHEMY_DATABASE_URL.startswith("mysql+pymysql://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace(
            "mysql://", "mysql+pymysql://"
        )

    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,      # avoids stale connections
        pool_recycle=280,        # prevents timeout issues
        connect_args={
            "ssl": {
                "ssl_mode": "REQUIRED"
            }
        }
    )

# SQLite Configuration (local dev)
else:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

# Session + Base
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()