"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../../navbar";
import { Loader2, Award, Zap, History, ShieldCheck, Flag } from "lucide-react";

export default function AgronomistWallet() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9f2] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#c8e639] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans selection:bg-[#c8e639] selection:text-black">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-[#1b2620] mb-8">Agronomist Credentials & Wallet</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="md:col-span-2 bg-[#1b2620] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8e639]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="relative z-10 flex justify-between items-start mb-12">
              <div>
                <p className="text-[#c8e639] font-bold text-sm tracking-widest uppercase mb-1">Total Earned Credits</p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-white">{user?.credits || 0}</span>
                  <span className="text-white/50 font-bold mb-1 border border-white/20 px-2 py-0.5 rounded text-xs">CRD</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                <Award className="text-[#c8e639] w-8 h-8" />
              </div>
            </div>
            
            <div className="relative z-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-white/50 text-xs font-bold mb-1">Status</p>
                <p className="text-white font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#c8e639]"></span> Active Verifier
                </p>
              </div>
              <div>
                <p className="text-white/50 text-xs font-bold mb-1">Base Conversion Rate</p>
                <p className="text-white font-bold">1 CRD = 0.50 AGV</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <h3 className="font-extrabold text-[#1b2620] text-sm uppercase">Quick Actions</h3>
            
            <button className="flex-1 w-full flex items-center justify-between bg-[#f7f9f2] p-4 rounded-2xl border border-gray-200 hover:border-[#c8e639] transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Zap className="text-[#1b2620] w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-[#1b2620] text-sm group-hover:text-[#c8e639] transition-colors">Redeem Credits</p>
                  <p className="text-xs text-gray-400 font-bold">Convert to AGV</p>
                </div>
              </div>
            </button>

            <button className="flex-1 w-full flex items-center justify-between bg-[#f7f9f2] p-4 rounded-2xl border border-gray-200 hover:border-[#1b2620] transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <History className="text-[#1b2620] w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-[#1b2620] text-sm">Validation History</p>
                  <p className="text-xs text-gray-400 font-bold">View past analysis</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-extrabold text-[#1b2620] mb-6">Recent Validations</h2>
          <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 font-bold">History will appear here after validations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
