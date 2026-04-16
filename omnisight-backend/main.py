import sys
import io

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'buffer'):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from fastapi import FastAPI, Depends, HTTPException, status,Response
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from models import User , Payout
from auth import get_current_user
import  models,schemas, auth
from database import SessionLocal , get_db
from pricing import calculate_weekly_premium
from datetime import datetime, date
from sqlalchemy import and_
from sqlalchemy import func
import threading
from models import Base
from database import engine
from zone_risk import get_live_zone_scores, get_heatmap_payload
import os
import requests
import random
import logging
import time
import threading
import certifi
from pydantic import BaseModel

from payout_logic import process_payout
from decimal import Decimal
import time, uuid, random
from fastapi import HTTPException
from sqlalchemy import desc

from fraud_engine import evaluate_claim
from models import FraudLog,Subscription
import razorpay

import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)


app = FastAPI(title="OmniSight AI API")
aqi_result_store = {
    "aqi": None,
    "breached": None,
    "payout": None,
    "last_updated": None
}

kill_switch_status = {
    "active": False,
    "reason": None
}

def evaluate_kill_switch(db: Session):
    total_fraud = db.query(FraudLog).count()

    # total payouts today
    today = datetime.now().date()
    total_payouts = db.query(Payout)\
        .filter(Payout.timestamp >= today)\
        .count()

    # 🔥 CONDITIONS
    if total_fraud > 5:
        kill_switch_status["active"] = True
        kill_switch_status["reason"] = "High fraud activity detected"

    elif total_payouts > 20:
        kill_switch_status["active"] = True
        kill_switch_status["reason"] = "Payout spike detected"

    else:
        kill_switch_status["active"] = False
        kill_switch_status["reason"] = None

    print("Fraud count:", total_fraud)
    print("Payout count:", total_payouts)
class SecurityCheckRequest(BaseModel):
    risk_score: int
    adb: bool = False
    rooted: bool = False
    emulator: bool = False
    frida: bool = False
    debugger: bool = False
    developer_mode: bool = False
    hooking: bool = False
    location: dict | None = None


AQI_THRESHOLD = 200
logging.basicConfig(level=logging.INFO)
# --- STARTUP EVENT ---



@app.on_event("startup")
   
def startup():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ DB connected & tables created")
    except Exception as e:
        print("❌ DB ERROR:", e)

# --- CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://omni-sight-ai.vercel.app",
        "https://omni-sight-ai-seven.vercel.app",
        "http://127.0.0.1:5173"


    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- GLOBAL ERROR HANDLER ---
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    print("❌ ERROR:", exc)  # for debugging logs
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

# --- DB Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ROUTES ---

@app.get("/")
@app.head("/")
def home():
    return {"status": "online", "message": "OmniSight AI Protocol Operational"}

# SIGNUP
@app.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserSignup, db: Session = Depends(get_db)):
    # validations
    if not user.password or user.password.strip() == "":
        raise HTTPException(status_code=400, detail="Password cannot be empty")

    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password too short")

    # check existing user
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = auth.hash_password(user.password)

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role if user.role else "client",
        balance=0,                 
        city="Asansol",            
        avg_daily_income=500.0,      
        activity_tier="silver",
        is_onboarded=0
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Account created successfully"}

# LOGIN
@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = auth.create_token({
        "sub": db_user.email,
        "role": db_user.role,
        "id": db_user.id
    })

    return {
    "access_token": token,
    "token_type": "bearer",
    "id": db_user.id,
    "name": db_user.name,
    "email": db_user.email,
    "role": db_user.role if db_user.role else "client",
    "city": db_user.city,
    "avg_daily_income": db_user.avg_daily_income,
    "activity_tier": db_user.activity_tier,
    "is_onboarded": db_user.is_onboarded
    }


# --- DASHBOARD ENDPOINTS ---


@app.get("/client/dashboard")
def client_dashboard(current_user: User = Depends(get_current_user)):
    return {
        "name": current_user.name,
        "balance": current_user.balance,
        "city": current_user.city
    }

