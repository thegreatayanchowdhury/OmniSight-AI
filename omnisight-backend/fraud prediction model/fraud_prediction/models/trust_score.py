"""Models that describe the output of a fraud evaluation."""

from dataclasses import dataclass
from typing import Dict, List


@dataclass(frozen=True)
class TrustScoreResult:
    """
    Normalized result returned by the multi-signal fraud engine.
    """

    risk_level: str
    risk_score: float
    trust_score: float
    action: str
    reasons: List[str]
    signals: Dict[str, float]

    def to_dict(self) -> dict:
        return {
            "risk_level": self.risk_level,
            "risk_score": round(self.risk_score, 2),
            "trust_score": round(self.trust_score, 2),
            "action": self.action,
            "reasons": self.reasons,
            "signals": {name: round(value, 2) for name, value in self.signals.items()},
        }
