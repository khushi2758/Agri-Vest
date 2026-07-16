import { calculateGdd } from "./feature/gdd_calc";
import { calculateHsi } from "./feature/hsi_calc";
import { calculateNpkIndices } from "./feature/npk_calc";
import { calculateSlidingWindowStats } from "./feature/sliding_window";
import { generateLagFeatures } from "./feature/lag_features";
import { CropStageMapper } from "./feature/crop_stage";

export interface RawInputFrame {
  T: number;
  RH: number;
  Rain: number;
  Light: number;
  Soil_N: number;
  Soil_P: number;
  Soil_K: number;
  SM: number;
  Date?: string;
  [key: string]: any;
}

export interface PestParams {
  tBase: number;
  tUpper: number;
  rhMin: number;
  rhOptLow: number;
  rhOptHigh: number;
  rhMax: number;
  kOpt: number;
  pCritical: number;
}

export class FeatureEngineer {
  private pestType: string;
  private cropOptimalN: number;
  private params: PestParams;
  private windows: number[] = [7, 14, 30];
  private lags: number[] = [1, 3, 7];
  private cropStageMapper: CropStageMapper;

  constructor(pestType: string, cropOptimalN: number, params: PestParams) {
    this.pestType = pestType;
    this.cropOptimalN = cropOptimalN;
    this.params = params;
    this.cropStageMapper = new CropStageMapper();
  }

  public transform(rawDf: RawInputFrame[], currentStage: string): Record<string, number> {
    if (rawDf.length === 0) {
      return {};
    }

    let gddAccum = 0;
    const gddDailyArray: number[] = [];
    const gddAccumArray: number[] = [];

    for (const row of rawDf) {
      const gdd = calculateGdd(row.T + 5, row.T - 5, this.params.tBase, this.params.tUpper);
      gddAccum += gdd;
      gddDailyArray.push(gdd);
      gddAccumArray.push(gddAccum);
    }

    const hsiArray = rawDf.map(row => 
      calculateHsi(row.RH, this.params.rhMin, this.params.rhOptLow, this.params.rhOptHigh, this.params.rhMax)
    );

    const npkArray = rawDf.map(row => 
      calculateNpkIndices(row.Soil_N, row.Soil_P, row.Soil_K, this.cropOptimalN, this.params.pCritical)
    );

    const windowData = rawDf.map(row => ({
      Temp: row.T,
      RH: row.RH,
      Rain: row.Rain,
      SM: row.SM
    }));
    
    const windowStats = calculateSlidingWindowStats(windowData, ['Temp', 'RH', 'Rain', 'SM'], this.windows);

    const lagData = rawDf.map(row => ({
      Temp: row.T,
      RH: row.RH,
      Rain: row.Rain,
      Soil_N: row.Soil_N,
      Soil_Moisture: row.SM
    }));

    const lagStats = generateLagFeatures(lagData, ['Temp', 'RH', 'Rain', 'Soil_N', 'Soil_Moisture'], this.lags);

    const latestRow = rawDf[rawDf.length - 1];
    const latestDate = latestRow.Date ?? new Date().toISOString();
    
    const stageData = this.cropStageMapper.update(currentStage, latestDate);

    const finalIdx = rawDf.length - 1;
    const latestNpk = npkArray[finalIdx];

    const result: Record<string, number> = {
      GDD_daily: gddDailyArray[finalIdx],
      GDD_accum: gddAccumArray[finalIdx],
      HSI: hsiArray[finalIdx],
      NEI: latestNpk.neiScore,
      N_P_ratio: latestNpk.npRatio,
      K_sufficiency: latestNpk.kSufficiencyScore,
      P_stress: latestNpk.pStressFlag,
      BBCH_code: stageData.BBCH_code,
      Stage_Num: stageData.Macro_Stage,
      Vuln_Borer: Math.max(stageData.Vuln_Stem_Borer, stageData.Vuln_Fruit_Borer),
      Vuln_Fruit: stageData.Vuln_Fruit_Borer,
      Vuln_Seedling: stageData.Vuln_Seedling_Pest,
      ...windowStats[finalIdx],
      ...lagStats[finalIdx]
    };

    return result;
  }
}
