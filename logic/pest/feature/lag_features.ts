export interface RawLagFeatureData {
  Temp: number;
  RH: number;
  Rain: number;
  Soil_N: number;
  Soil_Moisture: number;
  [key: string]: number;
}

export interface LagFeatureResult {
  [key: string]: number;
}

export function generateLagFeatures(
  dataStream: RawLagFeatureData[],
  features: string[] = ['Temp', 'RH', 'Rain', 'Soil_N', 'Soil_Moisture'],
  lags: number[] = [1, 3, 7]
): LagFeatureResult[] {
  const resultStream: LagFeatureResult[] = [];

  for (let t = 0; t < dataStream.length; t++) {
    const lagData: LagFeatureResult = {};

    for (const feature of features) {
      for (const lag of lags) {
        const targetIndex = t - lag;
        const validIndex = targetIndex >= 0 ? targetIndex : 0;
        
        if (dataStream.length > 0) {
          lagData[`${feature}_lag${lag}`] = dataStream[validIndex][feature] ?? 0;
        } else {
          lagData[`${feature}_lag${lag}`] = 0;
        }
      }
    }

    resultStream.push(lagData);
  }

  return resultStream;
}
