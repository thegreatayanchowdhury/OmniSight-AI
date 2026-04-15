import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getClientData, getDashboardActivity } from "./apis/dashboard";
import PayoutModal from './PayoutModal';
import { Menu } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_URL;

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
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
  const [weatherData, setWeatherData] = useState(null);
  const mapRef = React.useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Loading...",
    balance: "0",
    zone: "Loading..."
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [premiumPlan, setPremiumPlan] = useState(null);
  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState([]);

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
    const close = () => {
      setMenuOpen(false);
      setProfileOpen(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    // Initial load
    fetchData();

    //  Poll every 5 seconds
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    }, 5000);

    // Cleanup to prevent memory leaks
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/get-my-plan`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.plan) {
          setPremiumPlan(null);
          return;
        }

        setPremiumPlan({
          title: data.plan,          // 👈 FIX
          weekly: `₹${data.amount}`, // 👈 FIX
          status: data.status,
          city: data.city
        });
      })
      .catch(err => console.error("Plan fetch error", err));
  }, []);


  const fixLeafletIcons = () => {
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
    });
  };

  //map useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const current = [pos.coords.latitude, pos.coords.longitude];
          fixLeafletIcons();
          if (mapRef.current) return;
          const map = L.map("dashboardMap", {
            maxZoom: 20,
            minZoom: 3
          }).setView(current, 16);

          // map.getPane("tilePane").style.zIndex = 1;
          // map.getPane("overlayPane").style.zIndex = 2;
          // map.getPane("markerPane").style.zIndex = 3;
          // map.getPane("tooltipPane").style.zIndex = 4;
          // map.getPane("popupPane").style.zIndex = 5;
          map.createPane("trafficPane");
          map.getPane("trafficPane").style.zIndex = 650; // above tiles
          mapRef.current = map;
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap",
            maxZoom: 20
          }).addTo(map);
          //traffic view
          const trafficLayer = L.tileLayer(
            `${API_BASE_URL}/traffic-tile/{z}/{x}/{y}`,
            {
              attribution: 'Traffic © TomTom',
              maxZoom: 19,
              opacity: 0.7,
              pane: "trafficPane"
            }
          ).addTo(map);

          map.on("zoomend moveend", () => {
            trafficLayer.bringToFront();
          });

          const fetchWeather = async (lat, lon) => {
            try {
              const res = await fetch(
                `${API_BASE_URL}/route-risk?lat=${lat}&lon=${lon}`
              );

              const data = await res.json();
              console.log("Weather UI data:", data);

              setWeatherData(data);
            } catch (err) {
              console.error("Weather fetch error", err);
            }
          };
          //  Current marker
          L.marker(current).addTo(map).bindPopup("You are here");

          let destinationMarker = null;
          let routeLayers = [];
          const drawRoute = async (start, end) => {

            const lat = end[0];
            const lon = end[1];
            fetchWeather(lat, lon);
            // Clear old route
            routeLayers.forEach(layer => map.removeLayer(layer));
            routeLayers = [];

            // OSRM API
            const res = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
            );

            const data = await res.json();
            console.log("Route data", data);

            // No route
            if (!data.routes || data.routes.length === 0) {
              alert("Route not found");
              return;
            }

            const coords = data.routes[0].geometry.coordinates;

            // convert to [lat, lon]
            const latlngs = coords.map(c => [c[1], c[0]]);

            // Risk API
            let riskData = { segment_risks: [] };

            try {
              const riskRes = await fetch(
                `${API_BASE_URL}/route-risk?lat=${lat}&lon=${lon}`
              );

              if (riskRes.ok) {
                riskData = await riskRes.json();
              }
            } catch (err) {
              console.error("Risk API failed", err);
            }

            console.log("Risk data:", riskData);

            // SAFE CHECK
            const risks = riskData.segment_risks || [];

            //  DRAW ROUTE
            for (let i = 0; i < latlngs.length - 1; i++) {

              const segment = [latlngs[i], latlngs[i + 1]];

              let color = "green";

              //  SAFE ACCESS
              const risk = risks[i] || "Low";

              if (risk === "High") color = "red";
              else if (risk === "Medium") color = "orange";

              const line = L.polyline(segment, {
                color,
                weight: 6,
              }).addTo(map);

              routeLayers.push(line);
            }
            const bounds = L.latLngBounds(latlngs);
            map.fitBounds(bounds, {
              padding: [50, 50],
              maxZoom: 18
            });
          };

          // SEARCH BAR 
          const geocoder = L.Control.geocoder({
            defaultMarkGeocode: false,
          })
            .on("markgeocode", function (e) {
              const latlng = e.geocode.center;

              if (destinationMarker) map.removeLayer(destinationMarker);

              destinationMarker = L.marker(latlng)
                .addTo(map)
                .bindPopup("Destination")
                .openPopup();

              drawRoute(current, [latlng.lat, latlng.lng]);
            })
            .addTo(map);

          //  CLICK MAP
          map.on("click", (e) => {
            const latlng = e.latlng;

            if (destinationMarker) map.removeLayer(destinationMarker);

            destinationMarker = L.marker(latlng)
              .addTo(map)
              .bindPopup("Destination")
              .openPopup();

            drawRoute(current, [latlng.lat, latlng.lng]);
          });
        },
        (err) => {
          console.error("Location error:", err);
          alert("Please allow location access");
        }
      );
    }, 500);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");

    window.location.href = "/"; // redirect to landing page
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-omni-dark text-gray-100 font-sans">
      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-white/10 bg-omni-dark-card/40 backdrop-blur-md">

        {/* LEFT: Logo */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-omni-emerald rounded-lg">
            <Shield className="w-4 h-4 text-black" />
          </div>
          <span className="text-sm font-bold">
            OmniSight <span className="text-omni-emerald">AI</span>
          </span>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3">

          {/* MENU DROPDOWN */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
                setProfileOpen(false);
              }}
              className="p-2 bg-white/5 rounded-lg"
            >
              <Menu size={18} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-2 z-50">

                <button
                  onClick={() => navigate("/client/dashboard")}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-white/10 rounded-lg"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </button>

                <button
                  onClick={() => navigate("/client/payout-history")}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-white/10 rounded-lg"
                >
                  <History size={16} /> Payouts
                </button>

                <button
                  onClick={() => navigate("/client/heatmap")}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-white/10 rounded-lg"
                >
                  <MapPin size={16} /> Heatmap
                </button>

              </div>
            )}
          </div>

          {/* PROFILE DROPDOWN */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen(!profileOpen);
                setMenuOpen(false);
              }}
              className="w-9 h-9 rounded-full bg-omni-emerald flex items-center justify-center text-black font-bold"
            >
              {user.name?.charAt(0)}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-3 z-50">

                <div className="text-sm text-gray-300 mb-2">
                  Balance
                </div>

                <div className="text-lg font-bold text-omni-emerald mb-3">
                  {user.balance}
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full font-bold 
                bg-white/5 border border-white/10 text-white 
                hover:bg-red-500/20 hover:border-red-400/40 
                transition-all shadow-lg"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>
            )}
          </div>

        </div>
      </div>

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
          <button onClick={() => navigate("/client/payout-history")} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
            <History size={20} /> Payout History
          </button>
          {/* Redirect */}
          <button onClick={() => navigate("/client/heatmap")} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
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
            <p className="text-gray-400 text-sm">Your income is protected in <span className="text-omni-emerald font-semibold">{premiumPlan?.city || user.zone}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right flex flex-col items-end">
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
              <p className="text-emerald-100/60 mb-8 max-w-sm">Active monitoring in {premiumPlan?.city || user.zone}. Weekly coverage is live.</p>
              <div className="mt-auto flex gap-4">
                <button onClick={() => navigate("/pricing")} className="flex items-center gap-2 px-4 py-2 bg-omni-emerald text-black rounded-xl font-bold text-sm hover:bg-emerald-400 transition-all">
                  Buy More Plans <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats - Redirects */}
          <div className="space-y-6">
            <div onClick={() => navigate("/client/payout-history")} className="cursor-pointer group bg-omni-dark-card border border-white/5 p-6 rounded-3xl hover:border-omni-emerald/30 transition-all">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg group-hover:scale-110 transition-transform"><TrendingUp size={20} /></div>
                <p className="text-gray-400 text-sm">Income Recovered</p>
              </div>
              <p className="text-2xl font-bold text-white">₹{user.balance}</p>
            </div>
            <div onClick={() => navigate("/client/payout-history")} className="cursor-pointer group bg-omni-dark-card border border-white/5 p-6 rounded-3xl hover:border-orange-500/30 transition-all">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg group-hover:scale-110 transition-transform"><AlertTriangle size={20} /></div>
                <p className="text-gray-400 text-sm">Events Detected</p>
              </div>
              <p className="text-2xl font-bold text-white">{activities.filter(a => a.type === "Protection").length}</p>
            </div>
          </div>
        </div>

        {/* plan card */}
        {premiumPlan && (
          <div className="relative mb-6 rounded-2xl p-[1px] bg-gradient-to-r from-emerald-500/40 via-emerald-300/20 to-transparent">

            <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl p-5 border border-white/10">

              {/* Glow dot */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-emerald-400 font-medium">
                  Active
                </span>
              </div>

              {/* Header */}
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                Current Subscription
              </p>

              {/* Plan Name */}
              <div className="flex items-end gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {premiumPlan.title.toUpperCase()}
                </h2>

                <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Premium Access
                </span>
              </div>

              {/* Price */}
              <p className="text-emerald-400 text-lg font-semibold">
                {premiumPlan.weekly}
                <span className="text-gray-400 text-sm font-normal"> / week</span>
              </p>

              {/* Sub info */}
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Billing active</span>
                <span className="text-emerald-400">Protected Plan</span>
              </div>

            </div>
          </div>
        )}

        {/* live map */}
        <div className="mb-12">
          <h2 className="text-xl mb-4 text-emerald-400 font-semibold">
            🌍 Live Route Risk Map
          </h2>
          <div className="relative">
            <div
              id="dashboardMap"
              className="h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-xl relative z-0"
            ></div>
            <div className="absolute bottom-4 right-4 bg-black/80 text-white p-3 rounded-xl text-xs space-y-1 z-[1000] shadow-lg">

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Low Risk
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                Medium Risk
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                High Risk
              </div>

            </div>
          </div>
        </div>
        {/* weather data */}
        {weatherData && (
          <div className="mt-10 relative z-10 bg-omni-dark-card border border-white/10 rounded-2xl p-5 flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-400">📍 Location</p>
              <p className="text-lg font-bold text-omni-emerald">
                {weatherData.location}, {weatherData.region}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">🌦️ Condition</p>
              <p className="text-xl font-bold text-white">
                {weatherData.condition}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">⚠️ Risk Level</p>
              <p className={`text-xl font-bold ${weatherData.risk === "HIGH" ? "text-red-400" :
                weatherData.risk === "EXTREME" ? "text-purple-400" :
                  "text-green-400"
                }`}>
                {weatherData.risk}
              </p>
            </div>

          </div>
        )}
        {/* --- BOTTOM ROW: ACTIVITY --- */}
        <div className="mt-10 bg-omni-dark-card border border-white/5 rounded-3xl p-8 relative z-0">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Recent Protection Activity</h3>
            {/* Redirect to View All */}
            <button onClick={() => navigate("/client/payout-history")} className="text-omni-emerald text-sm font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-6">
            {activities.length > 0 ? activities.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${Number(item.amount) > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-400'}`}>
                    {Number(item.amount) > 0 ? <Wallet size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-white">{item.event}</p>
                    <p className="text-xs text-gray-500">{item.date} • {item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${Number(item.amount) > 0 ? 'text-omni-emerald' : 'text-red-400'}`}>
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
