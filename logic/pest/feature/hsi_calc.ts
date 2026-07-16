export function calculateHsi(rh: number, rhMin: number, rhOptLow: number, rhOptHigh: number, rhMax: number): number {
  if (rh < rhMin || rh > rhMax) {
    return 0;
  }
  
  if (rh >= rhOptLow && rh <= rhOptHigh) {
    return 1;
  }
  
  if (rh >= rhMin && rh < rhOptLow) {
    return (rh - rhMin) / (rhOptLow - rhMin);
  }
  
  if (rh > rhOptHigh && rh <= rhMax) {
    return (rhMax - rh) / (rhMax - rhOptHigh);
  }
  
  return 0;
}
