import { GbdtComponent, RawDataRow } from "./gbdt";

export interface StaticData {
  N_avg: number;
  P_avg: number;
  K_avg: number;
  pH: number;
  Soil_Moisture_avg: number;
  Crop_Stage: number;
  Host_Weight: number;
  Rotation_Flag: number;
  Monocrop_Flag: number;
  Irrigation_Type: number;
  Proximity: number;
}

export interface LstmModel {
  predict: (xSeq: number[][][]) => { contextVector: number[]; timing: number };
}

export interface RfModel {
  predict: (xRf: number[][]) => number[];
  predictProba: (xRf: number[][]) => number[][];
}

export class LstmRfPipeline {
  private lstm: LstmModel;
  private rf: RfModel;
  private W: number;
  private gbdtComponent: GbdtComponent;

  constructor(lstmModel: LstmModel, rfModel: RfModel, sequenceLength: number = 30) {
    this.lstm = lstmModel;
    this.rf = rfModel;
    this.W = sequenceLength;
    this.gbdtComponent = new GbdtComponent();
  }

  private calculateGdd(temperature: number): number {
    const baseTemp = 10;
    return Math.max(0, temperature - baseTemp);
  }

  private calculateRollingSum(data: RawDataRow[], key: string, window: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - window + 1); j <= i; j++) {
        sum += Number(data[j][key]) || 0;
        count++;
      }
      result.push(sum);
    }
    return result;
  }

  public infer(rawDataStream: RawDataRow[], staticData: StaticData) {
    const latestRawData = rawDataStream.length > 0 ? [rawDataStream[rawDataStream.length - 1]] : [];
    
    if (!this.gbdtComponent.isTrained && latestRawData.length > 0) {
      this.gbdtComponent.train(rawDataStream, rawDataStream.map(() => Math.floor(Math.random() * 2)));
    }
    
    const gbdtOut = this.gbdtComponent.transform(latestRawData);
    const baseRisk = gbdtOut.baseOut[0] ?? 0;
    const selectedCols = this.gbdtComponent.selectedFeatures;

    let hT: number[] = Array(32).fill(0);
    let timingDays = Infinity;

    if (baseRisk >= 0.20) {
      const seqData = rawDataStream.map(row => {
        const newRow: RawDataRow = {};
        for (const col of selectedCols) {
          newRow[col] = row[col];
        }
        newRow['Temperature'] = row['Temperature'] ?? 0;
        newRow['Rainfall'] = row['Rainfall'] ?? 0;
        return newRow;
      });

      const rollingRain = this.calculateRollingSum(seqData, 'Rainfall', 3);

      const enrichedSeqData = seqData.map((row, idx) => {
        return {
          ...row,
          GDD: this.calculateGdd(Number(row['Temperature'])),
          Rain_3d: rollingRain[idx]
        };
      });

      const finalSeq = enrichedSeqData.slice(-this.W);
      
      if (finalSeq.length > 0) {
        const xSeqKeys = Object.keys(finalSeq[0]);
        const xSeq: number[][][] = [
          finalSeq.map(row => xSeqKeys.map(key => Number((row as Record<string, any>)[key]) || 0))
        ];

        const lstmOutput = this.lstm.predict(xSeq);
        hT = lstmOutput.contextVector;
        timingDays = lstmOutput.timing;
      }
    }

    const staticVector = [
      staticData.N_avg,
      staticData.P_avg,
      staticData.K_avg,
      staticData.pH,
      staticData.Soil_Moisture_avg,
      staticData.Crop_Stage,
      staticData.Host_Weight,
      staticData.Rotation_Flag,
      staticData.Monocrop_Flag,
      staticData.Irrigation_Type,
      staticData.Proximity
    ];

    const xRfRow = [...hT, baseRisk, ...staticVector];
    const xRf = [xRfRow];

    const riskClass = this.rf.predict(xRf)[0] ?? 0;
    const riskProbs = this.rf.predictProba(xRf)[0] ?? [1, 0, 0, 0];

    const decision = this.fuseDecision(riskClass, timingDays, riskProbs);

    return {
      risk_level: riskClass,
      probabilities: riskProbs,
      timing_days: timingDays,
      alert_message: decision.message,
      recommended_action: decision.action
    };
  }

  private fuseDecision(riskClass: number, timing: number, probs: number[]) {
    if (riskClass === 0) {
      return { message: "Low Risk", action: "Monitor weekly" };
    }
    
    if (riskClass === 1) {
      if (timing > 10) {
        return { message: "Moderate Risk", action: "Set traps, scout in 5 days" };
      }
      if (timing >= 5 && timing <= 10) {
        return { message: "Moderate Risk (Approaching)", action: "Apply Biopesticide in 3 days" };
      }
    }
    
    if (riskClass === 2) {
      if (timing > 5) {
        return { message: "HIGH Risk", action: "Apply Bt/Neem within 48 hrs" };
      }
      if (timing <= 5) {
        return { message: "HIGH Risk (Imminent)", action: "Immediate chemical spray recommended" };
      }
    }
    
    if (riskClass === 3) {
      return { message: "CRITICAL", action: "Emergency: Combined Biological + Chemical intervention" };
    }
    
    return { message: "Unknown", action: "Manual scouting required" };
  }
}
