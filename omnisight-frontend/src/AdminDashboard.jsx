import React, { useState } from 'react';
import { Shield, Activity, Users, AlertOctagon, Zap, Map as MapIcon, Search, Filter, RefreshCw } from 'lucide-react';

const RiskHeatmap = () => {
  const [loading, setLoading] = useState(true);
  const lastUpdated = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-ping inline-block"></span>
          <MapIcon size={20} className="text-red-400" />
          Live Gig Worker Risk Heatmap
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 hidden sm:block">Updated: {lastUpdated} IST</span>
          <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-red-500/10 text-red-400">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block"></span>LIVE
          </span>
        </div>
      </div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-600/30"><span className="w-2 h-2 bg-red-600 rounded-full"></span>ZONE 3 — DANGER ≥75</span>
        <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30"><span className="w-2 h-2 bg-amber-500 rounded-full"></span>ZONE 2 — CAUTION 50–74</span>
        <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30"><span className="w-2 h-2 bg-emerald-600 rounded-full"></span>ZONE 1 — SAFE &lt;50</span>
        <span className="ml-auto text-xs text-gray-500 self-center hidden md:block">Mumbai · 5 zones · zone_1–zone_5</span>
      </div>
      <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{height:'520px'}}>
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0f1a] z-10 gap-3">
            <RefreshCw size={28} className="text-red-400 animate-spin"/>
            <p className="text-gray-400 text-sm">Loading risk heatmap...</p>
          </div>
        )}
        <iframe src="/heatmap.html" title="OmniSight Live Risk Heatmap"
          width="100%" height="100%"
          style={{border:'none',display:'block',background:'#0a0f1a'}}
          onLoad={() => setLoading(false)}/>
      </div>
      <p className="text-xs text-gray-600 mt-3 text-center">
        🛵 OmniSight AI · DevTrails 2026 · Gig Worker Safety · Click zone markers for full risk details
      </p>
    </div>
  );
};

const AdminDashboard = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const stats = [
    { label: 'Total Partners', value: '12,402', icon: <Users />, color: 'text-blue-400' },
    { label: 'Active Triggers', value: '3', icon: <Zap />, color: 'text-emerald-400' },
    { label: 'Fraud Flagged', value: '12', icon: <AlertOctagon />, color: 'text-red-400' },
    { label: 'Payouts Today', value: '₹42,500', icon: <Activity />, color: 'text-purple-400' },
  ];
  const disruptions = [
    { zone: "Bandra West, Mumbai", type: "Heavy Rain", intensity: "22mm/hr", status: "Active" },
    { zone: "Salt Lake, Kolkata", type: "Water Logging", intensity: "Critical", status: "Active" },
    { zone: "Indiranagar, Bangalore", type: "Protest/Roadblock", intensity: "High", status: "Pending" },
  ];
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-gray-100 font-sans flex">
      <aside className="w-20 lg:w-64 bg-black/40 border-r border-white/5 flex flex-col items-center lg:items-start p-6">
        <div className="flex items-center gap-2 mb-12">
          <div className="p-2 bg-red-500 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.4)]"><Shield className="w-6 h-6 text-white"/></div>
          <span className="hidden lg:block text-xl font-black tracking-tighter">OMNISIGHT <span className="text-red-500">OPS</span></span>
        </div>
        <nav className="space-y-6 w-full">
          <button className="flex items-center gap-4 text-red-500 w-full px-4 py-2 bg-red-500/10 rounded-xl"><Activity size={20}/><span className="hidden lg:block">Monitoring</span></button>
          <button className="flex items-center gap-4 text-gray-500 hover:text-white w-full px-4 py-2"><MapIcon size={20}/><span className="hidden lg:block">Zone Control</span></button>
          <button className="flex items-center gap-4 text-gray-500 hover:text-white w-full px-4 py-2"><Users size={20}/><span className="hidden lg:block">Partners</span></button>
          <button className="flex items-center gap-4 text-gray-500 hover:text-white w-full px-4 py-2"><AlertOctagon size={20}/><span className="hidden lg:block">Fraud AI</span></button>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold italic tracking-tight">SYSTEM OVERVIEW</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
              <input type="text" placeholder="Search Zone ID..." className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 outline-none focus:border-red-500/50"/>
            </div>
            <button onClick={() => { setIsSimulating(true); setTimeout(() => setIsSimulating(false), 3000); }}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${isSimulating ? 'bg-orange-500 animate-pulse' : 'bg-red-600 hover:bg-red-500'}`}>
              <Zap size={18} fill="currentColor"/> {isSimulating ? 'SIMULATING...' : 'SIMULATE DISRUPTION'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all">
              <div className={`mb-4 ${s.color}`}>{s.icon}</div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-3xl font-mono font-bold">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>Live Parametric Triggers</h2>
              <Filter className="text-gray-500 hover:text-white cursor-pointer" size={20}/>
            </div>
            <table className="w-full text-left">
              <thead><tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/5">
                <th className="pb-4">Zone</th><th className="pb-4">Trigger</th><th className="pb-4">Intensity</th><th className="pb-4">Status</th><th className="pb-4">Action</th>
              </tr></thead>
              <tbody className="text-sm">
                {disruptions.map((d, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="py-5 font-medium">{d.zone}</td>
                    <td className="py-5 text-gray-400">{d.type}</td>
                    <td className="py-5 font-mono text-red-400">{d.intensity}</td>
                    <td className="py-5"><span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{d.status}</span></td>
                    <td className="py-5"><button className="text-gray-500 hover:text-white transition-colors">Override</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><AlertOctagon className="text-orange-500" size={24}/>AI Anomaly Shield</h2>
            <div className="space-y-6">
              {[
                { user:"ID: 99283", issue:"GPS Spoofing Detected", score:"92%" },
                { user:"ID: 44102", issue:"Multiple Payout Requests", score:"88%" },
                { user:"ID: 11203", issue:"Zone/IP Mismatch", score:"74%" }
              ].map((f, i) => (
                <div key={i} className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-orange-500">{f.issue}</span>
                    <span className="text-[10px] text-gray-500">{f.score} match</span>
                  </div>
                  <p className="text-sm font-bold">{f.user}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 bg-red-500/20 text-red-500 py-1 rounded text-xs hover:bg-red-500 hover:text-white transition-all">Block</button>
                    <button className="flex-1 bg-white/5 text-gray-400 py-1 rounded text-xs hover:bg-white/10 transition-all">Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ── LIVE RISK HEATMAP ── */}
        <RiskHeatmap />
      </main>
    </div>
  );
};

export default AdminDashboard;
