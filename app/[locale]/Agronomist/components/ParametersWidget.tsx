"use client";
import React from "react";
import { ArrowUpRight } from "lucide-react";

interface IndexGraphProps {
  tempCelsius: number;
  moisturePct: number;
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

      /* dark variant: tinted water glass, same optics as the light cards, dimmer highlights */
      .water-glass-dark {
        
        
        -webkit-backdrop-filter: blur(20px) saturate(160%);
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.18),
          inset 0 -14px 22px -16px rgba(255, 255, 255, 0.08),
          0 10px 28px rgba(0, 0, 0, 0.3);
      }

      /* diagonal refraction sheen, static (no animation, no color glow) */
      .water-glass-card::before {
        content: "";
        position: absolute;
        top: -65%;
        left: -25%;
        width: 50%;
        height: 230%;
        pointer-events: none;
        z-index: 0;
      }
      .water-glass-dark::before {
       
        transform: rotate(12deg);
      }

      /* small droplet highlight, bottom-right, like a bead of water catching light */
      .water-glass-card::after {
        content: "";
        position: absolute;
        bottom: 12px;
        right: 16px;
        width: 16px;
        height: 16px;
        border-radius: 9999px;
        background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.03) 70%);
        pointer-events: none;
        z-index: 0;
      }

      @media (prefers-reduced-motion: reduce) {
        .water-glass-card { transition: none !important; }
      }
    `}</style>
  );
}

function MiniGauge({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-bold text-white/50 uppercase tracking-wider">{label}</span>
        <span className="text-lg font-black text-white">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 w-full bg-white rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color }}></div>
      </div>
    </div>
  );
}

export function ParametersWidget({ tempCelsius, moisturePct }: IndexGraphProps) {
  const gdd = Math.max(0, tempCelsius - 10);
  const svp = 0.6108 * Math.exp((17.27 * tempCelsius) / (tempCelsius + 237.3));
  const avp = svp * (moisturePct / 100);
  const vpd = parseFloat((svp - avp).toFixed(2));
  const thi = parseFloat((0.8 * tempCelsius + (moisturePct / 100) * (tempCelsius - 14.4) + 46.4).toFixed(1));
  const hsi = tempCelsius > 30 ? 1.0 : tempCelsius > 25 ? 0.5 : 0.0;

  return (
    <div className="water-glass-card water-glass-dark rounded-2xl p-6 h-full flex flex-col justify-between text-white transition-all hover:shadow-lg">
      <WaterGlassStyles />
      <div>
        <div className="flex justify-between items-start mb-1">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Agronomic Indices</p>
          <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-0.5"><ArrowUpRight size={10} />Live</span>
        </div>
        <p className="text-4xl font-black mb-1">{gdd.toFixed(1)} <span className="text-lg font-bold text-white/30">GDD</span></p>
        <p className="text-emerald-400 text-xs font-bold mb-6">Growing Degree Days</p>
      </div>

      <div className="flex flex-col gap-4">
        <MiniGauge value={vpd} max={3} label="VPD" color="linear-gradient(90deg, #22c55e, #86efac)" />
        <MiniGauge value={thi} max={100} label="THI" color="linear-gradient(90deg, #f59e0b, #fbbf24)" />
        <MiniGauge value={hsi} max={1} label="HSI" color={hsi > 0.5 ? "linear-gradient(90deg, #ef4444, #f87171)" : "linear-gradient(90deg, #22c55e, #86efac)"} />
      </div>
    </div>
  );
}