from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Numeric
from database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(50))

    balance = Column(Numeric(10, 2), nullable=False, default=0)  

    city = Column(String(100), default="Asansol")
    avg_daily_income = Column(Float, default=500.0)
    activity_tier = Column(String(20), default="silver")
    trust_score = Column(Float, default=80.0)
    fraud_flags = Column(Integer, default=0)
    is_onboarded = Column(Integer, default=0)

class Payout(Base):
    __tablename__ = "payouts"
 
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    disruption_type = Column(String(50)) # e.g., "Heavy Rain", "AQI"
    severity_level = Column(String(20))   # "Moderate", "Severe"
    payout_percentage = Column(Integer)  # 30 or 100
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="Released") # Released, Failed, Inprocess

class FraudLog(Base):
    __tablename__ = "fraud_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    risk_score = Column(Integer)
    risk_level = Column(String(100))
    reasons = Column(String(100))
    timestamp = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    plan = Column(String(20))  # basic / premium / elite
    amount = Column(Integer)
    city = Column(String(100))
    status = Column(String(15), default="pending")  # pending / success
    razorpay_order_id = Column(String(100))
    razorpay_payment_id = Column(String(100))
