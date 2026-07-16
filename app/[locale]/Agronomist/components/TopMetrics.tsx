import React from "react";
import { ArrowUpRight, ArrowDownRight, Droplets, Thermometer, Wind, Gauge } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  variant?: "dark" | "light";
}

function MetricCard({ label, value, unit, change, positive, icon, variant = "light" }: MetricCardProps) {
  const isDark = variant === "dark";
  return (
    <div className={`rounded-2xl p-5 flex flex-col justify-between min-h-35 transition-all hover:scale-[1.02] ${isDark ? "bg-[#1a1f16] text-white" : "bg-white border border-gray-100 shadow-sm"}`}>
      <div className="flex justify-between items-start">
        <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white/50" : "text-gray-400"}`}>{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? "bg-white/10" : "bg-[#eaf5e9]"}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-3xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>{value}<span className={`text-sm font-medium ml-1 ${isDark ? "text-white/40" : "text-gray-400"}`}>{unit}</span></p>
        <p className={`text-[11px] font-bold flex items-center gap-1 mt-1 ${positive ? "text-emerald-500" : "text-red-400"}`}>
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {change}
        </p>
      </div>
    </div>
  );
}

export function TopMetrics({ weatherData }: { weatherData: any }) {
  const temp = weatherData?.tempCelsius ?? 24;
  const moisture = weatherData?.moisturePct ?? 44;
  const wind = weatherData?.windSpeed ?? 12;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard label="Temperature" value={`${temp.toFixed(1)}`} unit="°C" change="2.1% from yesterday" positive={temp < 35} icon={<Thermometer size={16} className="text-emerald-500" />} variant="dark" />
      <MetricCard label="Humidity" value={`${moisture}`} unit="% RH" change="Optimal range" positive={true} icon={<Droplets size={16} className="text-emerald-500" />} />
      <MetricCard label="Wind Speed" value={`${wind.toFixed(1)}`} unit="km/h" change="Mild conditions" positive={wind < 20} icon={<Wind size={16} className="text-emerald-500" />} />
      <MetricCard label="Soil NPK" value="0.17" unit="idx" change="Balanced nutrients" positive={true} icon={<Gauge size={16} className="text-emerald-500" />} />
    </div>
  );
}
