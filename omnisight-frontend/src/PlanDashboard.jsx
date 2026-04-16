import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;
const PlanDashboard = () => {
  const [user, setUser] = useState(null);
  const [premiumPlan, setPremiumPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    console.log("Stored User:", storedUser); // 🔍 debug

    if (!storedUser) {
      console.log("No user found in localStorage");
      return;
    }

    setUser(storedUser);
    const fetchPremium = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/get-quote?city=${storedUser.city}&tier=${storedUser.activity_tier}&income=${storedUser.avg_daily_income}`
        );

        const data = await res.json();

        setPremiumPlan({
          title: "Premium",
          weekly: `₹${data.weekly_premium}`,
          monthly: `₹${(data.weekly_premium * 4).toFixed(0)}`,
          coverage: `₹${data.coverage_limit}`,
        });
      } catch (err) {
        console.error("Premium fetch error:", err);
      }
    };

    fetchPremium();
  }, []);
  const handleBuy = async (plan) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));

   navigate("/buy", { state: { plan } });
   await fetch(
  `${API_BASE_URL}/complete-onboarding?user_id=${storedUser.id}&plan=${plan.title.toLowerCase()}`,
  {
    method: "POST",
  }
);

    //  Update localStorage instantly
    const updatedUser = {
      ...storedUser,
      activity_tier: plan.title.toLowerCase(),
      is_onboarded: 1,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
swer@we.me
    //  Redirect to dashboard
    navigate("/client/dashboard");

  } catch (err) {
    console.error("Plan selection error:", err);
  }
};

  if (!user) return null;

  return (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">

    {/* HEADER */}
    <div className="max-w-6xl mx-auto mb-12">
      <h1 className="text-4xl font-bold tracking-tight">
        Welcome, <span className="text-emerald-400">{user.name?.split(" ")[0]}</span> 
      </h1>
      <p className="text-gray-400 mt-2">
        📍 {user.city} • Smart protection tailored for you
      </p>
    </div>

    <div className="max-w-6xl mx-auto">

      {/*  PREMIUM PLAN */}
      {premiumPlan && (
        <div className="mb-16">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-emerald-400">
              AI Recommended Plan
            </h2>

            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs">
              Best Value
            </span>
          </div>

          <div className="relative rounded-3xl p-10 
                          bg-gradient-to-br from-emerald-900/20 to-black/40
                          border border-emerald-500/40
                          shadow-[0_0_40px_rgba(16,185,129,0.25)]
                          hover:scale-[1.02] transition duration-300">

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-3xl blur-2xl bg-emerald-500/10 opacity-30"></div>

            <div className="relative z-10">

              {/* Title */}
              <h3 className="text-3xl font-bold mb-2">
                Premium Plan (Recommended)
              </h3>

              <p className="text-gray-400 mb-6">
                Built for {user.city} gig workers with dynamic risk protection
              </p>

              {/* Pricing */}
              <div className="flex items-end gap-4 mb-6">
                <p className="text-4xl font-bold text-emerald-400">
                  {premiumPlan.weekly}
                </p>
                <span className="text-gray-400 mb-1">/week</span>
              </div>

              <p className="text-gray-500 mb-6">
                {premiumPlan.monthly} billed monthly
              </p>

              {/* Coverage */}
              <div className="mb-8 p-4 bg-black/40 rounded-xl border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Coverage Limit</p>
                <p className="text-lg font-semibold">{premiumPlan.coverage}</p>
              </div>

              {/* Features grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8 text-sm">
                <p>✔ Income Protection</p>
                <p>✔ Weather + Pollution Cover</p>
                <p>✔ Instant Claim Payout</p>
                <p>✔ AI Risk Pricing</p>
                <p>✔ Priority Support</p>
                <p>✔ High Coverage Limits</p>
              </div>

              {/* WHY */}
              <div className="mb-8 p-4 bg-black/50 rounded-xl border border-white/10">
                <p className="text-xs text-gray-400 mb-2">Why this plan?</p>
                <p className="text-sm">
                  Based on your location in{" "}
                  <span className="text-emerald-400">{user.city}</span>, 
                  your earnings and activity suggest a{" "}
                  <span className="text-emerald-400 font-semibold">
                    higher disruption risk
                  </span>.
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={() => handleBuy(premiumPlan)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 
                           text-black py-3 rounded-xl font-bold text-lg
                           shadow-lg hover:shadow-emerald-500/30 transition"
              >
                Buy Premium Plan 
              </button>

            </div>
          </div>
        </div>
      )}

      {/*  OTHER PLANS */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Basic */}
        <div className="rounded-3xl p-6 bg-black/40 border border-gray-800 
                        hover:border-emerald-500 hover:scale-[1.02] transition">

          <h3 className="text-xl font-bold mb-3">Basic</h3>

          <p className="text-2xl font-semibold mb-2">₹49</p>
          <p className="text-gray-400 text-sm mb-6">Rain-only coverage</p>

          <ul className="text-sm text-gray-400 mb-6 space-y-2">
            <li>✔ Rain protection</li>
            <li>✔ Basic claim support</li>
          </ul>

          <button
            onClick={() => handleBuy({ title: "Basic", weekly: "₹49" })}
            className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-xl"
          >
            Choose Basic
          </button>
        </div>

        {/* Elite */}
        <div className="rounded-3xl p-6 bg-black/40 border border-gray-800 
                        hover:border-emerald-500 hover:scale-[1.02] transition">

          <h3 className="text-xl font-bold mb-3">Elite</h3>

          <p className="text-2xl font-semibold mb-2">₹149</p>
          <p className="text-gray-400 text-sm mb-6">
            Maximum coverage + fastest payouts
          </p>

          <ul className="text-sm text-gray-400 mb-6 space-y-2">
            <li>✔ Full risk coverage</li>
            <li>✔ Instant payouts</li>
            <li>✔ Priority processing</li>
          </ul>

          <button
            onClick={() => handleBuy({ title: "Elite", weekly: "₹149" })}
            className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-xl"
          >
            Choose Elite
          </button>
        </div>

      </div>
    </div>
  </div>
);
};

export default PlanDashboard;