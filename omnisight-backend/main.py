from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from models import User , Payout
from auth import get_current_user
import  models,schemas, auth
from database import SessionLocal , get_db
from pricing import calculate_weekly_premium
from automation import start_oracle
import threading
from models import Base
from database import engine

import time, uuid, random
from fastapi import HTTPException
app = FastAPI(title="OmniSight AI API")

# --- STARTUP EVENT ---
@app.on_event("startup")
def start_background_tasks():
    thread = threading.Thread(target=start_oracle)
    thread.daemon = True
    thread.start()

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
        activity_tier="silver" 
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
        "role": db_user.role,
        "name": db_user.name
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
    current_user=Depends(auth.require_role("client")),
    db: Session = Depends(get_db)
):
    return {
        "balance": "₹1,250",
        "status": "Shield Active",
        "zone": "Asansol - Sector 2",
        "recent_payouts": [
            {"id": 1, "event": "Heavy Rain", "amount": "+ ₹350", "date": "2h ago"},
            {"id": 2, "event": "Platform Outage", "amount": "+ ₹200", "date": "1d ago"}
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