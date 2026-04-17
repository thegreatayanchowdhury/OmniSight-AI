"""Multi-signal fraud evaluation entry point."""

from fraud_prediction.config import WEIGHTS
from fraud_prediction.engine.decision import resolve_decision
from fraud_prediction.models.trust_score import TrustScoreResult
from fraud_prediction.signals.crowd_validation import check_crowd_validation
from fraud_prediction.signals.device_integrity import check_device_integrity
from fraud_prediction.signals.environmental_correlation import (
    check_environmental_correlation,
)
from fraud_prediction.signals.movement_intelligence import check_movement_logic
from fraud_prediction.signals.network_signature import check_network_signature


def _get_user_trust_score(user) -> float:
    if user is None:
        return 100.0

    if isinstance(user, dict):
        return float(user.get("trust_score", 100.0))

    return float(getattr(user, "trust_score", 100.0))


def _collect_reasons(context: dict) -> list[str]:
    reason_map = {
        "mock_location_enabled": "Mock location is enabled",
        "is_rooted": "Rooted or jailbroken device detected",
        "is_emulator": "Emulator usage detected",
        "network_mismatch": "Network and location mismatch detected",
        "sudden_location_jump": "Sudden GPS jump detected",
        "recent_activity": "Missing recent delivery activity",
        "suspicious_cluster": "Cluster anomaly detected",
        "shared_device_detected": "Shared device behavior detected",
        "repeated_claim_pattern": "Repeated claim pattern detected",
        "weather_conflict": "Weather data conflicts with claim context",
        "traffic_conflict": "Traffic data conflicts with claim context",
        "route_anomaly": "Route anomaly detected",
        "ip_velocity_alert": "Rapid IP switching detected",
        "vpn_or_proxy_detected": "VPN or proxy usage detected",
        "unstable_connection": "Unstable connection pattern detected",
    }

    reasons: list[str] = []
    for key, message in reason_map.items():
        if key == "recent_activity":
            if not context.get("recent_activity", True):
                reasons.append(message)
        elif context.get(key, False):
            reasons.append(message)

    return reasons


def evaluate_claim(user=None, db=None, context: dict | None = None) -> dict:
    """
    Runs all signal checks, aggregates them, and returns a normalized result.

    The `db` argument is accepted for compatibility with the caller interface.
    """
    del db
    context = context or {}

    device_score = check_device_integrity(context)
    movement_score = check_movement_logic(context)
    network_score = check_network_signature(context)
    crowd_score = check_crowd_validation(context)
    environment_score = check_environmental_correlation(context)

    weighted_trust = (
        (device_score * WEIGHTS["device"])
        + (movement_score * WEIGHTS["movement"])
        + (network_score * WEIGHTS["network"])
        + (crowd_score * WEIGHTS["crowd"])
        + (environment_score * WEIGHTS["environment"])
    )

    risk_score = 1.0 - weighted_trust
    trust_score = weighted_trust * 100.0
    user_trust_score = _get_user_trust_score(user)
    risk_level, action = resolve_decision(risk_score, user_trust_score)

    result = TrustScoreResult(
        risk_level=risk_level,
        risk_score=risk_score,
        trust_score=trust_score,
        action=action,
        reasons=_collect_reasons(context),
        signals={
            "device": device_score,
            "movement": movement_score,
            "network": network_score,
            "crowd": crowd_score,
            "environment": environment_score,
        },
    )
    return result.to_dict()
