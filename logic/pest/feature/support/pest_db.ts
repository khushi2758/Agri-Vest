export interface PestAttackEntry {
  macros: number[];
  sub_ranges: [number, number][];
}

export const PEST_ATTACK_DB: Record<string, PestAttackEntry> = {
  "Stem_Borer": { macros: [1, 2], sub_ranges: [[31, 39], [41, 49]] },
  "Fruit_Borer": { macros: [4, 5], sub_ranges: [[61, 69], [71, 79]] },
  "Seedling_Pest": { macros: [0], sub_ranges: [[10, 19]] },
  "Leaf_Folder": { macros: [1, 2, 3], sub_ranges: [[21, 49]] }
};
