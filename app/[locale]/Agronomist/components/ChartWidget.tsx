"use client";
import React from "react";

const WEEKLY_DATA = [
  { label: "W1", values: [30, 45, 20] },
  { label: "W2", values: [40, 50, 35] },
  { label: "W3", values: [20, 30, 15] },
  { label: "W4", values: [55, 65, 40] },
  { label: "W5", values: [45, 55, 30] },
  { label: "W6", values: [70, 80, 60] },
  { label: "W7", values: [85, 90, 70] },
  { label: "W8", values: [60, 75, 50] },
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
        width: 45%;
        height: 230%;
        background: linear-gradient(
          115deg,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.14) 45%,
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
        bottom: 12px;
        right: 16px;
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

export function ChartWidget() {
  const maxVal = 100;

  return (
    <div className="water-glass-card water-glass-light rounded-2xl p-6 h-full flex flex-col transition-all hover:shadow-lg">
      <WaterGlassStyles />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Telemetry Trends</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Weekly field sensor aggregation</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-bold text-gray-500">Moisture</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300"></span>
            <span className="text-[10px] font-bold text-gray-500">Temp</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
            <span className="text-[10px] font-bold text-gray-500">NPK</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-end gap-3 relative">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          {[100, 75, 50, 25, 0].map(v => (
            <div key={v} className="flex items-center gap-2 w-full">
              <span className="text-[10px] text-gray-400 font-mono w-6 text-right">{v}</span>
              <div className="flex-1 border-b border-dashed border-black/10"></div>
            </div>
          ))}
        </div>

        {WEEKLY_DATA.map((week, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 z-10 group">
            <div className="flex items-end gap-0.5 w-full h-full" style={{ height: "100%" }}>
              {week.values.map((v, j) => (
                <div key={j} className="flex-1 flex flex-col justify-end h-full pb-6">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-500 group-hover:opacity-100 ${j === 0 ? "bg-emerald-500" : j === 1 ? "bg-emerald-300" : "bg-gray-300"}`}
                    style={{ height: `${(v / maxVal) * 100}%`, opacity: 0.85 }}
                  ></div>
                </div>
              ))}
            </div>
            <span className="text-[10px] font-bold text-gray-400">{week.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}