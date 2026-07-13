import { calculateYieldProbability } from "./yieldPrediction";

export interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  estimatedYield: number;
  probabilityPercent: number;
  isOptimal: boolean;
}

export function generateOHLC(
  snapshots: any[],
  basePrice: number = 100.0,
  targetYield: number = 200
): StockDataPoint[] {
  if (!snapshots || snapshots.length === 0) {
    return [];
  }

  const sortedSnapshots = [...snapshots].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let currentPrice = basePrice;
  const result: StockDataPoint[] = [];

  for (let i = 0; i < sortedSnapshots.length; i++) {
    const snap = sortedSnapshots[i];
    
    const sensorData = {
      npkIndex: snap.metrics?.soil_score || 50,
      moisturePct: snap.metrics?.soil_moisture_avg || 35,
      lightIndex: snap.weather?.temp_avg ? Math.max(0, snap.weather.temp_avg * 2.5) : 60,
      tempCelsius: snap.weather?.temp_avg || snap.metrics?.temperature_avg || 22,
    };

    const yieldModel = calculateYieldProbability(sensorData, targetYield);
    
    const yieldFactor = yieldModel.estimatedYield / targetYield;
    const probabilityFactor = yieldModel.probabilityPercent / 100;
    
    const sentimentScore = (yieldFactor * 0.7) + (probabilityFactor * 0.3);
    
    let baseDailyShift = (sentimentScore - 0.5) * 5.0; 
    
    const anomalies = snap.anomalies || [];
    let anomalyPenalty = 0;
    anomalies.forEach((anomaly: any) => {
      if (anomaly.severity === "high") anomalyPenalty -= 4.0;
      else if (anomaly.severity === "medium") anomalyPenalty -= 2.0;
      else if (anomaly.severity === "low") anomalyPenalty -= 0.5;
    });

    const netShift = baseDailyShift + anomalyPenalty;
    
    const dailyVolatility = 0.02 + ((1 - probabilityFactor) * 0.08) + (Math.abs(anomalyPenalty) / 100);
    
    const open = currentPrice;
    
    const intendedClose = Math.max(1.0, currentPrice * (1 + (netShift / 100)));
    
    const maxVariation = currentPrice * dailyVolatility;
    const high = Math.max(open, intendedClose) + (Math.random() * maxVariation);
    const low = Math.max(0.1, Math.min(open, intendedClose) - (Math.random() * maxVariation));
    
    const close = Math.max(low, Math.min(high, intendedClose));

    const volume = Math.floor(1000 + (Math.random() * 5000) * probabilityFactor);

    result.push({
      date: new Date(snap.date).toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
      estimatedYield: yieldModel.estimatedYield,
      probabilityPercent: yieldModel.probabilityPercent,
      isOptimal: yieldModel.isOptimal
    });

    currentPrice = close;
  }

  return result;
}
