import React from "react";
import { ChevronLeft, ChevronRight, Activity } from "lucide-react";

interface FieldsWidgetProps {
  onSelectLand: (landId: string) => void;
}

export function FieldsWidget({ onSelectLand }: FieldsWidgetProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Fields</h2>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-gray-400 hover:text-gray-600">See all</button>
          <div className="flex gap-2 text-gray-500">
            <ChevronLeft size={16} />
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Corn field */}
        <div className="cursor-pointer group" onClick={() => onSelectLand("corn-field")}>
          <div className="w-full h-44 rounded-3xl mb-3 relative overflow-hidden transition-transform group-hover:scale-[1.02] bg-[#ffe0b2] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-2">
            <svg className="w-full h-full opacity-80" viewBox="0 0 400 200" preserveAspectRatio="none">
              <path d="M50,150 L150,50 L250,60 L300,180 Z" fill="#ffcc80" stroke="#fff" strokeWidth="2" />
              <path d="M150,50 L350,20 L300,180" fill="#ffe0b2" stroke="#fff" strokeWidth="2" />
              <path d="M50,150 L10,50" fill="none" stroke="#fff" strokeWidth="2" />
              <polygon points="120,70 240,80 260,160 140,150" fill="#ffb74d" stroke="#fff" strokeWidth="1" />
            </svg>
            <div className="absolute top-4 left-4 bg-white rounded-lg px-2 py-1 text-xs font-bold text-gray-900 flex items-center gap-1 shadow-sm">
              <Activity size={12} /> 0.17
            </div>
          </div>
          <div className="flex justify-between items-end px-1">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Corn field</h3>
              <p className="text-[11px] font-medium text-gray-400">Harvest on July 16</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-400 text-xs">Corn</span>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-1 justify-end"><Activity size={12} /> 11 ha</p>
            </div>
          </div>
        </div>

        {/* Wheat field */}
        <div className="cursor-pointer group" onClick={() => onSelectLand("wheat-field")}>
          <div className="w-full h-44 rounded-3xl mb-3 relative overflow-hidden transition-transform group-hover:scale-[1.02] bg-[#c8e6c9] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-2">
            <svg className="w-full h-full opacity-80" viewBox="0 0 400 200" preserveAspectRatio="none">
              <path d="M20,180 L100,20 L250,40 L350,160 Z" fill="#a5d6a7" stroke="#fff" strokeWidth="2" />
              <path d="M100,20 L300,10 L350,160" fill="#c8e6c9" stroke="#fff" strokeWidth="2" />
              <polygon points="120,40 220,60 260,140 140,120" fill="#81c784" stroke="#fff" strokeWidth="1" />
            </svg>
            <div className="absolute top-4 left-4 bg-white rounded-lg px-2 py-1 text-xs font-bold text-gray-900 flex items-center gap-1 shadow-sm">
              <Activity size={12} /> 0.15
            </div>
          </div>
          <div className="flex justify-between items-end px-1">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Wheat field</h3>
              <p className="text-[11px] font-medium text-gray-400">Harvest on May 23</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-400 text-xs">Wheat</span>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-1 justify-end"><Activity size={12} /> 20 ha</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
