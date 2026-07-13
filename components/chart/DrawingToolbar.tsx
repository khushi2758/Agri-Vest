import React from "react";
import { PenLine, Square, Eraser, MousePointer2 } from "lucide-react";

export type DrawingTool = "none" | "trendline" | "zone";

interface DrawingToolbarProps {
  activeTool: DrawingTool;
  setActiveTool: (tool: DrawingTool) => void;
  onClear: () => void;
}

export default function DrawingToolbar({ activeTool, setActiveTool, onClear }: DrawingToolbarProps) {
  return (
    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100 h-full">
      <button 
        onClick={() => setActiveTool("none")} 
        className={`p-2 rounded-lg transition-colors ${activeTool === "none" ? 'bg-[#c8e639] text-[#1b2620]' : 'text-neutral-500 hover:bg-gray-50'}`}
        title="Cursor / Hover Mode"
      >
        <MousePointer2 size={16} />
      </button>
      
      <div className="w-px h-6 bg-gray-200 mx-1"></div>
      
      <button 
        onClick={() => setActiveTool("trendline")} 
        className={`p-2 rounded-lg transition-colors ${activeTool === "trendline" ? 'bg-[#c8e639] text-[#1b2620]' : 'text-neutral-500 hover:bg-gray-50'}`}
        title="Draw Trendline"
      >
        <PenLine size={16} />
      </button>
      
      <button 
        onClick={() => setActiveTool("zone")} 
        className={`p-2 rounded-lg transition-colors ${activeTool === "zone" ? 'bg-[#c8e639] text-[#1b2620]' : 'text-neutral-500 hover:bg-gray-50'}`}
        title="Draw Support/Resistance Zone"
      >
        <Square size={16} />
      </button>
      
      <div className="w-px h-6 bg-gray-200 mx-1"></div>
      
      <button 
        onClick={onClear} 
        className="p-2 rounded-lg text-neutral-500 hover:bg-red-50 hover:text-red-500 transition-colors"
        title="Clear All Drawings"
      >
        <Eraser size={16} />
      </button>
    </div>
  );
}
