from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    # MySQL requires a length for VARCHAR columns
    name = Column(String(100)) 
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(50))