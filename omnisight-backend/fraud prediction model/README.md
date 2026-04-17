Fraud prediction model package.

Structure

- fraud_prediction/config.py
- fraud_prediction/signals/
- fraud_prediction/models/
- fraud_prediction/engine/
- fraud_prediction/api/routes/

Usage

```python
from fraud_prediction.engine.evaluate_claim import evaluate_claim


class UserProfile:
    def __init__(self, trust_score: float) -> None:
        self.trust_score = trust_score


user = UserProfile(trust_score=82)
context = {
    "mock_location_enabled": False,
    "is_rooted": False,
    "is_emulator": False,
    "network_mismatch": False,
    "sudden_location_jump": False,
    "recent_activity": True,
    "suspicious_cluster": False,
    "weather_conflict": False,
    "traffic_conflict": False,
}

result = evaluate_claim(user=user, context=context)
print(result)
```

FastAPI integration

```python
from fraud_prediction.api.routes.fraud import router as fraud_router

app.include_router(fraud_router, prefix="/fraud-ai", tags=["Fraud AI"])
```
