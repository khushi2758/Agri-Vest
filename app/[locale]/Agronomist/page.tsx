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

  const handleSelectLand = (landId: string) => {
    let land = lands.find((l) => l.id === landId);
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
    const saved = savedProgress.find((p) => p.propertyId === land.id);
    if (saved) {
      setIsFlagged(saved.isFlagged ?? false);
      setSuggestion(saved.suggestion ?? "");
    } else {
      setIsFlagged(false);
      setSuggestion("");
    }
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
      <div className="min-h-screen bg-[#f8faf5] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf5] font-sans selection:bg-[#c8e639] selection:text-black">
      <NavBar />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Agronomist Dashboard</h1>
            <p className="text-sm text-gray-400 font-medium mt-1">Real-time field monitoring & agronomic analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm hover:shadow-md transition">
              <Bell size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm hover:shadow-md transition">
              <Settings size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <TopMetrics weatherData={weatherData} />

          <IndexGraphs />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" style={{ minHeight: "380px" }}>
            <div className="xl:col-span-2">
              <ChartWidget />
            </div>
            <div className="xl:col-span-1">
              <ParametersWidget tempCelsius={tempCelsius} moisturePct={moisturePct} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" style={{ minHeight: "420px" }}>
            <div className="xl:col-span-1">
              <DataTableWidget lands={lands} onSelectLand={handleSelectLand} />
            </div>
            <div className="xl:col-span-1">
              <MapWidget />
            </div>
            <div className="xl:col-span-1">
              <ModulesWidget />
            </div>
          </div>

          <CropRotationCalendar />
        </div>
      </div>

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
        onClose={() => setSelectedLand(null)}
        onReset={() => {
          setSelectedLand(null);
          setResult(null);
          fetchLands();
        }}
      />
    </div>
  );
}