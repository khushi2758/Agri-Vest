import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

interface PestProfile {
  name: string;
  displayName: string;
  hosts: string[];
  soil_preference: string[];
  soil_avoid: string[];
  vulnerable_macro_stages: number[];
  stage_priority: string;
  optimalTempRange: [number, number];
  optimalHumidityRange: [number, number];
  rainSensitivity: number;
}

const PEST_PROFILES: PestProfile[] = [
  {
    name: "Fall_Armyworm",
    displayName: "Fall Armyworm",
    hosts: ["maize", "corn", "sorghum", "millet", "rice", "sugarcane", "cotton"],
    soil_preference: ["any"],
    soil_avoid: [],
    vulnerable_macro_stages: [0, 1, 2, 3, 4, 5],
    stage_priority: "medium",
    optimalTempRange: [25, 35],
    optimalHumidityRange: [60, 90],
    rainSensitivity: 0.7
  },
  {
    name: "Aphid_General",
    displayName: "Aphid Complex",
    hosts: ["wheat", "barley", "mustard", "potato", "tomato", "pepper", "soybeans", "apples"],
    soil_preference: ["any"],
    soil_avoid: [],
    vulnerable_macro_stages: [0, 1, 4],
    stage_priority: "medium",
    optimalTempRange: [15, 28],
    optimalHumidityRange: [50, 80],
    rainSensitivity: -0.5
  },
  {
    name: "Cotton_Bollworm",
    displayName: "Cotton Bollworm",
    hosts: ["cotton", "tomato", "chickpea", "maize", "corn", "pepper"],
    soil_preference: ["sandy_loam", "loam", "clay_loam"],
    soil_avoid: ["pure_sand", "heavy_clay"],
    vulnerable_macro_stages: [4, 5],
    stage_priority: "high",
    optimalTempRange: [20, 32],
    optimalHumidityRange: [55, 85],
    rainSensitivity: 0.4
  },
  {
    name: "Rice_Stem_Borer",
    displayName: "Rice Stem Borer",
    hosts: ["rice"],
    soil_preference: ["clay", "clay_loam", "silty_clay"],
    soil_avoid: ["sandy", "gravelly"],
    vulnerable_macro_stages: [1, 2],
    stage_priority: "high",
    optimalTempRange: [25, 35],
    optimalHumidityRange: [70, 95],
    rainSensitivity: 0.8
  },
  {
    name: "Sugarcane_Borer",
    displayName: "Sugarcane Borer",
    hosts: ["sugarcane", "rice", "maize", "corn"],
    soil_preference: ["clay", "clay_loam", "silty_clay"],
    soil_avoid: ["sandy", "gravelly"],
    vulnerable_macro_stages: [1, 2, 3],
    stage_priority: "high",
    optimalTempRange: [22, 33],
    optimalHumidityRange: [65, 90],
    rainSensitivity: 0.6
  },
  {
    name: "Corn_Earworm",
    displayName: "Corn Earworm",
    hosts: ["maize", "corn", "tomato", "cotton", "soybean", "soybeans", "pepper"],
    soil_preference: ["any"],
    soil_avoid: [],
    vulnerable_macro_stages: [4, 5],
    stage_priority: "high",
    optimalTempRange: [20, 30],
    optimalHumidityRange: [50, 80],
    rainSensitivity: 0.3
  },
  {
    name: "Citrus_Leaf_Miner",
    displayName: "Citrus Leaf Miner",
    hosts: ["orange", "oranges", "lemon", "grapefruit", "lime", "citrus"],
    soil_preference: ["any"],
    soil_avoid: [],
    vulnerable_macro_stages: [0, 1, 2],
    stage_priority: "medium",
    optimalTempRange: [25, 35],
    optimalHumidityRange: [60, 90],
    rainSensitivity: 0.5
  },
  {
    name: "Diamondback_Moth",
    displayName: "Diamondback Moth",
    hosts: ["cabbage", "broccoli", "cauliflower", "canola", "mustard"],
    soil_preference: ["any"],
    soil_avoid: [],
    vulnerable_macro_stages: [0, 1, 4],
    stage_priority: "high",
    optimalTempRange: [18, 30],
    optimalHumidityRange: [40, 70],
    rainSensitivity: -0.6
  },
  {
    name: "Mango_Mealybug",
    displayName: "Mango Mealybug",
    hosts: ["mango", "guava", "citrus"],
    soil_preference: ["loam", "organic_rich"],
    soil_avoid: ["sandy", "gravelly"],
    vulnerable_macro_stages: [0, 1, 2, 4],
    stage_priority: "medium",
    optimalTempRange: [20, 35],
    optimalHumidityRange: [60, 85],
    rainSensitivity: 0.4
  },
  {
    name: "Colorado_Potato_Beetle",
    displayName: "Colorado Potato Beetle",
    hosts: ["potato", "tomato", "eggplant"],
    soil_preference: ["sandy_loam", "loam"],
    soil_avoid: ["waterlogged", "heavy_clay"],
    vulnerable_macro_stages: [1, 2, 5],
    stage_priority: "high",
    optimalTempRange: [20, 30],
    optimalHumidityRange: [40, 70],
    rainSensitivity: -0.3
  }
];

