import React from "react";
import { ArrowUpRight } from "lucide-react";

interface IndexGraphProps {
  tempCelsius: number;
  moisturePct: number;
}

function MiniGauge({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
        <span className="text-lg font-black text-gray-900">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
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
    <div className="bg-[#1a1f16] rounded-2xl p-6 h-full flex flex-col justify-between text-white">
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
