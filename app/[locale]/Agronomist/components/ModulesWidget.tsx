import React from "react";
import { Bug, RotateCcw, Calendar, Beaker, ArrowRight, Check } from "lucide-react";

const MODULES = [
  { id: "pest-prediction", label: "Pest Prediction", desc: "ML-based risk forecast", icon: Bug, color: "bg-red-50 text-red-500 border-red-100", ready: false },
  { id: "pest-control", label: "Pest Control", desc: "Treatment protocols", icon: Beaker, color: "bg-purple-50 text-purple-500 border-purple-100", ready: false },
  { id: "crop-calendar", label: "Crop Calendar", desc: "Growth stage tracker", icon: Calendar, color: "bg-amber-50 text-amber-500 border-amber-100", ready: false },
];

export function ModulesWidget() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Modules</h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Upcoming integrations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 flex-1">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <div key={mod.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm cursor-pointer ${mod.color}`}>
              <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
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
