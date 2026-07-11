"use client";
import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import NavBar from "../../navbar";
import {
  MapPin,
  Share2,
  Bookmark,
  ArrowUpRight,
  Droplets,
  Wind,
  Thermometer,
  Sprout,
  Tractor,
  TrendingUp,
  TrendingDown,
  Calendar,
  Wallet,
  Activity,
  BarChart3,
  Percent,
  X,
  Target,
  ShieldCheck,
  Globe,
  Layers,
  Map
} from "lucide-react";

const FARMLANDS = [
  { id: "sundance-corn-estate", name: "Sundance Corn", location: "Nebraska, USA", yield: "12.4%", risk: "Low", minInvestment: "$500", totalGoal: "$2.3M", fundedPct: 82, image: "/farm.jpg", initials: "SC", area_ha: 150.5, soil_type: "loamy", water_source: "borewell", status: "active" },
  { id: "blue-ridge-orchard", name: "Blue Ridge", location: "Virginia, USA", yield: "14.1%", risk: "Medium", minInvestment: "$1,000", totalGoal: "$1.5M", fundedPct: 65, image: "/farm.jpg", initials: "BR", area_ha: 85.2, soil_type: "red", water_source: "rainfed", status: "listed" },
  { id: "golden-wheat-coop", name: "Golden Wheat", location: "Kansas, USA", yield: "10.5%", risk: "Low", minInvestment: "$250", totalGoal: "$4.0M", fundedPct: 95, image: "/farm.jpg", initials: "GW", area_ha: 320.0, soil_type: "alluvial", water_source: "canal", status: "active" },
  { id: "emerald-vineyards", name: "Emerald Vine", location: "California, USA", yield: "16.8%", risk: "High", minInvestment: "$5,000", totalGoal: "$8.5M", fundedPct: 40, image: "/farm.jpg", initials: "EV", area_ha: 45.0, soil_type: "sandy", water_source: "mixed", status: "listed" },
  { id: "dakota-soy-fields", name: "Dakota Soy", location: "South Dakota, USA", yield: "11.2%", risk: "Medium", minInvestment: "$500", totalGoal: "$3.2M", fundedPct: 15, image: "/farm.jpg", initials: "DS", area_ha: 210.8, soil_type: "black", water_source: "river", status: "active" }
];

