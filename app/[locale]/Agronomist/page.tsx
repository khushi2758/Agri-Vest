"use client";

import React, { useEffect, useState } from "react";
import NavBar from "../navbar";
import { Loader2, Bell, Settings } from "lucide-react";
import { TopMetrics } from "./components/TopMetrics";
import { IndexGraphs } from "./components/IndexGraphs";
import { ChartWidget } from "./components/ChartWidget";
import { ParametersWidget } from "./components/ParametersWidget";
import { DataTableWidget } from "./components/DataTableWidget";
import { MapWidget } from "./components/MapWidget";
import { ModulesWidget } from "./components/ModulesWidget";
import { CropRotationCalendar } from "./components/CropRotationCalendar";
import { AnalysisModal } from "./components/AnalysisModal";
import { DEMO_FIELDS } from "./components/DEMO_FIELDS";

// ---- shared glass / motion utility classes (same language as the other redesigned pages) ----
function SoftUIStyles() {
  return (
    <style jsx global>{`
      @keyframes wallet-fade-up {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes wallet-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes wallet-row-in {
        from { opacity: 0; transform: translateX(-8px); }
        to { opacity: 1; transform: translateX(0); }
      }

      /* water glass: deeper blur/saturation, a wet top highlight, and a soft diagonal sheen (white only, static — no colored glow) */
      .wallet-card-soft, .wallet-pill {
        position: relative;
        overflow: hidden;
      }
      .wallet-card-soft {
        background: rgba(255, 255, 255, 0.32);
        backdrop-filter: blur(22px) saturate(170%);
        -webkit-backdrop-filter: blur(22px) saturate(170%);
        border: 1px solid rgba(255, 255, 255, 0.65);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.75),
          inset 0 -14px 24px -16px rgba(255, 255, 255, 0.35),
          0 10px 30px rgba(30, 50, 40, 0.12);
      }
      .wallet-pill {
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(12px) saturate(160%);
        -webkit-backdrop-filter: blur(12px) saturate(160%);
        border: 1px solid rgba(255, 255, 255, 0.65);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
      }
      .wallet-card-soft::before, .wallet-pill::before {
        content: "";
        position: absolute;
        top: -60%;
        left: -25%;
        width: 55%;
        height: 220%;
        background: linear-gradient(
          115deg,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.14) 45%,
          rgba(255, 255, 255, 0) 75%
        );
        transform: rotate(10deg);
        pointer-events: none;
      }

      .wallet-fade-up { animation: wallet-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .wallet-fade-in { animation: wallet-fade-in 0.6s ease both; }
      .wallet-row-in { animation: wallet-row-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }

      .wallet-hover-lift {
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
      }
      .wallet-hover-lift:hover {
        transform: translateY(-3px);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.8),
          inset 0 -14px 24px -16px rgba(255, 255, 255, 0.4),
          0 18px 38px rgba(30, 50, 40, 0.16);
      }

      @media (prefers-reduced-motion: reduce) {
        .wallet-fade-up, .wallet-fade-in, .wallet-row-in, .wallet-hover-lift {
          animation: none !important;
          transition: none !important;
        }
        .wallet-hover-lift:hover { transform: none; }
      }
    `}</style>
  );
}

