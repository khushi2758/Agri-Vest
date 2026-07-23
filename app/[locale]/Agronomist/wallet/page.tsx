"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { walletSteps } from "./tourw";
import HelpTourButton from "../HelpTourButton";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Cell } from "recharts";
import { 
  Search, RefreshCcw, Bell, Moon, Home, LayoutDashboard, 
  BarChart2, Wallet, Briefcase, Calendar, Settings, LogOut, 
  ArrowUpRight, ArrowDownLeft, ChevronDown, User, ShieldCheck, ShieldAlert
} from "lucide-react";

// ---- shared keyframes / soft-UI utility classes ---------------------------
function SoftUIStyles() {
  return (
    <style jsx global>{`
      @keyframes wallet-fade-up {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes wallet-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes wallet-row-in {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes wallet-spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* plain transparent glass: translucent surface, soft neutral shadow, no glow/blur aura */
      .wallet-card-soft {
        background: rgba(255, 255, 255, 0.55);
        backdrop-filter: blur(18px) saturate(140%);
        -webkit-backdrop-filter: blur(18px) saturate(140%);
        border: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow: 0 8px 24px rgba(27, 38, 32, 0.06);
      }
      .wallet-card-flat {
        background: rgba(255, 255, 255, 0.45);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255, 255, 255, 0.55);
      }
      .wallet-pill {
        background: rgba(255, 255, 255, 0.55);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.6);
      }

      /* translucent gradient-tinted glass card, static (no hue animation) */
      .wallet-holo-card {
        background: linear-gradient(135deg, rgba(196, 181, 253, 0.45), rgba(191, 230, 221, 0.3), rgba(223, 242, 168, 0.35));
        backdrop-filter: blur(16px) saturate(140%);
        -webkit-backdrop-filter: blur(16px) saturate(140%);
        border: 1px solid rgba(255, 255, 255, 0.5);
      }

      .wallet-fade-up { animation: wallet-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .wallet-fade-in { animation: wallet-fade-in 0.6s ease both; }
      .wallet-row-in { animation: wallet-row-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }

      .wallet-hover-lift {
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
      }
      .wallet-hover-lift:hover {
        transform: translateY(-3px);
        box-shadow: 0 16px 32px rgba(27, 38, 32, 0.1);
      }

      @media (prefers-reduced-motion: reduce) {
        .wallet-fade-up, .wallet-fade-in, .wallet-row-in, .wallet-hover-lift {
          animation: none !important;
          transition: none !important;
        }
        .wallet-hover-lift:hover { transform: none; }
      }
    `}</style>
  );
}

// tiny helper so recent-transaction icons cycle through the brand palette
const TX_COLORS = [
  { bg: "bg-[#c8e639]/25", text: "text-[#4d5c1f]" },
  { bg: "bg-[#5f7a4a]/15", text: "text-[#5f7a4a]" },
  { bg: "bg-[#1b2620]/5", text: "text-[#1b2620]" },
  { bg: "bg-amber-100", text: "text-amber-700" },
];

