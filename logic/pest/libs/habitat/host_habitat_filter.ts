import PEST_REQUIREMENTS from "./pest_requirements.json";
import { STAGE_DURATION_DAYS } from "../../feature/support/stage_durations";

export interface FilterResult {
  status: "STOP" | "PROCEED_FULL" | "PROCEED_REDUCED" | "DELAY";
  risk_multiplier: number;
  message: string;
  delay_days: number | null;
  flags: {
    host_match: boolean | null;
    soil_suitable: boolean | null;
    stage_vulnerable: boolean | null;
  };
}

export class HostHabitatFilter {
  private pestName: string;
  private pestData: any;
  private lastResult: FilterResult | null = null;

  private SOIL_NORMALIZATION: Record<string, string> = {
    "sandy": "sandy",
    "sand": "sandy",
    "sandy loam": "sandy_loam",
    "loamy sand": "sandy_loam",
    "loam": "loam",
    "silty loam": "silty_loam",
    "silt": "silty_loam",
    "clay loam": "clay_loam",
    "clay": "clay",
    "heavy clay": "heavy_clay",
    "silty clay": "silty_clay",
    "organic": "organic_rich",
    "organic rich": "organic_rich",
    "well drained": "well_drained",
    "waterlogged": "waterlogged",
    "gravel": "gravelly",
    "gravelly": "gravelly",
    "any": "any"
  };

  constructor(pestName: string) {
    this.pestName = pestName;
    this.pestData = this.loadPestData(pestName);
    
    if (!this.pestData) {
      throw new Error(`Pest '${pestName}' not found in database.`);
    }
  }

  private loadPestData(name: string): any {
    for (const [key, data] of Object.entries(PEST_REQUIREMENTS)) {
      if (key.toLowerCase() === name.toLowerCase()) {
        return data;
      }
    }
    return null;
  }

  private normalizeSoil(rawSoil: string): string {
    const raw = rawSoil.trim().toLowerCase();
    for (const [key, code] of Object.entries(this.SOIL_NORMALIZATION)) {
      if (raw.includes(key)) {
        return code;
      }
    }
    return "any";
  }

  private isHostMatch(cropType: string): boolean {
    const hostList: string[] = this.pestData.hosts || [];
    const target = cropType.toLowerCase();
    return hostList.some(h => h.toLowerCase() === target);
  }

  private isSoilSuitable(soilCode: string): { suitable: boolean; multiplier: number } {
    const code = this.normalizeSoil(soilCode);
    const prefList: string[] = this.pestData.soil_preference || [];
    const avoidList: string[] = this.pestData.soil_avoid || [];

    if (prefList.includes("any")) {
      return { suitable: true, multiplier: 1.0 };
    }

    if (avoidList.includes(code)) {
      return { suitable: false, multiplier: 0.5 };
    }

    if (prefList.includes(code)) {
      return { suitable: true, multiplier: 1.0 };
    }

    return { suitable: true, multiplier: 0.7 };
  }

  private isStageVulnerable(currentMacroStage: number): { vulnerable: boolean; delayDays: number | null } {
    const vulnerableStages: number[] = this.pestData.vulnerable_macro_stages || [];

    if (vulnerableStages.includes(currentMacroStage)) {
      return { vulnerable: true, delayDays: null };
    }

    const futureVulnerable = vulnerableStages.filter(s => s > currentMacroStage);

    if (futureVulnerable.length > 0) {
      const nextStage = Math.min(...futureVulnerable);
      let delayDays = 0;
      
      for (let s = currentMacroStage + 1; s <= nextStage; s++) {
        delayDays += STAGE_DURATION_DAYS[s] ?? 10;
      }
      
      return { vulnerable: false, delayDays };
    }

    return { vulnerable: false, delayDays: 999 };
  }

  public applyFilters(cropType: string, soilType: string, currentMacroStage: number): FilterResult {
    const hostMatch = this.isHostMatch(cropType);

    if (!hostMatch) {
      const result: FilterResult = {
        status: "STOP",
        risk_multiplier: 0.0,
        message: `Crop '${cropType}' is NOT a host for ${this.pestName}. Population cannot establish. Pipeline halted.`,
        delay_days: null,
        flags: {
          host_match: false,
          soil_suitable: null,
          stage_vulnerable: null
        }
      };
      this.lastResult = result;
      return result;
    }

    const { suitable: soilSuitable, multiplier: soilMultiplier } = this.isSoilSuitable(soilType);
    const { vulnerable: stageVulnerable, delayDays } = this.isStageVulnerable(currentMacroStage);

    if (!stageVulnerable) {
      const result: FilterResult = {
        status: "DELAY",
        risk_multiplier: 0.0,
        message: `Crop stage (${currentMacroStage}) is NOT vulnerable to ${this.pestName}. Prediction delayed. Estimated time to vulnerability: ${delayDays} days.`,
        delay_days: delayDays,
        flags: {
          host_match: true,
          soil_suitable: soilSuitable,
          stage_vulnerable: false
        }
      };
      this.lastResult = result;
      return result;
    }

    if (soilSuitable) {
      const result: FilterResult = {
        status: "PROCEED_FULL",
        risk_multiplier: 1.0,
        message: `Host and stage conditions met. Soil is suitable. Proceeding with full risk assessment for ${this.pestName}.`,
        delay_days: null,
        flags: {
          host_match: true,
          soil_suitable: true,
          stage_vulnerable: true
        }
      };
      this.lastResult = result;
      return result;
    } else {
      const reduction = Math.round((1 - soilMultiplier) * 100);
      const result: FilterResult = {
        status: "PROCEED_REDUCED",
        risk_multiplier: soilMultiplier,
        message: `Host and stage conditions met. However, soil type '${soilType}' is sub-optimal for ${this.pestName}. Risk reduced by ${reduction}%.`,
        delay_days: null,
        flags: {
          host_match: true,
          soil_suitable: false,
          stage_vulnerable: true
        }
      };
      this.lastResult = result;
      return result;
    }
  }

  public getGatekeeperFlag(): string {
    if (!this.lastResult) return "UNKNOWN";
    
    const status = this.lastResult.status;
    if (status === "PROCEED_FULL" || status === "PROCEED_REDUCED") {
      return "GO";
    }
    return status;
  }

  public getRiskMultiplier(): number {
    if (!this.lastResult) return 0.0;
    return this.lastResult.risk_multiplier;
  }
}