export default function AgronomistDashboard() {
  const [lands, setLands] = useState<any[]>([]);
  const [savedProgress, setSavedProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const [isFlagged, setIsFlagged] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const [landsRes, progressRes] = await Promise.all([fetch("/api/agronomist/lands"), fetch("/api/agronomist/progress")]);
      if (landsRes.ok && progressRes.ok) {
        const landsData = await landsRes.json();
        const progressData = await progressRes.json();
        setLands(landsData);
        setSavedProgress(progressData.progress || []);

        const location = landsData.length > 0 ? landsData[0].location : "Nebraska, USA";
        try {
          const wRes = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
          if (wRes.ok) {
            const wData = await wRes.json();
            setWeatherData(wData);
          }
        } catch (we) {}
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && lands.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const landId = urlParams.get("landId");
      if (landId) {
        handleSelectLand(landId);
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, [loading, lands]);

  const formatLocation = (loc: any): string => {
    if (typeof loc === 'string') return loc;
    if (loc && typeof loc === 'object' && loc.coordinates) {
      return `Lat: ${loc.coordinates[1].toFixed(2)}, Lng: ${loc.coordinates[0].toFixed(2)}`;
    }
    return "Unknown Location";
  };

  const handleSelectLand = (landId: string) => {
    let land = lands.find((l) => l.id === landId || l._id === landId || l._id?.toString() === landId);
    if (!land) {
      land = {
        id: landId,
        title: landId.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
        location: "Unknown Location",
        telemetry: { npkIndex: "0.17", moisturePct: 44, tempCelsius: 24 },
      };
    }
    setSelectedLand(land);
    setResult(null);
    const lid = land.id || land._id;
    const saved = savedProgress.find((p) => p.propertyId === lid);
    if (saved) {
      setIsFlagged(saved.isFlagged ?? false);
      setSuggestion(saved.suggestion ?? "");
    } else {
      setIsFlagged(false);
      setSuggestion("");
    }
    setIsModalOpen(false);
  };

  const handleValidate = async () => {
    if (!selectedLand) return;
    setSubmitting(true);
    try {
      const payload = {
        propertyId: selectedLand.id,
        npkIndex: selectedLand.telemetry?.npkIndex || "0.17",
        moisturePct: selectedLand.telemetry?.moisturePct || 44,
        tempCelsius: selectedLand.telemetry?.tempCelsius || 24,
        isFlagged,
        suggestion,
      };
      const res = await fetch("/api/agronomist/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
        await fetch("/api/agronomist/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: selectedLand.id, status: "completed" }),
        });
      }
    } catch (e) {} finally {
      setSubmitting(false);
    }
  };

  const handleSaveProgress = async () => {
    if (!selectedLand) return;
    setSavingProgress(true);
    try {
      await fetch("/api/agronomist/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: selectedLand.id, isFlagged, suggestion, status: "draft" }),
      });
      await fetchLands();
    } catch (e) {} finally {
      setSavingProgress(false);
    }
  };

  const tempCelsius = weatherData?.tempCelsius ?? (lands[0]?.telemetry?.tempCelsius || 24);
  const moisturePct = weatherData?.moisturePct ?? (lands[0]?.telemetry?.moisturePct || 44);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#b7d0ea] via-[#9dc0b1] to-[#6f8f5e] flex items-center justify-center">
        <SoftUIStyles />
        <div className="wallet-card-soft rounded-3xl p-8 wallet-fade-in">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b7d0ea] via-[#9dc0b1] to-[#6f8f5e] font-sans selection:bg-[#c8e639] selection:text-black">
      <SoftUIStyles />
      <NavBar />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
        <div className="flex justify-between items-center mb-8 wallet-fade-up">
          <div>
            <h1 className="text-3xl font-black text-[#1b2620] tracking-tight">Agronomist Dashboard</h1>
            <p className="text-sm text-[#1b2620]/50 font-medium mt-1">Real-time field monitoring & agronomic analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl wallet-card-soft wallet-hover-lift flex items-center justify-center text-[#1b2620]/60 hover:text-[#1b2620] transition-colors">
              <Bell size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl wallet-card-soft wallet-hover-lift flex items-center justify-center text-[#1b2620]/60 hover:text-[#1b2620] transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {!selectedLand ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 wallet-fade-up" style={{ minHeight: "600px", animationDelay: "80ms" }}>
            <div className="xl:col-span-2">
              <DataTableWidget lands={lands} onSelectLand={handleSelectLand} />
            </div>
            <div className="xl:col-span-1 wallet-card-soft rounded-2xl p-6 flex flex-col h-full">
              <h3 className="font-bold text-lg text-[#1b2620] mb-5">Previously Analysed Lands</h3>
              {savedProgress.length === 0 ? (
                <p className="text-sm text-[#1b2620]/40">No previous work found.</p>
              ) : (
                <div className="flex flex-col gap-4 overflow-y-auto">
                  {savedProgress.map((p, idx) => {
                    const land = lands.find(l => l.id === p.propertyId || l._id === p.propertyId) || { title: p.propertyId, location: "Unknown" };
                    return (
                      <div key={p.propertyId || idx} onClick={() => handleSelectLand(p.propertyId)} className="flex items-center justify-between p-4 wallet-pill rounded-xl cursor-pointer hover:bg-white/70 transition-colors wallet-row-in" style={{ animationDelay: `${idx * 45}ms` }}>
                        <div>
                          <p className="font-bold text-sm text-[#1b2620]">{land.title || land.id || p.propertyId}</p>
                          <p className="text-xs text-[#1b2620]/50 mt-1">{land.location || "Unknown"}</p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded-md">{p.status || "draft"}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between wallet-card-soft p-4 rounded-2xl wallet-fade-up">
              <div className="flex items-center gap-4">
                 <button onClick={() => setSelectedLand(null)} className="px-4 py-2 wallet-pill text-[#1b2620] rounded-xl text-sm font-bold hover:bg-white/70 transition-colors">
                   ← Back to Fields
                 </button>
                 <div>
                   <h2 className="text-xl font-bold text-[#1b2620]">{selectedLand.title || selectedLand.id}</h2>
                   <p className="text-xs text-[#1b2620]/50">{formatLocation(selectedLand.location)}</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 bg-[#c8e639] text-[#1b2620] rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
                Analyze & Suggest
              </button>
            </div>

            <div className="wallet-fade-up" style={{ animationDelay: "60ms" }}>
              <TopMetrics weatherData={weatherData} />
            </div>

            <div className="wallet-fade-up" style={{ animationDelay: "100ms" }}>
              <IndexGraphs />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 wallet-fade-up" style={{ minHeight: "380px", animationDelay: "140ms" }}>
              <div className="xl:col-span-2">
                <ChartWidget />
              </div>
              <div className="xl:col-span-1">
                <ParametersWidget tempCelsius={tempCelsius} moisturePct={moisturePct} />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 wallet-fade-up" style={{ minHeight: "420px", animationDelay: "180ms" }}>
              <div className="xl:col-span-1">
                <DataTableWidget lands={lands} onSelectLand={handleSelectLand} />
              </div>
              <div className="xl:col-span-1">
               <MapWidget
  lands={lands.length > 0 ? lands : DEMO_FIELDS}
  selectedLand={selectedLand}
/>
              </div>
              <div className="xl:col-span-1">
                <ModulesWidget />
              </div>
            </div>

            <div className="wallet-fade-up" style={{ animationDelay: "220ms" }}>
              <CropRotationCalendar />
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AnalysisModal
          selectedLand={selectedLand}
          suggestion={suggestion}
          isFlagged={isFlagged}
          savingProgress={savingProgress}
          submitting={submitting}
          result={result}
          setSuggestion={setSuggestion}
          setIsFlagged={setIsFlagged}
          handleSaveProgress={handleSaveProgress}
          handleValidate={handleValidate}
          onClose={() => setIsModalOpen(false)}
          onReset={() => {
            setIsModalOpen(false);
            setSelectedLand(null);
            setResult(null);
            fetchLands();
          }}
        />
      )}
    </div>
  );
}