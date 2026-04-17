"""Decision rules for interpreting fraud scores."""

from fraud_prediction.config import (
    HIGH_RISK_THRESHOLD,
    MEDIUM_RISK_THRESHOLD,
    TRUST_SCORE_MIN,
)


def resolve_decision(risk_score: float, user_trust_score: float) -> tuple[str, str]:
    """
    Maps the normalized risk score to a risk level and next action.
    """
    if risk_score >= HIGH_RISK_THRESHOLD or user_trust_score < TRUST_SCORE_MIN:
        return "HIGH", "FLAGGED_FOR_PROOF"

    if risk_score >= MEDIUM_RISK_THRESHOLD:
        return "MEDIUM", "DELAYED_VERIFICATION"

    return "LOW", "INSTANT_PAYOUT"
