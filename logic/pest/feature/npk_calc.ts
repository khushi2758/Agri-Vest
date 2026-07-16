export interface NpkResult {
  neiScore: number;
  nExcessFlag: boolean;
  kSufficiencyScore: number;
  pStressFlag: number;
  npRatio: number;
  knRatio: number;
}

export function calculateNpkIndices(
  nActual: number,
  pActual: number,
  kActual: number,
  nOptimal: number,
  pCritical: number,
  knOptimal: number = 1.2
): NpkResult {
  const epsilon = 1e-6;

  const nei = nActual / Math.max(nOptimal, epsilon);
  
  let neiScore = 0.5;
  let nExcessFlag = false;

  if (nei > 1.2) {
    neiScore = 1.0;
    nExcessFlag = true;
  } else if (nei < 0.7) {
    neiScore = 0.3;
  }

  const npRatio = nActual / (pActual + epsilon);
  const knRatio = kActual / (nActual + epsilon);

  const kSufficiencyScore = Math.min(1, Math.max(0, knRatio / knOptimal));

  const pStressFlag = pActual < pCritical ? 1 : 0;

  return {
    neiScore,
    nExcessFlag,
    kSufficiencyScore,
    pStressFlag,
    npRatio,
    knRatio
  };
}
