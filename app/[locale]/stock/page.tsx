"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import NavBar from "../navbar";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Wallet,
  ArrowUpRight,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Plus,
  Paperclip,
  CheckCircle2,
  ListTodo
} from "lucide-react";

const STOCKS = [
  { id: "AGRI-1001", name: "Sundance Corn", shares: "250", price: "$68,750.00", status: "Active", time: "In 2 days", initials: "SC", color: "bg-blue-100 text-blue-700" },
  { id: "AGRI-1002", name: "Blue Ridge", shares: "80", price: "$21,480.00", status: "Hold", time: "In 4 days", initials: "BR", color: "bg-orange-100 text-orange-700" },
  { id: "AGRI-1003", name: "BrightWave", shares: "125", price: "$47,980.00", status: "Active", time: "In 5 days", initials: "BW", color: "bg-purple-100 text-purple-700" },
  { id: "AGRI-1004", name: "Golden Wheat", shares: "190", price: "$55,230.00", status: "Watch", time: "In 16 days", initials: "GW", color: "bg-emerald-100 text-emerald-700" },
  { id: "AGRI-1005", name: "Emerald Vine", shares: "25", price: "$6,880.00", status: "Watch", time: "In 19 days", initials: "EV", color: "bg-rose-100 text-rose-700" },
];