@app.get("/client/dashboard-stats")
def get_client_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch only the last 4 payouts to keep the Logout button visible on PC
    recent_payouts = db.query(models.Payout)\
        .filter(models.Payout.user_id == current_user.id)\
        .order_by(desc(models.Payout.timestamp))\
        .limit(4)\
        .all()

    return {
        "balance": f"₹{current_user.balance}",
        "status": "Shield Active" if current_user.activity_tier != "inactive" else "Pending",
        "zone": f"{current_user.city} - Active",
        "recent_payouts": [
            {
                "id": p.id, 
                "event": p.disruption_type, 
                "amount": f"+ ₹{p.amount}", 
                "date": p.timestamp.strftime("%Y-%m-%d %H:%M")
            } for p in recent_payouts
        ]
    }

@app.get("/client/payouts")
def get_payout_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payouts = db.query(Payout).filter(Payout.user_id == current_user.id).all()
    return payouts

@app.get("/admin/system-status")
def get_admin_stats(
    current_user=Depends(auth.require_role("admin"))
):
    return {
        "total_partners": 12402,
        "active_triggers": 3,
        "fraud_alerts": 12,
        "total_disbursed": "₹42,500"
    }

@app.post("/admin/simulate-disruption")
def trigger_disruption(
    zone: str,
    trigger_type: str,
    current_user=Depends(auth.require_role("admin"))
):
    return {
        "status": "triggered",
        "message": f"Parametric event {trigger_type} activated for {zone}. AI is processing payouts."
    }

@app.get("/get-quote")
def get_insurance_quote(city: str, tier: str, income: float):
    premium = calculate_weekly_premium(city, tier, income)
    return {
        "weekly_premium": premium,
        "currency": "INR",
        "coverage_limit": income * 7,
        "billing_cycle": "Weekly"
    }


@app.post("/simulate-payout")
def simulate_payout(
    data: schemas.PayoutRequest,
    current_user=Depends(auth.require_role("client"))
):
    try:
        time.sleep(2)

        txn_id = str(uuid.uuid4())

        # 🎲 Random success simulation
        fake_bank = random.choice(["HDFC Bank", "SBI", "ICICI", "Axis Bank"])
        processing_time = random.randint(1, 3)

        return {
            "status": "success",
            "message": f"₹{data.amount} sent to {data.upi_id}",
            "transaction_id": txn_id,
            "bank": fake_bank,
            "time_taken": f"{processing_time} sec"
        }

    except Exception as e:
        print("PAYOUT ERROR:", e)
        raise HTTPException(status_code=500, detail="Payout failed")

@app.get("/client/payout-history")
def get_payout_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payouts = db.query(Payout).filter(Payout.user_id == current_user.id).all()

    return [
        {
            "id": p.id,
            "amount": p.amount,
            "disruption_type": p.disruption_type,
            "severity_level": p.severity_level,
            "payout_percentage": p.payout_percentage,
            "timestamp": p.timestamp,
            "status": p.status
        }
        for p in payouts
    ]
# AQI 
def fetch_aqi(city: str = "Asansol"):
    API_KEY = os.getenv("AQI_API_KEY")

    try:
        if API_KEY:
            url = f"https://api.waqi.info/feed/{city}/?token={API_KEY}"
            response = requests.get(url, timeout=5)
            data = response.json()

            if data.get("status") == "ok":
                return data["data"]["aqi"]

        logging.info("Using mock AQI data")
        return random.randint(100, 400)

    except Exception as e:
        logging.error(f"Error fetching AQI: {e}")
        return random.randint(100, 400)
from sqlalchemy import func

