import React from "react";
import { MapPin, MoreVertical, Eye } from "lucide-react";

const DEMO_FIELDS = [
  { id: "sundance-corn-estate", title: "Sundance Corn Estate", location: "Nebraska, USA", crop: "Corn", area: "150.5 ha", moisture: "44%", status: "active" },
  { id: "blue-ridge-orchard", title: "Blue Ridge Orchard", location: "Virginia, USA", crop: "Apples", area: "85.2 ha", moisture: "62%", status: "review" },
  { id: "golden-wheat-coop", title: "Golden Wheat Co-op", location: "Kansas, USA", crop: "Wheat", area: "320.0 ha", moisture: "38%", status: "active" },
  { id: "emerald-vineyards", title: "Emerald Vineyards", location: "California, USA", crop: "Grapes", area: "45.0 ha", moisture: "55%", status: "flagged" },
  { id: "dakota-soy-fields", title: "Dakota Soy Fields", location: "S. Dakota, USA", crop: "Soybeans", area: "210.8 ha", moisture: "41%", status: "active" },
  { id: "cascade-hops-farm", title: "Cascade Hops Farm", location: "Washington, USA", crop: "Hops", area: "78.3 ha", moisture: "58%", status: "active" },
  { id: "delta-rice-co", title: "Delta Rice Co.", location: "Arkansas, USA", crop: "Rice", area: "195.0 ha", moisture: "72%", status: "review" },
  { id: "peach-grove-ga", title: "Peach Grove", location: "Georgia, USA", crop: "Peaches", area: "62.5 ha", moisture: "49%", status: "active" },
];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-600 border-emerald-200",
  review: "bg-amber-50 text-amber-600 border-amber-200",
  flagged: "bg-red-50 text-red-500 border-red-200",
};

export function DataTableWidget({ lands, onSelectLand }: { lands: any[]; onSelectLand: (id: string) => void }) {
  const displayData = lands.length > 0 ? lands.map(l => ({
    id: l._id || l.id,
    title: l.title || l.id || l._id,
    location: (typeof l.location === 'object' && l.location?.coordinates) 
      ? `Lat: ${l.location.coordinates[1].toFixed(2)}, Lng: ${l.location.coordinates[0].toFixed(2)}` 
      : (l.location || "Unknown"),
    crop: l.crop || "Mixed",
    area: l.area || "N/A",
    moisture: l.telemetry?.moisturePct ? `${l.telemetry.moisturePct}%` : "N/A",
    status: l.status || "active",
  })) : DEMO_FIELDS;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Field Registry</h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">{displayData.length} monitored fields</p>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 -mx-2">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] text-gray-400 font-bold uppercase tracking-wider sticky top-0 bg-white">
            <tr>
              <th className="pb-3 px-2">Field</th>
              <th className="pb-3 px-2">Crop</th>
              <th className="pb-3 px-2">Area</th>
              <th className="pb-3 px-2">Moisture</th>
              <th className="pb-3 px-2">Status</th>
              <th className="pb-3 px-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((field, idx) => (
              <tr key={field.id || field._id || idx} onClick={() => onSelectLand(field.id || field._id)} className="border-b border-gray-50 hover:bg-[#f8fdf6] transition-colors cursor-pointer group">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                      <MapPin size={12} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{field.title}</p>
                      <p className="text-[10px] text-gray-400">{field.location}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 font-semibold text-gray-700 text-xs">{field.crop}</td>
                <td className="py-3 px-2 font-semibold text-gray-700 text-xs">{field.area}</td>
                <td className="py-3 px-2 font-bold text-gray-900 text-xs">{field.moisture}</td>
                <td className="py-3 px-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLES[field.status] || STATUS_STYLES.active}`}>{field.status}</span>
                </td>
                <td className="py-3 px-2">
                  <button className="text-gray-300 group-hover:text-gray-600 transition">
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
