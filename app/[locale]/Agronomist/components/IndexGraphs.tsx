"use client";
import React from "react";

const SPARK_DATA = [
  { label: "Vegetation Index", value: "0.82", data: [40, 42, 38, 45, 50, 55, 60, 58, 65, 70, 75, 82], trend: "+8.2%", positive: true },
  { label: "Soil Health Score", value: "74.5", data: [60, 62, 58, 65, 70, 68, 72, 70, 75, 72, 74, 74], trend: "+3.1%", positive: true },
  { label: "Water Use Efficiency", value: "0.91", data: [80, 78, 82, 85, 83, 88, 86, 90, 88, 92, 90, 91], trend: "+1.2%", positive: true },
];

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

      /* small droplet highlight, bottom-right, like a bead of water catching light */
      .water-glass-card::after {
        content: "";
        position: absolute;
        bottom: 10px;
        right: 14px;
        width: 16px;
        height: 16px;
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

function SparkLine({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 40;
  const w = 120;
  const step = w / (data.length - 1);

  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${positive ? "pos" : "neg"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? "#22c55e" : "#ef4444"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={positive ? "#22c55e" : "#ef4444"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${points} ${w},${h}`} fill={`url(#spark-${positive ? "pos" : "neg"})`} />
      <polyline points={points} fill="none" stroke={positive ? "#22c55e" : "#ef4444"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IndexGraphs() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <WaterGlassStyles />
      {SPARK_DATA.map((item) => (
        <div key={item.label} className="water-glass-card water-glass-light rounded-2xl p-5 flex items-center justify-between gap-4 transition-all hover:scale-[1.02] hover:shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-2xl font-black text-gray-900">{item.value}</p>
            <p className={`text-[11px] font-bold mt-0.5 ${item.positive ? "text-emerald-500" : "text-red-400"}`}>{item.trend} this month</p>
          </div>
          <SparkLine data={item.data} positive={item.positive} />
        </div>
      ))}
    </div>
  );
}