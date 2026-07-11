export interface LandMetrics {
  totalInvested: number;
  targetYieldPct: number;
  riskProfile: "Low" | "Medium" | "High";
  soilHealth: number;
  waterAdequacy: number;
  rotationDays: number;
}

export interface CandlestickData {
  period: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function generateProfitCandlesticks(metrics: LandMetrics, periods: number): CandlestickData[] {
  const data: CandlestickData[] = [];
  
  let currentProfit = metrics.totalInvested;
  const baseGrowthRate = (metrics.targetYieldPct / 100) / (365 / metrics.rotationDays);
  
  let volatilityBase = 0.02;
  if (metrics.riskProfile === "Medium") volatilityBase = 0.05;
  if (metrics.riskProfile === "High") volatilityBase = 0.09;

  const soilModifier = (100 - metrics.soilHealth) / 1000;
  const waterModifier = (100 - metrics.waterAdequacy) / 1000;
  const environmentalStress = soilModifier + waterModifier;

  for (let i = 1; i <= periods; i++) {
    const periodStr = `Month ${i}`;
    
    const open = currentProfit;
    
    const randomTrend = (Math.random() - 0.45);
    let growth = open * (baseGrowthRate + (randomTrend * volatilityBase) - environmentalStress);
    
    const close = open + growth;
    
    const noiseHigh = Math.random() * volatilityBase * open;
    const noiseLow = Math.random() * volatilityBase * open;
    
    const maxOC = Math.max(open, close);
    const minOC = Math.min(open, close);
    
    const high = maxOC + noiseHigh;
    const low = minOC - noiseLow;
    
    data.push({
      period: periodStr,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2))
    });
    
    currentProfit = close;
  }
  
  return data;
}

export function calculateProfitMetrics(candlesticks: CandlestickData[]) {
  if (candlesticks.length === 0) return { totalReturn: 0, highestPeak: 0, lowestDip: 0 };
  
  const initial = candlesticks[0].open;
  const final = candlesticks[candlesticks.length - 1].close;
  const totalReturn = ((final - initial) / initial) * 100;
  
  const highs = candlesticks.map(c => c.high);
  const lows = candlesticks.map(c => c.low);
  const highestPeak = Math.max(...highs);
  const lowestDip = Math.min(...lows);
  
  return {
    totalReturnPct: parseFloat(totalReturn.toFixed(2)),
    highestPeak: parseFloat(highestPeak.toFixed(2)),
    lowestDip: parseFloat(lowestDip.toFixed(2)),
    finalValue: parseFloat(final.toFixed(2))
  };
}
