import React, { MouseEvent, useRef } from "react";

interface RSIChartProps {
  data: any[];
  rsiData: any[];
  activeTool: string;
  onHover: (data: any, index: number | null) => void;
}

export default function RSIChart({ data, rsiData, activeTool, onHover }: RSIChartProps) {
  const chartHeight = 120;
  const chartWidth = 800;
  
  const getRsiY = (rsi: number) => chartHeight - (rsi / 100) * chartHeight;
  
  const svgRef = useRef<SVGSVGElement>(null);

  const rsiPath = rsiData.map((val, idx) => {
    if (val === null) return "";
    const x = (idx / data.length) * chartWidth + (chartWidth / data.length) / 2;
    const y = getRsiY(val);
    return `${idx === 14 ? 'M' : 'L'} ${x} ${y}`;
  }).join(" ");

  const getMouseCoords = (e: MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (activeTool !== "none") return;
    const coords = getMouseCoords(e);
    const idx = Math.floor((coords.x / chartWidth) * data.length);
    if (idx >= 0 && idx < data.length) {
      onHover(data[idx], idx);
    }
  };

  const handleMouseLeave = () => {
    if (activeTool === "none") {
      onHover(null, null);
    }
  };

  return (
    <svg 
      ref={svgRef}
      width="100%" 
      height={chartHeight} 
      viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
      preserveAspectRatio="none" 
      className="min-w-[800px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <rect x="0" y={getRsiY(70)} width={chartWidth} height={getRsiY(30) - getRsiY(70)} fill="#c8e639" fillOpacity="0.05" />
      <line x1="0" y1={getRsiY(70)} x2={chartWidth} y2={getRsiY(70)} stroke="#1b2620" strokeOpacity="0.2" strokeDasharray="4,4" />
      <line x1="0" y1={getRsiY(30)} x2={chartWidth} y2={getRsiY(30)} stroke="#1b2620" strokeOpacity="0.2" strokeDasharray="4,4" />
      <text x="0" y={getRsiY(70) - 5} fill="#1b2620" fillOpacity="0.4" fontSize="10" fontFamily="monospace" fontWeight="bold">70</text>
      <text x="0" y={getRsiY(30) + 12} fill="#1b2620" fillOpacity="0.4" fontSize="10" fontFamily="monospace" fontWeight="bold">30</text>
      <path d={rsiPath} fill="none" stroke="#1b2620" strokeWidth="2" />
    </svg>
  );
}
