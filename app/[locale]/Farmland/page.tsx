"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, LayoutDashboard, BarChart2, Wallet, Briefcase, Settings,
  Loader2, MapPin, Leaf, Droplets, Radio, Satellite, Wind,
  TrendingUp, TrendingDown, Sprout, CheckCircle2, ChevronRight, Flame, Minus,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { MapWidget } from "@/app/[locale]/Agronomist/components/MapWidget";
import NavBar from "../navbar";

// ---------------------------------------------------------------------------
// Sample data — replace with a real fetch to /api/farms once the backend
// exists. Shaped the way a farmer-owned multi-plot response would look.
// ---------------------------------------------------------------------------
type Farm = {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  area_ha: number;
  crop: string;
  growthStage: string;
  technologies: {
    key: string;
    name: string;
    icon: "sensor" | "irrigation" | "drone" | "weather";
    active: boolean;
    yieldImpact: number; // % increase attributed to this tech
  }[];
  yieldTrend: { month: string; traditional: number; withTech: number }[];
  soilMoisture: { day: string; zoneA: number; zoneB: number; zoneC: number }[];
  growthDistribution: { stage: string; value: number }[];
  demand: {
    score: number; // 0-100, higher = more investor demand
    investorInterest: number; // investors currently waitlisted/interested
    fundingVelocity: number; // % of funding goal filled per week
    trend: { week: string; score: number }[];
  };
};

const TECH_ICON = { sensor: Radio, irrigation: Droplets, drone: Satellite, weather: Wind };

function demandLevel(score: number): { label: string; color: string; bg: string; border: string } {
  if (score >= 70) return { label: "High demand", color: "text-green-700", bg: "bg-green-500/10", border: "border-green-300/40" };
  if (score >= 40) return { label: "Moderate demand", color: "text-amber-700", bg: "bg-amber-500/10", border: "border-amber-300/40" };
  return { label: "Low demand", color: "text-red-600", bg: "bg-red-500/10", border: "border-red-300/40" };
}

function demandTrendDirection(trend: { week: string; score: number }[]): "up" | "down" | "flat" {
  if (trend.length < 2) return "flat";
  const delta = trend[trend.length - 1].score - trend[0].score;
  if (delta > 1) return "up";
  if (delta < -1) return "down";
  return "flat";
}

function WaterGlassStyles() {
  return (
    <style jsx global>{`
      .water-glass-card {
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }
      .water-glass-card > * {
        position: relative;
        z-index: 1;
      }

      .water-glass-light {
        background: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.75),
          inset 0 -14px 22px -16px rgba(255, 255, 255, 0.35),
          0 10px 28px rgba(20, 40, 30, 0.10);
      }

      .water-glass-card::before {
        content: "";
        position: absolute;
        top: -65%;
        left: -25%;
        width: 40%;
        height: 230%;
        background: linear-gradient(
          115deg,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.14) 45%,
          rgba(255, 255, 255, 0) 75%
        );
        transform: rotate(12deg);
        pointer-events: none;
        z-index: 0;
      }

      .water-glass-card::after {
        content: "";
        position: absolute;
        bottom: 10px;
        right: 12px;
        width: 14px;
        height: 14px;
        border-radius: 9999px;
        background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.05) 70%);
        pointer-events: none;
        z-index: 0;
      }

      /* tinted glass chip: demand badges, tech-in-use rows, farm-list cards */
      .water-glass-chip {
        position: relative;
        overflow: hidden;
        isolation: isolate;
        backdrop-filter: blur(12px) saturate(160%);
        -webkit-backdrop-filter: blur(12px) saturate(160%);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.45),
          inset 0 -8px 14px -10px rgba(255, 255, 255, 0.25);
      }
      .water-glass-chip > * {
        position: relative;
        z-index: 1;
      }
      .water-glass-chip::before {
        content: "";
        position: absolute;
        top: -70%;
        left: -20%;
        width: 40%;
        height: 240%;
        background: linear-gradient(
          115deg,
          rgba(255, 255, 255, 0.4) 0%,
          rgba(255, 255, 255, 0.1) 45%,
          rgba(255, 255, 255, 0) 75%
        );
        transform: rotate(12deg);
        pointer-events: none;
        z-index: 0;
      }

      .water-glass-hover {
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
      }
      .water-glass-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 32px rgba(20, 40, 30, 0.14);
      }

      @media (prefers-reduced-motion: reduce) {
        .water-glass-card, .water-glass-chip, .water-glass-hover { transition: none !important; }
      }
    `}</style>
  );
}