function normalizeSoil(raw: string): string {
  const lower = raw.toLowerCase().trim();
  const map: Record<string, string> = {
    "sandy": "sandy", "sand": "sandy", "sandy loam": "sandy_loam",
    "loamy sand": "sandy_loam", "loam": "loam", "loamy": "loam",
    "silty loam": "silty_loam", "silt": "silty_loam",
    "clay loam": "clay_loam", "clay": "clay", "heavy clay": "heavy_clay",
    "silty clay": "silty_clay", "organic": "organic_rich",
    "well drained": "well_drained", "waterlogged": "waterlogged",
    "gravel": "gravelly", "gravelly": "gravelly",
    "alluvial": "loam", "black": "clay_loam", "red": "loam",
    "laterite": "clay", "any": "any"
  };
  for (const [key, code] of Object.entries(map)) {
    if (lower.includes(key)) return code;
  }
  return "loam";
}

function calculateTempSuitability(temp: number, range: [number, number]): number {
  const [low, high] = range;
  if (temp >= low && temp <= high) return 1.0;
  if (temp < low) return Math.max(0, 1 - (low - temp) / 15);
  return Math.max(0, 1 - (temp - high) / 15);
}

function calculateHumiditySuitability(rh: number, range: [number, number]): number {
  const [low, high] = range;
  if (rh >= low && rh <= high) return 1.0;
  if (rh < low) return Math.max(0, 1 - (low - rh) / 30);
  return Math.max(0, 1 - (rh - high) / 30);
}

function getMonthFromDate(): number {
  return new Date().getMonth();
}

function estimateCropStage(cropType: string): number {
  const month = getMonthFromDate();
  const cropSeasons: Record<string, { plant: number; harvest: number }> = {
    corn: { plant: 3, harvest: 9 },
    maize: { plant: 3, harvest: 9 },
    wheat: { plant: 10, harvest: 6 },
    rice: { plant: 4, harvest: 10 },
    soybeans: { plant: 4, harvest: 9 },
    soybean: { plant: 4, harvest: 9 },
    cotton: { plant: 3, harvest: 9 },
    sugarcane: { plant: 1, harvest: 11 },
    barley: { plant: 3, harvest: 7 },
    hops: { plant: 3, harvest: 8 },
    peaches: { plant: 2, harvest: 7 },
    oranges: { plant: 0, harvest: 11 },
    apples: { plant: 2, harvest: 9 },
    coffee: { plant: 3, harvest: 10 },
    grapes: { plant: 2, harvest: 8 },
    olives: { plant: 2, harvest: 10 },
  };

  const season = cropSeasons[cropType.toLowerCase()] || { plant: 2, harvest: 9 };
  let elapsed: number;
  if (season.harvest >= season.plant) {
    elapsed = month >= season.plant ? month - season.plant : 0;
  } else {
    elapsed = month >= season.plant ? month - season.plant : (12 - season.plant) + month;
  }

  const totalMonths = season.harvest >= season.plant
    ? season.harvest - season.plant
    : (12 - season.plant) + season.harvest;

  const progress = totalMonths > 0 ? elapsed / totalMonths : 0.5;

  if (progress < 0.1) return 0;
  if (progress < 0.3) return 1;
  if (progress < 0.45) return 2;
  if (progress < 0.6) return 3;
  if (progress < 0.8) return 4;
  return 5;
}

