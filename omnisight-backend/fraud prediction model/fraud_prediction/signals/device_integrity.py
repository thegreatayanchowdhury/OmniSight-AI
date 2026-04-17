"""Device-level fraud detection signals."""


def check_device_integrity(context: dict) -> float:
    """
    Returns a trust score between 0.0 and 1.0.
    1.0 means the device looks clean.
    0.0 means there is strong evidence of tampering.
    """
    score = 1.0

    if context.get("mock_location_enabled", False):
        score -= 0.6

    if context.get("is_rooted", False):
        score -= 0.3

    if context.get("is_emulator", False):
        score -= 0.5

    if context.get("network_mismatch", False):
        score -= 0.2

    return max(0.0, score)
