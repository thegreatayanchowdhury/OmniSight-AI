import React, { useState } from 'react';
import { Shield, CloudRain, MapPin, TrendingUp, Clock, Wallet, AlertTriangle, ChevronRight, LogOut, LayoutDashboard, History, RefreshCw, Map as MapIcon } from 'lucide-react';

const RiskHeatmap = () => {
  const [loading, setLoading] = useState(true);
  const lastUpdated = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
  return (
    <div className="bg-omni-dark-card border border-white/5 rounded-3xl p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <MapPin size={20} className="text-omni-emerald"/>
          Your Zone Risk Map
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 hidden sm:block">Updated: {lastUpdated} IST</span>
          <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-omni-emerald/10 text-omni-emerald">
            <span className="w-2 h-2 bg-omni-emerald rounded-full animate-pulse inline-block"></span>LIVE
          </span>
        </div>
      </div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-red-600/10 text-red-400 border border-red-600/20"><span className="w-2 h-2 bg-red-600 rounded-full"></span>ZONE 3 — DANGER</span>
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"><span className="w-2 h-2 bg-amber-500 rounded-full"></span>ZONE 2 — CAUTION</span>
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-600/10 text-emerald-400 border border-emerald-600/20"><span className="w-2 h-2 bg-emerald-600 rounded-full"></span>ZONE 1 — SAFE</span>
      </div>
      <div className="relative rounded-2xl overflow-hidden border border-white/5" style={{height:'480px'}}>
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-omni-dark z-10 gap-3">
            <RefreshCw size={26} className="text-omni-emerald animate-spin"/>
            <p className="text-gray-400 text-sm">Loading your zone risk map...</p>
          </div>
        )}
        <iframe src="/heatmap.html" title="OmniSight Zone Risk Map"
          width="100%" height="100%"
          style={{border:'none',display:'block'}}
          onLoad={() => setLoading(false)}/>
      </div>
      <p className="text-xs text-gray-600 mt-3 text-center">
        🛵 OmniSight AI · Mumbai Region · Click any marker for weather, traffic &amp; risk details
      </p>
    </div>
  );
};

const ClientDashboard = () => {
  const user = { name: "Ayan Chowdhury", zone: "Asansol - Sector 2", balance: "₹1,250" };
  const activities = [
    { id:1, type:'Payout', event:'Heavy Rain (Zone A)', amount:'+ ₹350', date:'2 hours ago', status:'Success' },
    { id:2, type:'Premium', event:'Weekly Protection', amount:'- ₹49', date:'Yesterday', status:'Active' },
    { id:3, type:'Payout', event:'Platform Outage', amount:'+ ₹200', date:'3 days ago', status:'Success' },
  ];
  return (
    <div className="flex min-h-screen bg-omni-dark text-gray-100 font-sans">
      <aside className="w-64 border-r border-white/5 bg-omni-dark-card/30 backdrop-blur-md hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="p-1.5 bg-omni-emerald rounded-lg"><Shield className="w-5 h-5 text-omni-dark" strokeWidth={2.5}/></div>
          <span className="text-lg font-bold tracking-tight text-white">OmniSight <span className="text-omni-emerald">AI</span></span>
        </div>
        <nav className="flex-grow space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-omni-emerald/10 text-omni-emerald rounded-xl font-medium"><LayoutDashboard size={20}/>Dashboard</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all"><History size={20}/>Payout History</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all"><MapPin size={20}/>Zone Heatmap</button>
        </nav>
        <button className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 transition-colors mt-auto"><LogOut size={20}/>Sign Out</button>
      </aside>
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-gray-400 text-sm">Your income is protected in <span className="text-omni-emerald font-semibold">{user.zone}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Wallet Balance</p>
              <p className="text-xl font-bold text-omni-emerald">{user.balance}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-omni-emerald to-emerald-800 flex items-center justify-center font-bold">AC</div>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="col-span-1 md:col-span-2 relative overflow-hidden bg-gradient-to-br from-emerald-900/40 to-omni-dark-card border border-omni-emerald/20 p-8 rounded-3xl">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-omni-emerald/20 rounded-2xl text-omni-emerald"><Shield size={32}/></div>
                <span className="px-3 py-1 bg-omni-emerald text-omni-dark text-xs font-black rounded-full uppercase">Shield Active</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">OmniSight Protocol 2.4</h2>
              <p className="text-emerald-100/60 mb-8 max-w-sm">Monitoring weather stations and traffic nodes in your zone. AI triggers are armed.</p>
              <div className="mt-auto flex gap-4">
                <div className="flex items-center gap-2 text-sm text-omni-emerald"><CloudRain size={16}/>Rain: 2.4mm (Threshold 15mm)</div>
                <div className="flex items-center gap-2 text-sm text-omni-emerald"><Clock size={16}/>Next Reset: 4d 12h</div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10"><Shield size={200}/></div>
          </div>
          <div className="space-y-6">
            <div className="bg-omni-dark-card border border-white/5 p-6 rounded-3xl">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><TrendingUp size={20}/></div>
                <p className="text-gray-400 text-sm">Income Recovered</p>
              </div>
              <p className="text-2xl font-bold">₹5,400</p>
            </div>
            <div className="bg-omni-dark-card border border-white/5 p-6 rounded-3xl">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg"><AlertTriangle size={20}/></div>
                <p className="text-gray-400 text-sm">Events Detected</p>
              </div>
              <p className="text-2xl font-bold">14</p>
            </div>
          </div>
        </div>
        <div className="bg-omni-dark-card border border-white/5 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Recent Protection Activity</h3>
            <button className="text-omni-emerald text-sm font-semibold flex items-center gap-1 hover:underline">View All<ChevronRight size={16}/></button>
          </div>
          <div className="space-y-6">
            {activities.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.amount.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-400'}`}>
                    {item.amount.includes('+') ? <Wallet size={20}/> : <Shield size={20}/>}
                  </div>
                  <div>
                    <p className="font-bold text-white">{item.event}</p>
                    <p className="text-xs text-gray-500">{item.date} • {item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${item.amount.includes('+') ? 'text-omni-emerald' : 'text-gray-300'}`}>{item.amount}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ── LIVE RISK HEATMAP ── */}
        <RiskHeatmap />
      </main>
    </div>
  );
};

export default ClientDashboard;
