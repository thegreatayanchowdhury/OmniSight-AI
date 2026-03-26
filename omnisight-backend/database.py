import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Note: Clever Cloud provides MYSQL_ADDON_URI
SQLALCHEMY_DATABASE_URL = os.getenv("MYSQL_ADDON_URI")

if not SQLALCHEMY_DATABASE_URL:
    # Local fallback so you can still work on Linux Mint offline
    SQLALCHEMY_DATABASE_URL = "sqlite:///./omnisight.db"

# MySQL requires a specific driver (pymysql), SQLite does not
if SQLALCHEMY_DATABASE_URL.startswith("mysql"):
    # Ensure the URI starts with mysql+pymysql://
    if not SQLALCHEMY_DATABASE_URL.startswith("mysql+pymysql://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("mysql://", "mysql+pymysql://")
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
else:
    # SQLite specific config
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()