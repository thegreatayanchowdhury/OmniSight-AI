"""FastAPI routes for the fraud dashboard."""

from fastapi import APIRouter


router = APIRouter()


@router.get("/stats")
async def get_fraud_ai_stats():
    """
    Returns sample data for a fraud dashboard.
    """
    return {
        "total_claims_analyzed": 1240,
        "fraud_prevented_value": "INR 45,200",
        "risk_distribution": {
            "low": 85,
            "medium": 10,
            "high": 5,
        },
        "top_signals": [
            "Mock Location",
            "Rooted Device",
            "Cluster Anomaly",
        ],
    }


@router.get("/flagged-claims")
async def get_flagged_claims():
    """
    Returns example claims that would need manual review.
    """
    return [
        {
            "id": 1,
            "worker": "User_49",
            "risk": "HIGH",
            "signal": "Teleportation Detected",
        },
        {
            "id": 2,
            "worker": "User_12",
            "risk": "MEDIUM",
            "signal": "Device Sharing",
        },
    ]
