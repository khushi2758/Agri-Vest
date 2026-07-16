import React from "react";
import { X, Flag, Loader2, CheckCircle } from "lucide-react";

interface AnalysisModalProps {
  selectedLand: any;
  suggestion: string;
  isFlagged: boolean;
  savingProgress: boolean;
  submitting: boolean;
  result: any;
  setSuggestion: (s: string) => void;
  setIsFlagged: (f: boolean) => void;
  handleSaveProgress: () => void;
  handleValidate: () => void;
  onClose: () => void;
  onReset: () => void;
}

export function AnalysisModal({
  selectedLand,
  suggestion,
  isFlagged,
  savingProgress,
  submitting,
  result,
  setSuggestion,
  setIsFlagged,
  handleSaveProgress,
  handleValidate,
  onClose,
  onReset
}: AnalysisModalProps) {
  if (!selectedLand) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full p-2 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="p-8">
          <h2 className="text-3xl font-extrabold text-[#1a1f16] mb-2">{selectedLand.title || 'Field Validation'}</h2>
          <p className="text-gray-500 font-medium mb-8 flex items-center gap-2">
            {selectedLand.location || 'Unknown Location'} • ID: {selectedLand.id || 'N/A'}
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-gray-400 mb-1">NPK Index</span>
              <span className="text-2xl font-black text-[#1a1f16]">{selectedLand.telemetry?.npkIndex || 'N/A'}</span>
            </div>
            <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-gray-400 mb-1">Moisture</span>
              <span className="text-2xl font-black text-[#1a1f16]">{selectedLand.telemetry?.moisturePct || 'N/A'}%</span>
            </div>
            <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-gray-400 mb-1">Temp</span>
              <span className="text-2xl font-black text-[#1a1f16]">{selectedLand.telemetry?.tempCelsius || 'N/A'}°C</span>
            </div>
          </div>

          {!result ? (
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-[#1a1f16] mb-2">Agronomist Suggestions & Analysis</label>
                <textarea 
                  value={suggestion} 
                  onChange={(e) => setSuggestion(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-2xl p-4 text-sm font-medium outline-none focus:border-[#81c784] resize-none h-32 transition-colors"
                  placeholder="Enter your agricultural analysis..."
                />
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsFlagged(!isFlagged)}
                  className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold transition-all border ${isFlagged ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                  <Flag size={18} className={isFlagged ? "fill-red-600" : ""} />
                </button>
                
                <button 
                  onClick={handleSaveProgress} disabled={savingProgress || submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-[#1a1f16] border border-gray-200 py-3.5 rounded-full text-sm font-extrabold hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  {savingProgress ? <Loader2 size={18} className="animate-spin" /> : "Save Draft"}
                </button>

                <button 
                  onClick={handleValidate} disabled={submitting || savingProgress || !suggestion.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a1f16] text-[#81c784] py-3.5 rounded-full text-sm font-extrabold hover:bg-black transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle size={18} /> Submit</>}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#eaf5e9] rounded-3xl p-8 border border-[#81c784]/30 text-center">
              <div className="w-16 h-16 bg-[#81c784] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#1a1f16] mb-2">Validation Complete</h3>
              <p className="text-gray-700 font-semibold mb-6">Your analysis has been processed successfully.</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6 text-left">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-xs font-bold text-gray-500 mb-1">Success Prob.</p>
                  <p className="text-xl font-black text-[#1a1f16]">{result.probabilityOfSuccess}%</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-xs font-bold text-gray-500 mb-1">Range</p>
                  <p className="text-xl font-black text-[#1a1f16]">{result.rangeOfSuccess}</p>
                </div>
                <div className="bg-[#1a1f16] rounded-2xl p-4 shadow-sm text-center">
                  <p className="text-xs font-bold text-white/60 mb-1">Credits</p>
                  <p className="text-2xl font-black text-[#81c784]">+{result.creditsEarned}</p>
                </div>
              </div>
              
              <button onClick={onReset} className="w-full bg-white text-[#1a1f16] border border-gray-200 py-3.5 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors">
                Validate Another Land
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
