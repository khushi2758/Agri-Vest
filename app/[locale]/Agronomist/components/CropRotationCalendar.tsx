"use client";
import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Sprout, AlertTriangle, Check, RotateCcw, Leaf } from "lucide-react";
import cropDatabaseData from "../data/cropDatabase.json";

const CROP_FAMILIES: Record<string, { name: string; color: string; bg: string; border: string }> = {
  legume: { name: "Legumes", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  cereal: { name: "Cereals", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  nightshade: { name: "Nightshades", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  brassica: { name: "Brassicas", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  cucurbit: { name: "Cucurbits", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  root: { name: "Root Crops", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  allium: { name: "Alliums", color: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200" },
  cover: { name: "Cover Crop", color: "text-teal-700", bg: "bg-teal-50", border: "border-teal-200" },
};

interface CropDef {
  id: string;
  name: string;
  family: string;
  daysToMaturity: number;
  plantMonths: number[];
  harvestMonths: number[];
  nitrogenEffect: number;
  soilHealthScore: number;
  incompatibleFamilies: string[];
}

const CROP_DATABASE: CropDef[] = cropDatabaseData as CropDef[];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface RotationSlot {
  cropId: string;
  startMonth: number;
  endMonth: number;
  year: number;
}

function calculateRotationHealth(slots: RotationSlot[]): { score: number; warnings: string[] } {
  const warnings: string[] = [];
  let totalNitrogen = 0;
  let totalSoilHealth = 0;

  for (let i = 0; i < slots.length; i++) {
    const crop = CROP_DATABASE.find((c) => c.id === slots[i].cropId);
    if (!crop) continue;

    totalNitrogen += crop.nitrogenEffect;
    totalSoilHealth += crop.soilHealthScore;

    if (i > 0) {
      const prevCrop = CROP_DATABASE.find((c) => c.id === slots[i - 1].cropId);
      if (prevCrop && crop.incompatibleFamilies.includes(prevCrop.family)) {
        warnings.push(`${crop.name} after ${prevCrop.name}: same family "${CROP_FAMILIES[prevCrop.family]?.name}" back-to-back reduces yield`);
      }
      if (prevCrop && prevCrop.family === crop.family) {
        warnings.push(`Consecutive ${CROP_FAMILIES[crop.family]?.name} increases pest pressure`);
      }
    }
  }

  if (totalNitrogen < -50) {
    warnings.push("Nitrogen deficit detected — consider adding a legume or cover crop");
  }

  const avgHealth = slots.length > 0 ? totalSoilHealth / slots.length : 0;
  const uniqueWarnings = [...new Set(warnings)];
  const penalty = uniqueWarnings.length * 10;
  const score = Math.max(0, Math.min(100, Math.round(avgHealth * 10 + (totalNitrogen > 0 ? 15 : 0) - penalty)));

  return { score, warnings: uniqueWarnings };
}

export function CropRotationCalendar() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [slots, setSlots] = useState<RotationSlot[]>([
    { cropId: "wheat", startMonth: 0, endMonth: 5, year: currentYear },
    { cropId: "soybean", startMonth: 5, endMonth: 9, year: currentYear },
    { cropId: "clover", startMonth: 9, endMonth: 11, year: currentYear },
  ]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [showCropPicker, setShowCropPicker] = useState(false);

  const health = useMemo(() => calculateRotationHealth(slots), [slots]);

  const getSlotForMonth = (month: number) => {
    return slots.find((s) => s.year === year && month >= s.startMonth && month <= s.endMonth);
  };

  const handleMonthClick = (month: number) => {
    setSelectedMonth(month);
    setShowCropPicker(true);
  };

  const handleAssignCrop = (cropId: string) => {
    if (selectedMonth === null) return;

    const crop = CROP_DATABASE.find((c) => c.id === cropId);
    if (!crop) return;

    const durationMonths = Math.ceil(crop.daysToMaturity / 30);
    const endMonth = Math.min(11, selectedMonth + durationMonths - 1);

    const filtered = slots.filter((s) => {
      if (s.year !== year) return true;
      return s.endMonth < selectedMonth || s.startMonth > endMonth;
    });

    filtered.push({ cropId, startMonth: selectedMonth, endMonth, year });
    filtered.sort((a, b) => a.startMonth - b.startMonth);

    setSlots(filtered);
    setShowCropPicker(false);
    setSelectedMonth(null);
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setSlots(slots.filter((s) => s.year !== year));
  };

  const scoreColor = health.score >= 70 ? "text-emerald-600" : health.score >= 40 ? "text-amber-500" : "text-red-500";
  const scoreBg = health.score >= 70 ? "bg-emerald-50 border-emerald-200" : health.score >= 40 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <RotateCcw size={18} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Crop Rotation Planner</h3>
              <p className="text-xs text-gray-400 font-medium">Click any month to assign a crop — rotation health is calculated automatically</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${scoreBg}`}>
              <Leaf size={14} className={scoreColor} />
              <span className={`text-sm font-black ${scoreColor}`}>{health.score}/100</span>
              <span className="text-[10px] font-bold text-gray-400">Rotation Score</span>
            </div>

            <div className="flex items-center gap-1 bg-gray-50 rounded-xl border border-gray-100 p-1">
              <button onClick={() => setYear(year - 1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition text-gray-500">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-black text-gray-900 w-12 text-center">{year}</span>
              <button onClick={() => setYear(year + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition text-gray-500">
                <ChevronRight size={16} />
              </button>
            </div>

            <button onClick={handleClearAll} className="text-xs font-bold text-gray-400 hover:text-red-500 transition px-3 py-2 rounded-lg hover:bg-red-50">
              Clear Year
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-1.5 mb-6">
          {MONTH_LABELS.map((label, i) => {
            const slot = getSlotForMonth(i);
            const crop = slot ? CROP_DATABASE.find((c) => c.id === slot.cropId) : null;
            const family = crop ? CROP_FAMILIES[crop.family] : null;
            const isStart = slot?.startMonth === i;
            const isEnd = slot?.endMonth === i;
            const isSelected = selectedMonth === i;

            return (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 text-center uppercase">{label}</span>
                <button
                  onClick={() => handleMonthClick(i)}
                  className={`relative h-20 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 group
                    ${isSelected ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200" :
                      crop && family ? `${family.bg} ${family.border} hover:shadow-md` :
                      "border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30"}`}
                >
                  {crop && family ? (
                    <>
                      {isStart && <Sprout size={14} className={family.color} />}
                      <span className={`text-[10px] font-black ${family.color} leading-tight text-center`}>{crop.name}</span>
                      {isStart && <span className="text-[8px] font-bold text-gray-400">{crop.daysToMaturity}d</span>}
                    </>
                  ) : (
                    <span className="text-[10px] text-gray-300 font-bold group-hover:text-emerald-400 transition">+</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(CROP_FAMILIES).map(([key, fam]) => (
            <div key={key} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${fam.bg} ${fam.border}`}>
              <span className={`w-2 h-2 rounded-full ${fam.bg} border ${fam.border}`}></span>
              <span className={`text-[10px] font-bold ${fam.color}`}>{fam.name}</span>
            </div>
          ))}
        </div>

        {health.warnings.length > 0 && (
          <div className="flex flex-col gap-2 mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            {health.warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <span className="text-xs font-medium text-amber-700">{w}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {slots.filter((s) => s.year === year).map((slot, i) => {
            const crop = CROP_DATABASE.find((c) => c.id === slot.cropId);
            const family = crop ? CROP_FAMILIES[crop.family] : null;
            if (!crop || !family) return null;

            return (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${family.bg} ${family.border} group`}>
                <div className={`w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center ${family.color}`}>
                  <Sprout size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-black ${family.color}`}>{crop.name}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{MONTH_LABELS[slot.startMonth]}–{MONTH_LABELS[slot.endMonth]} • {crop.daysToMaturity}d</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className={`text-[10px] font-bold ${crop.nitrogenEffect >= 0 ? "text-emerald-600" : "text-red-400"}`}>{crop.nitrogenEffect > 0 ? "+" : ""}{crop.nitrogenEffect}N</span>
                  <button onClick={() => handleRemoveSlot(slots.indexOf(slot))} className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                    <span className="text-[10px] font-bold">Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCropPicker && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setShowCropPicker(false); setSelectedMonth(null); }}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h4 className="text-lg font-black text-gray-900">Assign Crop — {selectedMonth !== null ? MONTH_LABELS[selectedMonth] : ""} {year}</h4>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Select a crop to plant starting this month</p>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2 max-h-100 overflow-y-auto">
              {CROP_DATABASE.map((crop) => {
                const family = CROP_FAMILIES[crop.family];
                const currentSlots = slots.filter((s) => s.year === year);
                const lastSlot = currentSlots[currentSlots.length - 1];
                const lastCrop = lastSlot ? CROP_DATABASE.find((c) => c.id === lastSlot.cropId) : null;
                const hasConflict = lastCrop && crop.incompatibleFamilies.includes(lastCrop.family);

                return (
                  <button
                    key={crop.id}
                    onClick={() => handleAssignCrop(crop.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left hover:shadow-md ${family.bg} ${family.border} ${hasConflict ? "opacity-50" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shrink-0 ${family.color}`}>
                      <Sprout size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-black ${family.color} truncate`}>{crop.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{crop.daysToMaturity}d • {crop.nitrogenEffect > 0 ? "+" : ""}{crop.nitrogenEffect}N</p>
                      {hasConflict && <p className="text-[9px] text-red-400 font-bold">⚠ Family conflict</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
