from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import models, schemas, auth
from database import SessionLocal, engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "OmniSight API Running 🚀"}
@app.post("/signup")
def signup(user: schemas.UserSignup, db: Session = Depends(get_db)):


    if not user.password or user.password.strip() == "":
        raise HTTPException(status_code=400, detail="Password cannot be empty")

    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    existing_user = db.query(models.User).filter(models.User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=auth.hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth.create_token({
        "sub": db_user.email,
        "role": db_user.role
    })

    return {"access_token": token, "role": db_user.role}

@app.get("/admin/dashboard")
def admin_dashboard(user=Depends(auth.require_role("admin"))):
    return {"message": "Welcome Admin", "user": user}

@app.get("/client/dashboard")
def client_dashboard(user=Depends(auth.require_role("client"))):
    return {"message": "Welcome Client", "user": user}
