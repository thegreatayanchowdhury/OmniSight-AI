from __future__ import annotations

from pathlib import Path
import sys

from fastapi import FastAPI

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from api.routes import plans, risk

app = FastAPI(
    title="OmniSight AI - Model 1 API",
    version="1.0.0",
    description="API for plan metadata and risk score outputs.",
)

app.include_router(plans.router, prefix="/plans", tags=["plans"])
app.include_router(risk.router, prefix="/risk", tags=["risk"])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
