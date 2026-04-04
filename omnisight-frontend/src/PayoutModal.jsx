import React, { useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Shield, ChevronRight, IndianRupee } from "lucide-react";

const PayoutModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState(500);
  const [upi, setUpi] = useState("subham@upi");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [result, setResult] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    
  const steps = [
    "Connecting to bank...",
    "Verifying UPI ID...",
    "Processing payout...",
    "Confirming with NPCI...",
  ];

  const handleWithdraw = async () => {
    setLoading(true);
    setResult(null);

    // Step animation
    for (let i = 0; i < steps.length; i++) {
      setStep(steps[i]);
      await new Promise((res) => setTimeout(res, 700));
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/simulate-payout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          upi_id: upi,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Payout failed");
        return;
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Connection failed");
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 font-sans">
      {/* Background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px]" />

      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl w-[400px] z-10">

        {/* HEADER */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-2.5 bg-emerald-500 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-xl font-bold text-white">
            Instant Payout
          </h2>
        </div>

        {/* FORM */}
        {!loading && !result && (
          <div className="space-y-4">
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/40 text-white border border-white/10 focus:border-emerald-500/50 outline-none"
              />
            </div>

            <input
              type="text"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              placeholder="UPI ID"
              className="w-full px-4 py-3.5 rounded-2xl bg-black/40 text-white border border-white/10 focus:border-emerald-500/50 outline-none"
            />

            <button
              onClick={handleWithdraw}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all active:scale-[0.98]"
            >
              Withdraw Now
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-400 text-sm">{step}</p>
          </div>
        )}

        {/* SUCCESS + CONFETTI */}
        {result && (
          <>
            <Confetti numberOfPieces={250} recycle={false} />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <h3 className="text-emerald-400 text-xl font-bold">
                🎉 Payment Successful!
              </h3>

              <p className="text-gray-400 mt-2">{result.message}</p>

              <div className="text-sm text-gray-500 mt-3">
                <p>Txn ID: {result.transaction_id}</p>
                <p>UPI: {upi}</p>
              </div>

              <button
                onClick={onClose}
                className="mt-5 px-4 py-2 bg-emerald-500 text-black rounded-xl font-semibold"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default PayoutModal;