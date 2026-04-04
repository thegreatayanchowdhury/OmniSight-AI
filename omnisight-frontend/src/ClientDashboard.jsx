import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getClientData, getPayoutHistory } from "./apis/dashboard";
import PayoutModal from './PayoutModal';

import { 
  Shield, 
  CloudRain, 
  MapPin, 
  TrendingUp, 
  Clock, 
  Wallet, 
  AlertTriangle,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  History
} from 'lucide-react';



const ClientDashboard = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState({
  name: "Loading...",
  balance: "₹0",
  zone: "Loading..."
});

const [open, setOpen] = useState(false);

const [activities, setActivities] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const userRes = await getClientData();
      const payoutRes = await getPayoutHistory();

      console.log("USER RES:", userRes.data);
      console.log("PAYOUT RES:", payoutRes.data);

      setUser({
        name: userRes.data?.name || "User",
        balance: `₹${userRes.data?.balance || 0}`,
        zone: userRes.data?.city || "N/A"
      });

      const formatted = payoutRes.data?.map((p) => ({
        id: p.id,
        type: "Payout",
        event: `${p.disruption_type} (${p.severity_level})`,
        amount: `+ ₹${p.amount}`,
        date: new Date(p.timestamp).toLocaleString(),
        status: p.status
      })) || [];

      setActivities(formatted);

    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  fetchData();
}, []);

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userName");
  navigate("/auth");
};



  return (
    <div className="flex min-h-screen bg-omni-dark text-gray-100 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-white/5 bg-omni-dark-card/30 backdrop-blur-md hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="p-1.5 bg-omni-emerald rounded-lg">
            <Shield className="w-5 h-5 text-omni-dark" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">OmniSight <span className="text-omni-emerald">AI</span></span>
        </div>

        <nav className="flex-grow space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-omni-emerald/10 text-omni-emerald rounded-xl font-medium">
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
            <History size={20} /> Payout History
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
            <MapPin size={20} /> Zone Heatmap
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 transition-colors mt-auto">
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-gray-400 text-sm">Your income is protected in <span className="text-omni-emerald font-semibold">{user.zone}</span></p>
          </div>
          <div className="flex items-center gap-4">
  
              {/* Mobile Logout Button */}
              <button 
                onClick={handleLogout}
                className="lg:hidden p-2 rounded-lg bg-red-500/10 text-red-400"
              >
                <LogOut size={18} />
              </button>

              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                  Wallet Balance
                </p>
                <p className="text-xl font-bold text-omni-emerald">{user.balance}</p>
              </div>

              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-omni-emerald to-emerald-800 flex items-center justify-center font-bold">
                AC
              </div>
            </div>


          
        </header>

        {/* --- TOP ROW: STATUS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Active Protection Card */}
          <div className="col-span-1 md:col-span-2 relative overflow-hidden bg-gradient-to-br from-emerald-900/40 to-omni-dark-card border border-omni-emerald/20 p-8 rounded-3xl">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-omni-emerald/20 rounded-2xl text-omni-emerald">
                  <Shield size={32} />
                </div>
                <span className="px-3 py-1 bg-omni-emerald text-omni-dark text-xs font-black rounded-full uppercase">Shield Active</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">OmniSight Protocol 2.4</h2>
              <p className="text-emerald-100/60 mb-8 max-w-sm">Monitoring weather stations and traffic nodes in your zone. AI triggers are armed.</p>
              <div className="mt-auto flex gap-4">
                <div className="flex items-center gap-2 text-sm text-omni-emerald">
                  <CloudRain size={16} /> Rain: 2.4mm (Threshold 15mm)
                </div>
                <div className="flex items-center gap-2 text-sm text-omni-emerald">
                  <Clock size={16} /> Next Reset: 4d 12h
                </div>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Shield size={200} />
            </div>
          </div>

          {/* Quick Stats */}
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

        {/* --- BOTTOM ROW: ACTIVITY --- */}
        <div className="bg-omni-dark-card border border-white/5 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Recent Protection Activity</h3>
            <button className="text-omni-emerald text-sm font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-6">
            {activities.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.amount.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-400'}`}>
                    {item.amount.includes('+') ? <Wallet size={20} /> : <Shield size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-white">{item.event}</p>
                    <p className="text-xs text-gray-500">{item.date} • {item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${item.amount.includes('+') ? 'text-omni-emerald' : 'text-gray-300'}`}>
                    {item.amount}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
<div className="bg-omni-dark-card p-6 rounded-2xl mt-6">
  <h3 className="text-lg font-bold mb-3">Quick Actions</h3>

  <button
    onClick={() => setOpen(true)}
    className="w-full bg-emerald-500 text-black py-3 rounded-xl font-semibold"
  >
    Withdraw Earnings 💸
  </button>
</div>
<PayoutModal
  isOpen={open}
  onClose={() => setOpen(false)}
/>
      </main>
    </div>
  );
};

export default ClientDashboard;