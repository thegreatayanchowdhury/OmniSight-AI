"""Movement and motion consistency signals."""


def check_movement_logic(context: dict) -> float:
    """
    Detects impossible or suspicious movement patterns.
    """
    score = 1.0

    if context.get("sudden_location_jump", False):
        score -= 0.7

    if not context.get("recent_activity", True):
        score -= 0.3

    return max(0.0, score)
