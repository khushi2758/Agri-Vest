export interface ValidationParams {
  npkIndex: number;
  moisturePct: number;
  tempCelsius: number;
  isFlagged: boolean;
}

export interface ValidationResult {
  probabilityOfSuccess: number;
  rangeOfSuccess: string;
  creditsEarned: number;
  validityScore: number;
}

export function calculateValidity(params: ValidationParams): ValidationResult {
  const optimalNpk = 60;
  const optimalMoisture = 45;
  const optimalTemp = 22;

  const npkScore = Math.max(0, 100 - Math.abs(params.npkIndex - optimalNpk) * 2);
  const moistureScore = Math.max(0, 100 - Math.abs(params.moisturePct - optimalMoisture) * 3);
  const tempScore = Math.max(0, 100 - Math.abs(params.tempCelsius - optimalTemp) * 5);

  const baseValidity = (npkScore + moistureScore + tempScore) / 3;
  
  let probabilityOfSuccess = baseValidity;
  
  if (params.isFlagged) {
    probabilityOfSuccess = Math.max(0, probabilityOfSuccess - 40);
  }

  let rangeOfSuccess = "Low";
  if (probabilityOfSuccess >= 80) rangeOfSuccess = "High";
  else if (probabilityOfSuccess >= 50) rangeOfSuccess = "Medium";

  const validityScore = Math.floor(probabilityOfSuccess);
  
  let creditsEarned = Math.floor(validityScore / 10);
  if (params.isFlagged && validityScore < 30) {
    creditsEarned += 10;
  } else if (!params.isFlagged && validityScore >= 80) {
    creditsEarned += 5;
  }

  return {
    probabilityOfSuccess: Number(probabilityOfSuccess.toFixed(2)),
    rangeOfSuccess,
    creditsEarned,
    validityScore
  };
}
