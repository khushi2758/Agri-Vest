import React from "react";
import { Leaf, Activity } from "lucide-react";

export function TasksWidget() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Upcoming tasks</h2>
        <button className="text-sm font-medium text-gray-400 hover:text-gray-600">See all</button>
      </div>
      <div className="flex flex-col gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#f1f8e9] flex items-center justify-center text-[#81c784]">
              <Leaf size={24} />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-900 text-sm">Harvesting</h3>
              <p className="text-xs font-medium text-gray-400">Wheat field</p>
              <p className="text-xs font-bold text-gray-900 mt-1">May 28</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-[#f57c00] bg-[#fff3e0] px-3 py-1.5 rounded-md">2d delay</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#f1f8e9] flex items-center justify-center text-[#81c784]">
              <Activity size={24} />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-900 text-sm">Treatment</h3>
              <p className="text-xs font-medium text-gray-400">Corn field</p>
              <p className="text-xs font-bold text-gray-900 mt-1">May 29</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-[#f57c00] bg-[#fff3e0] px-3 py-1.5 rounded-md">1d delay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