def delayed_aqi_process(city: str = "Asansol"):
    db = None

    try:
        print("🔥 delayed_aqi_process STARTED")

        time.sleep(10)

        aqi = fetch_aqi(city)
        print(f"📊 AQI Value: {aqi}")

        breached = aqi > AQI_THRESHOLD
        print(f"🚨 Breached: {breached}")

        if not breached:
            print("✅ No breach")

            aqi_result_store.update({
                "aqi": aqi,
                "breached": False,
                "payout": {
                    "type": "AQI",
                    "value": aqi,
                    "status": "No breach"
                },
                "last_updated": datetime.now().isoformat()
            })
            return

        # ✅ ONLY here DB is created
        db = SessionLocal()
        print("📌 DB:", db.bind.url)

        logging.info("🗄️ DB session started")

        #
        # ✅ ACTUAL FILTER
        users = db.query(User).filter(
            func.trim(func.lower(User.city)) == city.lower().strip()
        ).all()

        print("👥 FILTERED USERS:", len(users))

        event_type = "AQI"
        value = aqi
        successful_payouts = 0

        print("⚙️ Checking kill switch...")
        evaluate_kill_switch(db)

        if kill_switch_status["active"]:
            print(f"🚨 KILL SWITCH ACTIVE: {kill_switch_status['reason']}")
            return

        # ✅ LOOP ONLY ON FILTERED USERS
        for user in users:
            print(f"➡️ Processing user {user.id}")

            context = {
                "sudden_location_jump": False,
                "recent_activity": True,
                "is_emulator": False,
                "is_rooted": False,
                "suspicious_cluster": False,
                "network_mismatch": False
            }

            fraud_result = evaluate_claim(user, db, context)

            if user.trust_score < 40:
                continue
            if fraud_result["risk_level"] in ["HIGH", "MEDIUM"]:
                continue

            result = process_payout(event_type, value, user, db)

            if result:
                successful_payouts += 1

        payout_info = {
            "type": event_type,
            "value": value,
            "status": f"{successful_payouts} users paid"
        }

        aqi_result_store.update({
            "aqi": aqi,
            "breached": True,
            "payout": payout_info,
            "last_updated": datetime.now().isoformat()
        })

        print("📦 AQI result stored")

    except Exception as e:
        import traceback
        print("❌ AQI Background Error:", e)
        traceback.print_exc()

    finally:
        if db:
            db.close()
            print("🧹 DB session closed")
def calculate_device_risk(data: dict):
    risk = data.get("risk_score", 0)

    if data.get("adb"):
        risk += 20

    if data.get("developer_mode"):
        risk += 10

    if data.get("rooted"):
        risk += 30

    if data.get("emulator"):
        risk += 25

    if data.get("frida"):
        risk += 40

    if data.get("debugger"):
        risk += 25

    if data.get("hooking"):
        risk += 40

    return min(risk, 100)


