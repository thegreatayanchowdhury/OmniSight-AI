from __future__ import annotations

from typing import Any

import pandas as pd
from fastapi import APIRouter, HTTPException, Query

from src.common.config import DATA_DIR

router = APIRouter()

RISK_SCORES_PATH = DATA_DIR / "processed" / "zone_risk_scores_latest.csv"


def _load_scores() -> pd.DataFrame:
    if not RISK_SCORES_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail=(
                "Risk scores file not found. Run weekly scoring first "
                "(src.risk_model.inference.score_weekly)."
            ),
        )

    frame = pd.read_csv(RISK_SCORES_PATH)
    frame["week_start"] = pd.to_datetime(frame["week_start"], utc=False)
    return frame


def _normalize_record(record: dict[str, Any]) -> dict[str, Any]:
    normalized: dict[str, Any] = {}
    for key, value in record.items():
        if isinstance(value, pd.Timestamp):
            normalized[key] = value.isoformat()
        else:
            normalized[key] = value
    return normalized


@router.get("/latest")
def latest_scores(limit: int = Query(default=50, ge=1, le=500)) -> list[dict[str, Any]]:
    frame = _load_scores().sort_values("week_start", ascending=False).head(limit)
    records = frame.to_dict(orient="records")
    return [_normalize_record(record) for record in records]


@router.get("/zones/{zone_id}")
def latest_zone_score(zone_id: str) -> dict[str, Any]:
    frame = _load_scores()
    matches = frame[frame["zone_id"].astype(str).str.lower() == zone_id.lower()]
    if matches.empty:
        raise HTTPException(status_code=404, detail=f"Zone not found: {zone_id}")

    latest_row = matches.sort_values("week_start", ascending=False).iloc[0]
    return _normalize_record({k: latest_row[k] for k in matches.columns})
