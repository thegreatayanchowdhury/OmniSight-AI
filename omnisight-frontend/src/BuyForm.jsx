import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ShieldCheck, CreditCard, MapPin, Phone, User } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const BuyPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const plan = state?.plan;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!plan) {
    return <div className="text-white p-10">No plan selected ❌</div>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (!form.name || !form.phone || !form.city) {
      alert("Please fill all details");
      return;
    }

    try {
      setLoading(true);

      const amount = parseInt(plan.weekly.replace("₹", ""));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          amount,
          plan: plan.title.toLowerCase(),
          city: form.city
        }),
      });
      const order = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "OmniSight",
        description: plan.title,
        order_id: order.id,

        handler: async function (response) {

          await fetch(`${import.meta.env.VITE_API_URL}/verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
            }),
          });

          setSuccess(true);
          setTimeout(() => navigate("/client/dashboard"), 2500);
        },

        prefill: {
          name: form.name,
          contact: form.phone,
        },

        notes: {
          city: form.city,
        },

        method: {
          upi: true,
          card: true,
          netbanking: true,
        },
        theme: { color: "#10b981" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {/* LEFT - PLAN / ORDER SUMMARY */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="text-emerald-400" size={18} />
            <p className="text-sm text-gray-400">Order Summary</p>
          </div>

          <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
          <p className="text-emerald-400 text-3xl font-bold mb-4">{plan.weekly}</p>

          <div className="border-t border-white/10 pt-4 space-y-3 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Plan Price</span>
              <span>{plan.weekly}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between font-semibold text-white">
              <span>Total</span>
              <span>{plan.weekly}</span>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            🔒 Secured by Razorpay • 100% safe payments
          </div>
        </motion.div>

        {/* RIGHT - FORM */}
        <AnimatePresence>
          {!success ? (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl"
            >
              <h2 className="text-2xl font-semibold mb-6">Checkout</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center bg-black/50 border border-gray-700 rounded-xl px-3">
                  <User size={18} className="text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-3 bg-transparent outline-none"
                  />
                </div>

                <div className="flex items-center bg-black/50 border border-gray-700 rounded-xl px-3">
                  <Phone size={18} className="text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full p-3 bg-transparent outline-none"
                  />
                </div>

                <div className="flex items-start bg-black/50 border border-gray-700 rounded-xl px-3">
                  <MapPin size={18} className="text-gray-400 mt-3" />
                  <textarea
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full p-3 bg-transparent outline-none"
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black py-4 rounded-xl font-bold text-lg shadow-lg transition disabled:opacity-50"
              >
                {loading ? "Processing Payment..." : `Proceed to Pay ${plan.weekly}`}
              </motion.button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                You will be redirected to Razorpay secure checkout
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-3 flex flex-col items-center justify-center text-center"
            >
              <CheckCircle size={90} className="text-emerald-400 mb-4" />
              <h2 className="text-3xl font-bold text-emerald-400 mb-2">
                Payment Successful 🎉
              </h2>
              <p className="text-gray-400">Redirecting to dashboard...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BuyPage;