@app.post("/security/check")
def security_check(
    payload: SecurityCheckRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    data = payload.dict()

    # Calculate risk
    final_risk = calculate_device_risk(data)

    # Build context for your existing fraud engine
    context = {
        "sudden_location_jump": False,
        "recent_activity": True,
        "is_emulator": data.get("emulator"),
        "is_rooted": data.get("rooted"),
        "suspicious_cluster": data.get("frida") or data.get("hooking"),
        "network_mismatch": False
    }

    # Evaluate using your AI fraud engine
    fraud_result = evaluate_claim(current_user, db, context)

    # Store fraud log
    log = FraudLog(
        user_id=current_user.id,
        risk_score=final_risk,
        risk_level=fraud_result["risk_level"],
        reasons=",".join(fraud_result["reasons"]),
        created_at=datetime.now()
    )

    db.add(log)
    db.commit()

    # Decision logic
    if final_risk >= 70 or fraud_result["risk_level"] == "HIGH":
        decision = "BLOCK"
    elif final_risk >= 40:
        decision = "REVIEW"
    else:
        decision = "ALLOW"

    return {
        "success": True,
        "risk_score": final_risk,
        "decision": decision,
        "fraud_analysis": fraud_result
    }


@app.get("/aqi")
def run_oracle(city: str = "Asansol"):

    print("🚀 /aqi endpoint hit")

    thread = threading.Thread(
        target=delayed_aqi_process,
        args=(city,),
        daemon=True
    )
    thread.start()

    print("🧵 Background thread started")

    return {
        "success": True,
        "message": "AQI check scheduled",
        "data": aqi_result_store
    }

# --- Full History for "View All" Page ---
@app.get("/client/all-payouts")
def get_all_payouts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # This endpoint provides the full data for the dedicated history page
    all_payouts = db.query(models.Payout)\
        .filter(models.Payout.user_id == current_user.id)\
        .order_by(desc(models.Payout.timestamp))\
        .all()
    return all_payouts

# --- Balance Withdrawal Logic (Updates DB Balance) ---
@app.post("/client/withdraw")
def withdraw_balance(
    amount: float, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")
    
     #  Re-fetch user in same session
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    # Check if user has enough balance
    # current_user.balance is Numeric, so we convert to float for comparison
    if float(user.balance) < amount:
        raise HTTPException(status_code=400, detail="Insufficient funds in your account")

    # Update User Balance in MySQL
    user.balance = float(user.balance) - amount
    
    # Log the withdrawal so it appears in recent activity
    withdrawal_entry = models.Payout(
        user_id=user.id,
        amount=-amount,  # Negative shows money leaving the system
        disruption_type="Withdrawal",
        severity_level="N/A",
        payout_percentage=0,
        status="Completed",
        timestamp=datetime.now()
    )
    
    db.add(withdrawal_entry)
    db.commit()
    db.refresh(user)
    
    return {
        "status": "success", 
        "message": f"Successfully withdrawn ₹{amount}", 
        "new_balance": user.balance
    }
# live map
class RouteRequest(BaseModel):
    route: list

def get_weather(lat, lon):
    API_KEY = os.getenv("WEATHER_API_KEY")
    url = f"http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={lat},{lon}"
    response = requests.get(url)
    return response.json()

def calculate_risk(weather):
    current = weather.get("current", {})

    rain = current.get("precip_mm", 0)
    wind = current.get("wind_kph", 0)
    temp = current.get("temp_c", 0)

    score = 0

    if rain > 2:
        score += 2
    if wind > 20:
        score += 2
    if temp > 35:
        score += 1

    if score >= 4:
        return "High"
    elif score >= 2:
        return "Medium"
    else:
        return "Low"

@app.get("/route-risk")
def route_risk(lat: float, lon: float):
    API_KEY = os.getenv("WEATHER_API_KEY")
    url = f"http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={lat},{lon}&aqi=yes"

    res = requests.get(url)
    data = res.json()
    print(data)
    if "current" not in data:
        return {"error":data}
    condition = data["current"]["condition"]["text"]

    risk = "LOW"

    if "Rain" in condition:
        risk = "HIGH"
    elif "Storm" in condition:
        risk = "EXTREME"

    return {
        "risk": risk,
        "condition": condition,
        "location": data["location"]["name"],  
        "region": data["location"]["region"],   
        "country": data["location"]["country"]
    }


# ---------------------------------------------------------------------------
# ZONE RISK — LIVE SCORING  (every 15 min, cached in-process)
# ---------------------------------------------------------------------------

@app.get("/zones/risk/live")
def live_zone_risk():
    """
    Returns live 0-100 risk scores for all 20 pan-India zones.
    Blend: XGBoost baseline 55% + live WeatherAPI 45%
    Cached for 10 minutes in-process.
    """
    try:
        zones = get_live_zone_scores()
        return {
            "zones":               zones,
            "zone_count":          len(zones),
            "update_interval_min": 10,
            "scored_at":           zones[0]["scored_at"] if zones else None,
        }
    except Exception as exc:
        logging.error("live_zone_risk failed: %s", exc)
        raise HTTPException(status_code=500, detail="Zone risk scoring failed")


@app.get("/zones/risk/heatmap")
def live_heatmap_data():
    """
    Slim heatmap payload for 20 pan-India zones.
    Consumed by the frontend ZoneRiskMap component.
    Updates every 10 minutes with live weather data.
    """
    try:
        return get_heatmap_payload()
    except Exception as exc:
        logging.error("live_heatmap_data failed: %s", exc)
        raise HTTPException(status_code=500, detail="Heatmap data generation failed")


@app.get("/traffic-tile/{z}/{x}/{y}")
def traffic_tile(z: int, x: int, y: int):
    API_KEY = os.getenv("TOMTOM_API_KEY")

    url = f"https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key={API_KEY}"
    try:
        res = requests.get(url,timeout=5,verify=certifi.where())
        if res.status_code!=200:
            return {"error":res.text}
        return Response(content=res.content, media_type="image/png")
    except Exception as e:
        return {"error": "Traffic fetch failed"}


@app.get("/admin/fraud-logs")
def get_fraud_logs(
    db: Session = Depends(get_db),
    current_user=Depends(auth.require_role("admin"))
):
    logs = db.query(models.FraudLog)\
        .order_by(models.FraudLog.created_at.desc())\
        .limit(10)\
        .all()

    return [
        {
            "user_id": log.user_id,
            "risk_score": log.risk_score,
            "risk_level": log.risk_level,
            "reasons": log.reasons,
            "time": log.created_at
        }
        for log in logs
    ]


@app.get("/admin/fraud-stats")
def fraud_stats(db: Session = Depends(get_db)):
    total = db.query(FraudLog).count()
    high = db.query(FraudLog).filter(FraudLog.risk_level == "HIGH").count()
    medium = db.query(FraudLog).filter(FraudLog.risk_level == "MEDIUM").count()

    return {
        "total_flags": total,
        "high_risk": high,
        "medium_risk": medium,
        "fraud_ratio": round(high / total, 2) if total > 0 else 0
    }

#  KILL switch API
@app.get("/admin/kill-switch-status")
def get_kill_switch():
    return kill_switch_status

# GLOBAL STATE
kill_switch_status = {
    "active": False,
    "reason": None
}


@app.post("/admin/kill-switch")
def toggle_kill_switch(
    active: bool,
    reason: str = None,
    current_user=Depends(auth.require_role("admin"))
):
    kill_switch_status["active"] = active
    kill_switch_status["reason"] = reason if active else None

    return {
        "status": "updated",
        "kill_switch": kill_switch_status
    }

@app.post("/complete-onboarding")
def complete_onboarding(user_id: int, plan: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return {"error": "User not found"}

    # Save selected plan
    user.activity_tier = plan

    # Mark onboarding complete
    user.is_onboarded = 1

    db.commit()

    return {"message": "Onboarding completed"}

# Razorpay clientdict
client = razorpay.Client(
    auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET"))
)

class OrderRequest(BaseModel):
    amount: int

@app.post("/create-order")
def create_order(data: dict, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    
    amount = data["amount"]

    order = client.order.create({
        "amount": amount * 100,
        "currency": "INR",
        "payment_capture": 1
    })

    # DB me save karo
    subscription = Subscription(
        user_id=user.id,
        plan=data.get("plan"),  # basic/premium
        amount=amount,
        city=data.get("city"),
        razorpay_order_id=order["id"],
        status="pending"
    )

    db.add(subscription)
    db.commit()

    return order
@app.post("/verify-payment")
def verify_payment(data: dict, db: Session = Depends(get_db)):

    order_id = data["razorpay_order_id"]
    payment_id = data["razorpay_payment_id"]

    subscription = db.query(Subscription).filter(
        Subscription.razorpay_order_id == order_id
    ).first()

    if not subscription:
        raise HTTPException(status_code=404, detail="Order not found")

    # update DB
    subscription.status = "success"
    subscription.razorpay_payment_id = payment_id

    db.commit()

    return {"message": "Payment verified"}

@app.get("/get-my-plan")
def get_my_plan(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    
    sub = db.query(Subscription).filter(
        and_(
            Subscription.user_id == user.id,
            Subscription.status == "success"
        )
    ).order_by(Subscription.id.desc()).first()

    if not sub:
        return {"plan": None}

    return {
        "plan": sub.plan,
        "status": sub.status,
        "amount": sub.amount,
        "city": sub.city
    }

# ---------------------------------------------------------------------------
# ZONE RISK — LIVE SCORING  (every 15 min, cached in-process)
# ---------------------------------------------------------------------------

@app.get("/zones/risk/live")
def live_zone_risk():
    """
    Returns live 0-100 risk scores for all 5 Mumbai/Thane zones.
    Blend: XGBoost baseline 55% + live WeatherAPI 45%
    Cached for 15 minutes in-process.
    """
    try:
        zones = get_live_zone_scores()
        return {
            "zones":               zones,
            "zone_count":          len(zones),
            "update_interval_min": 15,
            "scored_at":           zones[0]["scored_at"] if zones else None,
        }
    except Exception as exc:
        logging.error("live_zone_risk failed: %s", exc)
        raise HTTPException(status_code=500, detail="Zone risk scoring failed")


@app.get("/zones/risk/heatmap")
def live_heatmap_data():
    """
    Slim heatmap payload consumed by the frontend ZoneRiskMap component.
    """
    try:
        return get_heatmap_payload()
    except Exception as exc:
        logging.error("live_heatmap_data failed: %s", exc)
        raise HTTPException(status_code=500, detail="Heatmap data generation failed")