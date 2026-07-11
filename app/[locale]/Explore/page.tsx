"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Footer from "@/app/[locale]/Footer";
import NavBar from "../navbar";
import {
  MapPin,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Sprout,
  ArrowRight,
  Filter,
  Search
} from "lucide-react";

const FARMLANDS = [
  {
    id: "sundance-corn-estate",
    name: "Sundance Corn Estate",
    location: "Nebraska, USA",
    image: "/farm.jpg",
    yield: "12.4%",
    risk: "Low",
    minInvestment: "$500",
    tech: ["AI Irrigation", "Autonomous Tractors"],
    cropType: "Corn",
    rotationDays: 120,
    trending: true,
    fundedPct: 82,
    totalGoal: "$2.3M",
  },
  {
    id: "blue-ridge-orchard",
    name: "Blue Ridge Apple Orchard",
    location: "Virginia, USA",
    image: "/farm.jpg", 
    yield: "14.1%",
    risk: "Medium",
    minInvestment: "$1,000",
    tech: ["Drone Scouting", "Soil Sensors"],
    cropType: "Apples",
    rotationDays: 365,
    trending: true,
    fundedPct: 65,
    totalGoal: "$1.5M",
  },
  {
    id: "golden-wheat-coop",
    name: "Golden Wheat Co-operative",
    location: "Kansas, USA",
    image: "/farm.jpg",
    yield: "10.5%",
    risk: "Low",
    minInvestment: "$250",
    tech: ["Satellite Imaging", "Predictive Weather"],
    cropType: "Wheat",
    rotationDays: 90,
    trending: false,
    fundedPct: 95,
    totalGoal: "$4.0M",
  },
  {
    id: "emerald-vineyards",
    name: "Emerald Vineyards",
    location: "California, USA",
    image: "/farm.jpg",
    yield: "16.8%",
    risk: "High",
    minInvestment: "$5,000",
    tech: ["Smart Drip", "Robotic Harvesting"],
    cropType: "Grapes",
    rotationDays: 180,
    trending: true,
    fundedPct: 40,
    totalGoal: "$8.5M",
  },
  {
    id: "dakota-soy-fields",
    name: "Dakota Soy Fields",
    location: "South Dakota, USA",
    image: "/farm.jpg",
    yield: "11.2%",
    risk: "Medium",
    minInvestment: "$500",
    tech: ["Variable Rate Tech", "AI Irrigation"],
    cropType: "Soybeans",
    rotationDays: 110,
    trending: false,
    fundedPct: 15,
    totalGoal: "$3.2M",
  }
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function ExploreCatalog() {
  const [filterTech, setFilterTech] = useState<string>("All");
  const [filterCrop, setFilterCrop] = useState<string>("All");
  const [filterRisk, setFilterRisk] = useState<string>("All");
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const allTechs = Array.from(new Set(FARMLANDS.flatMap(f => f.tech)));
  const allCrops = Array.from(new Set(FARMLANDS.map(f => f.cropType)));
  const allRisks = Array.from(new Set(FARMLANDS.map(f => f.risk)));

  const filteredFarms = FARMLANDS.filter(farm => {
    if (showTrendingOnly && !farm.trending) return false;
    if (filterTech !== "All" && !farm.tech.includes(filterTech)) return false;
    if (filterCrop !== "All" && farm.cropType !== filterCrop) return false;
    if (filterRisk !== "All" && farm.risk !== filterRisk) return false;
    if (searchQuery && !farm.name.toLowerCase().includes(searchQuery.toLowerCase()) && !farm.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#b8cb8a] font-sans relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
         <Image src="/bga.jpg" alt="" fill priority className="object-cover object-bottom opacity-30" />
         <div className="absolute inset-0 bg-linear-to-b from-[#8c8c81]/70 via-[#749a86]/90 to-[#374f42]" />
      </div>

      <div className="relative z-10">
        <NavBar />

        <div className="mx-auto max-w-350 px-6 pt-12 pb-24 md:px-14">

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl mb-12 shadow-2xl flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between"
          >
            <div className="relative w-full xl:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
              <input 
                type="text" 
                placeholder="Search by name or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-full py-3 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-[#c8e639] transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="flex items-center gap-2 mr-2 text-white/80 text-sm font-semibold uppercase tracking-wider">
                <Filter size={16} /> Filters:
              </div>

              <button 
                onClick={() => setShowTrendingOnly(!showTrendingOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition ${showTrendingOnly ? 'bg-[#c8e639] text-gray-900 shadow-[0_0_15px_rgba(200,230,57,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                <TrendingUp size={16} /> Trending
              </button>

              <select 
                value={filterCrop} 
                onChange={(e) => setFilterCrop(e.target.value)}
                className="appearance-none bg-white/10 border border-white/20 text-white rounded-full px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#c8e639] cursor-pointer [&>option]:text-gray-900"
              >
                <option value="All">All Crops</option>
                {allCrops.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select 
                value={filterTech} 
                onChange={(e) => setFilterTech(e.target.value)}
                className="appearance-none bg-white/10 border border-white/20 text-white rounded-full px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#c8e639] cursor-pointer [&>option]:text-gray-900"
              >
                <option value="All">All Technologies</option>
                {allTechs.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <select 
                value={filterRisk} 
                onChange={(e) => setFilterRisk(e.target.value)}
                className="appearance-none bg-white/10 border border-white/20 text-white rounded-full px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#c8e639] cursor-pointer [&>option]:text-gray-900"
              >
                <option value="All">Any Risk Level</option>
                {allRisks.map(r => <option key={r} value={r}>{r} Risk</option>)}
              </select>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredFarms.map((farm, index) => (
                <motion.div 
                  key={farm.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group flex flex-col bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-transparent hover:border-[#c8e639] shadow-xl hover:shadow-[0_20px_40px_-15px_rgba(200,230,57,0.3)] transition-all duration-300"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-gray-900">
                    <Image 
                      src={farm.image} 
                      alt={farm.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                      <div className="flex gap-2">
                        {farm.trending && (
                          <span className="bg-[#c8e639] text-gray-900 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-md">
                            <TrendingUp size={12} /> Hot
                          </span>
                        )}
                        <span className="bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-white/30 flex items-center gap-1">
                          <Sprout size={12} /> {farm.cropType}
                        </span>
                      </div>
                      <span className="bg-black/50 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-white/20 flex items-center gap-1">
                        <ShieldCheck size={12} className={farm.risk === 'Low' ? 'text-green-400' : farm.risk === 'Medium' ? 'text-yellow-400' : 'text-red-400'} /> {farm.risk}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                      <h3 className="text-2xl font-extrabold leading-tight tracking-tight mb-1">{farm.name}</h3>
                      <p className="text-sm text-white/80 flex items-center gap-1 font-medium"><MapPin size={14} className="text-[#c8e639]" /> {farm.location}</p>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col grow">
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Est. Yield</span>
                        <span className="text-lg font-extrabold text-[#374f42]">{farm.yield}</span>
                      </div>
                      <div className="flex flex-col border-l border-gray-200 pl-4">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Min. Invest</span>
                        <span className="text-lg font-extrabold text-[#374f42]">{farm.minInvestment}</span>
                      </div>
                      <div className="flex flex-col border-l border-gray-200 pl-4">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Rotation</span>
                        <span className="text-lg font-extrabold text-[#374f42] flex items-center gap-1">{farm.rotationDays}d</span>
                      </div>
                    </div>

                    <div className="mb-6 grow">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><Cpu size={12}/> Applied Tech</span>
                      <div className="flex flex-wrap gap-2">
                        {farm.tech.map((t) => (
                          <span key={t} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-gray-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span className="text-gray-600">Funded: {farm.fundedPct}%</span>
                        <span className="text-gray-900">{farm.totalGoal} Goal</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${farm.fundedPct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: easeOut }}
                          className="h-full bg-linear-to-r from-[#8da514] to-[#c8e639] rounded-full"
                        />
                      </div>
                    </div>

                    <Link href={`/property/${farm.id}`} className="block w-full mt-auto">
                      <button className="w-full bg-[#1b2620] hover:bg-black text-[#c8e639] font-bold py-3.5 px-4 rounded-2xl transition-colors duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg">
                        View Details <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredFarms.length === 0 && (
              <div className="col-span-full py-20 text-center text-white">
                <p className="text-xl font-semibold opacity-80">No farmland matches your current filters.</p>
                <button onClick={() => { setFilterCrop('All'); setFilterTech('All'); setFilterRisk('All'); setShowTrendingOnly(false); setSearchQuery(""); }} className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full font-medium transition">
                  Clear all filters
                </button>
              </div>
            )}

          </div>

        </div>
        <Footer />
      </div>
    </div>
  );
}