const SAMPLE_FARMS: Farm[] = [
  {
    id: "farm-1",
    name: "Green Meadow Plot A",
    location: "Ashanti Region, Ghana",
    lat: 6.7,
    lng: -1.6,
    area_ha: 12.4,
    crop: "Maize",
    growthStage: "Flowering",
    technologies: [
      { key: "sensor", name: "Soil moisture sensors (12 nodes)", icon: "sensor", active: true, yieldImpact: 14 },
      { key: "irrigation", name: "Automated drip irrigation", icon: "irrigation", active: true, yieldImpact: 21 },
      { key: "drone", name: "Drone NDVI imagery", icon: "drone", active: true, yieldImpact: 9 },
      { key: "weather", name: "On-site weather station", icon: "weather", active: false, yieldImpact: 6 },
    ],
    yieldTrend: [
      { month: "Jan", traditional: 40, withTech: 42 },
      { month: "Feb", traditional: 42, withTech: 48 },
      { month: "Mar", traditional: 41, withTech: 53 },
      { month: "Apr", traditional: 44, withTech: 61 },
      { month: "May", traditional: 43, withTech: 68 },
      { month: "Jun", traditional: 45, withTech: 74 },
    ],
    soilMoisture: [
      { day: "Mon", zoneA: 62, zoneB: 58, zoneC: 65 },
      { day: "Tue", zoneA: 60, zoneB: 55, zoneC: 63 },
      { day: "Wed", zoneA: 64, zoneB: 59, zoneC: 66 },
      { day: "Thu", zoneA: 61, zoneB: 57, zoneC: 64 },
      { day: "Fri", zoneA: 65, zoneB: 60, zoneC: 68 },
      { day: "Sat", zoneA: 63, zoneB: 58, zoneC: 65 },
      { day: "Sun", zoneA: 66, zoneB: 61, zoneC: 69 },
    ],
    growthDistribution: [
      { stage: "Seedling", value: 5 },
      { stage: "Vegetative", value: 20 },
      { stage: "Flowering", value: 55 },
      { stage: "Harvest-ready", value: 20 },
    ],
    demand: {
      score: 72,
      investorInterest: 34,
      fundingVelocity: 18,
      trend: [
        { week: "W1", score: 65 },
        { week: "W2", score: 70 },
        { week: "W3", score: 74 },
        { week: "W4", score: 72 },
      ],
    },
  },
  {
    id: "farm-2",
    name: "Riverbend Plot",
    location: "Volta Region, Ghana",
    lat: 6.9,
    lng: 0.3,
    area_ha: 8.1,
    crop: "Cassava",
    growthStage: "Vegetative",
    technologies: [
      { key: "sensor", name: "Soil moisture sensors (8 nodes)", icon: "sensor", active: true, yieldImpact: 11 },
      { key: "irrigation", name: "Automated drip irrigation", icon: "irrigation", active: false, yieldImpact: 18 },
      { key: "drone", name: "Drone NDVI imagery", icon: "drone", active: true, yieldImpact: 8 },
      { key: "weather", name: "On-site weather station", icon: "weather", active: true, yieldImpact: 7 },
    ],
    yieldTrend: [
      { month: "Jan", traditional: 30, withTech: 31 },
      { month: "Feb", traditional: 31, withTech: 34 },
      { month: "Mar", traditional: 30, withTech: 37 },
      { month: "Apr", traditional: 32, withTech: 41 },
      { month: "May", traditional: 31, withTech: 45 },
      { month: "Jun", traditional: 33, withTech: 49 },
    ],
    soilMoisture: [
      { day: "Mon", zoneA: 55, zoneB: 50, zoneC: 58 },
      { day: "Tue", zoneA: 54, zoneB: 49, zoneC: 56 },
      { day: "Wed", zoneA: 57, zoneB: 52, zoneC: 59 },
      { day: "Thu", zoneA: 56, zoneB: 51, zoneC: 58 },
      { day: "Fri", zoneA: 58, zoneB: 53, zoneC: 61 },
      { day: "Sat", zoneA: 57, zoneB: 52, zoneC: 60 },
      { day: "Sun", zoneA: 59, zoneB: 54, zoneC: 62 },
    ],
    growthDistribution: [
      { stage: "Seedling", value: 15 },
      { stage: "Vegetative", value: 50 },
      { stage: "Flowering", value: 25 },
      { stage: "Harvest-ready", value: 10 },
    ],
    demand: {
      score: 58,
      investorInterest: 18,
      fundingVelocity: 12,
      trend: [
        { week: "W1", score: 52 },
        { week: "W2", score: 55 },
        { week: "W3", score: 60 },
        { week: "W4", score: 58 },
      ],
    },
  },
  {
    id: "farm-3",
    name: "Sundown Grain Estate",
    location: "Northern Region, Ghana",
    lat: 9.4,
    lng: -0.9,
    area_ha: 20.6,
    crop: "Sorghum",
    growthStage: "Harvest-ready",
    technologies: [
      { key: "sensor", name: "Soil moisture sensors (18 nodes)", icon: "sensor", active: true, yieldImpact: 16 },
      { key: "irrigation", name: "Automated drip irrigation", icon: "irrigation", active: true, yieldImpact: 24 },
      { key: "drone", name: "Drone NDVI imagery", icon: "drone", active: true, yieldImpact: 11 },
      { key: "weather", name: "On-site weather station", icon: "weather", active: true, yieldImpact: 8 },
    ],
    yieldTrend: [
      { month: "Jan", traditional: 50, withTech: 55 },
      { month: "Feb", traditional: 51, withTech: 63 },
      { month: "Mar", traditional: 50, withTech: 70 },
      { month: "Apr", traditional: 52, withTech: 78 },
      { month: "May", traditional: 53, withTech: 84 },
      { month: "Jun", traditional: 53, withTech: 88 },
    ],
    soilMoisture: [
      { day: "Mon", zoneA: 66, zoneB: 61, zoneC: 70 },
      { day: "Tue", zoneA: 64, zoneB: 60, zoneC: 68 },
      { day: "Wed", zoneA: 67, zoneB: 63, zoneC: 71 },
      { day: "Thu", zoneA: 65, zoneB: 61, zoneC: 69 },
      { day: "Fri", zoneA: 68, zoneB: 64, zoneC: 72 },
      { day: "Sat", zoneA: 66, zoneB: 62, zoneC: 70 },
      { day: "Sun", zoneA: 69, zoneB: 65, zoneC: 73 },
    ],
    growthDistribution: [
      { stage: "Seedling", value: 2 },
      { stage: "Vegetative", value: 8 },
      { stage: "Flowering", value: 15 },
      { stage: "Harvest-ready", value: 75 },
    ],
    demand: {
      score: 85,
      investorInterest: 52,
      fundingVelocity: 27,
      trend: [
        { week: "W1", score: 78 },
        { week: "W2", score: 80 },
        { week: "W3", score: 84 },
        { week: "W4", score: 85 },
      ],
    },
  },
  {
    id: "farm-4",
    name: "Highland Terrace Plot",
    location: "Eastern Region, Ghana",
    lat: 6.2,
    lng: -0.3,
    area_ha: 5.5,
    crop: "Cocoa",
    growthStage: "Seedling",
    technologies: [
      { key: "sensor", name: "Soil moisture sensors (4 nodes)", icon: "sensor", active: false, yieldImpact: 10 },
      { key: "irrigation", name: "Automated drip irrigation", icon: "irrigation", active: false, yieldImpact: 15 },
      { key: "drone", name: "Drone NDVI imagery", icon: "drone", active: false, yieldImpact: 7 },
      { key: "weather", name: "On-site weather station", icon: "weather", active: true, yieldImpact: 5 },
    ],
    yieldTrend: [
      { month: "Jan", traditional: 20, withTech: 21 },
      { month: "Feb", traditional: 21, withTech: 22 },
      { month: "Mar", traditional: 20, withTech: 23 },
      { month: "Apr", traditional: 22, withTech: 25 },
      { month: "May", traditional: 21, withTech: 26 },
      { month: "Jun", traditional: 22, withTech: 27 },
    ],
    soilMoisture: [
      { day: "Mon", zoneA: 44, zoneB: 40, zoneC: 47 },
      { day: "Tue", zoneA: 42, zoneB: 39, zoneC: 45 },
      { day: "Wed", zoneA: 45, zoneB: 41, zoneC: 48 },
      { day: "Thu", zoneA: 43, zoneB: 40, zoneC: 46 },
      { day: "Fri", zoneA: 46, zoneB: 42, zoneC: 49 },
      { day: "Sat", zoneA: 44, zoneB: 41, zoneC: 47 },
      { day: "Sun", zoneA: 47, zoneB: 43, zoneC: 50 },
    ],
    growthDistribution: [
      { stage: "Seedling", value: 70 },
      { stage: "Vegetative", value: 20 },
      { stage: "Flowering", value: 8 },
      { stage: "Harvest-ready", value: 2 },
    ],
    demand: {
      score: 24,
      investorInterest: 4,
      fundingVelocity: 3,
      trend: [
        { week: "W1", score: 30 },
        { week: "W2", score: 28 },
        { week: "W3", score: 26 },
        { week: "W4", score: 24 },
      ],
    },
  },
  {
    id: "farm-5",
    name: "Coastal Delta Farm",
    location: "Central Region, Ghana",
    lat: 5.3,
    lng: -1.0,
    area_ha: 14.0,
    crop: "Rice",
    growthStage: "Vegetative",
    technologies: [
      { key: "sensor", name: "Soil moisture sensors (10 nodes)", icon: "sensor", active: true, yieldImpact: 12 },
      { key: "irrigation", name: "Automated drip irrigation", icon: "irrigation", active: true, yieldImpact: 19 },
      { key: "drone", name: "Drone NDVI imagery", icon: "drone", active: false, yieldImpact: 8 },
      { key: "weather", name: "On-site weather station", icon: "weather", active: false, yieldImpact: 5 },
    ],
    yieldTrend: [
      { month: "Jan", traditional: 35, withTech: 37 },
      { month: "Feb", traditional: 36, withTech: 40 },
      { month: "Mar", traditional: 35, withTech: 43 },
      { month: "Apr", traditional: 37, withTech: 47 },
      { month: "May", traditional: 36, withTech: 50 },
      { month: "Jun", traditional: 38, withTech: 52 },
    ],
    soilMoisture: [
      { day: "Mon", zoneA: 70, zoneB: 68, zoneC: 74 },
      { day: "Tue", zoneA: 69, zoneB: 66, zoneC: 72 },
      { day: "Wed", zoneA: 72, zoneB: 69, zoneC: 75 },
      { day: "Thu", zoneA: 70, zoneB: 67, zoneC: 73 },
      { day: "Fri", zoneA: 73, zoneB: 70, zoneC: 76 },
      { day: "Sat", zoneA: 71, zoneB: 68, zoneC: 74 },
      { day: "Sun", zoneA: 74, zoneB: 71, zoneC: 77 },
    ],
    growthDistribution: [
      { stage: "Seedling", value: 10 },
      { stage: "Vegetative", value: 45 },
      { stage: "Flowering", value: 30 },
      { stage: "Harvest-ready", value: 15 },
    ],
    demand: {
      score: 46,
      investorInterest: 15,
      fundingVelocity: 9,
      trend: [
        { week: "W1", score: 42 },
        { week: "W2", score: 44 },
        { week: "W3", score: 48 },
        { week: "W4", score: 46 },
      ],
    },
  },
  {
    id: "farm-6",
    name: "Savanna Sunrise Farm",
    location: "Upper East Region, Ghana",
    lat: 10.8,
    lng: -0.8,
    area_ha: 17.2,
    crop: "Millet",
    growthStage: "Vegetative",
    technologies: [
      { key: "sensor", name: "Soil moisture sensors (14 nodes)", icon: "sensor", active: true, yieldImpact: 13 },
      { key: "irrigation", name: "Automated drip irrigation", icon: "irrigation", active: true, yieldImpact: 20 },
      { key: "drone", name: "Drone NDVI imagery", icon: "drone", active: false, yieldImpact: 9 },
      { key: "weather", name: "On-site weather station", icon: "weather", active: true, yieldImpact: 6 },
    ],
    yieldTrend: [
      { month: "Jan", traditional: 28, withTech: 30 },
      { month: "Feb", traditional: 29, withTech: 34 },
      { month: "Mar", traditional: 28, withTech: 38 },
      { month: "Apr", traditional: 30, withTech: 44 },
      { month: "May", traditional: 29, withTech: 49 },
      { month: "Jun", traditional: 31, withTech: 54 },
    ],
    soilMoisture: [
      { day: "Mon", zoneA: 48, zoneB: 45, zoneC: 51 },
      { day: "Tue", zoneA: 47, zoneB: 44, zoneC: 50 },
      { day: "Wed", zoneA: 49, zoneB: 46, zoneC: 52 },
      { day: "Thu", zoneA: 48, zoneB: 45, zoneC: 51 },
      { day: "Fri", zoneA: 50, zoneB: 47, zoneC: 53 },
      { day: "Sat", zoneA: 49, zoneB: 46, zoneC: 52 },
      { day: "Sun", zoneA: 51, zoneB: 48, zoneC: 54 },
    ],
    growthDistribution: [
      { stage: "Seedling", value: 12 },
      { stage: "Vegetative", value: 48 },
      { stage: "Flowering", value: 28 },
      { stage: "Harvest-ready", value: 12 },
    ],
    demand: {
      score: 63,
      investorInterest: 22,
      fundingVelocity: 14,
      trend: [
        { week: "W1", score: 56 },
        { week: "W2", score: 59 },
        { week: "W3", score: 62 },
        { week: "W4", score: 63 },
      ],
    },
  },
  {
    id: "farm-7",
    name: "Palm Grove Estate",
    location: "Western Region, Ghana",
    lat: 5.0,
    lng: -2.3,
    area_ha: 31.5,
    crop: "Oil Palm",
    growthStage: "Harvest-ready",
    technologies: [
      { key: "sensor", name: "Soil moisture sensors (24 nodes)", icon: "sensor", active: true, yieldImpact: 15 },
      { key: "irrigation", name: "Automated drip irrigation", icon: "irrigation", active: true, yieldImpact: 22 },
      { key: "drone", name: "Drone NDVI imagery", icon: "drone", active: true, yieldImpact: 12 },
      { key: "weather", name: "On-site weather station", icon: "weather", active: true, yieldImpact: 7 },
    ],
    yieldTrend: [
      { month: "Jan", traditional: 60, withTech: 66 },
      { month: "Feb", traditional: 61, withTech: 74 },
      { month: "Mar", traditional: 60, withTech: 82 },
      { month: "Apr", traditional: 62, withTech: 90 },
      { month: "May", traditional: 63, withTech: 97 },
      { month: "Jun", traditional: 64, withTech: 103 },
    ],
    soilMoisture: [
      { day: "Mon", zoneA: 72, zoneB: 69, zoneC: 75 },
      { day: "Tue", zoneA: 70, zoneB: 67, zoneC: 73 },
      { day: "Wed", zoneA: 73, zoneB: 70, zoneC: 76 },
      { day: "Thu", zoneA: 71, zoneB: 68, zoneC: 74 },
      { day: "Fri", zoneA: 74, zoneB: 71, zoneC: 77 },
      { day: "Sat", zoneA: 72, zoneB: 69, zoneC: 75 },
      { day: "Sun", zoneA: 75, zoneB: 72, zoneC: 78 },
    ],
    growthDistribution: [
      { stage: "Seedling", value: 1 },
      { stage: "Vegetative", value: 6 },
      { stage: "Flowering", value: 13 },
      { stage: "Harvest-ready", value: 80 },
    ],
    demand: {
      score: 91,
      investorInterest: 68,
      fundingVelocity: 33,
      trend: [
        { week: "W1", score: 84 },
        { week: "W2", score: 87 },
        { week: "W3", score: 89 },
        { week: "W4", score: 91 },
      ],
    },
  },
  {
    id: "farm-8",
    name: "Lakeside Vegetable Farm",
    location: "Bono Region, Ghana",
    lat: 7.8,
    lng: -2.5,
    area_ha: 4.2,
    crop: "Tomato",
    growthStage: "Flowering",
    technologies: [
      { key: "sensor", name: "Soil moisture sensors (5 nodes)", icon: "sensor", active: false, yieldImpact: 9 },
      { key: "irrigation", name: "Automated drip irrigation", icon: "irrigation", active: false, yieldImpact: 16 },
      { key: "drone", name: "Drone NDVI imagery", icon: "drone", active: false, yieldImpact: 6 },
      { key: "weather", name: "On-site weather station", icon: "weather", active: false, yieldImpact: 4 },
    ],
    yieldTrend: [
      { month: "Jan", traditional: 18, withTech: 18 },
      { month: "Feb", traditional: 19, withTech: 20 },
      { month: "Mar", traditional: 18, withTech: 20 },
      { month: "Apr", traditional: 19, withTech: 21 },
      { month: "May", traditional: 18, withTech: 21 },
      { month: "Jun", traditional: 19, withTech: 22 },
    ],
    soilMoisture: [
      { day: "Mon", zoneA: 38, zoneB: 35, zoneC: 41 },
      { day: "Tue", zoneA: 36, zoneB: 34, zoneC: 39 },
      { day: "Wed", zoneA: 39, zoneB: 36, zoneC: 42 },
      { day: "Thu", zoneA: 37, zoneB: 35, zoneC: 40 },
      { day: "Fri", zoneA: 40, zoneB: 37, zoneC: 43 },
      { day: "Sat", zoneA: 38, zoneB: 36, zoneC: 41 },
      { day: "Sun", zoneA: 41, zoneB: 38, zoneC: 44 },
    ],
    growthDistribution: [
      { stage: "Seedling", value: 20 },
      { stage: "Vegetative", value: 35 },
      { stage: "Flowering", value: 35 },
      { stage: "Harvest-ready", value: 10 },
    ],
    demand: {
      score: 35,
      investorInterest: 7,
      fundingVelocity: 4,
      trend: [
        { week: "W1", score: 39 },
        { week: "W2", score: 37 },
        { week: "W3", score: 36 },
        { week: "W4", score: 35 },
      ],
    },
  },
];

