import React, { useState } from "react";
import { Calculator, ArrowRight } from "lucide-react";

interface ROICalculatorProps {
  currentPrice: number;
}

export default function ROICalculator({ currentPrice }: ROICalculatorProps) {
  const [investment, setInvestment] = useState<string>("1000");
  const [durationMonths, setDurationMonths] = useState<string>("12");
  
  const invAmount = parseFloat(investment) || 0;
  const months = parseInt(durationMonths, 10) || 1;
  const tokensBought = invAmount / (currentPrice || 1);
  const assumedMonthlyGrowth = 0.015; 
  const projectedPrice = currentPrice * Math.pow(1 + assumedMonthlyGrowth, months);
  const projectedValue = tokensBought * projectedPrice;
  const netProfit = projectedValue - invAmount;
  const roiPercentage = invAmount > 0 ? (netProfit / invAmount) * 100 : 0;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
        <div className="w-8 h-8 rounded-lg bg-[#c8e639]/20 flex items-center justify-center text-[#8da514]">
          <Calculator size={16} />
        </div>
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-500">ROI Calculator</h3>
      </div>
      
      <div className="flex flex-col gap-4 flex-1">
        <div>
          <label className="block text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1.5">Investment Amount ($)</label>
          <input 
            type="number" 
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            className="w-full bg-[#f7f9f2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#1b2620] focus:outline-none focus:border-[#c8e639] transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1.5">Holding Period (Months)</label>
          <input 
            type="number" 
            value={durationMonths}
            onChange={(e) => setDurationMonths(e.target.value)}
            className="w-full bg-[#f7f9f2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#1b2620] focus:outline-none focus:border-[#c8e639] transition-all"
          />
        </div>
        
        <div className="mt-2 bg-[#1b2620] rounded-xl p-4 text-white shadow-inner">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Projected Return</span>
            <span className="text-xs font-extrabold text-[#c8e639]">+{roiPercentage.toFixed(2)}%</span>
          </div>
          <span className="text-2xl font-extrabold">${projectedValue.toFixed(2)}</span>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Net Profit</span>
            <span className="text-xs font-bold text-white/90">${netProfit.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
