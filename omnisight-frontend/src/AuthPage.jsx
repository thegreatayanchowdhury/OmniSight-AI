import React, { useState } from 'react';
import { Shield, Mail, Lock, User, ChevronRight } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('client');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ======================
  // SUBMIT HANDLER
  // ======================
  const handleSubmit = async (e) => {
  e.preventDefault();

  const url = isLogin ? "/login" : "/signup";

  // ======================
  // FRONTEND VALIDATION
  // ======================

  if (!email || !email.includes("@")) {
    alert("Enter a valid email");
    return;
  }

  if (!password) {
    alert("Password is required");
    return;
  }

  
  if (!isLogin) {
    if (!name || name.trim().length < 2) {
      alert("Enter a valid name");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
  }

  const body = isLogin
    ? { email, password }
    : { name, email, password, role };

  try {
    const res = await fetch(`http://127.0.0.1:8000${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Something went wrong");
      return;
    }

    // ======================
    // LOGIN SUCCESS
    // ======================
    if (isLogin) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      // 🔥 redirect clean way
      window.location.href = data.role === "admin" ? "/admin" : "/client";
    } 
    // ======================
    // SIGNUP SUCCESS
    // ======================
    else {
      alert("Account created successfully! Please login.");

      // reset fields
      setName("");
      setEmail("");
      setPassword("");

      setIsLogin(true);
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};
  return (
    <div className="min-h-screen bg-omni-dark flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-[450px] z-10">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Shield className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-bold text-white">
            OmniSight <span className="text-emerald-400">AI</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">

          {/* Role Switch */}
          <div className="flex p-1 bg-black/40 rounded-xl mb-8">
            <button
              onClick={() => setRole('client')}
              className={`flex-1 py-2 rounded-lg ${
                role === 'client'
                  ? 'bg-emerald-500 text-black'
                  : 'text-gray-400'
              }`}
            >
              Partner
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 rounded-lg ${
                role === 'admin'
                  ? 'bg-emerald-500 text-black'
                  : 'text-gray-400'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-12 p-3 rounded-xl bg-black/40 text-white border border-white/10"
                />
              </div>
            )}

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-12 p-3 rounded-xl bg-black/40 text-white border border-white/10"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 p-3 rounded-xl bg-black/40 text-white border border-white/10"
              />
            </div>

            {/* BUTTON */}
            <button className="w-full bg-emerald-500 text-black py-3 rounded-xl font-bold flex justify-center items-center gap-2">
              {isLogin ? "Sign In" : "Sign Up"}
              <ChevronRight />
            </button>

          </form>

          {/* SWITCH */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-400 ml-1"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;