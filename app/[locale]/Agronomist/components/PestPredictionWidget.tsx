"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bug, ShieldAlert, Clock, Zap, Activity, Thermometer, Droplets, Leaf, AlertTriangle, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

interface PestResult {
  pestName: string;
  displayName: string;
  priority: string;
  riskScore: number;
  riskLevel: string;
  probability: number;
  timingDays: number;
  action: string;
  factors: {
    temp: number;
    humidity: number;
    host: boolean;
    soil: boolean;
    stage: boolean;
  };
}

interface PestPredictionData {
  overallRisk: number;
  overallLevel: string;
  predictions: PestResult[];
  analyzedAt: string;
  inputs: {
    temp: number;
    humidity: number;
    windSpeed: number;
    cropType: string;
    soilType: string;
  };
}

const RC: Record<string, { t: string; bg: string; br: string; bar: string; glow: string }> = {
  low: { t: "text-emerald-600", bg: "bg-emerald-50", br: "border-emerald-200", bar: "bg-emerald-500", glow: "shadow-emerald-200/40" },
  moderate: { t: "text-amber-600", bg: "bg-amber-50", br: "border-amber-200", bar: "bg-amber-500", glow: "shadow-amber-200/40" },
  high: { t: "text-orange-600", bg: "bg-orange-50", br: "border-orange-200", bar: "bg-orange-500", glow: "shadow-orange-200/40" },
  critical: { t: "text-red-600", bg: "bg-red-50", br: "border-red-200", bar: "bg-red-500", glow: "shadow-red-200/40" },
};

function RiskIcon({ level, size = 14 }: { level: string; size?: number }) {
  if (level === "low") return <CheckCircle2 size={size} className="text-emerald-500" />;
  if (level === "moderate") return <AlertTriangle size={size} className="text-amber-500" />;
  if (level === "high") return <ShieldAlert size={size} className="text-orange-500" />;
  return <XCircle size={size} className="text-red-500" />;
}

