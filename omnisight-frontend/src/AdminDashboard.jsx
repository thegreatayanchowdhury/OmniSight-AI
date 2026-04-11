import React, { useState } from "react";
import {
  Shield,
  Activity,
  Users,
  AlertOctagon,
  Zap,
  Map as MapIcon,
  Search,
  RefreshCw,
  Filter
} from "lucide-react";
import { LogOut } from "lucide-react";


const HEATMAP_HTML = `OMNISIGHT_FINAL_HEATMAP_HTML`;


const MonitoringPanel = ({ handleSimulate, isSimulating, handleLogout }) => {
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold italic tracking-tight">
          SYSTEM OVERVIEW
        </h1>

        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Zone ID..."
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 outline-none focus:border-red-500/50"
            />
          </div>

          <button
            onClick={handleSimulate}
            className="px-6 py-2 bg-red-600 rounded-full font-bold flex items-center gap-2"
          >
            <Zap size={18} />
            {isSimulating ? "SIMULATING..." : "SIMULATE DISRUPTION"}
          </button>

          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Emergency & Actuarial Cards */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-black/40 border border-red-500/20 rounded-3xl p-6">
          <h2 className="text-red-400 text-lg font-semibold">
            Emergency Control
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Instantly halt all new policy enrollments and renewals during
            high-risk scenarios.
          </p>
          <button className="mt-5 w-full bg-red-600 hover:bg-red-500 py-3 rounded-xl font-bold text-lg">
            🚨 KILL SWITCH
          </button>
          <p className="text-green-400 text-xs mt-2">
            Status: System Active
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-lg font-semibold">
            Actuarial Risk Monitor
          </h2>
          <p className="text-gray-400 mt-2">Loss Ratio</p>
          <p className="text-2xl font-bold text-orange-400">78%</p>
          <p className="text-gray-400 mt-2">Active Risk Zones</p>
          <p className="text-red-400 font-bold">5 Zones</p>
          <p className="text-gray-400 mt-2">Premium vs Payout</p>
          <p className="text-green-400 font-bold">₹1.2L / ₹95K</p>
          <div className="w-full bg-gray-700 h-2 rounded-full mt-3">
            <div className="bg-red-500 h-2 rounded-full w-3/4"></div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        {[
          { label: "TOTAL PARTNERS", value: "12,402", icon: <Users /> },
          { label: "ACTIVE TRIGGERS", value: "3", icon: <Zap /> },
          { label: "FRAUD FLAGGED", value: "12", icon: <AlertOctagon /> },
          { label: "PAYOUTS TODAY", value: "₹42,500", icon: <Activity /> }
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            {card.icon}
            <p className="text-gray-400 text-sm mt-2">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Live Parametric Triggers & AI Shield */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Live Parametric Triggers
          </h2>
          <table className="w-full text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="text-left">Zone</th>
                <th>Trigger</th>
                <th>Intensity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bandra West</td>
                <td>Heavy Rain</td>
                <td className="text-red-400">22mm/hr</td>
                <td className="text-red-400">ACTIVE</td>
                <td>Override</td>
              </tr>
              <tr>
                <td>Salt Lake</td>
                <td>Water Logging</td>
                <td className="text-red-400">Critical</td>
                <td className="text-red-400">ACTIVE</td>
                <td>Override</td>
              </tr>
              <tr>
                <td>Indiranagar</td>
                <td>Roadblock</td>
                <td className="text-yellow-400">High</td>
                <td className="text-yellow-400">PENDING</td>
                <td>Override</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            AI Anomaly Shield
          </h2>
          {[
            "GPS Spoofing Detected",
            "Multiple Payout Requests",
            "Zone/IP Mismatch"
          ].map((item, index) => (
            <div
              key={index}
              className="border border-red-500/20 rounded-xl p-4 mb-4"
            >
              <p className="text-orange-400 font-semibold">{item}</p>
              <p className="text-gray-400 text-sm">
                Suspicious activity detected.
              </p>
              <div className="flex gap-2 mt-2">
                <button className="bg-red-600 px-3 py-1 rounded-md">
                  Block
                </button>
                <button className="bg-gray-700 px-3 py-1 rounded-md">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


const ZoneControlPanel = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-4">
      <h1 className="text-2xl font-bold mb-4">Zone Control</h1>

      <div className="relative h-[600px] rounded-xl overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0f1a] z-10">
            <RefreshCw className="animate-spin text-red-500" />
          </div>
        )}

        <iframe
          srcDoc={HEATMAP_HTML}
          title="Heatmap"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setLoading(false)}
        />
      </div>

      <p className="text-gray-500 text-sm mt-2">
        Attach your heatmap HTML inside the HEATMAP_HTML constant.
      </p>
    </div>
  );
};


const ComingSoonPanel = ({ title }) => (
  <div className="flex items-center justify-center h-[70vh] text-gray-500 text-xl font-bold">
    {title} — Coming Soon
  </div>
);


const AdminDashboard = () => {
  const [activeNav, setActiveNav] = useState("monitoring");
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 2000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-black/40 border-r border-white/5 p-6">
        <div className="flex items-center gap-2 mb-10">
          <Shield className="text-red-500" />
          <span className="hidden lg:block font-bold text-xl">
            OMNISIGHT OPS
          </span>
        </div>

        <nav className="space-y-3">
          <button onClick={() => setActiveNav("monitoring")} className="nav-btn">
            <Activity /> <span className="hidden lg:block">Monitoring</span>
          </button>
          <button onClick={() => setActiveNav("riskzone")} className="nav-btn">
            <MapIcon /> <span className="hidden lg:block">Risk Zone</span>
          </button>
          <button onClick={() => setActiveNav("zonecontrol")} className="nav-btn">
            <MapIcon /> <span className="hidden lg:block">Zone Control</span>
          </button>
          <button onClick={() => setActiveNav("partners")} className="nav-btn">
            <Users /> <span className="hidden lg:block">Partners</span>
          </button>
          <button onClick={() => setActiveNav("fraud")} className="nav-btn">
            <AlertOctagon /> <span className="hidden lg:block">Fraud AI</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeNav === "monitoring" && (
          <MonitoringPanel
            handleSimulate={handleSimulate}
            isSimulating={isSimulating}
            handleLogout={handleLogout}
          />
        )}
        {activeNav === "zonecontrol" && <ZoneControlPanel />}
        {activeNav === "riskzone" && <ComingSoonPanel title="Risk Zone" />}
        {activeNav === "partners" && <ComingSoonPanel title="Partners" />}
        {activeNav === "fraud" && <ComingSoonPanel title="Fraud AI" />}
      </main>
    </div>
  );
};

export default AdminDashboard;
