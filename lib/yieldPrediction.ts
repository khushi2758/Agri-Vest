export class SimpleLinearRegression {
  private m: number = 0;
  private b: number = 0;

  public fit(x: number[], y: number[]): void {
    if (x.length !== y.length || x.length === 0) {
      throw new Error("Data arrays must be of equal length and non-empty.");
    }
    const n = x.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumXX += x[i] * x[i];
    }
    const meanX = sumX / n;
    const meanY = sumY / n;
    const numerator = sumXY - n * meanX * meanY;
    const denominator = sumXX - n * meanX * meanX;
    this.m = denominator === 0 ? 0 : numerator / denominator;
    this.b = meanY - this.m * meanX;
  }

  public predict(x: number): number {
    return this.m * x + this.b;
  }
}

export class MultipleLinearRegression {
  private weights: number[];
  private bias: number;
  private learningRate: number;
  private iterations: number;

  constructor(featuresCount: number, learningRate = 0.01, iterations = 1000) {
    this.weights = new Array(featuresCount).fill(0);
    this.bias = 0;
    this.learningRate = learningRate;
    this.iterations = iterations;
  }

  public fit(X: number[][], y: number[]): void {
    const n = y.length;
    for (let iter = 0; iter < this.iterations; iter++) {
      let dWeight = new Array(this.weights.length).fill(0);
      let dBias = 0;
      for (let i = 0; i < n; i++) {
        let yPredicted = this.bias;
        for (let j = 0; j < this.weights.length; j++) {
          yPredicted += this.weights[j] * X[i][j];
        }
        const error = yPredicted - y[i];
        for (let j = 0; j < this.weights.length; j++) {
          dWeight[j] += (2 / n) * error * X[i][j];
        }
        dBias += (2 / n) * error;
      }
      for (let j = 0; j < this.weights.length; j++) {
        this.weights[j] -= this.learningRate * dWeight[j];
      }
      this.bias -= this.learningRate * dBias;
    }
  }

  public predict(x: number[]): number {
    if (x.length !== this.weights.length) {
      throw new Error("Input features length does not match trained weights.");
    }
    let prediction = this.bias;
    for (let i = 0; i < this.weights.length; i++) {
      prediction += this.weights[i] * x[i];
    }
    return prediction;
  }
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export interface SensorData {
  npkIndex: number;
  moisturePct: number;
  lightIndex: number;
  tempCelsius: number;
}

export function calculateYieldProbability(data: SensorData, targetYield: number = 200) {
  const npkScore = (data.npkIndex - 50) / 10;
  const moistureScore = -Math.abs(data.moisturePct - 35) / 5 + 3;
  const lightScore = (data.lightIndex - 60) / 10;
  const tempScore = -Math.abs(data.tempCelsius - 22) / 3 + 2;

  const zScore = (npkScore * 1.5) + (moistureScore * 2.0) + (lightScore * 0.8) + (tempScore * 1.2);
  const probability = sigmoid(zScore);
  const estimatedYield = 150 + (zScore * 15);

  return {
    estimatedYield: Math.max(0, Math.round(estimatedYield * 10) / 10),
    probabilityPercent: Math.round(probability * 100),
    isOptimal: probability > 0.75,
    targetYield,
  };
}