const PIE_COLORS = ["#e7dfcf", "#c8e639", "#8bba16", "#1b2620"];

export default function FarmlandPage() {
  const router = useRouter();
  const [farms, setFarms] = useState<Farm[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFarms() {
      try {
        const res = await fetch("/api/farms");
        if (res.ok) {
          const json = await res.json();
          setFarms(json);
          setSelectedId(json[0]?.id ?? null);
        } else {
          // fall back to sample data if the endpoint isn't wired up yet
          setFarms(SAMPLE_FARMS);
          setSelectedId(SAMPLE_FARMS[0].id);
        }
      } catch {
        setFarms(SAMPLE_FARMS);
        setSelectedId(SAMPLE_FARMS[0].id);
      } finally {
        setLoading(false);
      }
    }
    fetchFarms();
  }, []);

  if (loading || !farms) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#b7d0ea] via-[#9dc0b1] to-[#6f8f5e] flex items-center justify-center">
        <WaterGlassStyles />
        <div className="water-glass-card water-glass-light rounded-3xl p-8">
          <Loader2 className="w-8 h-8 text-[#1b2620] animate-spin" />
        </div>
      </div>
    );
  }

  const farm = farms.find((f) => f.id === selectedId) ?? farms[0];
  const activeTechCount = farm.technologies.filter((t) => t.active).length;
  const totalYieldLift = farm.technologies.filter((t) => t.active).reduce((sum, t) => sum + t.yieldImpact, 0);
  const level = demandLevel(farm.demand.score);
  const trendDir = demandTrendDirection(farm.demand.trend);

  // Sorted purely for the "highest / lowest demand" callout — does not affect selection state.
  const rankedByDemand = [...farms].sort((a, b) => b.demand.score - a.demand.score);
  const highestDemandFarm = rankedByDemand[0];
  const lowestDemandFarm = rankedByDemand[rankedByDemand.length - 1];

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#cdded8] via-[#e8efeb] to-transparent">
      <WaterGlassStyles />
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-[#b7eae0] via-[#cfe1a4] to-[#b7bfa8] text-[#1b2620] flex overflow-hidden font-sans selection:bg-[#c8e639] selection:text-black">

        {/* Farmland sidebar — every farm, always visible, independent of the main content scroll */}
        <aside className="water-glass-card water-glass-light w-72 flex flex-col shrink-0 h-screen border-r-0 rounded-none">
          <div className="px-6 pt-6 pb-4 border-b border-white/40 relative z-10">
            <p className="text-[#1b2620]/50 text-[10px] font-bold uppercase tracking-widest mb-1">Farmland</p>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#1b2620]">Your Farms</h2>
              <span className="text-[10px] font-bold text-[#1b2620]/50 bg-white/30 px-2 py-1 rounded-md">{farms.length} plots</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-4 overflow-y-auto flex-1 relative z-10">
            {farms.map((f) => {
              const fLevel = demandLevel(f.demand.score);
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedId(f.id)}
                  className={`water-glass-chip water-glass-hover text-left rounded-2xl border p-4 transition-all ${
                    f.id === farm.id
                      ? "border-[#8bba16] bg-white/40 ring-2 ring-[#c8e639]/50"
                      : "border-white/40 bg-white/20 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-extrabold text-[#1b2620]">{f.name}</span>
                    <ChevronRight size={14} className="text-[#1b2620]/30 shrink-0" />
                  </div>
                  <p className="text-xs text-[#1b2620]/60 flex items-center gap-1"><MapPin size={11} /> {f.location}</p>
                  <p className="text-xs text-[#1b2620]/50 mt-1">{f.area_ha} ha · {f.crop}</p>
                  <span className={`inline-flex items-center gap-1 mt-2 text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${fLevel.bg} ${fLevel.color} ${fLevel.border}`}>
                    {f.demand.score}/100 · {fLevel.label}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-screen overflow-y-auto p-8">
          <div className="max-w-5xl w-full mx-auto flex flex-col gap-6">

            <div>
              <p className="text-[#1b2620]/60 text-xs font-bold uppercase tracking-widest mb-2">Selected plot</p>
              <h1 className="text-3xl font-extrabold text-[#1b2620]">{farm.name}</h1>
            </div>

            {/* highest / lowest demand callout across all farms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="water-glass-chip water-glass-hover rounded-2xl border border-green-300/40 bg-green-500/10 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center shrink-0">
                  <Flame size={18} className="text-green-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#1b2620]/50">Highest investor demand</p>
                  <button onClick={() => setSelectedId(highestDemandFarm.id)} className="text-sm font-extrabold text-[#1b2620] hover:underline truncate block">
                    {highestDemandFarm.name}
                  </button>
                  <p className="text-xs text-green-700 font-bold">{highestDemandFarm.demand.score}/100 · {highestDemandFarm.demand.investorInterest} investors waitlisted</p>
                </div>
              </div>
              <div className="water-glass-chip water-glass-hover rounded-2xl border border-red-300/40 bg-red-500/10 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center shrink-0">
                  <TrendingDown size={18} className="text-red-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#1b2620]/50">Lowest investor demand</p>
                  <button onClick={() => setSelectedId(lowestDemandFarm.id)} className="text-sm font-extrabold text-[#1b2620] hover:underline truncate block">
                    {lowestDemandFarm.name}
                  </button>
                  <p className="text-xs text-red-600 font-bold">{lowestDemandFarm.demand.score}/100 · {lowestDemandFarm.demand.investorInterest} investors waitlisted</p>
                </div>
              </div>
            </div>

            {/* overview strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="water-glass-card water-glass-light water-glass-hover rounded-2xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#1b2620]/50 mb-1">Growth stage</p>
                <p className="text-lg font-extrabold text-[#1b2620]">{farm.growthStage}</p>
              </div>
              <div className="water-glass-card water-glass-light water-glass-hover rounded-2xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#1b2620]/50 mb-1">Active technologies</p>
                <p className="text-lg font-extrabold text-[#1b2620]">{activeTechCount} / {farm.technologies.length}</p>
              </div>
              <div className="water-glass-card water-glass-light water-glass-hover rounded-2xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#1b2620]/50 mb-1">Est. yield lift</p>
                <p className="text-lg font-extrabold text-green-700">+{totalYieldLift}%</p>
              </div>
              <div className="water-glass-card water-glass-light water-glass-hover rounded-2xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#1b2620]/50 mb-1">Plot size</p>
                <p className="text-lg font-extrabold text-[#1b2620]">{farm.area_ha} ha</p>
              </div>
            </div>

            {/* investor demand */}
            <div className="water-glass-card water-glass-light rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#1b2620] mb-1 flex items-center gap-2">
                    <TrendingUp size={15} strokeWidth={2} className="text-[#1b2620]/50" /> Investor demand
                  </h2>
                  <p className="text-xs text-[#1b2620]/50">How actively investors are pursuing this plot</p>
                </div>
                <span className={`water-glass-chip inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-full border ${level.bg} ${level.color} ${level.border}`}>
                  {trendDir === "up" && <TrendingUp size={12} />}
                  {trendDir === "down" && <TrendingDown size={12} />}
                  {trendDir === "flat" && <Minus size={12} />}
                  {level.label}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
                <div className="flex gap-6">
                  <div>
                    <p className="text-3xl font-extrabold text-[#1b2620]">{farm.demand.score}<span className="text-sm text-[#1b2620]/50 font-bold">/100</span></p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#1b2620]/50 mt-1">Demand score</p>
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-[#1b2620]">{farm.demand.investorInterest}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#1b2620]/50 mt-1">Investors waitlisted</p>
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-[#1b2620]">{farm.demand.fundingVelocity}%</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#1b2620]/50 mt-1">Funded / week</p>
                  </div>
                </div>

                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={farm.demand.trend} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(27,38,32,0.5)" }} />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: "#1b2620", border: "none", borderRadius: "10px", color: "#fff" }} formatter={(v: any) => [`${v}/100`, "Demand score"]} />
                      <Line type="monotone" dataKey="score" stroke="#8bba16" strokeWidth={2.5} dot={{ r: 3, fill: "#8bba16" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* map */}
            <div className="water-glass-card water-glass-light rounded-2xl p-2 h-72">
              <div className="h-full w-full rounded-xl overflow-hidden">
                <MapWidget lands={[{ ...farm, title: farm.name }]} selectedLand={{ ...farm, title: farm.name }} />
              </div>
            </div>

            {/* technology in use */}
            <div className="water-glass-card water-glass-light rounded-2xl p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#1b2620] mb-4 flex items-center gap-2">
                <Radio size={15} strokeWidth={2} className="text-[#1b2620]/50" /> Technology in use
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {farm.technologies.map((tech) => {
                  const Icon = TECH_ICON[tech.icon];
                  return (
                    <div key={tech.key} className={`water-glass-chip flex items-center justify-between rounded-xl border px-4 py-3 ${
                      tech.active ? "border-[#c8e639]/50 bg-[#c8e639]/10" : "border-white/40 bg-white/15"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tech.active ? "bg-[#1b2620]" : "bg-white/30"}`}>
                          <Icon size={16} strokeWidth={2} className={tech.active ? "text-[#c8e639]" : "text-[#1b2620]/40"} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1b2620]">{tech.name}</p>
                          <p className="text-[11px] text-[#1b2620]/50">{tech.active ? "Active" : "Not installed"}</p>
                        </div>
                      </div>
                      {tech.active && (
                        <span className="text-xs font-extrabold text-green-700">+{tech.yieldImpact}%</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* yield trend: traditional vs with-technology */}
            <div className="water-glass-card water-glass-light rounded-2xl p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#1b2620] mb-1 flex items-center gap-2">
                <TrendingUp size={15} strokeWidth={2} className="text-[#1b2620]/50" /> Yield: traditional vs. with technology
              </h2>
              <p className="text-xs text-[#1b2620]/50 mb-4">Estimated yield (kg per hectare), by month</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={farm.yieldTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="withTechGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8bba16" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#8bba16" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="traditionalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1b2620" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#1b2620" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(27,38,32,0.08)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgba(27,38,32,0.5)" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgba(27,38,32,0.5)" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1b2620", border: "none", borderRadius: "10px", color: "#fff" }} />
                    <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
                    <Area type="monotone" dataKey="traditional" name="Traditional method" stroke="#1b2620" strokeWidth={2} fill="url(#traditionalGradient)" />
                    <Area type="monotone" dataKey="withTech" name="With technology" stroke="#8bba16" strokeWidth={2.5} fill="url(#withTechGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* soil moisture by zone */}
              <div className="water-glass-card water-glass-light rounded-2xl p-6">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#1b2620] mb-1 flex items-center gap-2">
                  <Droplets size={15} strokeWidth={2} className="text-[#1b2620]/50" /> Soil moisture by zone
                </h2>
                <p className="text-xs text-[#1b2620]/50 mb-4">% moisture, last 7 days</p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={farm.soilMoisture} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(27,38,32,0.08)" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(27,38,32,0.5)" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(27,38,32,0.5)" }} />
                      <Tooltip contentStyle={{ backgroundColor: "#1b2620", border: "none", borderRadius: "10px", color: "#fff" }} />
                      <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                      <Line type="monotone" dataKey="zoneA" name="Zone A" stroke="#1b2620" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="zoneB" name="Zone B" stroke="#8bba16" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="zoneC" name="Zone C" stroke="#c8a86e" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* growth stage distribution */}
              <div className="water-glass-card water-glass-light rounded-2xl p-6">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#1b2620] mb-1 flex items-center gap-2">
                  <Leaf size={15} strokeWidth={2} className="text-[#1b2620]/50" /> Crop growth distribution
                </h2>
                <p className="text-xs text-[#1b2620]/50 mb-4">Share of plot by growth stage</p>
                <div className="h-56 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={farm.growthDistribution}
                        dataKey="value"
                        nameKey="stage"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {farm.growthDistribution.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1b2620", border: "none", borderRadius: "10px", color: "#fff" }} />
                      <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* technology impact comparison */}
            <div className="water-glass-card water-glass-light rounded-2xl p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#1b2620] mb-1 flex items-center gap-2">
                <BarChart2 size={15} strokeWidth={2} className="text-[#1b2620]/50" /> Yield impact per technology
              </h2>
              <p className="text-xs text-[#1b2620]/50 mb-4">Estimated % yield increase attributed to each active technology</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={farm.technologies} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(27,38,32,0.08)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "rgba(27,38,32,0.5)" }} interval={0} angle={-12} textAnchor="end" height={60} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(27,38,32,0.5)" }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1b2620", border: "none", borderRadius: "10px", color: "#fff" }}
                      formatter={(v: any) => [`+${v}%`, "Yield impact"]}
                    />
                    <Bar dataKey="yieldImpact" radius={[6, 6, 0, 0]}>
                      {farm.technologies.map((t, i) => (
                        <Cell key={i} fill={t.active ? "#8bba16" : "#e7dfcf"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}