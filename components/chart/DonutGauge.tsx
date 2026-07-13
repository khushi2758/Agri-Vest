import React from "react";

interface DonutGaugeProps {
  score: number;
  label: string;
  sublabel: string;
}

export default function DonutGauge({ score, label, sublabel }: DonutGaugeProps) {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center shadow-sm w-full h-full">
      <h3 className="text-sm font-extrabold text-[#1b2620] mb-4 self-start">{label}</h3>
      <div className="relative flex items-center justify-center w-40 h-40">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="#ef4444"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={circumference + " " + circumference}
            className="opacity-20"
          />
          <circle
            stroke="#c8e639"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-neutral-400">{sublabel}</span>
          <span className="text-3xl font-extrabold text-[#1b2620]">{score}%</span>
        </div>
      </div>
      <div className="flex justify-between w-full mt-4 px-4">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Success</span>
          <span className="text-sm font-extrabold text-[#c8e639]">{score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Risk</span>
          <span className="text-sm font-extrabold text-red-500">{100 - score}</span>
        </div>
      </div>
    </div>
  );
}
