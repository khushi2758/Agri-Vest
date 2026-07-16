"use client";

import React, { useEffect, useState } from "react";
import NavBar from "../navbar";
import { Loader2 } from "lucide-react";
import { IndicatorsWidget } from "./components/IndicatorsWidget";
import { HarvestWidget } from "./components/HarvestWidget";
import { TasksWidget } from "./components/TasksWidget";
import { CalendarWidget } from "./components/CalendarWidget";
import { FieldsWidget } from "./components/FieldsWidget";
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
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && lands.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const landId = urlParams.get('landId');
      if (landId) {
        handleSelectLand(landId);
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [loading, lands]);

  const handleSelectLand = (landId: string) => {
    let land = lands.find(l => l.id === landId);
    if (!land) {
      land = {
        id: landId,
        title: landId === 'corn-field' ? 'Corn field' : 'Wheat field',
        location: 'Mock Location',
        telemetry: {
          npkIndex: '0.17',
          moisturePct: 44,
          tempCelsius: 24
        }
      };
    }
    setSelectedLand(land);
    setResult(null);
    const saved = savedProgress.find(p => p.propertyId === land.id);
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
        npkIndex: selectedLand.telemetry?.npkIndex || '0.17',
        moisturePct: selectedLand.telemetry?.moisturePct || 44,
        tempCelsius: selectedLand.telemetry?.tempCelsius || 24,
        isFlagged,
        suggestion
      };
      const res = await fetch("/api/agronomist/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
        await fetch("/api/agronomist/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            propertyId: selectedLand.id,
            status: "completed"
          })
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
      const payload = {
        propertyId: selectedLand.id,
        isFlagged,
        suggestion,
        status: "draft"
      };
      await fetch("/api/agronomist/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      await fetchLands();
    } catch (e) {} finally {
      setSavingProgress(false);
    }
  };
  const tempCelsius = lands[0]?.telemetry?.tempCelsius || 24;
  const moisturePct = lands[0]?.telemetry?.moisturePct || 44;
  if (loading) {
    return <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#81c784] animate-spin" />
      </div>;
  }
  return <div className="min-h-screen bg-[#f9fafb] font-sans selection:bg-[#c8e639] selection:text-black">
      
      <NavBar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col xl:flex-row gap-8">
          
          <div className="w-full xl:w-1/3 flex flex-col gap-8 bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
            <IndicatorsWidget tempCelsius={tempCelsius} moisturePct={moisturePct} />
            <HarvestWidget />
          </div>

          <div className="w-full xl:w-2/3 flex flex-col gap-8 bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TasksWidget />
              <CalendarWidget />
            </div>
            <FieldsWidget onSelectLand={handleSelectLand} />
          </div>

        </div>
      </div>

      <AnalysisModal selectedLand={selectedLand} suggestion={suggestion} isFlagged={isFlagged} savingProgress={savingProgress} submitting={submitting} result={result} setSuggestion={setSuggestion} setIsFlagged={setIsFlagged} handleSaveProgress={handleSaveProgress} handleValidate={handleValidate} onClose={() => setSelectedLand(null)} onReset={() => {
      setSelectedLand(null);
      setResult(null);
      fetchLands();
    }} />
    </div>;
}