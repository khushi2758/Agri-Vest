"use client";
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

function WaterGlassStyles() {
  return (
    <style jsx global>{`
      .water-glass-card {
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }
      .water-glass-card > * {
        position: relative;
        z-index: 1;
      }

      /* light variant: clear water-drop glass */
      .water-glass-light {
        background: rgba(255, 255, 255, 0.28);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.65);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.8),
          inset 0 -14px 22px -16px rgba(255, 255, 255, 0.4),
          0 10px 28px rgba(30, 50, 40, 0.10);
      }

      /* dark variant: tinted water glass over the dark card, same optics, dimmer */
      .water-glass-dark {
        background: rgba(20, 26, 18, 0.45);
        backdrop-filter: blur(20px) saturate(160%);
        -webkit-backdrop-filter: blur(20px) saturate(160%);
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.18),
          inset 0 -14px 22px -16px rgba(255, 255, 255, 0.08),
          0 10px 28px rgba(0, 0, 0, 0.25);
      }

      /* diagonal refraction sheen, static (no animation, no color glow) */
      .water-glass-card::before {
        content: "";
        position: absolute;
        top: -65%;
        left: -25%;
        width: 50%;
        height: 230%;
        background: linear-gradient(
          115deg,
          rgba(255, 255, 255, 0.55) 0%,
          rgba(255, 255, 255, 0.15) 45%,
          rgba(255, 255, 255, 0) 75%
        );
        transform: rotate(12deg);
        pointer-events: none;
        z-index: 0;
      }
      .water-glass-dark::before {
        background: linear-gradient(
          115deg,
          rgba(255, 255, 255, 0.16) 0%,
          rgba(255, 255, 255, 0.05) 45%,
          rgba(255, 255, 255, 0) 75%
        );
      }

      /* small droplet highlight, bottom-right, like a bead of water catching light */
      .water-glass-card::after {
        content: "";
        position: absolute;
        bottom: 10px;
        right: 14px;
        width: 18px;
        height: 18px;
        border-radius: 9999px;
        background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.05) 70%);
        pointer-events: none;
        z-index: 0;
      }

      @media (prefers-reduced-motion: reduce) {
        .water-glass-card { transition: none !important; }
      }
    `}</style>
  );
}

function MetricCard({ label, value, unit, change, positive, icon, variant = "light" }: MetricCardProps) {
  const isDark = variant === "dark";
  return (
    <div
      className={`water-glass-card ${isDark ? "water-glass-dark" : "water-glass-light"} rounded-2xl p-5 flex flex-col justify-between min-h-35 transition-all hover:scale-[1.02] hover:shadow-lg`}
    >
      <div className="flex justify-between items-start">
        <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white/50" : "text-gray-500"}`}>{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? "bg-white/10" : "bg-white/40 border border-white/50"}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-3xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>{value}<span className={`text-sm font-medium ml-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>{unit}</span></p>
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
      <WaterGlassStyles />
      <MetricCard label="Temperature" value={`${temp.toFixed(1)}`} unit="°C" change="2.1% from yesterday" positive={temp < 35} icon={<Thermometer size={16} className="text-emerald-500" />} variant="dark" />
      <MetricCard label="Humidity" value={`${moisture}`} unit="% RH" change="Optimal range" positive={true} icon={<Droplets size={16} className="text-emerald-500" />} />
      <MetricCard label="Wind Speed" value={`${wind.toFixed(1)}`} unit="km/h" change="Mild conditions" positive={wind < 20} icon={<Wind size={16} className="text-emerald-500" />} />
      <MetricCard label="Soil NPK" value="0.17" unit="idx" change="Balanced nutrients" positive={true} icon={<Gauge size={16} className="text-emerald-500" />} />
    </div>
  );
}