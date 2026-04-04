from database import SessionLocal
from models import User


def determine_payout_tier(disruption_type: str, value: float):
    """
    Implements Threshold Limits.
    """

    if disruption_type == "AQI":
        if value >= 300:
            return {"level": "Severe", "percent": 100}
        elif value >= 200:
            return {"level": "Moderate", "percent": 30}

    elif disruption_type == "Rainfall":
        if value >= 50:  # mm
            return {"level": "Severe", "percent": 100}
        elif value >= 20:
            return {"level": "Moderate", "percent": 30}

    return None


def calculate_payout_amount(avg_daily_income: float, tier_percent: int):
    return (avg_daily_income * tier_percent) / 100


def process_payout(disruption_type: str, value: float):
    db = SessionLocal()

    try:
        print(f"⚡ Processing {disruption_type} trigger with value {value}")

        tier = determine_payout_tier(disruption_type, value)

        if not tier:
            print("❌ No payout tier triggered")
            return

        users = db.query(User).filter(User.role == "client").all()
        print(f"👥 Found {len(users)} users")

        from models import Payout

        for user in users:
            print("Processing user:", user.name)

            avg_income = user.avg_daily_income or 500

            payout_amount = (
            Decimal(avg_income) * Decimal(tier["percent"]) / Decimal(100)
            )

            print(f"Before: {user.balance}")
            user.balance = (user.balance or 0) + payout_amount
            print(f"After: {user.balance}")

            print(
                f"💰 Paid ₹{payout_amount} to {user.name} "
                f"({tier['level']} - {tier['percent']}%)"
            )

            # ✅ CREATE payout record INSIDE loop
            payout_record = Payout(
                user_id=user.id,
                amount=payout_amount,
                disruption_type=disruption_type,
                severity_level=tier["level"],
                payout_percentage=tier["percent"]
            )

            db.add(payout_record)  # ✅ inside loop
            db.commit()

    except Exception as e:
        print("Payout error:", e)
        db.rollback()

    finally:
        db.close()