export default function StockDetailsPage() {
  const [selectedStock, setSelectedStock] = useState(STOCKS[2]); // Default to AGRI-1003 like the image

  return (
    <div className="min-h-screen bg-[#f7f9f2] font-sans pb-20 selection:bg-[#c8e639] selection:text-black">
      <NavBar />
      
      <div className="mx-auto max-w-350 px-6 pt-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1b2620] flex items-center gap-4">
              Stock Portfolio
            </h1>
            <p className="text-sm text-neutral-500 font-medium mt-1">Manage and track all your agricultural equity in one place.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-bold bg-white border border-gray-200 text-neutral-700 px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              <ListTodo size={16} /> Filters
            </button>
            <button className="flex items-center gap-2 text-sm font-extrabold bg-[#c8e639] text-[#1b2620] px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:bg-[#b0cc2f] transition-all">
              <Plus size={16} /> Trade New Asset
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-48 relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Equity</span>
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
              </div>
              <p className="text-3xl font-extrabold text-[#1b2620]">$ 24,850.00</p>
              <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-2">
                <TrendingDown size={14} /> 12.5% from last month
              </p>
            </div>
            
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-48 relative">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">24h Volume</span>
                <Calendar size={16} className="text-[#c8e639]" />
              </div>
              <p className="text-3xl font-extrabold text-[#1b2620]">$ 142,560.00</p>
              <p className="text-xs font-bold text-[#67780f] flex items-center gap-1 mt-2">
                <TrendingUp size={14} /> 8.2% from last month
              </p>
            </div>
            {/* Mock Bar Chart */}
            <div className="flex items-end gap-2 mt-4 h-12 w-full">
              {[30, 40, 20, 50, 45, 70, 85].map((h, i) => (
                <div key={i} className="w-full bg-[#c8e639]/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-48">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Avg Dividend Yield</span>
                <Clock size={16} className="text-[#c8e639]" />
              </div>
              <p className="text-3xl font-extrabold text-[#1b2620]">12.4%</p>
              <p className="text-xs font-bold text-[#67780f] flex items-center gap-1 mt-2">
                <TrendingDown size={14} /> 0.2% from last month
              </p>
            </div>
            {/* Mock Line Chart */}
            <div className="mt-4 relative h-12 w-full">
               <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                 <polyline fill="none" stroke="#c8e639" strokeWidth="2" points="0,25 15,20 30,22 45,15 60,18 75,10 90,12 100,5" strokeLinecap="round" strokeLinejoin="round"/>
                 {[
                   [0,25],[15,20],[30,22],[45,15],[60,18],[75,10],[90,12],[100,5]
                 ].map((pt, i) => (
                   <circle key={i} cx={pt[0]} cy={pt[1]} r="2.5" fill="white" stroke="#c8e639" strokeWidth="1.5" />
                 ))}
               </svg>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-48">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Available Cash</span>
                <Wallet size={16} className="text-[#c8e639]" />
              </div>
              <p className="text-3xl font-extrabold text-[#1b2620]">$ 186,540.00</p>
            </div>
            
            <div className="flex items-center justify-between mt-4">
               <div className="flex gap-2">
                 <div className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl flex flex-col justify-center">
                   <span className="text-[10px] text-neutral-400 font-bold">**** 4242</span>
                   <span className="text-xs font-extrabold text-neutral-700">Bank</span>
                 </div>
                 <div className="bg-[#1b2620] px-3 py-2 rounded-xl flex flex-col justify-center shadow-md">
                   <span className="text-[10px] text-white/60 font-bold">**** 6789</span>
                   <span className="text-xs font-extrabold text-white">Wallet</span>
                 </div>
               </div>
               <button className="bg-[#c8e639] hover:bg-[#a0bd0f] text-[#1b2620] p-3 rounded-full transition-colors shadow-sm">
                 <ArrowUpRight size={18} />
               </button>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <span className="text-sm font-bold text-[#1b2620] whitespace-nowrap">Active filters <span className="bg-[#1b2620] text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">2</span></span>
            
            <div className="h-4 w-px bg-gray-300 mx-2"></div>
            
            <button className="flex items-center gap-2 text-sm font-semibold text-neutral-600 bg-white border border-gray-200 px-4 py-2 rounded-xl whitespace-nowrap hover:bg-gray-50">
              All sectors <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-neutral-600 bg-white border border-gray-200 px-4 py-2 rounded-xl whitespace-nowrap hover:bg-gray-50">
              All statuses <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-neutral-600 bg-white border border-gray-200 px-4 py-2 rounded-xl whitespace-nowrap hover:bg-gray-50">
              Nov 2023 <Calendar size={14} />
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-neutral-600 bg-white border border-gray-200 px-4 py-2 rounded-xl whitespace-nowrap hover:bg-gray-50">
              Dec 2023 <Calendar size={14} />
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Enter stock ticker #" 
              className="w-full bg-white border border-gray-200 text-sm font-medium rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c8e639] focus:border-transparent"
            />
          </div>
        </div>

        {/* Bottom Split Container */}
        <div className="bg-[#1b2620] rounded-[2.5rem] p-4 flex flex-col lg:flex-row gap-4 shadow-2xl overflow-hidden min-h-150">
          
          {/* Left List Pane */}
          <div className="w-full lg:w-100 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-white font-extrabold text-lg">Active Portfolio</h2>
              
              <div className="flex bg-[#2c3d33] rounded-full p-1">
                <button className="px-4 py-1.5 text-xs font-bold text-white/60 hover:text-white rounded-full transition-colors">All</button>
                <button className="px-4 py-1.5 text-xs font-bold text-white/60 hover:text-white rounded-full transition-colors">Watch</button>
                <button className="px-4 py-1.5 text-xs font-extrabold bg-[#c8e639] text-[#1b2620] rounded-full shadow-sm flex items-center gap-1.5">Owned <span className="bg-[#1b2620] text-white text-[9px] px-1.5 py-0.5 rounded-full">5</span></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 mt-4 custom-scrollbar">
              {STOCKS.map((stock) => {
                const isSelected = selectedStock.id === stock.id;
                return (
                  <button
                    key={stock.id}
                    onClick={() => setSelectedStock(stock)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 text-left ${
                      isSelected 
                        ? "bg-[#c8e639] text-[#1b2620] shadow-md scale-[1.02]" 
                        : "hover:bg-[#2c3d33] text-white/80"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm ${isSelected ? 'bg-[#1b2620] text-[#c8e639]' : stock.color}`}>
                        {stock.initials}
                      </div>
                      <div>
                        <p className={`text-sm font-extrabold ${isSelected ? 'text-[#1b2620]' : 'text-white'}`}># {stock.id}</p>
                        <p className={`text-xs font-medium mt-0.5 ${isSelected ? 'text-[#343d07]' : 'text-white/50'}`}>{stock.time}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-sm font-extrabold ${isSelected ? 'text-[#1b2620]' : 'text-white'}`}>{stock.price}</p>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isSelected ? "bg-[#1b2620]/10 text-[#1b2620]" : "bg-white/10 text-white/60"
                      }`}>
                        {stock.status}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Details Pane */}
          <div className="flex-1 bg-linear-to-br from-[#c8e639] to-[#b0cc2f] rounded-4xl p-8 flex flex-col justify-between shadow-inner relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8 border-b border-[#1b2620]/10 pb-6">
                <div>
                  <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest mb-2">Stock Details</p>
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-extrabold text-[#1b2620]"># {selectedStock.id}</h2>
                    <span className="bg-white/40 text-[#1b2620] text-xs font-bold px-2 py-1 rounded-md">{selectedStock.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest mb-2">Asset Name</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/40 flex items-center justify-center">
                        <TrendingUp size={16} className="text-[#1b2620]" />
                      </div>
                      <span className="text-xl font-extrabold text-[#1b2620]">{selectedStock.name}</span>
                    </div>
                  </div>

                  <button className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-[#1b2620] hover:bg-white/50 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Data Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/40 hover:bg-white/50 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                    <p className="text-3xl font-extrabold text-[#1b2620] group-hover:scale-105 transition-transform origin-left">{selectedStock.price}</p>
                    <ArrowUpRight size={18} className="text-[#1b2620]/40 group-hover:text-[#1b2620] transition-colors" />
                  </div>
                  <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest">Share Price</p>
                </div>

                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/40 hover:bg-white/50 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                    <p className="text-3xl font-extrabold text-[#1b2620] group-hover:scale-105 transition-transform origin-left">$21,250.00</p>
                    <ArrowUpRight size={18} className="text-[#1b2620]/40 group-hover:text-[#1b2620] transition-colors" />
                  </div>
                  <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest">Est. Return</p>
                </div>

                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/40 hover:bg-white/50 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                    <p className="text-3xl font-extrabold text-[#1b2620] group-hover:scale-105 transition-transform origin-left">$10,740.00</p>
                    <ArrowUpRight size={18} className="text-[#1b2620]/40 group-hover:text-[#1b2620] transition-colors" />
                  </div>
                  <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest">Unrealized Gain</p>
                </div>

                {/* Add Item / Buy More */}
                <button className="bg-white/20 hover:bg-white/40 border-2 border-dashed border-[#1b2620]/20 rounded-2xl p-5 flex flex-col items-center justify-center text-[#1b2620] transition-all group">
                   <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                     <Plus size={20} />
                   </div>
                   <span className="text-sm font-extrabold">Buy Shares</span>
                </button>
                
              </div>
            </div>

            {/* Bottom Footer Area */}
            <div className="relative z-10 border-t border-[#1b2620]/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div className="flex gap-12 w-full sm:w-auto">
                <div>
                  <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest mb-1">Total Equity</p>
                  <p className="text-2xl font-extrabold text-[#1b2620]">{selectedStock.price}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest mb-1">Unrealized Gain</p>
                  <p className="text-2xl font-extrabold text-[#1b2620]">{selectedStock.price}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-bold text-[#1b2620]/60 uppercase tracking-widest mb-1">Today's Return</p>
                  <p className="text-2xl font-extrabold text-[#1b2620]">{selectedStock.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                <button className="w-12 h-12 rounded-full border-2 border-[#1b2620]/20 flex items-center justify-center text-[#1b2620] hover:bg-[#1b2620] hover:text-[#c8e639] transition-colors">
                  <Paperclip size={18} />
                </button>
                <button className="w-12 h-12 rounded-full border-2 border-[#1b2620]/20 flex items-center justify-center text-[#1b2620] hover:bg-[#1b2620] hover:text-[#c8e639] transition-colors">
                  <Calendar size={18} />
                </button>
                <button className="bg-[#1b2620] hover:bg-black text-white font-extrabold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap">
                  Trade Now <ArrowUpRight size={16} />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
