import React from "react";

interface PerformanceTableProps {
  data: any[];
}

export default function PerformanceTable({ data }: PerformanceTableProps) {
  const recentData = data.slice(-5).reverse();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col shadow-sm h-full overflow-hidden">
      <h3 className="text-sm font-extrabold text-[#1b2620] mb-4 uppercase tracking-widest">Performance Details</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] uppercase tracking-widest text-neutral-400">
              <th className="pb-3 font-bold">Date</th>
              <th className="pb-3 font-bold">Soil Score</th>
              <th className="pb-3 font-bold">Efficiency</th>
              <th className="pb-3 font-bold">Yield (%)</th>
              <th className="pb-3 font-bold">Close Price</th>
            </tr>
          </thead>
          <tbody>
            {recentData.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-3 text-xs font-bold font-mono text-neutral-500">{row.date}</td>
                <td className="py-3 text-xs font-extrabold text-[#c8e639]">{row.metrics?.soil_score || 85}</td>
                <td className="py-3 text-xs font-bold text-neutral-600">{row.metrics?.efficiency || 90}%</td>
                <td className="py-3 text-xs font-bold text-[#8da514]">{row.metrics?.yield_pct || 98}%</td>
                <td className="py-3 text-xs font-extrabold font-mono text-[#1b2620]">{row.close.toFixed(2)} AGV</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
