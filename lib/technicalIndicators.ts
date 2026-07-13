export const calculateSMA = (data: any[], period: number) => {
  return data.map((val, idx) => {
    if (idx < period - 1) return null;
    const slice = data.slice(idx - period + 1, idx + 1);
    const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
    return sum / period;
  });
};

export const calculateBollingerBands = (data: any[], period: number, stdDev: number) => {
  const sma = calculateSMA(data, period);
  return data.map((val, idx) => {
    if (idx < period - 1) return { upper: null, lower: null, middle: null };
    const slice = data.slice(idx - period + 1, idx + 1);
    const mean = sma[idx] as number;
    const variance = slice.reduce((acc, curr) => acc + Math.pow(curr.close - mean, 2), 0) / period;
    const sd = Math.sqrt(variance);
    return {
      middle: mean,
      upper: mean + (sd * stdDev),
      lower: mean - (sd * stdDev)
    };
  });
};

export const calculateRSI = (data: any[], period: number) => {
  let gains = 0;
  let losses = 0;
  
  return data.map((val, idx) => {
    if (idx === 0) return null;
    const diff = val.close - data[idx - 1].close;
    
    if (idx <= period) {
      if (diff >= 0) gains += diff;
      else losses -= diff;
      
      if (idx === period) {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
      }
      return null;
    }
    
    const prevAvgGain = gains / period;
    const prevAvgLoss = losses / period;
    
    const currentGain = diff >= 0 ? diff : 0;
    const currentLoss = diff < 0 ? -diff : 0;
    
    gains = ((prevAvgGain * (period - 1)) + currentGain);
    losses = ((prevAvgLoss * (period - 1)) + currentLoss);
    
    const rs = losses === 0 ? 100 : gains / losses;
    return 100 - (100 / (1 + rs));
  });
};