export default function PropertyDetail({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;
  const locale = resolvedParams.locale;

  const property = FARMLANDS.find(f => f.id === propertyId) || FARMLANDS[0];
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-[#f7f9f2] font-sans pb-20 selection:bg-[#c8e639] selection:text-black">
      <NavBar />
      
      <div className="mx-auto max-w-350 px-6 pt-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              <Link href={`/${locale}/Explore`} className="hover:text-neutral-900 transition-colors">Catalog</Link>
              <span>/</span>
              <span className="text-[#343d07]">{property.name}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#1b2620] flex items-center gap-4">
              Property Details
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-neutral-700 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              <Share2 size={16} />
            </button>
            <button className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-neutral-700 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              <Bookmark size={16} />
            </button>
            <button onClick={() => setIsTradeModalOpen(true)} className="flex items-center gap-2 text-sm font-extrabold bg-[#c8e639] text-[#1b2620] px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:bg-[#b0cc2f] transition-all">
              Invest Now <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-48 relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Target Yield</span>
                <Target size={16} className="text-[#c8e639]" />
              </div>
              <p className="text-3xl font-extrabold text-[#1b2620]">{property.yield}</p>
              <p className="text-xs font-bold text-[#67780f] flex items-center gap-1 mt-2">
                <TrendingUp size={14} /> Annual Cash Yield
              </p>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gray-50 rounded-full border-8 border-white z-0 opacity-50"></div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-48 relative">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Funding Goal</span>
                <Wallet size={16} className="text-[#c8e639]" />
              </div>
              <p className="text-3xl font-extrabold text-[#1b2620]">{property.totalGoal}</p>
              <p className="text-xs font-bold text-neutral-500 flex items-center gap-1 mt-2">
                Total capital required
              </p>
            </div>
            <div className="flex items-end gap-2 mt-4 h-12 w-full">
              {[30, 40, 20, 50, 45, 70, 85].map((h, i) => (
                <div key={i} className="w-full bg-[#c8e639]/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-48">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Funded</span>
                <Percent size={16} className="text-[#c8e639]" />
              </div>
              <p className="text-3xl font-extrabold text-[#1b2620]">{property.fundedPct}%</p>
              <p className="text-xs font-bold text-[#67780f] flex items-center gap-1 mt-2">
                Active syndicate
              </p>
            </div>
            <div className="mt-8 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${property.fundedPct}%` }} className="h-full bg-linear-to-r from-[#8da514] to-[#c8e639]" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-48">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Risk Profile</span>
                <ShieldCheck size={16} className="text-[#c8e639]" />
              </div>
              <p className="text-3xl font-extrabold text-[#1b2620]">{property.risk}</p>
            </div>
            <div className="flex items-center justify-between mt-4">
               <div className="flex gap-2">
                 <div className="bg-[#1b2620] px-3 py-2 rounded-xl flex flex-col justify-center shadow-md">
                   <span className="text-[10px] text-white/60 font-bold">Min Invest</span>
                   <span className="text-xs font-extrabold text-white">{property.minInvestment}</span>
                 </div>
               </div>
               <Link href={`/${locale}/prospectus/${property.id}`} className="bg-[#c8e639] hover:bg-[#a0bd0f] text-[#1b2620] p-3 rounded-full transition-colors shadow-sm">
                 <ArrowUpRight size={18} />
               </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <span className="text-sm font-bold text-[#1b2620] whitespace-nowrap">Property Sections</span>
            <div className="h-4 w-px bg-gray-300 mx-2"></div>
            <button 
              onClick={() => setActiveTab("Overview")}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl whitespace-nowrap shadow-sm transition-colors ${activeTab === "Overview" ? "text-white bg-[#1b2620] border border-[#1b2620]" : "text-neutral-600 bg-white border border-gray-200 hover:bg-gray-50"}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("Telemetry")}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl whitespace-nowrap shadow-sm transition-colors ${activeTab === "Telemetry" ? "text-white bg-[#1b2620] border border-[#1b2620]" : "text-neutral-600 bg-white border border-gray-200 hover:bg-gray-50"}`}
            >
              Telemetry
            </button>
            <button 
              onClick={() => setActiveTab("Financials")}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl whitespace-nowrap shadow-sm transition-colors ${activeTab === "Financials" ? "text-white bg-[#1b2620] border border-[#1b2620]" : "text-neutral-600 bg-white border border-gray-200 hover:bg-gray-50"}`}
            >
              Financials
            </button>
          </div>
        </div>

        <div className="bg-[#1b2620] rounded-[2.5rem] p-4 flex flex-col shadow-2xl overflow-hidden min-h-150">
          
          <div className="flex-1 bg-linear-to-br from-[#c8e639] to-[#a0bd0f] rounded-4xl p-8 flex flex-col justify-between shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center justify-between mb-8 border-b border-[#1b2620]/10 pb-6">
                <div>
                  <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest mb-2">Asset Details</p>
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-extrabold text-[#1b2620]">{property.name}</h2>
                  </div>
                  <p className="text-sm font-bold text-[#1b2620]/80 mt-2 flex items-center gap-1"><MapPin size={16}/> {property.location}</p>
                </div>
              </div>

              {activeTab === "Overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="relative h-72 rounded-3xl overflow-hidden border-4 border-white/40 shadow-lg">
                      <Image src={property.image} alt={property.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex flex-col justify-center gap-4">
                      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/40">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xl font-extrabold text-[#1b2620]">{property.area_ha} HA</p>
                          <Map size={18} className="text-[#1b2620]" />
                        </div>
                        <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest">Total Area</p>
                      </div>

                      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/40">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xl font-extrabold text-[#1b2620] capitalize">{property.soil_type}</p>
                          <Layers size={18} className="text-[#1b2620]" />
                        </div>
                        <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest">Soil Type</p>
                      </div>

                      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/40">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xl font-extrabold text-[#1b2620] capitalize">{property.water_source}</p>
                          <Droplets size={18} className="text-[#1b2620]" />
                        </div>
                        <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest">Water Source</p>
                      </div>
                  </div>
                </div>
              )}

              {activeTab === "Telemetry" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="col-span-full mb-2">
                     <p className="text-xl font-extrabold text-[#1b2620]">Live Field Telemetry</p>
                     <p className="text-sm font-bold text-[#1b2620]/70">Real-time IoT sensor readings across all zones.</p>
                  </div>
                  <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-white/40 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-4xl font-extrabold text-[#1b2620]">32.4%</p>
                      <Droplets size={24} className="text-[#1b2620]" />
                    </div>
                    <p className="text-sm font-bold text-[#1b2620]/60 uppercase tracking-widest">Avg Soil Moisture</p>
                  </div>

                  <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-white/40 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-4xl font-extrabold text-[#1b2620]">8.2</p>
                      <Wind size={24} className="text-[#1b2620]" />
                    </div>
                    <p className="text-sm font-bold text-[#1b2620]/60 uppercase tracking-widest">Air Quality Index (AQI)</p>
                  </div>

                  <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-white/40 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-4xl font-extrabold text-[#1b2620]">18.2°C</p>
                      <Thermometer size={24} className="text-[#1b2620]" />
                    </div>
                    <p className="text-sm font-bold text-[#1b2620]/60 uppercase tracking-widest">Mean Soil Temp</p>
                  </div>
                </div>
              )}

              {activeTab === "Financials" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="col-span-full mb-2">
                     <p className="text-xl font-extrabold text-[#1b2620]">Investment Financials</p>
                     <p className="text-sm font-bold text-[#1b2620]/70">Projected returns, minimums, and funding status.</p>
                  </div>
                  
                  <div className="flex flex-col justify-center gap-4">
                      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/40">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xl font-extrabold text-[#1b2620]">{property.totalGoal}</p>
                          <Wallet size={18} className="text-[#1b2620]" />
                        </div>
                        <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest">Total Raise Amount</p>
                      </div>

                      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/40">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xl font-extrabold text-[#1b2620]">{property.minInvestment}</p>
                          <Target size={18} className="text-[#1b2620]" />
                        </div>
                        <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest">Minimum Investment</p>
                      </div>

                      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/40">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xl font-extrabold text-[#1b2620]">{property.yield}</p>
                          <Percent size={18} className="text-[#1b2620]" />
                        </div>
                        <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest">Projected IRR</p>
                      </div>
                  </div>

                  <div className="relative h-64 rounded-3xl overflow-hidden border-4 border-white/40 shadow-lg bg-[#f7f9f2] flex items-center justify-center p-6">
                      <div className="text-center">
                         <Activity size={48} className="text-[#c8e639] mx-auto mb-4" />
                         <p className="text-2xl font-extrabold text-[#1b2620] mb-2">Market Condition</p>
                         <p className="text-sm text-neutral-600 font-bold max-w-xs">The Greedy Index is currently highly favorable for early entry in this sector.</p>
                      </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative z-10 border-t border-[#1b2620]/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 mt-4">
              <div className="flex gap-12 w-full sm:w-auto">
                <div>
                  <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest mb-1">Target Yield</p>
                  <p className="text-2xl font-extrabold text-[#1b2620]">{property.yield}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest mb-1">Min Invest</p>
                  <p className="text-2xl font-extrabold text-[#1b2620]">{property.minInvestment}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                <Link href={`/${locale}/prospectus/${property.id}`} className="bg-white/30 hover:bg-white/50 text-[#1b2620] font-extrabold px-6 py-3.5 rounded-full transition-colors whitespace-nowrap">
                  View Prospectus
                </Link>
                <button onClick={() => setIsTradeModalOpen(true)} className="bg-[#1b2620] hover:bg-black text-white font-extrabold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap">
                  Invest Now <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {isTradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsTradeModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#f7f9f2] rounded-4xl shadow-2xl overflow-hidden border border-[#c8e639]/30"
            >
              <div className="bg-[#1b2620] text-white px-8 py-6 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8e639]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <h2 className="text-2xl font-extrabold flex items-center gap-2 relative z-10">
                  <Activity className="text-[#c8e639]" /> Trade Execution Details
                </h2>
                <button onClick={() => setIsTradeModalOpen(false)} className="text-white/60 hover:text-white transition-colors relative z-10">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#67780f] mb-3 flex items-center gap-1.5"><BarChart3 size={14}/> Greedy Index</h3>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-extrabold text-[#2a3307]">78</span>
                      <span className="text-sm font-bold text-[#c8e639] bg-[#1b2620] px-2 py-0.5 rounded-md mb-1">Strong Buy</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-linear-to-r from-red-400 via-yellow-400 to-[#c8e639] mt-3 relative">
                      <div className="absolute top-1/2 left-[78%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#1b2620] rounded-full shadow-sm"></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#67780f] mb-3 flex items-center gap-1.5"><Percent size={14}/> Expected ROI</h3>
                    <div className="flex flex-col">
                      <span className="text-3xl font-extrabold text-[#2a3307]">14.5% - 17.2%</span>
                      <span className="text-xs font-bold text-neutral-500 mt-1">Target Annualized Return (IRR)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#2a3307] mb-4 border-b border-gray-100 pb-2">Probable Crop Yield Analysis</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-[#f7f9f2] p-3 rounded-xl border border-[#e0e8cd]">
                      <span className="block text-[10px] font-bold uppercase text-[#67780f] mb-1">Yield Proj.</span>
                      <span className="text-lg font-extrabold text-[#2a3307]">210 bu/ac</span>
                    </div>
                    <div className="bg-[#f7f9f2] p-3 rounded-xl border border-[#e0e8cd]">
                      <span className="block text-[10px] font-bold uppercase text-[#67780f] mb-1">NPK Sensor</span>
                      <span className="text-sm font-extrabold text-[#2a3307]">Optimal Base</span>
                    </div>
                    <div className="bg-[#f7f9f2] p-3 rounded-xl border border-[#e0e8cd]">
                      <span className="block text-[10px] font-bold uppercase text-[#67780f] mb-1">Moisture</span>
                      <span className="text-sm font-extrabold text-[#2a3307]">32.4% (Ideal)</span>
                    </div>
                    <div className="bg-[#f7f9f2] p-3 rounded-xl border border-[#e0e8cd]">
                      <span className="block text-[10px] font-bold uppercase text-[#67780f] mb-1">Light Index</span>
                      <span className="text-sm font-extrabold text-[#2a3307]">94% (High)</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                    Advanced spectral imaging and ground NPK sensors indicate soil conditions are highly favorable. Combined with active moisture management and strong solar indices, this asset's biological yield probability remains in the top 5th percentile of the region.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setIsTradeModalOpen(false)} className="flex-1 py-3.5 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button className="flex-2 py-3.5 px-4 rounded-xl font-extrabold text-[#1b2620] bg-[#c8e639] hover:bg-[#a8c718] transition-colors shadow-lg hover:shadow-xl">
                    Confirm Investment Allocation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
