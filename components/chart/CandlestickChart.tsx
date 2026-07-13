import React, { useState, MouseEvent, useRef } from "react";
import { DrawingTool } from "./DrawingToolbar";

interface CandlestickChartProps {
  data: any[];
  smaData: any[];
  bollingerData: any[];
  showSMA: boolean;
  showBollinger: boolean;
  activeTool: DrawingTool;
  onHover: (data: any, index: number | null) => void;
  clearTrigger: number;
}

interface DrawnLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface DrawnRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function CandlestickChart({ 
  data, smaData, bollingerData, showSMA, showBollinger, activeTool, onHover, clearTrigger 
}: CandlestickChartProps) {
  
  const [lines, setLines] = useState<DrawnLine[]>([]);
  const [rects, setRects] = useState<DrawnRect[]>([]);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);
  const [currentPos, setCurrentPos] = useState<{x: number, y: number} | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    setLines([]);
    setRects([]);
  }, [clearTrigger]);

  const maxHigh = Math.max(...data.map((d: any) => d.high), ...(showBollinger ? bollingerData.map(d => d.upper || 0) : []));
  const minLow = Math.min(...data.map((d: any) => d.low), ...(showBollinger ? bollingerData.map(d => d.lower || Infinity).filter(v => v !== Infinity) : []));
  const priceRange = maxHigh - minLow;
  
  const chartHeight = 350;
  const chartWidth = 800;
  
  const getY = (price: number) => chartHeight - ((price - minLow) / (priceRange || 1)) * chartHeight;
  const candleWidth = Math.max(4, Math.floor(chartWidth / data.length) - 2);

  const smaPath = smaData.map((val, idx) => {
    if (val === null) return "";
    const x = (idx / data.length) * chartWidth + (chartWidth / data.length) / 2;
    const y = getY(val);
    return `${idx === 6 ? 'M' : 'L'} ${x} ${y}`;
  }).join(" ");

  const bbUpperPath = bollingerData.map((val, idx) => {
    if (val.upper === null) return "";
    const x = (idx / data.length) * chartWidth + (chartWidth / data.length) / 2;
    const y = getY(val.upper);
    return `${idx === 13 ? 'M' : 'L'} ${x} ${y}`;
  }).join(" ");

  const bbLowerPath = bollingerData.map((val, idx) => {
    if (val.lower === null) return "";
    const x = (idx / data.length) * chartWidth + (chartWidth / data.length) / 2;
    const y = getY(val.lower);
    return `${idx === 13 ? 'M' : 'L'} ${x} ${y}`;
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

  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    if (activeTool === "none") return;
    const coords = getMouseCoords(e);
    setIsDrawing(true);
    setStartPos(coords);
    setCurrentPos(coords);
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (activeTool === "none" && !isDrawing) {
      const coords = getMouseCoords(e);
      const idx = Math.floor((coords.x / chartWidth) * data.length);
      if (idx >= 0 && idx < data.length) {
        onHover(data[idx], idx);
      }
      return;
    }

    if (isDrawing) {
      setCurrentPos(getMouseCoords(e));
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !startPos || !currentPos) return;
    
    if (activeTool === "trendline") {
      setLines([...lines, { x1: startPos.x, y1: startPos.y, x2: currentPos.x, y2: currentPos.y }]);
    } else if (activeTool === "zone") {
      const x = Math.min(startPos.x, currentPos.x);
      const y = Math.min(startPos.y, currentPos.y);
      const w = Math.abs(currentPos.x - startPos.x);
      const h = Math.abs(currentPos.y - startPos.y);
      setRects([...rects, { x, y, w, h }]);
    }
    
    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
  };

  const handleMouseLeave = () => {
    if (isDrawing) {
      handleMouseUp();
    }
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
      className={`min-w-[800px] ${activeTool !== "none" ? "cursor-crosshair" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {[0, 0.25, 0.5, 0.75, 1].map(tick => {
        const y = chartHeight * tick;
        const price = maxHigh - (priceRange * tick);
        return (
          <g key={tick}>
            <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="#1b2620" strokeOpacity="0.05" strokeDasharray="4,4" />
            <text x="0" y={y > 20 ? y - 5 : y + 15} fill="#1b2620" fillOpacity="0.4" fontSize="10" fontFamily="monospace" fontWeight="bold">${price.toFixed(2)}</text>
          </g>
        );
      })}

      {showBollinger && (
        <>
          <path d={bbUpperPath} fill="none" stroke="#67780f" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
          <path d={bbLowerPath} fill="none" stroke="#67780f" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
        </>
      )}
      {showSMA && <path d={smaPath} fill="none" stroke="#8da514" strokeWidth="2" />}

      {data.map((d: any, i: number) => {
        const x = (i / data.length) * chartWidth + (chartWidth / data.length) / 2;
        const isUp = d.close >= d.open;
        const color = isUp ? "#c8e639" : "#ef4444";
        const wickColor = isUp ? "#a0bd0f" : "#dc2626";
        
        const yHigh = getY(d.high);
        const yLow = getY(d.low);
        const yOpen = getY(d.open);
        const yClose = getY(d.close);
        
        const rectTop = Math.min(yOpen, yClose);
        const rectHeight = Math.max(Math.abs(yClose - yOpen), 2); 

        return (
          <g key={i}>
            <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={wickColor} strokeWidth={Math.max(1, candleWidth / 4)} />
            <rect 
              x={x - candleWidth / 2} 
              y={rectTop} 
              width={candleWidth} 
              height={rectHeight} 
              fill={color} 
              rx={1}
            />
          </g>
        );
      })}

      {rects.map((r, i) => (
        <rect key={`r-${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill="#c8e639" fillOpacity="0.15" stroke="#8da514" strokeWidth="1" strokeDasharray="4,4" />
      ))}
      
      {lines.map((l, i) => (
        <line key={`l-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#c8e639" strokeWidth="2" />
      ))}

      {isDrawing && activeTool === "zone" && startPos && currentPos && (
        <rect 
          x={Math.min(startPos.x, currentPos.x)} 
          y={Math.min(startPos.y, currentPos.y)} 
          width={Math.abs(currentPos.x - startPos.x)} 
          height={Math.abs(currentPos.y - startPos.y)} 
          fill="#c8e639" fillOpacity="0.15" stroke="#8da514" strokeWidth="1" strokeDasharray="4,4" 
        />
      )}
      
      {isDrawing && activeTool === "trendline" && startPos && currentPos && (
        <line x1={startPos.x} y1={startPos.y} x2={currentPos.x} y2={currentPos.y} stroke="#c8e639" strokeWidth="2" />
      )}
    </svg>
  );
}
