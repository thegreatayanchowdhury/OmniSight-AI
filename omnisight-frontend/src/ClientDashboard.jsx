import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getClientData, getDashboardActivity } from "./apis/dashboard"; 
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
  History,
  ArrowUpRight
} from 'lucide-react';
// import { LogOut } from "lucide-react";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Loading...",
    balance: "0",
    zone: "Loading..."
  });

  

  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState([]);

  // We pull this into a function so we can re-call it after a withdrawal
  const fetchData = async () => {
    try {
      const userRes = await getClientData();
      // Calling the limited endpoint (4 items) to keep PC layout clean
      const payoutRes = await getDashboardActivity(); 

      setUser({
        name: userRes.data?.name || "User",
         balance: userRes.data?.balance || 0,
        zone: userRes.data?.city || "N/A"
      });

      const formatted = payoutRes.data?.recent_payouts?.map((p) => ({
        id: p.id,
        type: "Protection",
        event: p.event,
        amount: p.amount,
        date: p.date,
        status: "Completed"
      })) || [];

      setActivities(formatted);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const handleLogout = () => {
  //   localStorage.clear();
  //   navigate("/");
  // };

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
  
    window.location.href = "/"; // redirect to landing page
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
          {/* Redirect */}
          <button onClick={()=>navigate("/client/payout-history")} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
            <History size={20} /> Payout History
          </button>
          {/* Redirect */}
          <button onClick={()=>navigate("/client/heatmap")} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
            <MapPin size={20} /> Zone Heatmap
          </button>
        </nav>

        {/* <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 transition-colors mt-auto">
          <LogOut size={20} /> Sign Out
        </button> */}
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-gray-400 text-sm">Your income is protected in <span className="text-omni-emerald font-semibold">{user.zone}</span></p>
          </div>
          <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Wallet Balance</p>
                <p className="text-xl font-bold text-omni-emerald">₹{user.balance}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-omni-emerald to-emerald-800 flex items-center justify-center font-bold text-white">
                {user.name.charAt(0)}
              </div>

              <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-2 rounded-full font-bold 
                        bg-white/5 border border-white/10 text-white 
                            hover:bg-red-500/20 hover:border-red-400/40 
                            transition-all shadow-lg"
                          >
                            <LogOut size={18} />
                            Logout
              </button>

            </div>
        </header>

        {/* --- TOP ROW: STATUS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Active Shield Tile with "Buy Plans" redirect */}
          <div className="col-span-1 md:col-span-2 relative overflow-hidden bg-gradient-to-br from-emerald-900/40 to-omni-dark-card border border-omni-emerald/20 p-8 rounded-3xl">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-omni-emerald/20 rounded-2xl text-omni-emerald"><Shield size={32} /></div>
                <span className="px-3 py-1 bg-omni-emerald text-omni-dark text-xs font-black rounded-full uppercase">Shield Active</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">OmniSight AI Protection</h2>
              <p className="text-emerald-100/60 mb-8 max-w-sm">Active monitoring in {user.zone}. Weekly coverage is live.</p>
              <div className="mt-auto flex gap-4">
                <button onClick={()=>navigate("/pricing")} className="flex items-center gap-2 px-4 py-2 bg-omni-emerald text-black rounded-xl font-bold text-sm hover:bg-emerald-400 transition-all">
                  Buy More Plans <ArrowUpRight size={16}/>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats - Redirects */}
          <div className="space-y-6">
            <div onClick={()=>navigate("/client/payout-history")} className="cursor-pointer group bg-omni-dark-card border border-white/5 p-6 rounded-3xl hover:border-omni-emerald/30 transition-all">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg group-hover:scale-110 transition-transform"><TrendingUp size={20}/></div>
                <p className="text-gray-400 text-sm">Income Recovered</p>
              </div>
              <p className="text-2xl font-bold text-white">₹{user.balance}</p>
            </div>
            <div onClick={()=>navigate("/client/payout-history")} className="cursor-pointer group bg-omni-dark-card border border-white/5 p-6 rounded-3xl hover:border-orange-500/30 transition-all">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg group-hover:scale-110 transition-transform"><AlertTriangle size={20}/></div>
                <p className="text-gray-400 text-sm">Events Detected</p>
              </div>
              <p className="text-2xl font-bold text-white">{activities.filter(a => a.type === "Protection").length}</p>
            </div>
          </div>
        </div>

        {/* --- BOTTOM ROW: ACTIVITY --- */}
        <div className="bg-omni-dark-card border border-white/5 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Recent Protection Activity</h3>
            {/* Redirect to View All */}
            <button onClick={()=>navigate("/client/payout-history")} className="text-omni-emerald text-sm font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-6">
            {activities.length > 0 ? activities.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-400'}`}>
                    {item.amount > 0 ? <Wallet size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-white">{item.event}</p>
                    <p className="text-xs text-gray-500">{item.date} • {item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${item.amount > 0 ? 'text-omni-emerald' : 'text-red-400'}`}>
                    {item.amount}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">{item.status}</p>
                </div>
              </div>
            )) : <p className="text-gray-500 text-center py-4">No recent activity detected.</p>}
          </div>
        </div>

        <div className="bg-omni-dark-card p-6 rounded-3xl mt-6 border border-white/5">
          <h3 className="text-lg font-bold mb-3 text-white">Quick Actions</h3>
          <button onClick={() => setOpen(true)} className="w-full bg-omni-emerald text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
            Withdraw Recovered Earnings 💸
          </button>
        </div>

        <PayoutModal 
          isOpen={open} 
          onClose={() => {
            setOpen(false);
            fetchData(); // Refresh data after closing the modal to see new balance
          }} 
        />
      </main>
    </div>
  );
};

export default ClientDashboard;
