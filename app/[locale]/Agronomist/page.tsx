"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../navbar";
import { Loader2, Activity, MapPin, CheckCircle, Flag, Send } from "lucide-react";

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
      const [landsRes, progressRes] = await Promise.all([
        fetch("/api/agronomist/lands"),
        fetch("/api/agronomist/progress")
      ]);
      
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

  const handleSelectLand = (land: any) => {
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
        npkIndex: selectedLand.telemetry.npkIndex,
        moisturePct: selectedLand.telemetry.moisturePct,
        tempCelsius: selectedLand.telemetry.tempCelsius,
        isFlagged,
        suggestion
      };
      
      const res = await fetch("/api/agronomist/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
        
        await fetch("/api/agronomist/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: selectedLand.id, status: "completed" })
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      await fetchLands();
    } catch (e) {} finally {
      setSavingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9f2] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#c8e639] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans selection:bg-[#c8e639] selection:text-black">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
        
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <h1 className="text-2xl font-extrabold text-[#1b2620] mb-4">Land Analysis Queue</h1>
          
          {savedProgress.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Saved for Analysis</h2>
              <div className="flex flex-col gap-3">
                {lands.filter(l => savedProgress.some(p => p.propertyId === l.id)).map(land => (
                  <div 
                    key={`saved-${land.id}`} 
                    onClick={() => handleSelectLand(land)}
                    className={`bg-white rounded-2xl p-5 cursor-pointer border-2 transition-all shadow-sm ${selectedLand?.id === land.id ? 'border-[#c8e639]' : 'border-transparent hover:border-[#1b2620]/10'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-[#1b2620]">{land.title}</h3>
                      <span className="text-xs font-extrabold bg-[#1b2620] text-[#c8e639] px-2 py-1 rounded">Draft</span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> {land.location}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">All Lands</h2>
            <div className="flex flex-col gap-3">
              {lands.map((land) => (
                <div 
                  key={land.id} 
                  onClick={() => handleSelectLand(land)}
                  className={`bg-white rounded-2xl p-5 cursor-pointer border-2 transition-all shadow-sm ${selectedLand?.id === land.id ? 'border-[#c8e639]' : 'border-transparent hover:border-[#1b2620]/10'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[#1b2620]">{land.title}</h3>
                    <span className="text-xs font-extrabold bg-[#1b2620] text-[#c8e639] px-2 py-1 rounded">ID: {land.id}</span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-4"><MapPin size={12}/> {land.location}</p>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                    <span>NPK: <span className="text-[#1b2620]">{land.telemetry.npkIndex}</span></span>
                    <span>💧 <span className="text-[#1b2620]">{land.telemetry.moisturePct}%</span></span>
                    <span>🌡️ <span className="text-[#1b2620]">{land.telemetry.tempCelsius}°C</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          {selectedLand ? (
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-3xl font-extrabold text-[#1b2620] mb-2">{selectedLand.title}</h2>
              <p className="text-gray-500 mb-8">{selectedLand.location}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-[#f7f9f2] p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-gray-400 mb-1">NPK Index</span>
                  <span className="text-2xl font-black text-[#1b2620]">{selectedLand.telemetry.npkIndex}</span>
                </div>
                <div className="bg-[#f7f9f2] p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-gray-400 mb-1">Moisture</span>
                  <span className="text-2xl font-black text-[#1b2620]">{selectedLand.telemetry.moisturePct}%</span>
                </div>
                <div className="bg-[#f7f9f2] p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-gray-400 mb-1">Temp</span>
                  <span className="text-2xl font-black text-[#1b2620]">{selectedLand.telemetry.tempCelsius}°C</span>
                </div>
              </div>

              {!result ? (
                <div className="flex flex-col gap-6 animate-in fade-in">
                  <div>
                    <label className="block text-sm font-bold text-[#1b2620] mb-2">Agronomist Suggestions & Analysis</label>
                    <textarea 
                      value={suggestion} onChange={(e) => setSuggestion(e.target.value)}
                      className="w-full bg-[#f7f9f2] border border-gray-200 rounded-xl p-4 text-sm font-medium outline-none focus:border-[#1b2620] resize-none h-32"
                      placeholder="Enter your agricultural analysis..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsFlagged(!isFlagged)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all border ${isFlagged ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                    >
                      <Flag size={16} className={isFlagged ? "fill-red-600" : ""} />
                      {isFlagged ? "Flagged for Risks" : "Flag Issues"}
                    </button>
                    
                    <button 
                      onClick={handleSaveProgress} disabled={savingProgress || submitting}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-[#1b2620] border border-gray-200 py-2.5 rounded-lg text-sm font-extrabold hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                      {savingProgress ? <Loader2 size={16} className="animate-spin" /> : "Save Progress"}
                    </button>

                    <button 
                      onClick={handleValidate} disabled={submitting || savingProgress || !suggestion.trim()}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#1b2620] text-[#c8e639] py-2.5 rounded-lg text-sm font-extrabold hover:bg-black transition-all disabled:opacity-50"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Activity size={16} /> Submit Validation</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f0f4ec] rounded-2xl p-8 border border-[#c8e639]/30 text-center animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-[#c8e639] rounded-full flex items-center justify-center mx-auto mb-4 text-[#1b2620]">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-[#1b2620] mb-1">Validation Complete</h3>
                  <p className="text-gray-600 font-bold mb-6">Your analysis has been processed successfully.</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6 text-left">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <p className="text-xs font-bold text-gray-400 mb-1">Success Probability</p>
                      <p className="text-xl font-black text-[#1b2620]">{result.probabilityOfSuccess}%</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <p className="text-xs font-bold text-gray-400 mb-1">Success Range</p>
                      <p className="text-xl font-black text-[#1b2620]">{result.rangeOfSuccess}</p>
                    </div>
                    <div className="bg-[#1b2620] rounded-xl p-4 shadow-sm text-center">
                      <p className="text-xs font-bold text-white/60 mb-1">Credits Earned</p>
                      <p className="text-2xl font-black text-[#c8e639]">+{result.creditsEarned}</p>
                    </div>
                  </div>
                  
                  <button onClick={() => { setSelectedLand(null); setResult(null); fetchLands(); }} className="bg-white text-[#1b2620] border border-gray-200 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors">
                    Validate Another Land
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full bg-white rounded-3xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-bold p-10 text-center">
              Select a land parcel from the queue to begin your analysis and earn credits.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
