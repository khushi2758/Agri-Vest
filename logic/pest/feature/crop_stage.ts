import { BBCH_TABLE } from "./support/bbch_table";
import { PEST_ATTACK_DB } from "./support/pest_db";
import { STAGE_DURATION_DAYS } from "./support/stage_durations";

export class CropStageMapper {
  private macroCode: number = 1;
  private bbchCode: number = 32;
  private daysInStage: number = 0;
  private previousMacro: number = 1;
  private temporalWeight: number = 1.0;
  private vulnerabilities: Record<string, number> = {};

  public update(rawStageString: string, currentDate: string) {
    const { newMacro, newBbch } = this.normalizeStage(rawStageString);

    if (newMacro !== this.macroCode) {
      this.daysInStage = 0;
      this.macroCode = newMacro;
      this.bbchCode = newBbch;
    } else {
      this.daysInStage += 1;
    }

    this.previousMacro = this.macroCode;

    const totalDur = STAGE_DURATION_DAYS[this.macroCode] ?? 14;
    const progress = totalDur > 0 ? this.daysInStage / totalDur : 0;

    if (progress < 0.4) {
      this.temporalWeight = 1.0;
    } else if (progress < 0.7) {
      this.temporalWeight = 0.7;
    } else {
      this.temporalWeight = 0.3;
    }

    this.vulnerabilities = this.calculateVulnerabilities(this.macroCode, this.bbchCode);

    return this.getOutputs();
  }

  private normalizeStage(raw: string): { newMacro: number; newBbch: number } {
    const rawClean = raw.toLowerCase().trim();

    for (const [macroStr, data] of Object.entries(BBCH_TABLE)) {
      const macro = Number(macroStr);
      for (const syn of data.synonyms) {
        if (rawClean.includes(syn)) {
          return { newMacro: macro, newBbch: data.central };
        }
      }
    }

    return { newMacro: 1, newBbch: 32 };
  }

  private calculateVulnerabilities(macro: number, bbch: number): Record<string, number> {
    const vulnScores: Record<string, number> = {};

    for (const [pestName, prefs] of Object.entries(PEST_ATTACK_DB)) {
      let score = 0.0;

      if (prefs.macros.includes(macro)) {
        score = 1.0;

        if (prefs.sub_ranges.length > 0) {
          let matched = false;
          for (const [start, end] of prefs.sub_ranges) {
            if (bbch >= start && bbch <= end) {
              matched = true;
              break;
            }
          }
          
          if (!matched) {
            let nearest = Infinity;
            for (const [start, end] of prefs.sub_ranges) {
              const distStart = Math.abs(bbch - start);
              const distEnd = Math.abs(bbch - end);
              nearest = Math.min(nearest, distStart, distEnd);
            }
            
            if (nearest <= 5) {
              score = 0.6;
            } else {
              score = 0.3;
            }
          }
        }
      }

      const finalScore = score * this.temporalWeight;
      vulnScores[pestName] = Math.round(finalScore * 100) / 100;
    }

    return vulnScores;
  }

  public getOutputs() {
    const vulnStem = (this.vulnerabilities["Stem_Borer"] ?? 0) >= 0.5 ? 1 : 0;
    const vulnFruit = (this.vulnerabilities["Fruit_Borer"] ?? 0) >= 0.5 ? 1 : 0;
    const vulnSeedling = (this.vulnerabilities["Seedling_Pest"] ?? 0) >= 0.5 ? 1 : 0;

    const maxVuln = Math.max(vulnStem, vulnFruit, vulnSeedling);
    const attackWeight = maxVuln * this.temporalWeight;
    
    const totalDur = STAGE_DURATION_DAYS[this.macroCode] ?? 14;

    return {
      BBCH_code: this.bbchCode,
      Macro_Stage: this.macroCode,
      Vuln_Stem_Borer: vulnStem,
      Vuln_Fruit_Borer: vulnFruit,
      Vuln_Seedling_Pest: vulnSeedling,
      Days_In_Stage: this.daysInStage,
      Stage_Progress_Ratio: Math.round((this.daysInStage / totalDur) * 100) / 100,
      Attack_Prob_Weight: Math.round(attackWeight * 100) / 100,
      All_Pest_Scores: this.vulnerabilities
    };
  }
}
