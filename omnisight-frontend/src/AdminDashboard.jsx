import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Users,
  AlertOctagon,
  Zap,
  Map as MapIcon,
  Search,
  CheckCircle,
  XCircle,
  Filter,
  RefreshCw
} from 'lucide-react';
import { LogOut } from "lucide-react";

// ── Live Risk Heatmap Panel ───────────────────────────────────────────────────
const RiskZonePanel = () => {
  const [loading, setLoading] = useState(true);
  const lastUpdated = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', hour12: true
  });

  return (
    <div className="flex flex-col gap-6">

      {/* Panel header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold italic tracking-tight">RISK ZONE MAP</h1>
          <p className="text-gray-500 text-sm mt-1">
            Live gig worker risk heatmap · Mumbai Region · zone_1 – zone_5
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 hidden sm:block">
            Updated: {lastUpdated} IST
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block"></span>
            LIVE
          </span>
        </div>
      </div>

      {/* Zone legend pills */}
      <div className="flex gap-3 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-600/30">
          <span className="w-2 h-2 bg-red-600 rounded-full"></span>
          ZONE 3 — DANGER ≥75
        </span>
        <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
          ZONE 2 — CAUTION 50–74
        </span>
        <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30">
          <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
          ZONE 1 — SAFE &lt;50
        </span>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Risk Zones', value: '5', color: 'text-red-400' },
          { label: 'Highest Risk Score', value: '98.04', color: 'text-orange-400' },
          { label: 'Scan Radius', value: '25 km', color: 'text-blue-400' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Heatmap iframe */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="relative" style={{ height: '560px' }}>
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0f1a] z-10 gap-3">
              <RefreshCw size={28} className="text-red-400 animate-spin" />
              <p className="text-gray-400 text-sm">Loading live risk heatmap...</p>
            </div>
          )}
          <iframe
            src="/heatmap.html"
            title="OmniSight Live Risk Heatmap"
            width="100%"
            height="100%"
            style={{ border: 'none', display: 'block', background: '#0a0f1a' }}
            onLoad={() => setLoading(false)}
          />
        </div>
        <div className="px-6 py-3 border-t border-white/5 flex justify-between items-center">
          <p className="text-xs text-gray-600">
            🛵 OmniSight AI · DevTrails 2026 · Gig Worker Safety · Click any zone marker for risk details
          </p>
          <span className="text-xs text-gray-600">
            Data: Feb 2024 – Mar 2026
          </span>
        </div>
      </div>

      {/* Zone breakdown table */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-ping inline-block"></span>
          Zone Risk Breakdown (Latest Week)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/5">
                <th className="pb-3">Zone ID</th>
                <th className="pb-3">Area</th>
                <th className="pb-3">Risk Score</th>
                <th className="pb-3">Risk Bin</th>
                <th className="pb-3">Worker Alert</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'zone_1', area: 'Dharavi',       score: 98.04, bin: 'HIGH' },
                { id: 'zone_2', area: 'Kurla West',    score: 98.00, bin: 'HIGH' },
                { id: 'zone_3', area: 'Andheri East',  score: 97.85, bin: 'HIGH' },
                { id: 'zone_4', area: 'Bandra Kurla',  score: 97.99, bin: 'HIGH' },
                { id: 'zone_5', area: 'Thane West',    score: 98.01, bin: 'HIGH' },
              ].map((z, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-3 font-mono text-gray-400">{z.id}</td>
                  <td className="py-3 font-medium">{z.area}</td>
                  <td className="py-3 font-mono text-red-400 font-bold">{z.score}</td>
                  <td className="py-3">
                    <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                      {z.bin}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold">
                      🔴 ZONE 3 — DANGER
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

// ── Admin Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [isSystemPaused, setIsSystemPaused] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeNav, setActiveNav] = useState('monitoring'); // 'monitoring' | 'riskzone' | 'zonecontrol' | 'partners' | 'fraud'

  const stats = [
    { label: 'Total Partners', value: '12,402', icon: <Users />, color: 'text-blue-400' },
    { label: 'Active Triggers', value: '3', icon: <Zap />, color: 'text-omni-emerald' },
    { label: 'Fraud Flagged', value: '12', icon: <AlertOctagon />, color: 'text-red-400' },
    { label: 'Payouts Today', value: '₹42,500', icon: <Activity />, color: 'text-purple-400' },
  ];

  const disruptions = [
    { zone: "Bandra West, Mumbai", type: "Heavy Rain", intensity: "22mm/hr", status: "Active", time: "14:20" },
    { zone: "Salt Lake, Kolkata", type: "Water Logging", intensity: "Critical", status: "Active", time: "15:05" },
    { zone: "Indiranagar, Bangalore", type: "Protest/Roadblock", intensity: "High", status: "Pending", time: "16:45" },
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };

  const toggleSystem = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/toggle-system", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pause: !isSystemPaused })
      });
      const data = await res.json();
      setIsSystemPaused(data.paused);
    } catch (err) {
      console.error(err);
      alert("Failed to toggle system");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-gray-100 font-sans flex">

      {/* ── ADMIN SIDEBAR ── */}
      <aside className="w-20 lg:w-64 bg-black/40 border-r border-white/5 flex flex-col items-center lg:items-start p-6 flex-shrink-0">
        <div className="flex items-center gap-2 mb-12">
          <div className="p-2 bg-red-500 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.4)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="hidden lg:block text-xl font-black tracking-tighter">
            OMNISIGHT <span className="text-red-500">OPS</span>
          </span>
        </div>

        <nav className="space-y-3 w-full">

          {/* Monitoring */}
          <button
            onClick={() => setActiveNav('monitoring')}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-xl transition-all ${
              activeNav === 'monitoring'
                ? 'text-red-500 bg-red-500/10'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <Activity size={20} />
            <span className="hidden lg:block">Monitoring</span>
          </button>

          {/* ── RISK ZONE (new) ── */}
          <button
            onClick={() => setActiveNav('riskzone')}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-xl transition-all ${
              activeNav === 'riskzone'
                ? 'text-red-500 bg-red-500/10'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <MapIcon size={20} />
            <span className="hidden lg:block flex items-center gap-2">
              Risk Zone
              {/* live pulse badge */}
              <span className="hidden lg:inline-flex items-center gap-1 ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block"></span>
                LIVE
              </span>
            </span>
          </button>

          {/* Zone Control */}
          <button
            onClick={() => setActiveNav('zonecontrol')}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-xl transition-all ${
              activeNav === 'zonecontrol'
                ? 'text-red-500 bg-red-500/10'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <MapIcon size={20} />
            <span className="hidden lg:block">Zone Control</span>
          </button>

          {/* Partners */}
          <button
            onClick={() => setActiveNav('partners')}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-xl transition-all ${
              activeNav === 'partners'
                ? 'text-red-500 bg-red-500/10'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <Users size={20} />
            <span className="hidden lg:block">Partners</span>
          </button>

          {/* Fraud AI */}
          <button
            onClick={() => setActiveNav('fraud')}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-xl transition-all ${
              activeNav === 'fraud'
                ? 'text-red-500 bg-red-500/10'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <AlertOctagon size={20} />
            <span className="hidden lg:block">Fraud AI</span>
          </button>

        </nav>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* ── RISK ZONE VIEW ── */}
        {activeNav === 'riskzone' && <RiskZonePanel />}

        {/* ── MONITORING VIEW (original) ── */}
        {activeNav === 'monitoring' && (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-bold italic tracking-tight">SYSTEM OVERVIEW</h1>
              <div className="flex gap-4 flex-wrap justify-end items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="text" placeholder="Search Zone ID..." className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 outline-none focus:border-red-500/50" />
                </div>
                <button
                  onClick={handleSimulate}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${isSimulating ? 'bg-orange-500 animate-pulse' : 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/20'}`}
                >
                  <Zap size={18} fill="currentColor" /> {isSimulating ? 'SIMULATING EVENT...' : 'SIMULATE DISRUPTION'}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-2 rounded-full font-bold bg-white/5 border border-white/10 text-white hover:bg-red-500/20 hover:border-red-400/40 transition-all shadow-lg"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>

            {/* Admin Control Panel */}
            <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-black/40 border border-red-500/20 rounded-3xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-red-400">Emergency Control</h2>
                  <AlertOctagon className="text-red-500" />
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  Instantly halt all new policy enrollments and renewals during high-risk scenarios.
                </p>
                <button
                  onClick={toggleSystem}
                  className={`w-full py-4 rounded-2xl font-black text-lg tracking-wider transition-all ${
                    isSystemPaused
                      ? "bg-gray-700 text-gray-300"
                      : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                  }`}
                >
                  {isSystemPaused ? "SYSTEM PAUSED" : "🚨 KILL SWITCH"}
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  Status: {isSystemPaused ? "❌ Enrollment Disabled" : "✅ System Active"}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h2 className="text-lg font-bold mb-4">Actuarial Risk Monitor</h2>
                <div className="space-y-4">
                  <div><p className="text-xs text-gray-500">Loss Ratio</p><p className="text-xl font-bold text-orange-400">78%</p></div>
                  <div><p className="text-xs text-gray-500">Active Risk Zones</p><p className="text-xl font-bold text-red-400">5 Zones</p></div>
                  <div><p className="text-xs text-gray-500">Premium vs Payout</p><p className="text-xl font-bold text-omni-emerald">₹1.2L / ₹95K</p></div>
                  <div className="pt-3">
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "78%" }} />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">Risk threshold nearing critical level</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all">
                  <div className={`mb-4 ${stat.color}`}>{stat.icon}</div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-mono font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                    Live Parametric Triggers
                  </h2>
                  <Filter className="text-gray-500 hover:text-white cursor-pointer" size={20} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/5">
                        <th className="pb-4">Zone</th><th className="pb-4">Trigger Type</th>
                        <th className="pb-4">Intensity</th><th className="pb-4">Status</th><th className="pb-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {disruptions.map((d, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0 group">
                          <td className="py-5 font-medium">{d.zone}</td>
                          <td className="py-5 text-gray-400">{d.type}</td>
                          <td className="py-5 font-mono text-red-400">{d.intensity}</td>
                          <td className="py-5">
                            <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{d.status}</span>
                          </td>
                          <td className="py-5">
                            <button className="text-gray-500 hover:text-white transition-colors">Override</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <AlertOctagon className="text-orange-500" size={24} /> AI Anomaly Shield
                </h2>
                <div className="space-y-6">
                  {[
                    { user: "ID: 99283", issue: "GPS Spoofing Detected", score: "92%" },
                    { user: "ID: 44102", issue: "Multiple Payout Requests", score: "88%" },
                    { user: "ID: 11203", issue: "Zone/IP Mismatch", score: "74%" }
                  ].map((fraud, i) => (
                    <div key={i} className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-orange-500">{fraud.issue}</span>
                        <span className="text-[10px] text-gray-500">{fraud.score} match</span>
                      </div>
                      <p className="text-sm font-bold">{fraud.user}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 bg-red-500/20 text-red-500 py-1 rounded text-xs hover:bg-red-500 hover:text-white transition-all">Block</button>
                        <button className="flex-1 bg-white/5 text-gray-400 py-1 rounded text-xs hover:bg-white/10 transition-all">Review</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Placeholder views for other nav items */}
        {['zonecontrol','partners','fraud'].includes(activeNav) && (
          <div className="flex items-center justify-center h-64 text-gray-600 text-lg font-bold">
            {activeNav === 'zonecontrol' && '🗺️ Zone Control — coming soon'}
            {activeNav === 'partners' && '👥 Partners — coming soon'}
            {activeNav === 'fraud' && '🛡️ Fraud AI — coming soon'}
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
