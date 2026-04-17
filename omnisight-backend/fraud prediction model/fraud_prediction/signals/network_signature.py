"""Network consistency and connection quality signals."""


def check_network_signature(context: dict) -> float:
    """
    Evaluates whether the network footprint matches expected user behavior.
    """
    score = 1.0

    if context.get("network_mismatch", False):
        score -= 0.4

    if context.get("ip_velocity_alert", False):
        score -= 0.3

    if context.get("vpn_or_proxy_detected", False):
        score -= 0.3

    if context.get("unstable_connection", False):
        score -= 0.2

    return max(0.0, score)
