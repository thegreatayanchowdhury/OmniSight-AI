import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Users,
  AlertOctagon,
  Zap,
  Map as MapIcon,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { LogOut } from "lucide-react";

const HEATMAP_HTML = `
<!-- Paste the entire content of omnisight_final_heatmap.html below -->
REPLACE_THIS_WITH_YOUR_OMNISIGHT_FINAL_HEATMAP_HTML
`;

const RiskZonePanel = () => {
  const [loading, setLoading] = useState(true);

  const lastUpdated = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold italic tracking-tight">
            RISK ZONE MAP
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Live gig worker risk heatmap · Mumbai Region · zone_1 – zone_5
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 hidden sm:block">
            Updated: {lastUpdated} IST
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            LIVE
          </span>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <span className="px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-bold">
          ZONE 3 — DANGER ≥75
        </span>
        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
          ZONE 2 — CAUTION 50–74
        </span>
        <span className="px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-400 text-xs font-bold">
          ZONE 1 — SAFE &lt;50
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Risk Zones', value: '5', color: 'text-red-400' },
          { label: 'Highest Risk Score', value: '98.04', color: 'text-orange-400' },
          { label: 'Scan Radius', value: '25 km', color: 'text-blue-400' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-gray-500 text-xs font-bold uppercase">{s.label}</p>
            <p className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="relative" style={{ height: '560px' }}>
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0f1a] z-10">
              <RefreshCw size={28} className="text-red-400 animate-spin" />
              <p className="text-gray-400 text-sm mt-2">
                Loading live risk heatmap...
              </p>
            </div>
          )}

          <iframe
            srcDoc={HEATMAP_HTML}
            title="OmniSight Live Risk Heatmap"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            sandbox="allow-scripts allow-same-origin allow-popups"
            onLoad={() => setLoading(false)}
          />
        </div>

        <div className="px-6 py-3 border-t border-white/5 flex justify-between items-center">
          <p className="text-xs text-gray-600">
            OmniSight AI · DevTrails 2026 · Gig Worker Safety
          </p>
          <span className="text-xs text-gray-600">
            Data: Feb 2024 – Mar 2026
          </span>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeNav, setActiveNav] = useState('monitoring');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-gray-100 font-sans flex">
      <aside className="w-20 lg:w-64 bg-black/40 border-r border-white/5 flex flex-col items-center lg:items-start p-6">
        <div className="flex items-center gap-2 mb-12">
          <div className="p-2 bg-red-500 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="hidden lg:block text-xl font-black tracking-tighter">
            OMNISIGHT <span className="text-red-500">OPS</span>
          </span>
        </div>

        <nav className="space-y-3 w-full">
          <button
            onClick={() => setActiveNav('monitoring')}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-xl ${
              activeNav === 'monitoring'
                ? 'text-red-500 bg-red-500/10'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <Activity size={20} />
            <span className="hidden lg:block">Monitoring</span>
          </button>

          <button
            onClick={() => setActiveNav('zonecontrol')}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-xl ${
              activeNav === 'zonecontrol'
                ? 'text-red-500 bg-red-500/10'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <MapIcon size={20} />
            <span className="hidden lg:block flex items-center gap-2">
              Zone Control
              <span className="ml-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                LIVE
              </span>
            </span>
          </button>

          <button
            onClick={() => setActiveNav('partners')}
            className="flex items-center gap-4 w-full px-4 py-2 text-gray-500 hover:text-white"
          >
            <Users size={20} />
            <span className="hidden lg:block">Partners</span>
          </button>

          <button
            onClick={() => setActiveNav('fraud')}
            className="flex items-center gap-4 w-full px-4 py-2 text-gray-500 hover:text-white"
          >
            <AlertOctagon size={20} />
            <span className="hidden lg:block">Fraud AI</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {activeNav === 'zonecontrol' && <RiskZonePanel />}

        {activeNav === 'monitoring' && (
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold italic tracking-tight">
              SYSTEM OVERVIEW
            </h1>
            <div className="flex gap-4">
              <button
                onClick={handleSimulate}
                className="px-6 py-2 bg-red-600 rounded-full font-bold"
              >
                <Zap size={18} className="inline mr-2" />
                {isSimulating ? 'SIMULATING...' : 'SIMULATE DISRUPTION'}
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-full"
              >
                <LogOut size={18} className="inline mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}

        {['partners', 'fraud'].includes(activeNav) && (
          <div className="flex items-center justify-center h-64 text-gray-600 text-lg font-bold">
            {activeNav === 'partners' && 'Partners — coming soon'}
            {activeNav === 'fraud' && 'Fraud AI — coming soon'}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
