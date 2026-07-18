"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Loader2, TrendingUp, TrendingDown, 
  Activity, Droplets, Sun, Thermometer, SlidersHorizontal
} from "lucide-react";
import NavBar from "../../navbar";
import ROICalculator from "@/components/ROICalculator";
import DrawingToolbar, { DrawingTool } from "@/components/chart/DrawingToolbar";
import CandlestickChart from "@/components/chart/CandlestickChart";
import RSIChart from "@/components/chart/RSIChart";
import DonutGauge from "@/components/chart/DonutGauge";
import PerformanceTable from "@/components/chart/PerformanceTable";
import { calculateSMA, calculateBollingerBands, calculateRSI } from "@/lib/technicalIndicators";
import HelpTourButton from "../../HelpTourButton";
import { markRouteEntryAsDynamicRewrite } from "next/dist/client/components/segment-cache/cache";
import { marketAnalysisSteps } from "./marketAnalysisSteps";

export default function StockTradingView({ params }: { params: Promise<{ plotId: string, locale: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredData, setHoveredData] = useState<any>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const [showSMA, setShowSMA] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  
  const [activeTool, setActiveTool] = useState<DrawingTool>("none");
  const [clearTrigger, setClearTrigger] = useState(0);

  useEffect(() => {
    async function fetchStock() {
      try {
        const res = await fetch(`/api/stock/${resolvedParams.plotId}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
          if (json.data && json.data.length > 0) {
            setHoveredData(json.data[json.data.length - 1]);
            setHoverIndex(json.data.length - 1);
          }
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchStock();
  }, [resolvedParams.plotId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9f2] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#c8e639] animate-spin" />
      </div>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f9f2] text-[#1b2620] flex flex-col font-sans">
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Activity size={48} className="text-[#1b2620] mb-4 opacity-30" />
          <h2 className="text-2xl font-extrabold mb-2 text-[#1b2620]">No Market Data Available</h2>
          <p className="text-neutral-500 font-medium">This agricultural asset does not have enough performance snapshots to generate a trading chart.</p>
          <Link href={`/${resolvedParams.locale}/Explore`} className="mt-6 bg-[#1b2620] text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl font-extrabold hover:bg-black transition-all">Back to Explore</Link>
        </div>
      </div>
    );
  }

  const stockData = data.data;
  const currentPrice = stockData[stockData.length - 1].close;
  const previousPrice = stockData.length > 1 ? stockData[stockData.length - 2].close : stockData[0].close;
  const priceChange = currentPrice - previousPrice;
  const priceChangePct = (priceChange / previousPrice) * 100;
  
  const smaData = calculateSMA(stockData, 7);
  const bollingerData = calculateBollingerBands(stockData, 14, 2);
  const rsiData = calculateRSI(stockData, 14);

  const handleHover = (d: any, index: number | null) => {
    if (d) {
      setHoveredData(d);
      setHoverIndex(index);
    } else {
      setHoveredData(stockData[stockData.length - 1]);
      setHoverIndex(stockData.length - 1);
    }
  };

  const handleClearDrawings = () => {
    setClearTrigger(prev => prev + 1);
  };

  const yieldProb = hoveredData?.probabilityPercent || stockData[stockData.length-1].probabilityPercent || 92;

  return (
    <div className="min-h-screen bg-[#f7f9f2] text-[#1b2620] font-sans selection:bg-[#c8e639] selection:text-black pb-20">
      <NavBar />
      <HelpTourButton steps={marketAnalysisSteps}/>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <Link href={`/${resolvedParams.locale}/property/${resolvedParams.plotId}`} className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-neutral-600 hover:bg-[#1b2620] hover:text-[#c8e639] shadow-sm border border-gray-200 transition-colors">
              <ArrowLeft size={24} />
            </Link>
           <div id="market-header">
              <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3 text-[#1b2620]">
                {data.name} TRADING
              </h1>
            </div>
          </div>
          
          <div  id="market-summary" className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Asset Value</span>
              <span className="text-2xl font-black font-mono text-[#1b2620]">{currentPrice.toFixed(2)} AGV <span className="text-sm text-neutral-400 font-bold ml-1 font-sans">(~${currentPrice.toFixed(2)})</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">24h P/L</span>
              <span className={`text-2xl font-black font-mono flex items-center gap-1 ${priceChange >= 0 ? 'text-[#8da514]' : 'text-red-500'}`}>
                {priceChange >= 0 ? '+' : '-'}{Math.abs(priceChange).toFixed(2)} AGV <span className="text-sm opacity-60 font-bold ml-1 font-sans">(~${Math.abs(priceChange).toFixed(2)})</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Growth Rate</span>
              <span className={`text-2xl font-black font-mono ${priceChangePct >= 0 ? 'text-[#c8e639]' : 'text-red-500'}`}>
                {priceChangePct >= 0 ? '+' : ''}{priceChangePct.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-3 flex flex-col gap-6">
          <div id="yield-gauge" className="h-64">
              <DonutGauge score={yieldProb} label="Yield Probability" sublabel="Projected" />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex-1">
              <h3 className="text-sm font-extrabold text-[#1b2620] mb-6 uppercase tracking-widest">Asset Summary</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#c8e639]/20 rounded-lg flex items-center justify-center font-black text-[#8da514]">
                  AG
                </div>
                <div id="asset-summary">
                  <h4 className="font-bold text-sm">Agriculture Yield</h4>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Property Futures</p>
                </div>
                <div className="ml-auto text-xs font-black bg-[#1b2620] text-white px-3 py-1 rounded-md">LONG</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-xs font-bold text-neutral-500">Property ID</span>
                  <span className="text-xs font-bold text-[#1b2620]">{resolvedParams.plotId.substring(0,8)}...</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-xs font-bold text-neutral-500">Current Price</span>
                  <span className="text-xs font-bold font-mono text-[#1b2620]">{currentPrice.toFixed(2)} AGV <span className="text-[10px] text-neutral-400 font-sans ml-1">(~${currentPrice.toFixed(2)})</span></span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-xs font-bold text-neutral-500">Crop Type</span>
                  <span className="text-xs font-bold text-[#1b2620]">Rice / Kharif</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-xs font-bold text-neutral-500">Target Yield</span>
                  <span className="text-xs font-bold text-[#1b2620]">6.5 Tonnes</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-xs font-bold text-neutral-500">Risk/Reward</span>
                  <span className="text-xs font-black text-[#c8e639]">3.00</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-neutral-500">Est. Returns</span>
                  <span className="text-lg font-black text-[#8da514] font-mono">+15.5%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 flex flex-col gap-6">
            
            <div  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col relative overflow-hidden h-[400px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold text-[#1b2620] uppercase tracking-widest">Position Analysis</h3>
                <div id="drawing-tools" className="flex items-center gap-4">
                  <DrawingToolbar 
                    activeTool={activeTool} 
                    setActiveTool={setActiveTool} 
                    onClear={handleClearDrawings} 
                  />
                   <div id="technical-indicators" className="flex items-center gap-1 bg-gray-50 px-1 py-1 rounded-lg border border-gray-100">
                    <button onClick={() => setShowSMA(!showSMA)} className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-colors ${showSMA ? 'bg-[#1b2620] text-white' : 'text-neutral-500 hover:bg-gray-200'}`}>SMA</button>
                    <button onClick={() => setShowBollinger(!showBollinger)} className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-colors ${showBollinger ? 'bg-[#1b2620] text-white' : 'text-neutral-500 hover:bg-gray-200'}`}>BB</button>
                    <button onClick={() => setShowRSI(!showRSI)} className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-colors ${showRSI ? 'bg-[#1b2620] text-white' : 'text-neutral-500 hover:bg-gray-200'}`}>RSI</button>
                  </div>
                </div>
              </div>
              
              <div id="candlestick-chart" className="relative w-full flex-1 flex items-end">
                <CandlestickChart 
                  data={stockData} 
                  smaData={smaData} 
                  bollingerData={bollingerData} 
                  showSMA={showSMA} 
                  showBollinger={showBollinger} 
                  activeTool={activeTool} 
                  onHover={handleHover}
                  clearTrigger={clearTrigger}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {showRSI ? (
                <div id="rsi-chart" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col relative overflow-hidden h-48">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#1b2620]">RSI Analysis</h3>
                    {hoverIndex !== null && rsiData[hoverIndex] !== null && (
                      <span className="text-sm font-bold font-mono text-[#8da514]">{Number(rsiData[hoverIndex]).toFixed(2)}</span>
                    )}
                  </div>
                  <div className="relative w-full flex-1 overflow-hidden">
                    <RSIChart 
                      data={stockData}
                      rsiData={rsiData}
                      activeTool={activeTool}
                      onHover={handleHover}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-center h-48">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">RSI Disabled</span>
                </div>
              )}

              <div id="market-drivers" className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-48">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#1b2620] mb-4">Market Drivers</h3>
                <div className="flex flex-col gap-4 flex-1 justify-center">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets size={14} className="text-blue-500" />
                      <span className="text-xs font-bold text-neutral-600">Soil Moisture</span>
                    </div>
                    <div className="w-32 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[85%]"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer size={14} className="text-orange-500" />
                      <span className="text-xs font-bold text-neutral-600">Temperature</span>
                    </div>
                    <div className="w-32 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 w-[60%]"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun size={14} className="text-yellow-500" />
                      <span className="text-xs font-bold text-neutral-600">Light Index</span>
                    </div>
                    <div className="w-32 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 w-[90%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div  className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div id="performance-table" className="md:col-span-2">
                <PerformanceTable data={stockData} />
              </div>
              <div id="roi-calculator" className="md:col-span-1">
                <ROICalculator currentPrice={currentPrice} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
