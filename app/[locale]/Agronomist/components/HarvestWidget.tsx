import React from "react";

export function HarvestWidget() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Harvest</h2>
      <div className="bg-[#f8f9fa] rounded-3xl p-6 shadow-sm border border-gray-50">
        <div className="flex items-baseline gap-1 mb-8">
          <span className="text-4xl font-bold text-gray-900">15,4</span>
          <span className="text-sm font-semibold text-gray-500">t / 3m</span>
        </div>
        
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
              <span>Wheat</span>
              <span>6,4 t</span>
            </div>
            <div className="w-full bg-[#eaf5e9] rounded-full h-3">
              <div className="bg-[#81c784] h-3 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
              <span>Corn</span>
              <span>3,2 t</span>
            </div>
            <div className="w-full bg-[#eaf5e9] rounded-full h-3">
              <div className="bg-[#aed581] h-3 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
              <span>Tomato</span>
              <span>4,7 t</span>
            </div>
            <div className="w-full bg-[#eaf5e9] rounded-full h-3">
              <div className="bg-[#aed581] h-3 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
