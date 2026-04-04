import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Shield, Mail, Lock, User, ChevronRight } from 'lucide-react';
import { loginUser, signupUser } from "./apis/auth";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // // ✅ Redirect if already logged in
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = localStorage.getItem("role");

  //   if (token) {
  //     if (role === "admin") {
  //       navigate("/admin/dashboard");
  //     } else {
  //       navigate("/client/dashboard");
  //     }
  //   }
  // }, []);

  const [open, setOpen] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) setOpen(true);
}, []);


const handleContinue = () => {
  const role = localStorage.getItem("role");

  if (role === "admin") {
    navigate("/admin/dashboard");
  } else {
    navigate("/client/dashboard");
  }
};

const handleLogout = () => {
  localStorage.clear();
  setOpen(false);
};

  // ✅ SINGLE clean handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !email.includes("@")) return alert("Enter a valid email");
    if (!password || password.length < 6)
      return alert("Password must be at least 6 characters");
    if (!isLogin && (!name || name.trim().length < 2))
      return alert("Enter a valid name");

    const body = isLogin
      ? { email, password }
      : { name, email, password, role };

    try {
      const response = isLogin
        ? await loginUser(body)
        : await signupUser(body);

      const data = response.data;

      if (isLogin) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");

        if (!data.access_token) {
          alert("Login failed: No token received");
          return;
        }

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userName", data.name || "User");

        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/client/dashboard");
        }
      } else {
        alert("Account created successfully! Please login.");
        setIsLogin(true);
        setName("");
      }
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Connection failed. Is the backend running?";
      alert(message);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-[420px] z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="p-2.5 bg-emerald-500 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Shield className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            OmniSight <span className="text-emerald-400">AI</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          {/* Role Switch (Only show during Signup) */}
          {!isLogin && (
            <div className="flex p-1 bg-black/40 rounded-2xl mb-8 border border-white/5">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  role === 'client' ? 'bg-emerald-500 text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Delivery Partner
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  role === 'admin' ? 'bg-emerald-500 text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Admin
              </button>
            </div>
          )}

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Join OmniSight"}
            </h2>
            <p className="text-gray-500 text-sm">
              {isLogin ? "Secure access to your earnings protection" : "Start yourparametric income journey"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/40 text-white border border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work Email"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/40 text-white border border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secure Password"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/40 text-white border border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all mt-4 active:scale-[0.98] shadow-[0_10px_20px_rgba(16,185,129,0.2)]">
              {isLogin ? "Sign In" : "Create Account"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>

          <div className="text-center mt-8">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-500 text-sm hover:text-white transition-colors"
            >
              {isLogin ? "New to OmniSight? " : "Already protected? "}
              <span className="text-emerald-400 font-semibold">{isLogin ? "Create account" : "Sign in here"}</span>
            </button>
          </div>
        </div>
      </div>
      {open && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 w-80 text-center shadow-2xl">
      
      <h2 className="text-xl font-semibold text-white mb-2">
        Already Logged In
      </h2>

      <p className="text-gray-400 mb-5">
        Continue to dashboard or logout?
      </p>

      <div className="flex justify-center gap-3">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>

        <button
          onClick={handleContinue}
          className="px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};


export default AuthPage;