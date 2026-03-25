from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import models, schemas, auth
from database import SessionLocal, engine, Base
from typing import List

# Initialize database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="OmniSight AI API")

# --- CORS CONFIGURATION ---
origins = [
    "http://localhost:5173",          # Local Vite Development
    "http://localhost:3000",
    "https://omni-sight-ai.vercel.app", # Vercel Frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ROUTES ---

@app.get("/")
def home():
    return {"status": "online", "message": "OmniSight AI Protocol Operational"}

@app.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserSignup, db: Session = Depends(get_db)):
    if not user.password or user.password.strip() == "":
        raise HTTPException(status_code=400, detail="Password cannot be empty")
    
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password too short")

    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=auth.hash_password(user.password),
        role=user.role if user.role else "client"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Account created successfully"}

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

# --- DASHBOARD DATA ENDPOINTS ---

@app.get("/client/dashboard-stats")
def get_client_stats(current_user = Depends(auth.require_role("client")), db: Session = Depends(get_db)):
    # This matches the stats your React Client Dashboard needs
    return {
        "balance": "₹1,250", # Pull from user.wallet_balance in models
        "status": "Shield Active",
        "zone": "Asansol - Sector 2",
        "recent_payouts": [
            {"id": 1, "event": "Heavy Rain", "amount": "+ ₹350", "date": "2h ago"},
            {"id": 2, "event": "Platform Outage", "amount": "+ ₹200", "date": "1d ago"}
        ]
    }

@app.get("/admin/system-status")
def get_admin_stats(current_user = Depends(auth.require_role("admin"))):
    # This matches your Admin Control Center stats
    return {
        "total_partners": 12402,
        "active_triggers": 3,
        "fraud_alerts": 12,
        "total_disbursed": "₹42,500"
    }

# --- THE AI TRIGGER ENGINE  ---

@app.post("/admin/simulate-disruption")
def trigger_disruption(zone: str, trigger_type: str, current_user = Depends(auth.require_role("admin"))):
    """
    Endpoint for the 'SIMULATE DISRUPTION' button in Admin React UI.
    """
    # Logic: 1. Log the event. 2. Find users in zone. 3. Trigger auto-payout.
    return {
        "status": "triggered",
        "message": f"Parametric event {trigger_type} activated for {zone}. AI is processing payouts."
    }