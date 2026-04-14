from models import FraudLog
from datetime import datetime

def evaluate_claim(user, db, context):
    risk_score = 0
    reasons = []

    #  1. Sudden Location Jump
    if context.get("sudden_location_jump"):
        risk_score += 30
        reasons.append("Sudden GPS jump")

    #  2. No recent activity
    if not context.get("recent_activity"):
        risk_score += 20
        reasons.append("No delivery activity")

    #  3. Device Integrity
    if context.get("is_emulator"):
        risk_score += 40
        reasons.append("Emulator detected")

    if context.get("is_rooted"):
        risk_score += 30
        reasons.append("Rooted device")

    #  4. Suspicious cluster
    if context.get("suspicious_cluster"):
        risk_score += 25
        reasons.append("Cluster fraud pattern")

    #  5. Network mismatch (basic)
    if context.get("network_mismatch"):
        risk_score += 20
        reasons.append("Network vs location mismatch")

    # --- TRUST SCORE UPDATE ---
    if risk_score > 70:
        user.trust_score -= 10
        user.fraud_flags += 1

    elif risk_score > 40:
        user.trust_score -= 5

    else:
        user.trust_score += 1  # reward good behavior

    if risk_score >= 70:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    
    # 🔥 SAVE FRAUD LOG
        fraud_log = FraudLog(
        user_id=user.id,
        risk_score=risk_score,
        risk_level=risk_level,
        reasons=", ".join(reasons),   # ✅ change key name
        created_at=datetime.now()     # ✅ match your API
    )

    db.add(fraud_log)

    # clamp between 0–100
    user.trust_score = max(0, min(100, user.trust_score))

    db.commit()

    return {
    "risk_level": risk_level,
    "score": risk_score
}