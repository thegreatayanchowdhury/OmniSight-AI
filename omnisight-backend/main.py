from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import models, schemas, auth
from zone_risk import get_live_zone_scores, get_heatmap_payload
import logging
logger = logging.getLogger(__name__)
from database import SessionLocal, engine

app = FastAPI(title="OmniSight AI API")

# --- STARTUP EVENT ---
@app.on_event("startup")
def startup():
    try:
        models.Base.metadata.create_all(bind=engine)
        print("✅ DB connected & tables created")
    except Exception as e:
        print("❌ DB ERROR:", e)

# --- CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://omni-sight-ai.vercel.app",
        "https://omni-sight-ai-seven.vercel.app"

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
        content={"detail": "Internal Server Error"},
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
        role=user.role if user.role else "client"
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


# ---------------------------------------------------------------------------
# ZONE RISK — LIVE SCORING  (every 15 min, cached in-process)
# ---------------------------------------------------------------------------

@app.get("/zones/risk/live")
def live_zone_risk():
    """
    Returns live 0-100 risk scores for all 5 Mumbai/Thane zones.

    Scores are computed from:
      - Static geographic baseline (elevation, river proximity, coastal exposure)
      - Live weather from WeatherAPI (same WEATHER_API_KEY as /route-risk)

    Results are cached for 15 minutes in-process.
    Call this endpoint every 15 min from the frontend to keep the heatmap fresh.

    Response shape:
    {
      "zones": [...],
      "zone_count": 5,
      "update_interval_min": 15,
      "scored_at": "2026-04-13T..."
    }
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
        logger.error("live_zone_risk failed: %s", exc)
        raise HTTPException(status_code=500, detail="Zone risk scoring failed")


@app.get("/zones/risk/heatmap")
def live_heatmap_data():
    """
    Slim heatmap payload consumed by the self-refreshing heatmap.html
    and the AdminDashboard / ClientDashboard map components.

    Response shape:
    {
      "center": [lat, lon],
      "radius_km": 25,
      "next_refresh_ms": <epoch ms when cache expires>,
      "update_interval_min": 15,
      "zones": [
        {
          "id", "display_name", "city", "center",
          "risk_score", "risk_bin", "risk_label",
          "color", "condition", "precip_mm", "wind_kph"
        }, ...
      ]
    }
    """
    try:
        return get_heatmap_payload()
    except Exception as exc:
        logger.error("live_heatmap_data failed: %s", exc)
        raise HTTPException(status_code=500, detail="Heatmap data generation failed")