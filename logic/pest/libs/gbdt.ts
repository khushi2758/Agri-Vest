export interface GbdtConfig {
  maxDepth?: number;
  nEstimators?: number;
  learningRate?: number;
  importanceThreshold?: number;
}

export type RawDataRow = Record<string, any>;
export type CleanDataRow = Record<string, number>;

export class GbdtComponent {
  private maxDepth: number;
  private nEstimators: number;
  private learningRate: number;
  private importanceThreshold: number;
  
  public selectedFeatures: string[] = [];
  public isTrained: boolean = false;

  private stageMapping: Record<string, number> = {
    'Seedling': 0,
    'Vegetative': 1,
    'Flowering': 2,
    'Fruiting': 3,
    'Harvest': 4
  };

  private quantileCache: Record<string, { q01: number; q99: number }> = {};

  constructor(config?: GbdtConfig) {
    this.maxDepth = config?.maxDepth ?? 5;
    this.nEstimators = config?.nEstimators ?? 500;
    this.learningRate = config?.learningRate ?? 0.05;
    this.importanceThreshold = config?.importanceThreshold ?? 0.95;
  }

  private calculateQuantiles(values: number[]): { q01: number; q99: number } {
    if (values.length === 0) return { q01: 0, q99: 0 };
    const sorted = [...values].sort((a, b) => a - b);
    const idx01 = Math.floor(sorted.length * 0.01);
    const idx99 = Math.floor(sorted.length * 0.99);
    return {
      q01: sorted[idx01] ?? sorted[0],
      q99: sorted[idx99 >= sorted.length ? sorted.length - 1 : idx99] ?? sorted[sorted.length - 1]
    };
  }

  public preprocess(rawData: RawDataRow[], isTraining: boolean = false): CleanDataRow[] {
    const cleaned: CleanDataRow[] = [];
    const keys = rawData.length > 0 ? Object.keys(rawData[0]) : [];
    const numericKeys = keys.filter(k => typeof rawData[0][k] === 'number');

    if (isTraining) {
      numericKeys.forEach(key => {
        const values = rawData.map(row => Number(row[key]) || 0);
        this.quantileCache[key] = this.calculateQuantiles(values);
      });
    }

    let lastValidRow: CleanDataRow = {};

    for (const row of rawData) {
      const processedRow: CleanDataRow = {};

      for (const key of keys) {
        let val = row[key];

        if (val === null || val === undefined) {
          val = lastValidRow[key] !== undefined ? lastValidRow[key] : 0;
        }

        if (key === 'Stage') {
          processedRow['Stage_Num'] = this.stageMapping[String(val)] ?? -1;
        } else if (typeof val === 'number') {
          const limits = this.quantileCache[key];
          if (limits) {
            val = Math.max(limits.q01, Math.min(val, limits.q99));
          }
          processedRow[key] = val;
        } else {
          processedRow[key] = Number(val) || 0;
        }
      }

      lastValidRow = { ...processedRow };
      cleaned.push(processedRow);
    }

    return cleaned;
  }

  public train(xRaw: RawDataRow[], yLabels: number[]) {
    const xClean = this.preprocess(xRaw, true);
    
    if (xClean.length === 0) {
      throw new Error("Empty training data");
    }

    const availableFeatures = Object.keys(xClean[0]);
    
    const mockImportances = availableFeatures.map(() => Math.random());
    const totalImportance = mockImportances.reduce((a, b) => a + b, 0);
    const normalizedImportances = mockImportances.map(v => v / totalImportance);
    
    const featureScores = availableFeatures.map((feat, idx) => ({
      feature: feat,
      score: normalizedImportances[idx]
    })).sort((a, b) => b.score - a.score);

    let cumulative = 0;
    this.selectedFeatures = [];
    
    for (const fs of featureScores) {
      this.selectedFeatures.push(fs.feature);
      cumulative += fs.score;
      if (cumulative >= this.importanceThreshold) {
        break;
      }
    }

    this.isTrained = true;

    const leafIndices = xClean.map(() => Array.from({ length: 10 }, () => Math.floor(Math.random() * 20)));
    const baseRiskScores = xClean.map(() => Math.random());

    return {
      selectedFeatures: this.selectedFeatures,
      leafEmbeddings: leafIndices,
      baseRiskScores
    };
  }

  public transform(newRawData: RawDataRow[]) {
    if (!this.isTrained) {
      throw new Error("GBDT Component must be trained before calling transform.");
    }

    const xClean = this.preprocess(newRawData, false);
    
    const xReduced = xClean.map(row => {
      const reducedRow: CleanDataRow = {};
      for (const feat of this.selectedFeatures) {
        reducedRow[feat] = row[feat] ?? 0;
      }
      return reducedRow;
    });

    const leafOut = xClean.map(() => Array.from({ length: 10 }, () => Math.floor(Math.random() * 20)));
    const baseOut = xClean.map(() => Math.random());

    return {
      xReduced,
      leafOut,
      baseOut
    };
  }
}
