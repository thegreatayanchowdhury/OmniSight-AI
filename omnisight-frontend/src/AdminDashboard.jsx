import React, { useState, useEffect } from "react";
import axios from "axios";
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


const HEATMAP_HTML = `<!DOCTYPE html>
<html>
<head>
    
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.js"></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.2.0/css/all.min.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/python-visualization/folium/folium/templates/leaflet.awesome.rotate.min.css"/>
    
            <meta name="viewport" content="width=device-width,
                initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <style>
                #map_34d5b6f7c621242a0ef356363c3a3e68 {
                    position: relative;
                    width: 100.0%;
                    height: 100.0%;
                    left: 0.0%;
                    top: 0.0%;
                }
                .leaflet-container { font-size: 1rem; }
            </style>

            <style>html, body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
            }
            </style>

            <style>#map {
                position:absolute;
                top:0;
                bottom:0;
                right:0;
                left:0;
                }
            </style>

            <script>
                L_NO_TOUCH = false;
                L_DISABLE_3D = false;
            </script>

        
    <script src="https://cdn.jsdelivr.net/gh/python-visualization/folium@main/folium/templates/leaflet_heat.min.js"></script>
</head>
<body>
    
    
<div style="position:fixed;bottom:24px;left:24px;z-index:9999;
     background:#fff;padding:14px 16px;border-radius:14px;
     box-shadow:0 4px 20px rgba(0,0,0,0.15);
     font-family:Inter,sans-serif;font-size:12px;min-width:235px;
     border:1px solid #e5e7eb">
  <div style="font-size:15px;font-weight:800;color:#111">🛵 OmniSight AI</div>
  <div style="font-size:10px;color:#6b7280;margin-bottom:8px">
    DevTrails 2026 · Gig Worker Safety · Mumbai Region
  </div>
  <div style="margin:5px 0">
    <span style="background:#dc2626;color:#fff;padding:2px 10px;
      border-radius:20px;font-weight:700">ZONE 3</span>
    &nbsp;DANGER &nbsp;<span style="color:#9ca3af">≥ 75</span>
  </div>
  <div style="margin:5px 0">
    <span style="background:#f59e0b;color:#fff;padding:2px 10px;
      border-radius:20px;font-weight:700">ZONE 2</span>
    &nbsp;CAUTION &nbsp;<span style="color:#9ca3af">50–74</span>
  </div>
  <div style="margin:5px 0">
    <span style="background:#16a34a;color:#fff;padding:2px 10px;
      border-radius:20px;font-weight:700">ZONE 1</span>
    &nbsp;SAFE &nbsp;<span style="color:#9ca3af">&lt; 50</span>
  </div>
  <hr style="margin:8px 0;border-color:#f3f4f6"/>
  <div style="color:#6b7280;font-size:10px;line-height:1.7">
    📅 Feb 2024 – Mar 2026 weekly data<br/>
    📍 5 zones · zone_1 to zone_5 · Mumbai<br/>
    ⚡ Click any marker for trend sparkline
  </div>
</div>
    
<div style="position:fixed;top:10px;left:50%;transform:translateX(-50%);
     z-index:9999;background:#dc2626;color:#fff;padding:8px 22px;
     border-radius:24px;font-family:Inter,sans-serif;font-size:12px;
     font-weight:700;box-shadow:0 4px 14px rgba(220,38,38,0.45);
     white-space:nowrap">
  ⚠️ ZONE 3 ALERT — Dharavi · Kurla West · Andheri East · Bandra Kurla · Thane West — Avoid for gig deliveries
</div>
    
            <div class="folium-map" id="map_34d5b6f7c621242a0ef356363c3a3e68" ></div>
        
</body>
<script>
    
    
            var map_34d5b6f7c621242a0ef356363c3a3e68 = L.map(
                "map_34d5b6f7c621242a0ef356363c3a3e68",
                {
                    center: [19.076, 72.8777],
                    crs: L.CRS.EPSG3857,
                    ...{
  "zoom": 12,
  "zoomControl": true,
  "preferCanvas": false,
}

                }
            );
            L.control.scale().addTo(map_34d5b6f7c621242a0ef356363c3a3e68);

            

        
    
            var tile_layer_876189504f6b252b360d522c26fc44bf = L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
                {
  "minZoom": 0,
  "maxZoom": 20,
  "maxNativeZoom": 20,
  "noWrap": false,
  "attribution": "\\u0026copy; \\u003ca href=\\"https://www.openstreetmap.org/copyright\\"\\u003eOpenStreetMap\\u003c/a\\u003e contributors \\u0026copy; \\u003ca href=\\"https://carto.com/attributions\\"\\u003eCARTO\\u003c/a\\u003e",
  "subdomains": "abcd",
  "detectRetina": false,
  "tms": false,
  "opacity": 1,
}

            );
        
    
            tile_layer_876189504f6b252b360d522c26fc44bf.addTo(map_34d5b6f7c621242a0ef356363c3a3e68);
        
    
            var feature_group_114f37d4b3af483c0f437a1df1dae089 = L.featureGroup(
                {
}
            );
        
    
            var circle_ebd667917d6e530edd7bcf0440238dbd = L.circle(
                [19.0422, 72.8553],
                {"bubblingMouseEvents": true, "color": "#dc2626", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#dc2626", "fillOpacity": 0.13, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 1578.410135, "stroke": true, "weight": 2.5}
            ).addTo(feature_group_114f37d4b3af483c0f437a1df1dae089);
        
    
            circle_ebd667917d6e530edd7bcf0440238dbd.bindTooltip(
                \`<div>
                     [ZONE 3] Dharavi  98.0/100
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            var circle_8c1cb481c942cdf89872eb21b0925439 = L.circle(
                [19.0728, 72.8826],
                {"bubblingMouseEvents": true, "color": "#dc2626", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#dc2626", "fillOpacity": 0.13, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 1577.987075, "stroke": true, "weight": 2.5}
            ).addTo(feature_group_114f37d4b3af483c0f437a1df1dae089);
        
    
            circle_8c1cb481c942cdf89872eb21b0925439.bindTooltip(
                \`<div>
                     [ZONE 3] Kurla West  98.0/100
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            var circle_15648a6691b0904345f34b233bc0d87c = L.circle(
                [19.1136, 72.8697],
                {"bubblingMouseEvents": true, "color": "#dc2626", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#dc2626", "fillOpacity": 0.13, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 1576.37761, "stroke": true, "weight": 2.5}
            ).addTo(feature_group_114f37d4b3af483c0f437a1df1dae089);
        
    
            circle_15648a6691b0904345f34b233bc0d87c.bindTooltip(
                \`<div>
                     [ZONE 3] Andheri East  97.9/100
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            var circle_c90884aa87e3be9d76eec0152d93b4c4 = L.circle(
                [19.0596, 72.8656],
                {"bubblingMouseEvents": true, "color": "#dc2626", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#dc2626", "fillOpacity": 0.13, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 1577.94984, "stroke": true, "weight": 2.5}
            ).addTo(feature_group_114f37d4b3af483c0f437a1df1dae089);
        
    
            circle_c90884aa87e3be9d76eec0152d93b4c4.bindTooltip(
                \`<div>
                     [ZONE 3] Bandra Kurla  98.0/100
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            var circle_4b480d2d4c4acf1a6b38d2066aaa34ad = L.circle(
                [19.1852, 72.971],
                {"bubblingMouseEvents": true, "color": "#dc2626", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#dc2626", "fillOpacity": 0.13, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 1578.1154999999999, "stroke": true, "weight": 2.5}
            ).addTo(feature_group_114f37d4b3af483c0f437a1df1dae089);
        
    
            circle_4b480d2d4c4acf1a6b38d2066aaa34ad.bindTooltip(
                \`<div>
                     [ZONE 3] Thane West  98.0/100
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            feature_group_114f37d4b3af483c0f437a1df1dae089.addTo(map_34d5b6f7c621242a0ef356363c3a3e68);
        
    
            var feature_group_0f5351308663871484f4f98929e5845d = L.featureGroup(
                {
}
            );
        
    
            feature_group_0f5351308663871484f4f98929e5845d.addTo(map_34d5b6f7c621242a0ef356363c3a3e68);
        
    
            var feature_group_4e4956bb36d972eb114ef69826771a5c = L.featureGroup(
                {
}
            );
        
    
            feature_group_4e4956bb36d972eb114ef69826771a5c.addTo(map_34d5b6f7c621242a0ef356363c3a3e68);
        
    
            var marker_9aef16cfe278f84561ebd3c0e28a516f = L.marker(
                [19.076, 72.8777],
                {
}
            ).addTo(map_34d5b6f7c621242a0ef356363c3a3e68);
        
    
            var icon_a36901944aed6ca3c69978d73985b81c = L.AwesomeMarkers.icon(
                {
  "markerColor": "blue",
  "iconColor": "white",
  "icon": "motorcycle",
  "prefix": "fa",
  "extraClasses": "fa-rotate-0",
}
            );
        
    
            marker_9aef16cfe278f84561ebd3c0e28a516f.bindTooltip(
                \`<div>
                     📍 Gig Worker Location
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
                marker_9aef16cfe278f84561ebd3c0e28a516f.setIcon(icon_a36901944aed6ca3c69978d73985b81c);
            
    
            var circle_43965b09cfab9415cd6eeecc81b91f51 = L.circle(
                [19.076, 72.8777],
                {"bubblingMouseEvents": true, "color": "#0ea5e9", "dashArray": "6", "dashOffset": null, "fill": false, "fillColor": "#0ea5e9", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 25000.0, "stroke": true, "weight": 2}
            ).addTo(map_34d5b6f7c621242a0ef356363c3a3e68);
        
    
            circle_43965b09cfab9415cd6eeecc81b91f51.bindTooltip(
                \`<div>
                     OmniSight scan radius: 25 km
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            var feature_group_76a90137c9624feaa8293ea99156a959 = L.featureGroup(
                {
}
            );
        
    
            var circle_marker_3bbd78489f184387f3e931f2e5e0e5de = L.circleMarker(
                [19.0422, 72.8553],
                {"bubblingMouseEvents": true, "color": "#dc2626", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#dc2626", "fillOpacity": 0.88, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 17.8037285, "stroke": true, "weight": 3}
            ).addTo(feature_group_76a90137c9624feaa8293ea99156a959);
        
    
        var popup_b3daf41f419348623ee06ef247941afb = L.popup({
  "maxWidth": 320,
});

        
            
                var html_834065967f2b454c35e87d5729fb2a00 = $(\`<div id="html_834065967f2b454c35e87d5729fb2a00" style="width: 100.0%; height: 100.0%;"> <div style='font-family:Inter,sans-serif;font-size:12px;min-width:270px'>   <div style='background:#dc2626;color:#fff;padding:7px 12px;               border-radius:8px 8px 0 0;font-weight:700;font-size:13px'>     ZONE 1 — ZONE 3 (DANGER)   </div>   <div style='padding:9px 12px;border:1px solid #e5e7eb;               border-top:none;border-radius:0 0 8px 8px;background:#fff'>     <b>Area:</b> Dharavi &nbsp;|&nbsp; <b>City:</b> Mumbai<br/>     <b>Latest Risk:</b>       <span style='color:#dc2626;font-weight:800;font-size:15px'>98.04</span>       <span style='color:#9ca3af'> / 100</span>       &nbsp;<span style='background:#dc2626;color:#fff;padding:1px 7px;         border-radius:10px;font-size:10px'>HIGH</span><br/>     <b>Week:</b> 2026-03-19<br/>     <hr style='margin:5px 0;border-color:#f3f4f6'/>     <b>Historical stats:</b><br/>     &nbsp;Avg: <b>90.06</b> &nbsp;     Min: <b>58.40</b> &nbsp;     Max: <b>98.04</b> &nbsp;     Weeks: <b>53</b><br/>     <hr style='margin:5px 0;border-color:#f3f4f6'/>     📍 <b>Distance:</b> 4.43 km &nbsp;     <span style="color:#0ea5e9;font-weight:600">✔ Within 25km</span>      <div style='margin-top:7px'>   <div style='font-size:10px;color:#6b7280;margin-bottom:2px'>     Last 16 data points &nbsp;     <span style='color:#dc2626;font-weight:700'>▲ 98.0</span>   </div>   <svg width='210' height='42'        style='display:block;border:1px solid #f3f4f6;border-radius:4px;background:#fafafa'>     <polyline points='0,4 14,42 28,12 42,0 56,28 70,0 84,9 98,0 112,0 126,0 140,0 154,0 168,35 182,40 196,1 210,0' fill='none' stroke='#6366f1' stroke-width='1.8'/>     <circle cx="0" cy="4" r="2.5" fill="#6366f1"/><circle cx="14" cy="42" r="2.5" fill="#6366f1"/><circle cx="28" cy="12" r="2.5" fill="#6366f1"/><circle cx="42" cy="0" r="2.5" fill="#6366f1"/><circle cx="56" cy="28" r="2.5" fill="#6366f1"/><circle cx="70" cy="0" r="2.5" fill="#6366f1"/><circle cx="84" cy="9" r="2.5" fill="#6366f1"/><circle cx="98" cy="0" r="2.5" fill="#6366f1"/><circle cx="112" cy="0" r="2.5" fill="#6366f1"/><circle cx="126" cy="0" r="2.5" fill="#6366f1"/><circle cx="140" cy="0" r="2.5" fill="#6366f1"/><circle cx="154" cy="0" r="2.5" fill="#6366f1"/><circle cx="168" cy="35" r="2.5" fill="#6366f1"/><circle cx="182" cy="40" r="2.5" fill="#6366f1"/><circle cx="196" cy="1" r="2.5" fill="#6366f1"/><circle cx="210" cy="0" r="2.5" fill="#6366f1"/>   </svg>   <div style='font-size:9px;color:#9ca3af'>Oct 17 → Mar 19</div> </div>   </div> </div></div>\`)[0];
                popup_b3daf41f419348623ee06ef247941afb.setContent(html_834065967f2b454c35e87d5729fb2a00);
            
        

        circle_marker_3bbd78489f184387f3e931f2e5e0e5de.bindPopup(popup_b3daf41f419348623ee06ef247941afb)
        ;

        
    
    
            circle_marker_3bbd78489f184387f3e931f2e5e0e5de.bindTooltip(
                \`<div>
                     [ZONE 3] zone_1 · Dharavi | 98.0/100 | 4.4km
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            var marker_98a02a43871a822fdabf6c1e67836a17 = L.marker(
                [19.0422, 72.8553],
                {
}
            ).addTo(feature_group_76a90137c9624feaa8293ea99156a959);
        
    
            var div_icon_3bc40f9f1f37e5d29f063e0102c3e766 = L.divIcon({
  "html": "\\u003cdiv style=\\u0027background:#dc2626;color:#fff;padding:2px 7px;border-radius:8px;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 1px 5px rgba(0,0,0,.3);margin-top:18px\\u0027\\u003eZONE 1 \\u00b7 98\\u003c/div\\u003e",
  "iconSize": [110, 22],
  "iconAnchor": [55, 0],
  "className": "empty",
});
        
    
                marker_98a02a43871a822fdabf6c1e67836a17.setIcon(div_icon_3bc40f9f1f37e5d29f063e0102c3e766);
            
    
            var circle_marker_2b2cfb0c6960c6a7c5fa3159f7278b1b = L.circleMarker(
                [19.0728, 72.8826],
                {"bubblingMouseEvents": true, "color": "#dc2626", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#dc2626", "fillOpacity": 0.88, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 17.7998825, "stroke": true, "weight": 3}
            ).addTo(feature_group_76a90137c9624feaa8293ea99156a959);
        
    
        var popup_67edaef27e2d29246d4fb36a0db1531a = L.popup({
  "maxWidth": 320,
});

        
            
                var html_0764fed492c6b675e04d09169e448cf2 = $(\`<div id="html_0764fed492c6b675e04d09169e448cf2" style="width: 100.0%; height: 100.0%;"> <div style='font-family:Inter,sans-serif;font-size:12px;min-width:270px'>   <div style='background:#dc2626;color:#fff;padding:7px 12px;               border-radius:8px 8px 0 0;font-weight:700;font-size:13px'>     ZONE 2 — ZONE 3 (DANGER)   </div>   <div style='padding:9px 12px;border:1px solid #e5e7eb;               border-top:none;border-radius:0 0 8px 8px;background:#fff'>     <b>Area:</b> Kurla West &nbsp;|&nbsp; <b>City:</b> Mumbai<br/>     <b>Latest Risk:</b>       <span style='color:#dc2626;font-weight:800;font-size:15px'>98.00</span>       <span style='color:#9ca3af'> / 100</span>       &nbsp;<span style='background:#dc2626;color:#fff;padding:1px 7px;         border-radius:10px;font-size:10px'>HIGH</span><br/>     <b>Week:</b> 2026-03-19<br/>     <hr style='margin:5px 0;border-color:#f3f4f6'/>     <b>Historical stats:</b><br/>     &nbsp;Avg: <b>83.50</b> &nbsp;     Min: <b>64.41</b> &nbsp;     Max: <b>98.16</b> &nbsp;     Weeks: <b>8</b><br/>     <hr style='margin:5px 0;border-color:#f3f4f6'/>     📍 <b>Distance:</b> 0.63 km &nbsp;     <span style="color:#0ea5e9;font-weight:600">✔ Within 25km</span>      <div style='margin-top:7px'>   <div style='font-size:10px;color:#6b7280;margin-bottom:2px'>     Last 8 data points &nbsp;     <span style='color:#16a34a;font-weight:700'>▼ 98.0</span>   </div>   <svg width='210' height='42'        style='display:block;border:1px solid #f3f4f6;border-radius:4px;background:#fafafa'>     <polyline points='0,0 30,4 60,27 90,31 120,42 150,40 180,0 210,0' fill='none' stroke='#6366f1' stroke-width='1.8'/>     <circle cx="0" cy="0" r="2.5" fill="#6366f1"/><circle cx="30" cy="4" r="2.5" fill="#6366f1"/><circle cx="60" cy="27" r="2.5" fill="#6366f1"/><circle cx="90" cy="31" r="2.5" fill="#6366f1"/><circle cx="120" cy="42" r="2.5" fill="#6366f1"/><circle cx="150" cy="40" r="2.5" fill="#6366f1"/><circle cx="180" cy="0" r="2.5" fill="#6366f1"/><circle cx="210" cy="0" r="2.5" fill="#6366f1"/>   </svg>   <div style='font-size:9px;color:#9ca3af'>Feb 01 → Mar 19</div> </div>   </div> </div></div>\`)[0];
                popup_67edaef27e2d29246d4fb36a0db1531a.setContent(html_0764fed492c6b675e04d09169e448cf2);
            
        

        circle_marker_2b2cfb0c6960c6a7c5fa3159f7278b1b.bindPopup(popup_67edaef27e2d29246d4fb36a0db1531a)
        ;

        
    
    
            circle_marker_2b2cfb0c6960c6a7c5fa3159f7278b1b.bindTooltip(
                \`<div>
                     [ZONE 3] zone_2 · Kurla West | 98.0/100 | 0.6km
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            var marker_03b2ff72abf2f8cf1233e5b296fdeeaa = L.marker(
                [19.0728, 72.8826],
                {
}
            ).addTo(feature_group_76a90137c9624feaa8293ea99156a959);
        
    
            var div_icon_bbae63822570db83818621fae1b18752 = L.divIcon({
  "html": "\\u003cdiv style=\\u0027background:#dc2626;color:#fff;padding:2px 7px;border-radius:8px;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 1px 5px rgba(0,0,0,.3);margin-top:18px\\u0027\\u003eZONE 2 \\u00b7 98\\u003c/div\\u003e",
  "iconSize": [110, 22],
  "iconAnchor": [55, 0],
  "className": "empty",
});
        
    
                marker_03b2ff72abf2f8cf1233e5b296fdeeaa.setIcon(div_icon_bbae63822570db83818621fae1b18752);
            
    
            var circle_marker_083bcf10eb05dde106f03999782a96ac = L.circleMarker(
                [19.1136, 72.8697],
                {"bubblingMouseEvents": true, "color": "#dc2626", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#dc2626", "fillOpacity": 0.88, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 17.785251, "stroke": true, "weight": 3}
            ).addTo(feature_group_76a90137c9624feaa8293ea99156a959);
        
    
        var popup_d2a580c10d83273a8dec9ed2d31dc09a = L.popup({
  "maxWidth": 320,
});

        
            
                var html_f5079ee22299bcc5316f8d6a44d3c4ba = $(\`<div id="html_f5079ee22299bcc5316f8d6a44d3c4ba" style="width: 100.0%; height: 100.0%;"> <div style='font-family:Inter,sans-serif;font-size:12px;min-width:270px'>   <div style='background:#dc2626;color:#fff;padding:7px 12px;               border-radius:8px 8px 0 0;font-weight:700;font-size:13px'>     ZONE 3 — ZONE 3 (DANGER)   </div>   <div style='padding:9px 12px;border:1px solid #e5e7eb;               border-top:none;border-radius:0 0 8px 8px;background:#fff'>     <b>Area:</b> Andheri East &nbsp;|&nbsp; <b>City:</b> Mumbai<br/>     <b>Latest Risk:</b>       <span style='color:#dc2626;font-weight:800;font-size:15px'>97.85</span>       <span style='color:#9ca3af'> / 100</span>       &nbsp;<span style='background:#dc2626;color:#fff;padding:1px 7px;         border-radius:10px;font-size:10px'>HIGH</span><br/>     <b>Week:</b> 2026-03-19<br/>     <hr style='margin:5px 0;border-color:#f3f4f6'/>     <b>Historical stats:</b><br/>     &nbsp;Avg: <b>74.07</b> &nbsp;     Min: <b>50.60</b> &nbsp;     Max: <b>97.85</b> &nbsp;     Weeks: <b>6</b><br/>     <hr style='margin:5px 0;border-color:#f3f4f6'/>     📍 <b>Distance:</b> 4.26 km &nbsp;     <span style="color:#0ea5e9;font-weight:600">✔ Within 25km</span>      <div style='margin-top:7px'>   <div style='font-size:10px;color:#6b7280;margin-bottom:2px'>     Last 6 data points &nbsp;     <span style='color:#dc2626;font-weight:700'>▲ 97.9</span>   </div>   <svg width='210' height='42'        style='display:block;border:1px solid #f3f4f6;border-radius:4px;background:#fafafa'>     <polyline points='0,7 42,36 84,42 126,37 168,4 210,0' fill='none' stroke='#6366f1' stroke-width='1.8'/>     <circle cx="0" cy="7" r="2.5" fill="#6366f1"/><circle cx="42" cy="36" r="2.5" fill="#6366f1"/><circle cx="84" cy="42" r="2.5" fill="#6366f1"/><circle cx="126" cy="37" r="2.5" fill="#6366f1"/><circle cx="168" cy="4" r="2.5" fill="#6366f1"/><circle cx="210" cy="0" r="2.5" fill="#6366f1"/>   </svg>   <div style='font-size:9px;color:#9ca3af'>Feb 01 → Mar 19</div> </div>   </div> </div></div>\`)[0];
                popup_d2a580c10d83273a8dec9ed2d31dc09a.setContent(html_f5079ee22299bcc5316f8d6a44d3c4ba);
            
        

        circle_marker_083bcf10eb05dde106f03999782a96ac.bindPopup(popup_d2a580c10d83273a8dec9ed2d31dc09a)
        ;

        
    
    
            circle_marker_083bcf10eb05dde106f03999782a96ac.bindTooltip(
                \`<div>
                     [ZONE 3] zone_3 · Andheri East | 97.9/100 | 4.3km
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            var marker_1db37ae3ec1af024a09506f00c88b67d = L.marker(
                [19.1136, 72.8697],
                {
}
            ).addTo(feature_group_76a90137c9624feaa8293ea99156a959);
        
    
            var div_icon_6fa6df687c480bddd0f5c1fa48c0376d = L.divIcon({
  "html": "\\u003cdiv style=\\u0027background:#dc2626;color:#fff;padding:2px 7px;border-radius:8px;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 1px 5px rgba(0,0,0,.3);margin-top:18px\\u0027\\u003eZONE 3 \\u00b7 98\\u003c/div\\u003e",
  "iconSize": [110, 22],
  "iconAnchor": [55, 0],
  "className": "empty",
});
        
    
                marker_1db37ae3ec1af024a09506f00c88b67d.setIcon(div_icon_6fa6df687c480bddd0f5c1fa48c0376d);
            
    
            var circle_marker_5e14c3545a4db9311e8992dd0c615dc9 = L.circleMarker(
                [19.0596, 72.8656],
                {"bubblingMouseEvents": true, "color": "#dc2626", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#dc2626", "fillOpacity": 0.88, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 17.799544, "stroke": true, "weight": 3}
            ).addTo(feature_group_76a90137c9624feaa8293ea99156a959);
        
    
        var popup_df5b8a55fd865d0bed0fdfbf5369c91b = L.popup({
  "maxWidth": 320,
});

        
            
                var html_af8992b42adb88fc9130564ebb606ede = $(\`<div id="html_af8992b42adb88fc9130564ebb606ede" style="width: 100.0%; height: 100.0%;"> <div style='font-family:Inter,sans-serif;font-size:12px;min-width:270px'>   <div style='background:#dc2626;color:#fff;padding:7px 12px;               border-radius:8px 8px 0 0;font-weight:700;font-size:13px'>     ZONE 4 — ZONE 3 (DANGER)   </div>   <div style='padding:9px 12px;border:1px solid #e5e7eb;               border-top:none;border-radius:0 0 8px 8px;background:#fff'>     <b>Area:</b> Bandra Kurla &nbsp;|&nbsp; <b>City:</b> Mumbai<br/>     <b>Latest Risk:</b>       <span style='color:#dc2626;font-weight:800;font-size:15px'>98.00</span>       <span style='color:#9ca3af'> / 100</span>       &nbsp;<span style='background:#dc2626;color:#fff;padding:1px 7px;         border-radius:10px;font-size:10px'>HIGH</span><br/>     <b>Week:</b> 2026-03-19<br/>     <hr style='margin:5px 0;border-color:#f3f4f6'/>     <b>Historical stats:</b><br/>     &nbsp;Avg: <b>81.51</b> &nbsp;     Min: <b>60.85</b> &nbsp;     Max: <b>98.00</b> &nbsp;     Weeks: <b>4</b><br/>     <hr style='margin:5px 0;border-color:#f3f4f6'/>     📍 <b>Distance:</b> 2.22 km &nbsp;     <span style="color:#0ea5e9;font-weight:600">✔ Within 25km</span>      <div style='margin-top:7px'>   <div style='font-size:10px;color:#6b7280;margin-bottom:2px'>     Last 4 data points &nbsp;     <span style='color:#dc2626;font-weight:700'>▲ 98.0</span>   </div>   <svg width='210' height='42'        style='display:block;border:1px solid #f3f4f6;border-radius:4px;background:#fafafa'>     <polyline points='0,0 70,42 140,32 210,0' fill='none' stroke='#6366f1' stroke-width='1.8'/>     <circle cx="0" cy="0" r="2.5" fill="#6366f1"/><circle cx="70" cy="42" r="2.5" fill="#6366f1"/><circle cx="140" cy="32" r="2.5" fill="#6366f1"/><circle cx="210" cy="0" r="2.5" fill="#6366f1"/>   </svg>   <div style='font-size:9px;color:#9ca3af'>Feb 01 → Mar 19</div> </div>   </div> </div></div>\`)[0];
                popup_df5b8a55fd865d0bed0fdfbf5369c91b.setContent(html_af8992b42adb88fc9130564ebb606ede);
            
        

        circle_marker_5e14c3545a4db9311e8992dd0c615dc9.bindPopup(popup_df5b8a55fd865d0bed0fdfbf5369c91b)
        ;

        
    
    
            circle_marker_5e14c3545a4db9311e8992dd0c615dc9.bindTooltip(
                \`<div>
                     [ZONE 3] zone_4 · Bandra Kurla | 98.0/100 | 2.2km
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            var marker_cae4ec9a7cbfc2f610a5afa18e499fb8 = L.marker(
                [19.0596, 72.8656],
                {
}
            ).addTo(feature_group_76a90137c9624feaa8293ea99156a959);
        
    
            var div_icon_79a24441c78fc888ed86ecfc0e43f021 = L.divIcon({
  "html": "\\u003cdiv style=\\u0027background:#dc2626;color:#fff;padding:2px 7px;border-radius:8px;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 1px 5px rgba(0,0,0,.3);margin-top:18px\\u0027\\u003eZONE 4 \\u00b7 98\\u003c/div\\u003e",
  "iconSize": [110, 22],
  "iconAnchor": [55, 0],
  "className": "empty",
});
        
    
                marker_cae4ec9a7cbfc2f610a5afa18e499fb8.setIcon(div_icon_79a24441c78fc888ed86ecfc0e43f021);
            
    
            var circle_marker_f8158e10b41c41499ceef9b94630a630 = L.circleMarker(
                [19.1852, 72.971],
                {"bubblingMouseEvents": true, "color": "#dc2626", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#dc2626", "fillOpacity": 0.88, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 17.80105, "stroke": true, "weight": 3}
            ).addTo(feature_group_76a90137c9624feaa8293ea99156a959);
        
    
        var popup_9f87bd4cd37042369c3d83f80de39c02 = L.popup({
  "maxWidth": 320,
});

        
            
                var html_1c432d72826e17204af1fe7a8bf72087 = $(\`<div id="html_1c432d72826e17204af1fe7a8bf72087" style="width: 100.0%; height: 100.0%;"> <div style='font-family:Inter,sans-serif;font-size:12px;min-width:270px'>   <div style='background:#dc2626;color:#fff;padding:7px 12px;               border-radius:8px 8px 0 0;font-weight:700;font-size:13px'>     ZONE 5 — ZONE 3 (DANGER)   </div>   <div style='padding:9px 12px;border:1px solid #e5e7eb;               border-top:none;border-radius:0 0 8px 8px;background:#fff'>     <b>Area:</b> Thane West &nbsp;|&nbsp; <b>City:</b> Thane<br/>     <b>Latest Risk:</b>       <span style='color:#dc2626;font-weight:800;font-size:15px'>98.01</span>       <span style='color:#9ca3af'> / 100</span>       &nbsp;<span style='background:#dc2626;color:#fff;padding:1px 7px;         border-radius:10px;font-size:10px'>HIGH</span><br/>     <b>Week:</b> 2026-03-19<br/>     <hr style='margin:5px 0;border-color:#f3f4f6'/>     <b>Historical stats:</b><br/>     &nbsp;Avg: <b>83.56</b> &nbsp;     Min: <b>61.60</b> &nbsp;     Max: <b>98.01</b> &nbsp;     Weeks: <b>5</b><br/>     <hr style='margin:5px 0;border-color:#f3f4f6'/>     📍 <b>Distance:</b> 15.60 km &nbsp;     <span style="color:#0ea5e9;font-weight:600">✔ Within 25km</span>      <div style='margin-top:7px'>   <div style='font-size:10px;color:#6b7280;margin-bottom:2px'>     Last 5 data points &nbsp;     <span style='color:#dc2626;font-weight:700'>▲ 98.0</span>   </div>   <svg width='210' height='42'        style='display:block;border:1px solid #f3f4f6;border-radius:4px;background:#fafafa'>     <polyline points='0,0 52,38 105,42 157,2 210,0' fill='none' stroke='#6366f1' stroke-width='1.8'/>     <circle cx="0" cy="0" r="2.5" fill="#6366f1"/><circle cx="52" cy="38" r="2.5" fill="#6366f1"/><circle cx="105" cy="42" r="2.5" fill="#6366f1"/><circle cx="157" cy="2" r="2.5" fill="#6366f1"/><circle cx="210" cy="0" r="2.5" fill="#6366f1"/>   </svg>   <div style='font-size:9px;color:#9ca3af'>Feb 01 → Mar 19</div> </div>   </div> </div></div>\`)[0];
                popup_9f87bd4cd37042369c3d83f80de39c02.setContent(html_1c432d72826e17204af1fe7a8bf72087);
            
        

        circle_marker_f8158e10b41c41499ceef9b94630a630.bindPopup(popup_9f87bd4cd37042369c3d83f80de39c02)
        ;

        
    
    
            circle_marker_f8158e10b41c41499ceef9b94630a630.bindTooltip(
                \`<div>
                     [ZONE 3] zone_5 · Thane West | 98.0/100 | 15.6km
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            var marker_3506f72c918a61746606e56f161faeb2 = L.marker(
                [19.1852, 72.971],
                {
}
            ).addTo(feature_group_76a90137c9624feaa8293ea99156a959);
        
    
            var div_icon_f0669137016dab622522117fe29c72c8 = L.divIcon({
  "html": "\\u003cdiv style=\\u0027background:#dc2626;color:#fff;padding:2px 7px;border-radius:8px;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 1px 5px rgba(0,0,0,.3);margin-top:18px\\u0027\\u003eZONE 5 \\u00b7 98\\u003c/div\\u003e",
  "iconSize": [110, 22],
  "iconAnchor": [55, 0],
  "className": "empty",
});
        
    
                marker_3506f72c918a61746606e56f161faeb2.setIcon(div_icon_f0669137016dab622522117fe29c72c8);
            
    
            feature_group_76a90137c9624feaa8293ea99156a959.addTo(map_34d5b6f7c621242a0ef356363c3a3e68);
        
    
            var heat_map_889329d37486cf2ee2d339f1654f60ab = L.heatLayer(
                [[19.0422, 72.8553, 0.771408280726364], [19.0728, 72.8826, 0.9505073227601243], [19.1136, 72.8697, 0.7779611791475598], [19.0596, 72.8656, 0.8752452202588696], [19.1852, 72.971, 0.24502624999999997]],
                {
  "minOpacity": 0.3,
  "maxZoom": 13,
  "radius": 40,
  "blur": 26,
}
            );
        
    
            heat_map_889329d37486cf2ee2d339f1654f60ab.addTo(map_34d5b6f7c621242a0ef356363c3a3e68);
        
    
            var feature_group_84565035a64a613716a8896b1602b925 = L.featureGroup(
                {
}
            );
        
    
            var poly_line_aaa6b396c6266c75ceda3c7557bf7bb0 = L.polyline(
                [[19.076, 72.8777], [19.0728, 72.8826]],
                {"bubblingMouseEvents": true, "color": "#dc2626", "dashArray": null, "dashOffset": null, "fill": false, "fillColor": "#dc2626", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "noClip": false, "opacity": 0.55, "smoothFactor": 1.0, "stroke": true, "weight": 2.5}
            ).addTo(feature_group_84565035a64a613716a8896b1602b925);
        
    
            poly_line_aaa6b396c6266c75ceda3c7557bf7bb0.bindTooltip(
                \`<div>
                     Kurla West → 0.63 km
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            var poly_line_0bcaa30dbdde671309809c6eb09af945 = L.polyline(
                [[19.076, 72.8777], [19.0596, 72.8656]],
                {"bubblingMouseEvents": true, "color": "#dc2626", "dashArray": null, "dashOffset": null, "fill": false, "fillColor": "#dc2626", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "noClip": false, "opacity": 0.55, "smoothFactor": 1.0, "stroke": true, "weight": 2.5}
            ).addTo(feature_group_84565035a64a613716a8896b1602b925);
        
    
            poly_line_0bcaa30dbdde671309809c6eb09af945.bindTooltip(
                \`<div>
                     Bandra Kurla → 2.22 km
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            var poly_line_5b66ff1cf5bb9b83a760afb0fac8a3d0 = L.polyline(
                [[19.076, 72.8777], [19.1136, 72.8697]],
                {"bubblingMouseEvents": true, "color": "#dc2626", "dashArray": null, "dashOffset": null, "fill": false, "fillColor": "#dc2626", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "noClip": false, "opacity": 0.55, "smoothFactor": 1.0, "stroke": true, "weight": 2.5}
            ).addTo(feature_group_84565035a64a613716a8896b1602b925);
        
    
            poly_line_5b66ff1cf5bb9b83a760afb0fac8a3d0.bindTooltip(
                \`<div>
                     Andheri East → 4.26 km
                 </div>\`,
                {
  "sticky": true,
}
            );
        
    
            feature_group_84565035a64a613716a8896b1602b925.addTo(map_34d5b6f7c621242a0ef356363c3a3e68);
        
    
            var layer_control_88595e44538f31b9ed0e7ec0e78f0684_layers = {
                base_layers : {
                    "cartodbpositron" : tile_layer_876189504f6b252b360d522c26fc44bf,
                },
                overlays :  {
                    "\\ud83d\\udd34 Zone 3 \\u2014 DANGER  (\\u226575)" : feature_group_114f37d4b3af483c0f437a1df1dae089,
                    "\\ud83d\\udfe1 Zone 2 \\u2014 CAUTION (50\\u201374)" : feature_group_0f5351308663871484f4f98929e5845d,
                    "\\ud83d\\udfe2 Zone 1 \\u2014 SAFE    (\\u003c50)" : feature_group_4e4956bb36d972eb114ef69826771a5c,
                    "\\ud83d\\udccd Zone Markers \\u2014 click for details" : feature_group_76a90137c9624feaa8293ea99156a959,
                    "\\ud83c\\udf21\\ufe0f Weighted Risk Heatmap" : heat_map_889329d37486cf2ee2d339f1654f60ab,
                    "\\ud83d\\udd17 Nearest Zone Links" : feature_group_84565035a64a613716a8896b1602b925,
                },
            };
            let layer_control_88595e44538f31b9ed0e7ec0e78f0684 = L.control.layers(
                layer_control_88595e44538f31b9ed0e7ec0e78f0684_layers.base_layers,
                layer_control_88595e44538f31b9ed0e7ec0e78f0684_layers.overlays,
                {
  "position": "topright",
  "collapsed": false,
  "autoZIndex": true,
}
            ).addTo(map_34d5b6f7c621242a0ef356363c3a3e68);

        
</script>
</html>`;


