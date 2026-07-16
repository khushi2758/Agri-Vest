"use client";
import React, { useEffect, useRef, useState } from "react";
import { MapPin, Layers } from "lucide-react";

const FIELD_LOCATIONS = [
  { id: "sundance-corn-estate", name: "Sundance Corn", lat: 41.5, lng: -100.0, region: "Nebraska", crop: "Corn", area: "150.5 ha" },
  { id: "blue-ridge-orchard", name: "Blue Ridge", lat: 37.5, lng: -79.0, region: "Virginia", crop: "Apples", area: "85.2 ha" },
  { id: "golden-wheat-coop", name: "Golden Wheat", lat: 38.5, lng: -98.0, region: "Kansas", crop: "Wheat", area: "320.0 ha" },
  { id: "emerald-vineyards", name: "Emerald Vine", lat: 36.7, lng: -119.8, region: "California", crop: "Grapes", area: "45.0 ha" },
  { id: "dakota-soy-fields", name: "Dakota Soy", lat: 44.0, lng: -100.0, region: "South Dakota", crop: "Soybeans", area: "210.8 ha" },
  { id: "cascade-hops-farm", name: "Cascade Hops", lat: 47.6, lng: -122.3, region: "Washington", crop: "Hops", area: "78.3 ha" },
  { id: "delta-rice-co", name: "Delta Rice", lat: 33.4, lng: -91.0, region: "Arkansas", crop: "Rice", area: "195.0 ha" },
  { id: "peach-grove-ga", name: "Peach Grove", lat: 32.8, lng: -83.6, region: "Georgia", crop: "Peaches", area: "62.5 ha" },
];

export function MapWidget() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [activeView, setActiveView] = useState<"street" | "satellite">("street");

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(linkEl);

    const scriptEl = document.createElement("script");
    scriptEl.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    scriptEl.onload = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = (window as any).L;

      const map = L.map(mapRef.current, {
        center: [39.5, -98.35],
        zoom: 4,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      const markerIcon = L.divIcon({
        className: "",
        html: `<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
          <div style="width:12px;height:12px;background:#22c55e;border-radius:50%;border:2px solid #fff;box-shadow:0 0 12px rgba(34,197,94,0.6),0 0 24px rgba(34,197,94,0.3);"></div>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      FIELD_LOCATIONS.forEach((loc, i) => {
        const marker = L.marker([loc.lat, loc.lng], { icon: markerIcon }).addTo(map);
        marker.bindPopup(
          `<div style="font-family:system-ui;padding:4px 0;">
            <div style="font-weight:800;font-size:13px;color:#111;margin-bottom:2px;">${loc.name}</div>
            <div style="font-size:11px;color:#666;margin-bottom:6px;">${loc.region}</div>
            <div style="display:flex;gap:8px;">
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:3px 8px;">
                <span style="font-size:9px;color:#16a34a;font-weight:700;">${loc.crop}</span>
              </div>
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:3px 8px;">
                <span style="font-size:9px;color:#475569;font-weight:700;">${loc.area}</span>
              </div>
            </div>
          </div>`,
          { className: "leaflet-popup-custom", closeButton: false, maxWidth: 200 }
        );
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);

      setTimeout(() => map.invalidateSize(), 200);
    };
    document.head.appendChild(scriptEl);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const toggleView = () => {
    if (!mapInstanceRef.current) return;
    const L = (window as any).L;
    const map = mapInstanceRef.current;

    map.eachLayer((layer: any) => {
      if (layer._url && layer._url.includes("{s}")) {
        map.removeLayer(layer);
      }
    });

    if (activeView === "street") {
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
      }).addTo(map);
      setActiveView("satellite");
    } else {
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);
      setActiveView("street");
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden h-full min-h-80 border border-white/10">
      <div ref={mapRef} className="absolute inset-0 z-0"></div>

      <div className="absolute inset-0 z-10 pointer-events-none bg-linear-to-t from-[#0f1a12]/80 via-transparent to-[#0f1a12]/40"></div>

      <div className="absolute top-0 left-0 right-0 z-20 p-5">
        <div className="flex justify-between items-start">
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2.5">
            <h3 className="text-white font-bold text-sm">Field Locations</h3>
            <p className="text-white/40 text-[10px] font-medium">Active monitoring zones</p>
          </div>
          <button
            onClick={toggleView}
            className="pointer-events-auto bg-black/30 backdrop-blur-xl border border-white/10 text-white/70 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-white/20 transition"
          >
            <Layers size={12} /> {activeView === "street" ? "Satellite" : "Dark"}
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] text-white/60 font-bold">{FIELD_LOCATIONS.length} Active Fields</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={10} className="text-white/30" />
              <span className="text-[10px] text-white/60 font-bold">Continental US</span>
            </div>
          </div>
          <div className="flex -space-x-1.5">
            {FIELD_LOCATIONS.slice(0, 5).map((loc) => (
              <div key={loc.id} className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center" title={loc.name}>
                <span className="text-[7px] font-black text-emerald-300">{loc.name.charAt(0)}</span>
              </div>
            ))}
            <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-[7px] font-black text-white/60">+{FIELD_LOCATIONS.length - 5}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
          border: 1px solid #e2e8f0 !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 10px 14px !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}
