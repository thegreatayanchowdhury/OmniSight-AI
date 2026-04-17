"""External-condition correlation signals."""


def check_environmental_correlation(context: dict) -> float:
    """
    Compares the claim with external environmental evidence such as
    weather and traffic conditions.
    """
    score = 1.0

    if context.get("weather_conflict", False):
        score -= 0.5

    if context.get("traffic_conflict", False):
        score -= 0.3

    if context.get("route_anomaly", False):
        score -= 0.2

    return max(0.0, score)