function RiskGauge({ value, level }: { value: number; level: string }) {
  const c = RC[level] || RC.low;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-[88px] h-[88px] shrink-0">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r="36" fill="none" stroke="#f3f4f6" strokeWidth="7" />
        <circle
          cx="44" cy="44" r="36" fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${c.t} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-xl font-black ${c.t} leading-none`}>{value}</span>
        <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Risk %</span>
      </div>
    </div>
  );
}

export function PestPredictionWidget({
  land,
  weatherData
}: {
  land: any;
  weatherData: any;
}) {
  const [data, setData] = useState<PestPredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePest, setActivePest] = useState<string | null>(null);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!land || !weatherData) return;

    const cropType = land.crop || "wheat";
    const soilType = land.soil_type || "loamy";
    const temp = weatherData.tempCelsius || 25;
    const humidity = weatherData.moisturePct || 60;
    const windSpeed = weatherData.windSpeed || 10;

    setLoading(true);
    setError("");
    setActivePest(null);

    fetch(`/api/agronomist/pest-prediction?temp=${temp}&humidity=${humidity}&windSpeed=${windSpeed}&crop=${encodeURIComponent(cropType)}&soil=${encodeURIComponent(soilType)}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(result => {
        setData(result);
        if (result.predictions?.length > 0) {
          setActivePest(result.predictions[0].pestName);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to run prediction");
        setLoading(false);
      });
  }, [land?.id, land?._id, weatherData?.tempCelsius]);

  if (!land) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
          <Bug size={16} className="text-gray-300" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-400">Pest Risk Forecast</p>
          <p className="text-[11px] text-gray-300 font-medium">Select a land to analyze</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-red-400 rounded-full animate-spin" />
        <div>
          <p className="text-sm font-bold text-gray-500">Analyzing pest risk...</p>
          <p className="text-[11px] text-gray-400 font-medium">Processing weather × soil × crop stage</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-3">
        <AlertTriangle size={18} className="text-amber-400" />
        <p className="text-sm font-bold text-gray-500">{error || "No data"}</p>
      </div>
    );
  }

  const oc = RC[data.overallLevel] || RC.low;
  const active = data.predictions.find(p => p.pestName === activePest);
  const activeC = active ? (RC[active.riskLevel] || RC.low) : RC.low;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-[280px] border-b lg:border-b-0 lg:border-r border-gray-100 p-5 flex flex-col">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
              <Bug size={14} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 leading-tight">Pest Forecast</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-gray-400 font-bold">Live • {data.predictions.length} threats</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <RiskGauge value={data.overallRisk} level={data.overallLevel} />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Thermometer size={11} className="text-gray-400" />
                <span className="text-[11px] font-bold text-gray-600">{data.inputs.temp}°C</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Droplets size={11} className="text-gray-400" />
                <span className="text-[11px] font-bold text-gray-600">{data.inputs.humidity}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf size={11} className="text-gray-400" />
                <span className="text-[11px] font-bold text-gray-600 capitalize">{data.inputs.cropType}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity size={11} className="text-gray-400" />
                <span className="text-[11px] font-bold text-gray-600 capitalize">{data.inputs.soilType}</span>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-1 overflow-y-auto max-h-[180px] lg:max-h-[160px] pr-1 -mr-1">
            {data.predictions.map((pest) => {
              const c = RC[pest.riskLevel] || RC.low;
              const isActive = activePest === pest.pestName;
              return (
                <button
                  key={pest.pestName}
                  onClick={() => setActivePest(pest.pestName)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200 group ${isActive ? `${c.bg} border ${c.br}` : "hover:bg-gray-50 border border-transparent"}`}
                >
                  <RiskIcon level={pest.riskLevel} size={13} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-black truncate ${isActive ? c.t : "text-gray-700"}`}>{pest.displayName}</p>
                    <div className="w-full h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${c.bar}`} style={{ width: `${pest.riskScore}%` }} />
                    </div>
                  </div>
                  <span className={`text-[11px] font-black shrink-0 ${c.t}`}>{pest.riskScore}%</span>
                  {isActive && <ChevronRight size={12} className={c.t} />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 p-5 flex flex-col">
          {active ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${activeC.bg} border ${activeC.br} flex items-center justify-center`}>
                    <RiskIcon level={active.riskLevel} size={13} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{active.displayName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${activeC.bg} ${activeC.t}`}>{active.riskLevel}</span>
                      {active.priority === "critical" && <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-red-100 text-red-600">Priority</span>}
                      <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Clock size={10} /> {active.timingDays > 90 ? "90+" : active.timingDays}d window</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${activeC.t} leading-none`}>{active.riskScore}%</p>
                  <p className="text-[9px] text-gray-400 font-bold mt-0.5">RISK SCORE</p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-4">
                {[
                  { label: "Temp", value: `${active.factors.temp}%`, icon: Thermometer, hot: active.factors.temp >= 70, color: "text-red-400" },
                  { label: "Humidity", value: `${active.factors.humidity}%`, icon: Droplets, hot: active.factors.humidity >= 70, color: "text-blue-400" },
                  { label: "Host", value: active.factors.host ? "✓" : "✗", icon: Leaf, hot: active.factors.host, color: "text-emerald-500" },
                  { label: "Soil", value: active.factors.soil ? "✓" : "✗", icon: Activity, hot: active.factors.soil, color: "text-amber-500" },
                  { label: "Stage", value: active.factors.stage ? "⚠" : "✓", icon: Zap, hot: active.factors.stage, color: "text-red-500" },
                ].map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="flex flex-col items-center p-2 rounded-xl bg-gray-50/80 border border-gray-100">
                      <Icon size={13} className={f.hot ? f.color : "text-gray-300"} />
                      <span className={`text-sm font-black mt-1 ${f.hot ? "text-gray-800" : "text-gray-400"}`}>{f.value}</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase">{f.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className={`flex items-start gap-2.5 p-3 rounded-xl ${activeC.bg} border ${activeC.br}`}>
                <Zap size={14} className={`${activeC.t} mt-0.5 shrink-0`} />
                <div>
                  <p className={`text-[11px] font-black ${activeC.t}`}>Action Required</p>
                  <p className="text-[11px] text-gray-700 font-medium mt-0.5 leading-relaxed">{active.action}</p>
                </div>
              </div>

              <div className="mt-auto pt-3 flex items-center justify-between">
                <p className="text-[9px] text-gray-400 font-medium">Analyzed {new Date(data.analyzedAt).toLocaleTimeString()}</p>
                <div className="flex gap-1">
                  {data.predictions.map((p) => {
                    const pc = RC[p.riskLevel] || RC.low;
                    return (
                      <button
                        key={p.pestName}
                        onClick={() => setActivePest(p.pestName)}
                        title={p.displayName}
                        className={`w-2 h-2 rounded-full transition-all ${activePest === p.pestName ? `${pc.bar} scale-125` : "bg-gray-200 hover:bg-gray-300"}`}
                      />
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <CheckCircle2 size={28} className="text-emerald-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-400">No pest threats detected</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
