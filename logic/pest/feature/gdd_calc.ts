export function calculateGdd(tMax: number, tMin: number, tBase: number, tUpper: number): number {
  if (tMax < tBase || tMin > tUpper) {
    return 0;
  }

  if (tMin >= tBase && tMax <= tUpper) {
    return (tMax + tMin) / 2 - tBase;
  }

  const alpha = (tMax - tMin) / 2;
  const beta = (tMax + tMin) / 2;

  if (tMin < tBase) {
    const theta1 = Math.asin((tBase - beta) / alpha);
    return (1 / Math.PI) * ((beta - tBase) * (Math.PI / 2 - theta1) + alpha * Math.cos(theta1));
  }

  if (tMax > tUpper) {
    const theta2 = Math.asin((tUpper - beta) / alpha);
    return (1 / Math.PI) * ((beta - tBase) * (Math.PI / 2 + theta2) + alpha * Math.cos(theta2) - (tUpper - tBase) * (Math.PI / 2 - theta2));
  }

  return 0;
}
