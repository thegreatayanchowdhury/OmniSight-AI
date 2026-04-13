import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, Tooltip, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const HEATMAP_URL = `${API_BASE}/zones/risk/heatmap`;
const REFRESH_MS = 15 * 60 * 1000; // 15 minutes
const CENTER = [19.0760, 72.8777];
const RADIUS_KM = 25;

// ---------------------------------------------------------------------------
// Fallback data if API is unreachable
// ---------------------------------------------------------------------------
const FALLBACK_ZONES = [
  { id: "zone_1", display_name: "Dharavi",      city: "Mumbai", center: [19.0422, 72.8553], risk_score: 72.0, risk_bin: "high",   risk_label: "DANGER",  color: "#dc2626", condition: "Fallback", precip_mm: 0, wind_kph: 0 },
  { id: "zone_2", display_name: "Kurla West",   city: "Mumbai", center: [19.0728, 72.8826], risk_score: 65.0, risk_bin: "medium", risk_label: "CAUTION", color: "#f59e0b", condition: "Fallback", precip_mm: 0, wind_kph: 0 },
  { id: "zone_3", display_name: "Andheri East", city: "Mumbai", center: [19.1136, 72.8697], risk_score: 41.0, risk_bin: "low",    risk_label: "SAFE",    color: "#16a34a", condition: "Fallback", precip_mm: 0, wind_kph: 0 },
  { id: "zone_4", display_name: "Bandra Kurla", city: "Mumbai", center: [19.0596, 72.8656], risk_score: 68.0, risk_bin: "high",   risk_label: "DANGER",  color: "#dc2626", condition: "Fallback", precip_mm: 0, wind_kph: 0 },
  { id: "zone_5", display_name: "Thane West",   city: "Thane",  center: [19.1852, 72.9710], risk_score: 38.0, risk_bin: "low",    risk_label: "SAFE",    color: "#16a34a", condition: "Fallback", precip_mm: 0, wind_kph: 0 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371.0;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function riskLabel(score) {
  if (score >= 75) return { label: "DANGER", color: "#dc2626" };
  if (score >= 50) return { label: "CAUTION", color: "#f59e0b" };
  return { label: "SAFE", color: "#16a34a" };
}

// Worker location marker icon
const workerIcon = L.divIcon({
  html: `<div style="background:#3b82f6;width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(59,130,246,0.6)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  className: "",
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
function FitBounds({ zones }) {
  const map = useMap();
  useEffect(() => {
    if (zones.length > 0) {
      const bounds = L.latLngBounds(zones.map(z => z.center));
      map.fitBounds(bounds.pad(0.3));
    }
  }, [zones, map]);
  return null;
}

export default function ZoneRiskMap({ height = "520px", showLegend = true }) {
  const [zones, setZones] = useState(FALLBACK_ZONES);
  const [source, setSource] = useState("loading");
  const [lastRefresh, setLastRefresh] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await fetch(HEATMAP_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.zones && data.zones.length > 0) {
        setZones(data.zones);
        setSource("live");
      } else {
        throw new Error("Empty zones");
      }
    } catch (err) {
      console.warn("[OmniSight] API unreachable, using fallback:", err.message);
      setSource("fallback");
    }
    setLastRefresh(new Date());
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Sort zones by distance to user for nearest links
  const sortedByDist = [...zones].sort(
    (a, b) => haversine(CENTER[0], CENTER[1], a.center[0], a.center[1]) - haversine(CENTER[0], CENTER[1], b.center[0], b.center[1])
  );
  const nearest3 = sortedByDist.slice(0, 3);

  const dangerZones = zones.filter(z => z.risk_score >= 75);

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Danger alert banner */}
      {dangerZones.length > 0 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-red-600 text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg whitespace-nowrap" style={{ boxShadow: "0 4px 14px rgba(220,38,38,0.45)" }}>
          ⚠️ DANGER — {dangerZones.map(z => z.display_name).join(" · ")} — High risk for gig workers
        </div>
      )}

      <MapContainer
        center={CENTER}
        zoom={12}
        style={{ width: "100%", height: "100%", borderRadius: "12px" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
        />

        <FitBounds zones={zones} />

        {/* Zone risk circles */}
        {zones.map(z => {
          const { label, color } = riskLabel(z.risk_score);
          const dist = haversine(CENTER[0], CENTER[1], z.center[0], z.center[1]);
          return (
            <React.Fragment key={z.id}>
              {/* Background shaded circle */}
              <Circle
                center={z.center}
                radius={500 + z.risk_score * 11}
                pathOptions={{ color: z.color || color, fillColor: z.color || color, fillOpacity: 0.15, weight: 2 }}
              >
                <Tooltip sticky>{z.id.toUpperCase().replace("_", " ")} — {label} — {z.risk_score.toFixed(1)}/100</Tooltip>
              </Circle>

              {/* Marker dot */}
              <CircleMarker
                center={z.center}
                radius={8 + Math.min(12, z.risk_score / 10)}
                pathOptions={{ color: z.color || color, fillColor: z.color || color, fillOpacity: 0.88, weight: 2 }}
              >
                <Tooltip sticky>
                  {z.display_name} | {z.risk_score.toFixed(1)}/100 | {dist.toFixed(1)}km
                </Tooltip>
                <Popup maxWidth={280}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", minWidth: "220px" }}>
                    <div style={{ background: z.color || color, color: "#fff", padding: "6px 10px", borderRadius: "8px 8px 0 0", fontWeight: 700 }}>
                      {z.id.toUpperCase().replace("_", " ")} — {label}
                    </div>
                    <div style={{ padding: "8px 10px", border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 8px 8px" }}>
                      <b>Area:</b> {z.display_name} | <b>City:</b> {z.city}<br />
                      <b>Risk Score:</b> <span style={{ color: z.color || color, fontWeight: 800, fontSize: "14px" }}>{z.risk_score.toFixed(1)}</span>/100<br />
                      <b>Condition:</b> {z.condition}<br />
                      <b>Rain:</b> {z.precip_mm} mm | <b>Wind:</b> {z.wind_kph} kph<br />
                      <b>Distance:</b> {dist.toFixed(2)} km
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* Worker location */}
        <Marker position={CENTER} icon={workerIcon}>
          <Tooltip>📍 Gig Worker Location</Tooltip>
        </Marker>

        {/* Scan radius ring */}
        <Circle
          center={CENTER}
          radius={RADIUS_KM * 1000}
          pathOptions={{ color: "#0ea5e9", fill: false, weight: 2, dashArray: "6" }}
        >
          <Tooltip>OmniSight {RADIUS_KM}km scan radius</Tooltip>
        </Circle>

        {/* Nearest zone link lines */}
        {nearest3.map(z => (
          <Polyline
            key={`link-${z.id}`}
            positions={[CENTER, z.center]}
            pathOptions={{ color: z.color || riskLabel(z.risk_score).color, weight: 2, opacity: 0.5 }}
          >
            <Tooltip>{z.display_name} → {haversine(CENTER[0], CENTER[1], z.center[0], z.center[1]).toFixed(2)} km</Tooltip>
          </Polyline>
        ))}
      </MapContainer>

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-[#0a0f1a]/95 text-white p-3 rounded-xl text-xs border border-white/10" style={{ minWidth: "200px", backdropFilter: "blur(8px)" }}>
          <div className="text-sm font-extrabold mb-1">🛵 OmniSight AI</div>
          <div className="text-gray-500 text-[10px] mb-2">
            {source === "live" ? "Live" : "Fallback"} · Updates every 15 min
          </div>
          <div className="space-y-1">
            <div><span className="inline-block bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">DANGER</span> ≥75</div>
            <div><span className="inline-block bg-yellow-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">CAUTION</span> 50–74</div>
            <div><span className="inline-block bg-green-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">SAFE</span> &lt;50</div>
          </div>
          {lastRefresh && (
            <div className="text-gray-600 text-[9px] mt-2">
              Last refresh: {lastRefresh.toLocaleTimeString("en-IN", { hour12: true })}
            </div>
          )}
        </div>
      )}

      {/* Status banner */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-[#0a0f1a]/90 text-gray-500 text-center text-[10px] py-1 border-t border-white/5">
        ⟳ OmniSight AI — {source === "live" ? "Connected to live risk API" : source === "fallback" ? "Using fallback data" : "Loading..."} · {zones.length} zones
      </div>
    </div>
  );
}
