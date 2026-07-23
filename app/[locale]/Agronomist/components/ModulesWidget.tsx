"use client";
import React from "react";
import { Bug, RotateCcw, Calendar, Beaker, ArrowRight, Check } from "lucide-react";

const MODULES = [
  { id: "pest-prediction", label: "Pest Prediction", desc: "ML-based risk forecast", icon: Bug, color: "bg-red-500/10 text-red-600 border-red-300/40", ready: false },
  { id: "pest-control", label: "Pest Control", desc: "Treatment protocols", icon: Beaker, color: "bg-purple-500/10 text-purple-600 border-purple-300/40", ready: false },
  { id: "crop-calendar", label: "Crop Calendar", desc: "Growth stage tracker", icon: Calendar, color: "bg-amber-500/10 text-amber-600 border-amber-300/40", ready: false },
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
        bottom: 10px;
        right: 12px;
        width: 14px;
        height: 14px;
        border-radius: 9999px;
        background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.05) 70%);
        pointer-events: none;
        z-index: 0;
      }

      /* tinted glass chip: same optics as the light card, translucent brand-color wash instead of white */
      .water-glass-chip {
        position: relative;
        overflow: hidden;
        isolation: isolate;
        backdrop-filter: blur(14px) saturate(160%);
        -webkit-backdrop-filter: blur(14px) saturate(160%);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.5),
          inset 0 -10px 16px -12px rgba(255, 255, 255, 0.3);
      }
      .water-glass-chip > * {
        position: relative;
        z-index: 1;
      }
      .water-glass-chip::before {
        content: "";
        position: absolute;
        top: -70%;
        left: -20%;
        width: 40%;
        height: 240%;
        background: linear-gradient(
          115deg,
          rgba(255, 255, 255, 0.45) 0%,
          rgba(255, 255, 255, 0.1) 45%,
          rgba(255, 255, 255, 0) 75%
        );
        transform: rotate(12deg);
        pointer-events: none;
        z-index: 0;
      }

      @media (prefers-reduced-motion: reduce) {
        .water-glass-card, .water-glass-chip { transition: none !important; }
      }
    `}</style>
  );
}

export function ModulesWidget() {
  return (
    <div className="water-glass-card water-glass-light rounded-2xl p-6 h-full flex flex-col transition-all hover:shadow-lg">
      <WaterGlassStyles />
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Modules</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Upcoming integrations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 flex-1">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <div key={mod.id} className={`water-glass-chip flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md cursor-pointer ${mod.color}`}>
              <div className="w-9 h-9 rounded-lg bg-white/50 border border-white/60 flex items-center justify-center">
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{mod.label}</p>
                <p className="text-[10px] opacity-70 font-medium">{mod.desc}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {mod.ready ? (
                  <>
                    <span className="text-[10px] font-bold text-emerald-600">Active</span>
                    <Check size={12} className="text-emerald-600" />
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-bold opacity-50">Coming Soon</span>
                    <ArrowRight size={12} className="opacity-30" />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}