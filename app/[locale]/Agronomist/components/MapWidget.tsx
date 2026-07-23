"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Layers } from "lucide-react";

export function MapWidget({ lands = [], selectedLand = null }: { lands?: any[], selectedLand?: any }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [activeView, setActiveView] = useState<"street" | "satellite">("street");

  useEffect(() => {
    if (mapInstanceRef.current) return;

    if ((window as any).L) {
      initMap();
      return;
    }

    const existingLink = document.querySelector('link[href*="leaflet"]');
    if (!existingLink) {
      const linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";
      linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(linkEl);
    }

    const existingScript = document.querySelector('script[src*="leaflet"]');
    if (existingScript) {
      const checkL = setInterval(() => {
        if ((window as any).L) {
          clearInterval(checkL);
          initMap();
        }
      }, 50);
      return;
    }

    const scriptEl = document.createElement("script");
    scriptEl.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    scriptEl.onload = initMap;
    document.head.appendChild(scriptEl);

    function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return;
      const L = (window as any).L;
      if (!L) return;

      const map = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: false,
        attributionControl: false,
      });

     L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }
).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapInstanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 200);
      setMapReady(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const drawMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    const L = (window as any).L;
    if (!map || !L || !lands || lands.length === 0) return;

    markersRef.current.forEach(m => {
      try { map.removeLayer(m); } catch (e) {}
    });
    markersRef.current = [];

const normalIcon = L.divIcon({
  className: "",
  html: '<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;"><div style="width:12px;height:12px;background:#4285F4;border-radius:50%;border:2px solid #fff;box-shadow:0 0 12px rgba(66,133,244,0.6),0 0 24px rgba(66,133,244,0.3);"></div></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const selectedMarkerIcon = L.divIcon({
  className: "",
  html: `
    <div style="width:32px;height:44px;filter:drop-shadow(0 3px 5px rgba(0,0,0,0.4));">
      <svg width="32" height="44" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 22 12 22s12-13 12-22C24 5.4 18.6 0 12 0z" fill="#EA4335"/>
        <circle cx="12" cy="12" r="5.2" fill="#ffffff"/>
      </svg>
    </div>
  `,
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -42],
});

    const bounds: [number, number][] = [];

    lands.forEach((land: any) => {
    const lat = land.lat;
const lng = land.lng;

if (lat == null || lng == null) return;

      if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) return;

      const landId = land.id || land._id?.toString();
      const selectedId = selectedLand ? (selectedLand.id || selectedLand._id?.toString()) : null;
      const isSelected = landId && selectedId && landId === selectedId;
      const iconToUse = isSelected ? selectedMarkerIcon : normalIcon;

      const marker = L.marker([lat, lng], { icon: iconToUse }).addTo(map);
      marker.bindPopup(
        '<div style="font-family:system-ui;padding:4px 0;">' +
          '<div style="font-weight:800;font-size:13px;color:#111;margin-bottom:2px;">' + (land.title || land.id || "Unknown") + '</div>' +
          '<div style="font-size:11px;color:#666;margin-bottom:6px;">' + (land.crop || "Mixed") + ' &bull; ' + (land.area_ha ? land.area_ha + ' ha' : land.area || "N/A") + '</div>' +
          '<div style="display:flex;gap:8px;">' +
            '<div style="background:' + (isSelected ? '#fef3c7' : '#f0fdf4') + ';border:1px solid ' + (isSelected ? '#fcd34d' : '#bbf7d0') + ';border-radius:6px;padding:3px 8px;">' +
              '<span style="font-size:9px;color:' + (isSelected ? '#d97706' : '#16a34a') + ';font-weight:700;">' + (isSelected ? "Selected" : "Active") + '</span>' +
            '</div>' +
          '</div>' +
        '</div>',
        { className: "leaflet-popup-custom", closeButton: false, maxWidth: 200 }
      );

      markersRef.current.push(marker);
      bounds.push([lat, lng]);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 5 });
    }
  }, [lands, selectedLand]);

  useEffect(() => {
    if (mapReady) {
      drawMarkers();
    }
  }, [mapReady, drawMarkers]);

  const toggleView = () => {
    if (!mapInstanceRef.current) return;
    const L = (window as any).L;
    const map = mapInstanceRef.current;

    map.eachLayer((layer: any) => {
      if (layer._url) map.removeLayer(layer);
    });

    if (activeView === "street") {
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 29,
      }).addTo(map);
      setActiveView("satellite");
    } else {
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 29,
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
            <p className="text-white/40 text-[10px] font-medium">Global monitoring zones</p>
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
              <span className="text-[10px] text-white/60 font-bold">{lands.length} Active Fields</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={10} className="text-white/30" />
              <span className="text-[10px] text-white/60 font-bold">Global Data</span>
            </div>
          </div>
          <div className="flex -space-x-1.5">
            {lands.slice(0, 5).map((loc: any) => (
              <div key={loc.id || loc._id} className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center" title={loc.title || loc.id}>
                <span className="text-[7px] font-black text-emerald-300">{(loc.title || loc.id || "U").charAt(0)}</span>
              </div>
            ))}
            {lands.length > 5 && (
              <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-[7px] font-black text-white/60">+{lands.length - 5}</span>
              </div>
            )}
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
