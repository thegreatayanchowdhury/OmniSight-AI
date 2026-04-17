"""Configuration values for the multi-signal fraud engine."""

WEIGHTS = {
    "device": 0.35,
    "movement": 0.20,
    "network": 0.15,
    "crowd": 0.15,
    "environment": 0.15,
}

TRUST_SCORE_MIN = 40
HIGH_RISK_THRESHOLD = 0.75
MEDIUM_RISK_THRESHOLD = 0.40
