export interface RawFeatureData {
  Temp: number;
  RH: number;
  Rain: number;
  SM: number;
  [key: string]: number;
}

export interface WindowStatistics {
  [key: string]: number;
}

export function calculateSlidingWindowStats(
  dataStream: RawFeatureData[],
  features: string[] = ['Temp', 'RH', 'Rain', 'SM'],
  windows: number[] = [7, 14, 30]
): WindowStatistics[] {
  const resultStream: WindowStatistics[] = [];

  for (let t = 0; t < dataStream.length; t++) {
    const timeStepStats: WindowStatistics = {};

    for (const feature of features) {
      for (const w of windows) {
        const windowValues: number[] = [];
        
        const startIdx = Math.max(0, t - w + 1);
        for (let j = startIdx; j <= t; j++) {
          windowValues.push(dataStream[j][feature]);
        }

        const validCount = windowValues.length;
        const targetCount = w;
        
        let sum = 0;
        let min = Infinity;
        let max = -Infinity;

        for (let i = 0; i < validCount; i++) {
          const val = windowValues[i];
          sum += val;
          if (val < min) min = val;
          if (val > max) max = val;
        }

        const currentMean = validCount > 0 ? sum / validCount : 0;
        let adjustedSum = sum;

        if (validCount < targetCount && validCount > 0) {
          const paddingCount = targetCount - validCount;
          adjustedSum += currentMean * paddingCount;
        } else if (validCount === 0) {
          min = 0;
          max = 0;
        }

        const mean = targetCount > 0 ? adjustedSum / targetCount : 0;

        let varianceSum = 0;
        for (let i = 0; i < validCount; i++) {
          varianceSum += Math.pow(windowValues[i] - mean, 2);
        }
        
        if (validCount < targetCount && validCount > 0) {
          const paddingCount = targetCount - validCount;
          varianceSum += paddingCount * Math.pow(currentMean - mean, 2);
        }

        const variance = targetCount > 1 ? varianceSum / (targetCount - 1) : 0;
        const std = Math.sqrt(variance);

        timeStepStats[`${feature}_mean_${w}d`] = mean;
        timeStepStats[`${feature}_std_${w}d`] = std;
        timeStepStats[`${feature}_sum_${w}d`] = adjustedSum;
        timeStepStats[`${feature}_max_${w}d`] = max === -Infinity ? 0 : max;
        timeStepStats[`${feature}_min_${w}d`] = min === Infinity ? 0 : min;
      }
    }
    
    resultStream.push(timeStepStats);
  }

  return resultStream;
}
