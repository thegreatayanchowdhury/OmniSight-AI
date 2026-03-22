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
  Filter
} from 'lucide-react';

const AdminDashboard = () => {
  const [isSimulating, setIsSimulating] = useState(false);

  // Mock stats for the dashboard
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

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-gray-100 font-sans flex">
      
      {/* --- ADMIN SIDEBAR --- */}
      <aside className="w-20 lg:w-64 bg-black/40 border-r border-white/5 flex flex-col items-center lg:items-start p-6">
        <div className="flex items-center gap-2 mb-12">
          <div className="p-2 bg-red-500 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.4)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="hidden lg:block text-xl font-black tracking-tighter">OMNISIGHT <span className="text-red-500">OPS</span></span>
        </div>
        
        <nav className="space-y-6 w-full">
          <button className="flex items-center gap-4 text-red-500 w-full px-4 py-2 bg-red-500/10 rounded-xl"><Activity size={20}/> <span className="hidden lg:block">Monitoring</span></button>
          <button className="flex items-center gap-4 text-gray-500 hover:text-white w-full px-4 py-2"><MapIcon size={20}/> <span className="hidden lg:block">Zone Control</span></button>
          <button className="flex items-center gap-4 text-gray-500 hover:text-white w-full px-4 py-2"><Users size={20}/> <span className="hidden lg:block">Partners</span></button>
          <button className="flex items-center gap-4 text-gray-500 hover:text-white w-full px-4 py-2"><AlertOctagon size={20}/> <span className="hidden lg:block">Fraud AI</span></button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold italic tracking-tight">SYSTEM OVERVIEW</h1>
          <div className="flex gap-4">
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
          
          {/* Active Disruption List */}
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
                    <th className="pb-4">Zone</th>
                    <th className="pb-4">Trigger Type</th>
                    <th className="pb-4">Intensity</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {disruptions.map((d, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0 group">
                      <td className="py-5 font-medium">{d.zone}</td>
                      <td className="py-5 text-gray-400">{d.type}</td>
                      <td className="py-5 font-mono text-red-400">{d.intensity}</td>
                      <td className="py-5">
                        <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                          {d.status}
                        </span>
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

          {/* AI Fraud Detection Feed */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertOctagon className="text-orange-500" size={24} />
              AI Anomaly Shield
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
      </main>
    </div>
  );
};

export default AdminDashboard;