export default function WalletDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchWalletData() {
      try {
        const res = await fetch("/api/wallet");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          router.push("/en/login");
        }
      } catch (err) {
        router.push("/en/login");
      } finally {
        setLoading(false);
      }
    }
    fetchWalletData();
  }, [router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#b7d0ea] via-[#9dc0b1] to-[#6f8f5e] flex items-center justify-center relative overflow-hidden">
        <SoftUIStyles />
        <div className="wallet-card-soft rounded-3xl p-8 relative z-10 wallet-fade-in">
          <RefreshCcw className="w-8 h-8 text-[#5f7a4a]" style={{ animation: "wallet-spin-slow 1s linear infinite" }} />
        </div>
      </div>
    );
  }

  if (!data || !data.user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b7d0ea] via-[#9dc0b1] to-[#6f8f5e] text-[#1b2620] flex flex-col overflow-hidden font-sans selection:bg-[#c8e639] selection:text-[#1b2620]"  >
      <SoftUIStyles />
      <div className="flex flex-1 overflow-hidden">
      <HelpTourButton steps={walletSteps}/>
      
      <aside id="sidebar" className="w-60 border-r border-black/5 flex flex-col py-6 px-4 shrink-0 z-20 wallet-card-flat shadow-sm wallet-fade-in" >
     
        <Link href="/en" className="flex items-center gap-2 text-[#1b2620] mb-10 px-2" >
           <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-[#5f7a4a]">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
           <span className="font-extrabold text-lg tracking-tight"><span className="text-[#c8e639] bg-[#1b2620] px-1 rounded">AGRI</span>VEST</span>
        </Link>
        <nav className="flex flex-col gap-1 flex-1 w-full">
          <Link href="/en" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#c8e639] text-[#1b2620] font-bold text-sm transition-all"><Home size={18} /> Overview</Link>
          <Link href="/en/Explore" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] text-[#1b2620]/50 hover:text-[#1b2620] font-bold text-sm transition-all"><LayoutDashboard size={18} /> Explore</Link>
          <Link href="/en/Portfolio" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] text-[#1b2620]/50 hover:text-[#1b2620] font-bold text-sm transition-all"><BarChart2 size={18} /> Portfolio</Link>
          <Link href="/en/Wallet" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] text-[#1b2620]/50 hover:text-[#1b2620] font-bold text-sm transition-all"><Wallet size={18} /> Wallet</Link>
          <Link href="/en/Investor" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] text-[#1b2620]/50 hover:text-[#1b2620] font-bold text-sm transition-all"><Briefcase size={18} /> Investor</Link>
          <Link href="/en/Farmers" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] text-[#1b2620]/50 hover:text-[#1b2620] font-bold text-sm transition-all"><Calendar size={18} /> Farmers</Link>
        </nav>
        <div className="flex flex-col gap-1 w-full mt-auto pt-4 border-t border-black/5">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] text-[#1b2620]/50 hover:text-[#1b2620] font-bold text-sm transition-all"><Settings size={18} /> Settings</button>
          <button onClick={() => { fetch("/api/auth/logout", {method: "POST"}).then(()=>router.push("/en/login")) }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-[#1b2620]/50 hover:text-red-500 font-bold text-sm transition-all"><LogOut size={18} /> Sign out</button>
        </div>
        
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden p-6 relative">

        <header className="flex justify-between items-center mb-6 relative z-30 wallet-fade-up">
          <div id="search-bar" className="flex items-center wallet-pill rounded-full px-4 py-2 w-96 shadow-sm transition-shadow focus-within:shadow-md">
            <Search size={16} className="text-[#1b2620]/40 mr-3" />
            <input type="text" placeholder="Search merchant or ID..." className="bg-transparent border-none outline-none text-sm w-full text-[#1b2620] placeholder-[#1b2620]/40" />
            <div className="flex items-center gap-1 bg-black/[0.03] px-2 py-0.5 rounded text-[10px] text-[#1b2620]/60 font-bold ml-2">
               <span className="text-xs">⌘</span> Space
            </div>
          </div>
          
          <div className="flex items-center gap-5 relative">
            <button className="text-[#1b2620]/40 hover:text-[#1b2620] transition-all hover:scale-110"><RefreshCcw size={18} /></button>
            <button className="text-[#1b2620]/40 hover:text-[#1b2620] transition-all hover:scale-110 relative">
               <Bell size={18} />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#c8e639] rounded-full border border-white"></span>
            </button>
            <button className="text-[#1b2620]/40 hover:text-[#1b2620] transition-all hover:scale-110"><Moon size={18} /></button>
            
            <div id="profile-menu" className="relative" ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-4 border-l border-black/10 cursor-pointer hover:opacity-80 transition-opacity"
              >
                 <div className="flex flex-col items-end">
                   <span className="text-sm font-bold text-[#1b2620]">{data.user.name}</span>
                   <span className="text-xs text-[#1b2620]/40">@{data.user.email.split('@')[0]}</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-[#c8e639]/20 border-2 border-[#c8e639] flex items-center justify-center text-[#1b2620] font-extrabold uppercase overflow-hidden shadow-sm">
                    {data.user.name.substring(0, 2)}
                 </div>
                 <ChevronDown size={14} className="text-[#1b2620]/40" />
              </div>

              {isProfileOpen && (
                <div className="absolute top-14 right-0 w-72 wallet-card-soft rounded-2xl p-5 z-50 flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-black/5">
                    <div className="w-12 h-12 rounded-full bg-[#c8e639]/20 text-[#1b2620] flex items-center justify-center font-extrabold uppercase text-lg">
                      {data.user.name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-[#1b2620]">{data.user.name}</p>
                      <p className="text-xs text-[#1b2620]/60">{data.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between items-center bg-black/[0.03] p-3 rounded-xl border border-black/5">
                      <span className="text-xs font-bold text-[#1b2620]/60">Total Balance</span>
                      <span className="text-sm font-extrabold text-[#1b2620]">{data.user.totalBalance} AGV <span className="text-[10px] text-neutral-400 font-medium ml-1">(~${data.user.totalBalance})</span></span>
                    </div>
                    <div className="flex justify-between items-center bg-black/[0.03] p-3 rounded-xl border border-black/5">
                      <span className="text-xs font-bold text-[#1b2620]/60">KYC Status</span>
                      {data.user.kyc_verified ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-[#5f7a4a] bg-[#5f7a4a]/10 px-2 py-1 rounded"><ShieldCheck size={12}/> Verified</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded"><ShieldAlert size={12}/> Pending</span>
                      )}
                    </div>
                  </div>

                  <Link href="/en/profile" className="w-full bg-[#1b2620] text-white text-center text-sm font-bold py-2.5 rounded-xl hover:bg-black transition-colors mb-2">
                    Edit Profile & KYC
                  </Link>
                  <button onClick={() => { fetch("/api/auth/logout", {method: "POST"}).then(()=>router.push("/en/login")) }} className="w-full bg-red-50 text-red-600 text-center text-sm font-bold py-2.5 rounded-xl hover:bg-red-100 transition-colors">
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 pb-10 custom-scrollbar relative z-10">

          {/* stat chips row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 wallet-fade-up">
            <div className="wallet-card-soft wallet-hover-lift rounded-2xl p-5">
              <p className="text-[#1b2620]/50 text-xs font-bold uppercase tracking-wide mb-1">Balance</p>
              <p className="text-xl font-extrabold text-[#1b2620] mb-1">{data.user.totalBalance} AGV</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1b2620] bg-[#c8e639] px-2 py-0.5 rounded-full"><ArrowUpRight size={10}/> 2.92% WoW</span>
            </div>
            <div className="wallet-card-soft wallet-hover-lift rounded-2xl p-5">
              <p className="text-[#1b2620]/50 text-xs font-bold uppercase tracking-wide mb-1">Investments</p>
              <p className="text-xl font-extrabold text-[#1b2620] mb-1">{data.user.totalInvestments} AGV</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1b2620] bg-[#c8e639] px-2 py-0.5 rounded-full"><ArrowUpRight size={10}/> 1.52% WoW</span>
            </div>
            <div className="wallet-card-soft wallet-hover-lift rounded-2xl p-5">
              <p className="text-[#1b2620]/50 text-xs font-bold uppercase tracking-wide mb-1">Avg. annual rate</p>
              <p className="text-xl font-extrabold text-[#1b2620] mb-1">{data.user.averageAnnualRate} AGV</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1b2620] bg-[#c8e639] px-2 py-0.5 rounded-full"><ArrowUpRight size={10}/> 3.52% WoW</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            <div className="xl:col-span-2 flex flex-col gap-6">
              
              <div id="balance-overview" className="wallet-card-soft wallet-hover-lift rounded-3xl p-8 relative overflow-hidden flex flex-col min-h-[380px] wallet-fade-up" style={{ animationDelay: "80ms" }}>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h2 className="text-[#1b2620]/50 text-sm font-bold mb-1">Payout Timeline</h2>
                    <div className="flex items-end gap-3">
                       <span className="text-4xl font-extrabold tracking-tight text-[#1b2620]">{data.user.totalBalance} AGV <span className="text-lg text-neutral-400 font-medium ml-2">(~${data.user.totalBalance})</span></span>
                       <span className="text-[#1b2620] text-sm font-bold flex items-center mb-1 bg-[#c8e639] px-2 py-0.5 rounded-full"><ArrowUpRight size={14} className="mr-1"/> 2.92%</span>
                    </div>
                  </div>
                  <div className="flex wallet-pill p-1 rounded-full">
                     <button className="px-4 py-1.5 text-xs font-bold text-[#1b2620]/40 hover:text-[#1b2620] transition-colors rounded-full">1 year</button>
                     <button className="px-4 py-1.5 text-xs font-bold text-[#1b2620]/40 hover:text-[#1b2620] transition-colors rounded-full">6 month</button>
                     <button className="px-4 py-1.5 text-xs font-bold text-[#1b2620]/40 hover:text-[#1b2620] transition-colors rounded-full">3 month</button>
                     <button className="px-4 py-1.5 text-xs font-bold bg-white text-[#1b2620] rounded-full shadow-sm">1 month</button>
                  </div>
                </div>

                <div className="flex-1 w-full -ml-4 mt-4 relative z-10 min-h-[200px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.balanceData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                         <defs>
                           <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#c8e639" stopOpacity={0.4}/>
                             <stop offset="95%" stopColor="#c8e639" stopOpacity={0}/>
                           </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(27,38,32,0.05)" />
                         <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'rgba(27,38,32,0.4)', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                         <YAxis orientation="right" axisLine={false} tickLine={false} tick={{fill: 'rgba(27,38,32,0.4)', fontSize: 12, fontWeight: 'bold'}} dx={10} tickFormatter={(val) => `${val/1000}k AGV`} />
                         <Tooltip 
                            contentStyle={{ backgroundColor: '#1b2620', borderRadius: '12px', border: 'none', color: '#fff', padding: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                            itemStyle={{ color: '#c8e639', fontWeight: 'bold' }}
                            labelStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '4px' }}
                            formatter={(value: any) => [`${value} AGV`, "Balance"]}
                            cursor={{ stroke: 'rgba(27,38,32,0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
                         />
                         <Area type="monotone" dataKey="balance" stroke="#1b2620" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" isAnimationActive animationDuration={1100} animationEasing="ease-out" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-black/5 relative z-10">
                   <div className="flex items-center gap-3 text-sm">
                      <span className="text-[#1b2620]/50 font-bold">Average annual rate</span>
                      <span className="font-extrabold text-[#1b2620]">{data.user.averageAnnualRate} AGV <span className="text-[10px] text-neutral-400 font-medium ml-1">(~${data.user.averageAnnualRate})</span></span>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#1b2620]">
                         <div className="w-3 h-3 rounded-sm bg-[#1b2620]"></div> Actual balance
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#1b2620]/60">
                         <div className="w-3 h-3 rounded-sm bg-[#c8e639]"></div> Total monthly balance
                      </div>
                   </div>
                </div>
              </div>

              <div  className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[320px]">
                 
                 <div id="prospectus-card" className="bg-[#1b2620] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-lg wallet-fade-up wallet-hover-lift" style={{ animationDelay: "160ms" }}>
                    <div className="relative z-10">
                       <h3 className="text-3xl font-extrabold text-white leading-tight mb-3">Trusted by Thousands<br/>Join Us Today!</h3>
                       <p className="text-white/60 text-sm font-bold w-4/5 leading-relaxed">Secure, reliable, and trusted by agricultural investors worldwide.</p>
                       
                       <div className="flex -space-x-3 mt-6">
                          <div className="w-10 h-10 rounded-full bg-white border-2 border-[#1b2620] flex items-center justify-center text-xs font-bold text-[#1b2620] z-30">US</div>
                          <div className="w-10 h-10 rounded-full bg-[#c8e639] border-2 border-[#1b2620] flex items-center justify-center text-xs font-bold text-[#1b2620] z-20">EU</div>
                          <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-[#1b2620] flex items-center justify-center text-xs font-bold text-white z-10">+</div>
                       </div>
                    </div>
                    <button className="w-full bg-[#c8e639] text-[#1b2620] font-extrabold py-3.5 rounded-xl mt-6 relative z-10 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                       Request Prospectus
                    </button>
                 </div>

                 <div id="investment-chart" className="wallet-card-soft wallet-hover-lift rounded-3xl p-6 flex flex-col wallet-fade-up" style={{ animationDelay: "220ms" }}>
                    <div className="flex justify-between items-start mb-6">
                       <div>
                         <h3 className="text-[#1b2620]/50 text-xs uppercase tracking-wider font-extrabold mb-1">Net vs Fees</h3>
                         <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold text-[#1b2620]">{data.user.totalInvestments} AGV <span className="text-xs text-neutral-400 font-medium ml-1">(~${data.user.totalInvestments})</span></span>
                            <span className="text-[#1b2620] text-[10px] font-bold flex items-center bg-[#c8e639] px-1.5 py-0.5 rounded-full"><ArrowUpRight size={10}/> 1.52%</span>
                         </div>
                       </div>
                       <div className="flex gap-2">
                          <button className="flex items-center gap-1 wallet-pill px-3 py-1.5 rounded-lg text-xs font-bold text-[#1b2620]/60 hover:text-[#1b2620] transition-colors">
                            Sort <ArrowDownLeft size={12} className="rotate-180" />
                          </button>
                          <button className="flex items-center gap-1 wallet-pill px-3 py-1.5 rounded-lg text-xs font-bold text-[#1b2620]/60 hover:text-[#1b2620] transition-colors">
                            Month <ChevronDown size={12} />
                          </button>
                       </div>
                    </div>
                    
                    <div className="flex-1 w-full relative">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.investmentData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(27,38,32,0.05)" />
                             <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'rgba(27,38,32,0.4)', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                             <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(27,38,32,0.4)', fontSize: 10, fontWeight: 'bold'}} tickFormatter={(val) => `${val} AGV`} />
                             <Tooltip cursor={{fill: 'rgba(27,38,32,0.03)'}} contentStyle={{ backgroundColor: '#1b2620', border: 'none', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                             <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={900} animationEasing="ease-out">
                                {data.investmentData.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={entry.highlight ? "#c8e639" : "#e5e8da"} />
                                ))}
                             </Bar>
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

              </div>

            </div>
            
            <div className="flex flex-col gap-6">
               
               <div id="wallet-card" className="wallet-card-soft rounded-3xl p-6 relative overflow-hidden h-[420px] flex flex-col wallet-fade-up" style={{ animationDelay: "120ms" }}>
                  <div className="flex justify-between items-center mb-8 relative z-10">
                     <h3 className="text-[#1b2620] font-extrabold text-sm tracking-wide uppercase">My cards</h3>
                     <button className="bg-white hover:bg-[#c8e639]/20 text-[#1b2620] text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1 shadow-sm">
                        + Add new
                     </button>
                  </div>
                  
                  <div className="relative flex-1 flex flex-col items-center justify-center">
                     
                     <div className="absolute top-0 w-[85%] h-12 bg-black/[0.02] rounded-t-2xl shadow-sm scale-95 translate-y-0"></div>
                     <div className="absolute top-4 w-[92%] h-12 bg-black/[0.03] rounded-t-2xl shadow-md scale-[0.98] translate-y-0"></div>
                     
                     <div className="relative z-10 w-full wallet-holo-card rounded-2xl p-6 shadow-md mt-8 overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-8 relative z-10">
                           <span className="text-[#1b2620]/70 font-extrabold text-xl tracking-wider">VISA</span>
                           <div className="w-10 h-8 rounded bg-gradient-to-br from-white/60 to-white/20 opacity-90 border border-white/40"></div>
                        </div>
                        <p className="text-[#1b2620]/50 text-xs font-bold mb-1 relative z-10">Balance</p>
                        <div className="flex justify-between items-end relative z-10">
                           <span className="text-2xl font-extrabold text-[#1b2620]">{data.user.totalBalance} AGV <span className="text-xs text-[#1b2620]/40 font-medium ml-1">(~${data.user.totalBalance})</span></span>
                           <span className="text-[#1b2620] text-[10px] font-extrabold bg-white/70 px-2 py-1 rounded-full shadow-sm flex items-center gap-0.5"><ArrowUpRight size={10}/> 3.52%</span>
                        </div>
                     </div>
                     <p className="text-[#1b2620]/40 text-xs font-bold mt-4">Virtual card ready</p>
                  </div>

                  <div className="flex gap-4 mt-6 relative z-10">
                     <button className="flex-1 bg-white hover:bg-black/[0.02] border border-black/5 text-[#1b2620] font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ArrowDownLeft size={16} /> Request
                     </button>
                     <button className="flex-1 bg-[#1b2620] hover:bg-black text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                        <ArrowUpRight size={16} className="text-[#c8e639]" /> Reveal details
                     </button>
                  </div>
               </div>

               <div id="recent-transactions" className="wallet-card-soft wallet-hover-lift rounded-3xl p-6 flex-1 min-h-[300px] wallet-fade-up" style={{ animationDelay: "260ms" }}>
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-[#1b2620] font-extrabold text-sm tracking-wide uppercase">Recent Transactions</h3>
                     <button className="text-[#1b2620]/40 hover:text-[#1b2620] text-xs font-bold transition-colors">View All</button>
                  </div>

                  <div className="flex gap-2 mb-4">
                     <button className="px-3 py-1 rounded-full text-xs font-bold bg-[#1b2620] text-white">All</button>
                     <button className="px-3 py-1 rounded-full text-xs font-bold wallet-pill text-[#1b2620]/50">Spend</button>
                     <button className="px-3 py-1 rounded-full text-xs font-bold wallet-pill text-[#1b2620]/50">Filters</button>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                     {data.transactions.map((tx: any, index: number) => {
                        const palette = TX_COLORS[index % TX_COLORS.length];
                        return (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/[0.02] transition-colors cursor-pointer border border-transparent hover:border-black/5 wallet-row-in" style={{ animationDelay: `${300 + index * 45}ms` }}>
                           <div className="flex items-center gap-4">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold ${palette.bg} ${palette.text}`}>
                                 {tx.name.substring(0, 1)}
                              </div>
                              <div>
                                 <p className="text-[#1b2620] font-bold text-sm mb-0.5">{tx.name}</p>
                                 <p className="text-[#1b2620]/40 text-[11px] font-bold">{tx.date}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <span className={`font-extrabold text-sm ${tx.type === 'in' ? 'text-[#5f7a4a]' : 'text-[#1b2620]'}`}>
                                 {tx.type === 'in' ? '+' : '-'}{tx.rawAmount.toLocaleString('en-US', {minimumFractionDigits: 2})} AGV
                                 <span className="text-[10px] opacity-60 ml-1 font-medium">(~${tx.rawAmount.toLocaleString('en-US', {minimumFractionDigits: 2})})</span>
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${tx.type === 'in' ? 'bg-[#c8e639] text-[#1b2620]' : 'bg-black/5 text-[#1b2620]/60'}`}>
                                 {tx.type === 'in' ? 'Received' : 'Sent'}
                              </span>
                           </div>
                        </div>
                        );
                     })}
                  </div>
               </div>

            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}