function computePestRisk(
  pest: PestProfile,
  temp: number,
  humidity: number,
  windSpeed: number,
  cropType: string,
  soilType: string
): {
  riskScore: number;
  riskLevel: string;
  probability: number;
  timingDays: number;
  action: string;
  factors: { temp: number; humidity: number; host: boolean; soil: boolean; stage: boolean };
} {
  const cropLower = cropType.toLowerCase();
  const hostMatch = pest.hosts.some(h => cropLower.includes(h) || h.includes(cropLower));

  if (!hostMatch) {
    return {
      riskScore: 0,
      riskLevel: "none",
      probability: 0,
      timingDays: 999,
      action: "Not applicable for this crop",
      factors: { temp: 0, humidity: 0, host: false, soil: false, stage: false }
    };
  }

  const normalizedSoil = normalizeSoil(soilType);
  let soilMultiplier = 0.7;
  if (pest.soil_preference.includes("any")) {
    soilMultiplier = 1.0;
  } else if (pest.soil_avoid.includes(normalizedSoil)) {
    soilMultiplier = 0.3;
  } else if (pest.soil_preference.includes(normalizedSoil)) {
    soilMultiplier = 1.0;
  }

  const macroStage = estimateCropStage(cropType);
  const stageVulnerable = pest.vulnerable_macro_stages.includes(macroStage);

  let stageMultiplier = 0.15;
  if (stageVulnerable) {
    stageMultiplier = 1.0;
  } else {
    const futureVuln = pest.vulnerable_macro_stages.filter(s => s > macroStage);
    if (futureVuln.length > 0) {
      stageMultiplier = 0.3;
    }
  }

  const tempScore = calculateTempSuitability(temp, pest.optimalTempRange);
  const humidityScore = calculateHumiditySuitability(humidity, pest.optimalHumidityRange);

  let windFactor = 1.0;
  if (windSpeed > 25) windFactor = 0.6;
  else if (windSpeed > 15) windFactor = 0.8;

  const rawRisk = (tempScore * 0.30 + humidityScore * 0.25 + soilMultiplier * 0.15 + stageMultiplier * 0.25 + windFactor * 0.05);
  const clampedRisk = Math.min(1, Math.max(0, rawRisk));

  let riskLevel: string;
  let timingDays: number;
  let action: string;

  if (clampedRisk < 0.25) {
    riskLevel = "low";
    timingDays = 30;
    action = "Monitor weekly, maintain standard scouting";
  } else if (clampedRisk < 0.50) {
    riskLevel = "moderate";
    timingDays = 14;
    action = "Set traps, scout every 5 days, prepare biopesticide";
  } else if (clampedRisk < 0.75) {
    riskLevel = "high";
    timingDays = 5;
    action = "Apply Bt/Neem within 48 hours, increase scouting";
  } else {
    riskLevel = "critical";
    timingDays = 2;
    action = "Emergency: Combined biological + chemical intervention";
  }

  if (!stageVulnerable && riskLevel !== "low") {
    const futureVuln = pest.vulnerable_macro_stages.filter(s => s > macroStage);
    if (futureVuln.length > 0) {
      timingDays = Math.max(timingDays, (futureVuln[0] - macroStage) * 15);
    }
  }

  return {
    riskScore: Math.round(clampedRisk * 100),
    riskLevel,
    probability: Math.round(clampedRisk * 100),
    timingDays,
    action,
    factors: {
      temp: Math.round(tempScore * 100),
      humidity: Math.round(humidityScore * 100),
      host: hostMatch,
      soil: soilMultiplier >= 0.7,
      stage: stageVulnerable
    }
  };
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.roles?.includes("agronomist")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const temp = parseFloat(searchParams.get("temp") || "25");
    const humidity = parseFloat(searchParams.get("humidity") || "60");
    const windSpeed = parseFloat(searchParams.get("windSpeed") || "10");
    const cropType = searchParams.get("crop") || "wheat";
    const soilType = searchParams.get("soil") || "loamy";

    const predictions = PEST_PROFILES
      .map(pest => {
        const result = computePestRisk(pest, temp, humidity, windSpeed, cropType, soilType);
        return {
          pestName: pest.name,
          displayName: pest.displayName,
          priority: pest.stage_priority,
          ...result
        };
      })
      .filter(p => p.riskLevel !== "none")
      .sort((a, b) => b.riskScore - a.riskScore);

    const overallRisk = predictions.length > 0
      ? Math.round(predictions.reduce((sum, p) => sum + p.riskScore, 0) / predictions.length)
      : 0;

    let overallLevel = "low";
    if (overallRisk >= 75) overallLevel = "critical";
    else if (overallRisk >= 50) overallLevel = "high";
    else if (overallRisk >= 25) overallLevel = "moderate";

    return NextResponse.json({
      overallRisk,
      overallLevel,
      predictions,
      analyzedAt: new Date().toISOString(),
      inputs: { temp, humidity, windSpeed, cropType, soilType }
    });
  } catch (error) {
    console.error("Pest prediction error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
