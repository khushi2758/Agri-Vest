export interface BbchEntry {
  range: [number, number];
  central: number;
  synonyms: string[];
}

export const BBCH_TABLE: Record<number, BbchEntry> = {
  0: { range: [0, 19], central: 12, synonyms: ["seedling", "germination", "emerge", "1-2 leaf"] },
  1: { range: [20, 39], central: 32, synonyms: ["tillering", "vegetative", "leaf development"] },
  2: { range: [40, 49], central: 45, synonyms: ["booting", "stem elongation", "jointing", "internode"] },
  3: { range: [50, 59], central: 55, synonyms: ["heading", "inflorescence", "panicle", "earing"] },
  4: { range: [60, 69], central: 65, synonyms: ["flowering", "bloom", "anthesis", "50% flower", "full bloom"] },
  5: { range: [70, 79], central: 75, synonyms: ["fruiting", "pod", "grain fill", "berry", "pod development"] },
  6: { range: [80, 89], central: 85, synonyms: ["maturity", "ripening", "senescence", "harvest"] }
};
