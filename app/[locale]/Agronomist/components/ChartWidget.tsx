import React from "react";

const WEEKLY_DATA = [
  { label: "W1", values: [30, 45, 20] },
  { label: "W2", values: [40, 50, 35] },
  { label: "W3", values: [20, 30, 15] },
  { label: "W4", values: [55, 65, 40] },
  { label: "W5", values: [45, 55, 30] },
  { label: "W6", values: [70, 80, 60] },
  { label: "W7", values: [85, 90, 70] },
  { label: "W8", values: [60, 75, 50] },
];

export function ChartWidget() {
  const maxVal = 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Telemetry Trends</h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Weekly field sensor aggregation</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-bold text-gray-500">Moisture</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300"></span>
            <span className="text-[10px] font-bold text-gray-500">Temp</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span>
            <span className="text-[10px] font-bold text-gray-500">NPK</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-end gap-3 relative">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          {[100, 75, 50, 25, 0].map(v => (
            <div key={v} className="flex items-center gap-2 w-full">
              <span className="text-[10px] text-gray-300 font-mono w-6 text-right">{v}</span>
              <div className="flex-1 border-b border-dashed border-gray-100"></div>
            </div>
          ))}
        </div>

        {WEEKLY_DATA.map((week, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 z-10 group">
            <div className="flex items-end gap-0.5 w-full h-full" style={{ height: "100%" }}>
              {week.values.map((v, j) => (
                <div key={j} className="flex-1 flex flex-col justify-end h-full pb-6">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-500 group-hover:opacity-100 ${j === 0 ? "bg-emerald-500" : j === 1 ? "bg-emerald-300" : "bg-gray-200"}`}
                    style={{ height: `${(v / maxVal) * 100}%`, opacity: 0.85 }}
                  ></div>
                </div>
              ))}
            </div>
            <span className="text-[10px] font-bold text-gray-400">{week.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
