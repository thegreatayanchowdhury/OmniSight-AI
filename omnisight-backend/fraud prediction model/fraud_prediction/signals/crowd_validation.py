"""Crowd-pattern and multi-worker correlation signals."""


def check_crowd_validation(context: dict) -> float:
    """
    Flags suspicious patterns shared across multiple workers or devices.
    """
    score = 1.0

    if context.get("suspicious_cluster", False):
        score -= 0.7

    if context.get("shared_device_detected", False):
        score -= 0.2

    if context.get("repeated_claim_pattern", False):
        score -= 0.2

    return max(0.0, score)
