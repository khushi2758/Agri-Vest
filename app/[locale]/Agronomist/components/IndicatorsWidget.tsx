import React from "react";
import { Activity, CloudRain, Wind, Droplets } from "lucide-react";

interface IndicatorsWidgetProps {
  tempCelsius: number;
  moisturePct: number;
}

export function IndicatorsWidget({ tempCelsius, moisturePct }: IndicatorsWidgetProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Indicators</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#f8f9fa] rounded-3xl p-5 shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-6">
            <span className="font-semibold text-gray-700">Sensors</span>
            <Activity size={18} className="text-gray-400" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">8</span>
              <span className="text-sm font-medium text-gray-500">Online</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">2</span>
              <span className="text-sm font-medium text-gray-500">Low battery</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">0</span>
              <span className="text-sm font-medium text-gray-500">Offline</span>
            </div>
          </div>
        </div>

        <div className="bg-[#eaf5e9] rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-700">Weather</span>
            <CloudRain size={18} className="text-gray-500" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-6">{tempCelsius}°C</div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Wind size={16} /> 16 km/h
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Droplets size={16} /> {moisturePct}%
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <CloudRain size={16} /> 0 mm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