const MonitoringPanel = ({ handleSimulate, isSimulating, handleLogout }) => {

const [fraudLogs, setFraudLogs] = useState([]);
const [fraudStats, setFraudStats] = useState({
  total_flags: 0,
  high_risk: 0
});

const [killSwitch, setKillSwitch] = useState({
  active: false,
  reason: null
});

useEffect(() => {
  const fetchKillSwitch = async () => {
    try {
      const killRes = await axios.get("/admin/kill-switch-status");
      setKillSwitch(killRes.data);
    } catch (err) {
      console.error("Kill switch fetch error:", err);
    }
  };

  fetchKillSwitch();

  const interval = setInterval(fetchKillSwitch, 5000); // 🔥 live

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const fetchFraudData = async () => {
    try {
      const logsRes = await axios.get("/admin/fraud-logs");
      const statsRes = await axios.get("/admin/fraud-stats");

      setFraudLogs(
        Array.isArray(logsRes.data)
          ? logsRes.data
          : logsRes.data?.logs || []
      );
      setFraudStats(statsRes.data);
    } catch (err) {
      console.error("Fraud fetch error:", err);
    }
  };

  fetchFraudData();

  const interval = setInterval(fetchFraudData, 5000); // 🔥 every 5 sec

  return () => clearInterval(interval); // cleanup
}, []);

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

          <button
            className={`mt-5 w-full py-3 rounded-xl font-bold text-lg ${
              killSwitch.active
                ? "bg-red-700 animate-pulse"
                : "bg-green-600"
            }`}
          >
            🚨 KILL SWITCH
          </button>

          <p
            className={`text-xs mt-2 ${
              killSwitch.active ? "text-red-400" : "text-green-400"
            }`}
          >
            Status: {killSwitch.active ? "ACTIVE 🚨" : "System Safe"}
          </p>

          {killSwitch.reason && (
            <p className="text-orange-400 text-xs mt-1">
              Reason: {killSwitch.reason}
            </p>
          )}
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
          { label: "FRAUD FLAGGED", value: fraudStats.total_flags, icon: <AlertOctagon /> },
          { label: "HIGH RISK", value: fraudStats.high_risk, icon: <AlertOctagon /> }
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
          {fraudLogs.map((log, index) => (
            <div
              key={index}
              className="border border-red-500/20 rounded-xl p-4 mb-4"
            >
              <p className="text-orange-400 font-semibold">
                {log.risk_level} Risk
              </p>

              <p className="text-gray-400 text-sm">
                {log.reasons}
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


const ZONE_DATA = [
  { id: "zone_1", area: "Dharavi",      city: "Mumbai", score: 98.04, level: 3, color: "#dc2626", dist: "4.4 km" },
  { id: "zone_2", area: "Kurla West",   city: "Mumbai", score: 98.00, level: 3, color: "#dc2626", dist: "0.6 km" },
  { id: "zone_3", area: "Andheri East", city: "Mumbai", score: 97.85, level: 3, color: "#dc2626", dist: "4.3 km" },
  { id: "zone_4", area: "Bandra Kurla", city: "Mumbai", score: 98.00, level: 3, color: "#dc2626", dist: "2.2 km" },
  { id: "zone_5", area: "Thane West",   city: "Thane",  score: 98.01, level: 3, color: "#dc2626", dist: "15.6 km" },
];

const ZoneControlPanel = () => {
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState(ZONE_DATA.map(z => ({ ...z })));
  const [tick, setTick] = useState(0);

  // Simulate live score fluctuation
  useState(() => {
    const interval = setInterval(() => {
      setScores(prev => prev.map(z => ({
        ...z,
        score: Math.min(100, Math.max(50, +(z.score + (Math.random() - 0.48) * 0.6).toFixed(2)))
      })));
      setTick(t => t + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getBadge = (level) => {
    if (level >= 3) return { label: "DANGER", bg: "bg-red-600", text: "text-white" };
    if (level === 2) return { label: "CAUTION", bg: "bg-yellow-500", text: "text-black" };
    return { label: "SAFE", bg: "bg-green-600", text: "text-white" };
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold italic tracking-tight">ZONE CONTROL</h1>
          <p className="text-gray-500 text-sm mt-1">Live risk heatmap · Mumbai Region · DevTrails 2026</p>
        </div>
        <div className="flex items-center gap-2 bg-red-600/10 border border-red-500/30 rounded-full px-4 py-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-sm font-semibold">LIVE</span>
        </div>
      </div>

      {/* Map */}
      <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden mb-4">
        <div className="relative h-[520px]">
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
      </div>

      {/* Live Zone Risk Ticker */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-red-400" />
          <h2 className="text-sm font-bold tracking-widest text-gray-300 uppercase">Live Gig Worker Risk Scores</h2>
          <span className="ml-auto text-xs text-gray-600">updates every 2s</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {scores.map((zone) => {
            const badge = getBadge(zone.level);
            const pct = Math.min(100, zone.score);
            return (
              <div
                key={zone.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 hover:border-red-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-mono uppercase">{zone.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white leading-tight">{zone.area}</p>
                <p className="text-xs text-gray-500">{zone.city} · {zone.dist}</p>
                <div className="mt-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Risk</span>
                    <span className="text-red-400 font-bold font-mono">{zone.score.toFixed(1)}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: zone.score > 75 ? "#dc2626" : zone.score > 50 ? "#f59e0b" : "#16a34a" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
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

  const navItems = [
    { key: "monitoring",  label: "Monitoring",   Icon: Activity },
    { key: "zonecontrol", label: "Zone Control", Icon: MapIcon },
    { key: "partners",    label: "Partners",     Icon: Users },
    { key: "fraud",       label: "Fraud AI",     Icon: AlertOctagon },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-[#0d1220] border-r border-white/10 p-5 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-1">
          <Shield className="text-red-500 shrink-0" size={22} />
          <span className="hidden lg:block font-bold text-lg tracking-wide text-white">
            OMNISIGHT OPS
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveNav(key)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left ${
                activeNav === key
                  ? "bg-red-600/20 text-red-400 border border-red-500/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="hidden lg:block text-sm font-medium">{label}</span>
            </button>
          ))}
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
        {activeNav === "partners" && <ComingSoonPanel title="Partners" />}
        {activeNav === "fraud" && <ComingSoonPanel title="Fraud AI" />}
      </main>
    </div>
  );
};

export default AdminDashboard;
