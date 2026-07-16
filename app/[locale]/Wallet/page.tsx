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
    return <div className="min-h-screen bg-white flex items-center justify-center"><RefreshCcw className="w-8 h-8 text-[#c8e639] animate-spin" /></div>;
  }

  if (!data || !data.user) return null;

  return (
    <div className="min-h-screen bg-[#f7f9f2] text-[#1b2620] flex overflow-hidden font-sans selection:bg-[#c8e639] selection:text-black"  >
      <HelpTourButton steps={walletSteps}/>
      
      <aside id="sidebar" className="w-20 border-r border-[#1b2620]/10 flex flex-col items-center py-6 shrink-0 z-20 bg-white shadow-sm " >
     
        <Link href="/en" className="text-[#1b2620] mb-12 hover:scale-110 transition-transform " >
           <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </Link>
        <div className="flex flex-col gap-6 flex-1 w-full px-4">
          <Link href="/en" className="p-3 rounded-xl hover:bg-[#f7f9f2] text-[#1b2620]/40 hover:text-[#1b2620] transition-all flex justify-center"><Home size={20} /></Link>
          <Link href="/en/Explore" className="p-3 rounded-xl hover:bg-[#f7f9f2] text-[#1b2620]/40 hover:text-[#1b2620] transition-all flex justify-center"><LayoutDashboard size={20} /></Link>
          <Link href="/en/Portfolio" className="p-3 rounded-xl hover:bg-[#f7f9f2] text-[#1b2620]/40 hover:text-[#1b2620] transition-all flex justify-center"><BarChart2 size={20} /></Link>
          <Link href="/en/Wallet" className="p-3 rounded-xl bg-[#c8e639] text-[#1b2620] shadow-[0_4px_15px_rgba(200,230,57,0.4)] flex justify-center"><Wallet size={20} /></Link>
          <Link href="/en/Investor" className="p-3 rounded-xl hover:bg-[#f7f9f2] text-[#1b2620]/40 hover:text-[#1b2620] transition-all flex justify-center"><Briefcase size={20} /></Link>
          <Link href="/en/Farmers" className="p-3 rounded-xl hover:bg-[#f7f9f2] text-[#1b2620]/40 hover:text-[#1b2620] transition-all flex justify-center"><Calendar size={20} /></Link>
        </div>
        <div className="flex flex-col gap-6 w-full px-4 mt-auto">
          <button className="p-3 rounded-xl hover:bg-[#f7f9f2] text-[#1b2620]/40 hover:text-[#1b2620] transition-all flex justify-center"><Settings size={20} /></button>
          <button onClick={() => { fetch("/api/auth/logout", {method: "POST"}).then(()=>router.push("/en/login")) }} className="p-3 rounded-xl hover:bg-red-50 text-[#1b2620]/40 hover:text-red-500 transition-all flex justify-center"><LogOut size={20} /></button>
        </div>
        
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden p-6 relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#c8e639]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

        <header className="flex justify-between items-center mb-6 relative z-30">
          <div id="search-bar" className="flex items-center bg-white border border-[#1b2620]/10 rounded-full px-4 py-2 w-96 shadow-sm">
            <Search size={16} className="text-[#1b2620]/40 mr-3" />
            <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm w-full text-[#1b2620] placeholder-[#1b2620]/40" />
            <div className="flex items-center gap-1 bg-[#f7f9f2] px-2 py-0.5 rounded text-[10px] text-[#1b2620]/60 font-bold ml-2">
               <span className="text-xs">⌘</span> Space
            </div>
          </div>
          
          <div className="flex items-center gap-5 relative">
            <button className="text-[#1b2620]/40 hover:text-[#1b2620] transition-colors"><RefreshCcw size={18} /></button>
            <button className="text-[#1b2620]/40 hover:text-[#1b2620] transition-colors relative">
               <Bell size={18} />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#c8e639] rounded-full border border-white"></span>
            </button>
            <button className="text-[#1b2620]/40 hover:text-[#1b2620] transition-colors"><Moon size={18} /></button>
            
            <div id="profile-menu" className="relative" ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-4 border-l border-[#1b2620]/10 cursor-pointer hover:opacity-80 transition-opacity"
              >
                 <div className="flex flex-col items-end">
                   <span className="text-sm font-bold text-[#1b2620]">{data.user.name}</span>
                   <span className="text-xs text-[#1b2620]/40">@{data.user.email.split('@')[0]}</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-[#f7f9f2] border-2 border-[#c8e639] flex items-center justify-center text-[#1b2620] font-extrabold uppercase overflow-hidden shadow-sm">
                    {data.user.name.substring(0, 2)}
                 </div>
                 <ChevronDown size={14} className="text-[#1b2620]/40" />
              </div>

              {isProfileOpen && (
                <div className="absolute top-14 right-0 w-72 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-[#1b2620]/10 p-5 z-50 flex flex-col animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#1b2620]/10">
                    <div className="w-12 h-12 rounded-full bg-[#f7f9f2] text-[#1b2620] flex items-center justify-center font-extrabold uppercase text-lg">
                      {data.user.name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-[#1b2620]">{data.user.name}</p>
                      <p className="text-xs text-[#1b2620]/60">{data.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between items-center bg-[#f7f9f2] p-3 rounded-xl border border-[#1b2620]/5">
                      <span className="text-xs font-bold text-[#1b2620]/60">Total Balance</span>
                      <span className="text-sm font-extrabold text-[#1b2620]">{data.user.totalBalance} AGV <span className="text-[10px] text-neutral-400 font-medium ml-1">(~${data.user.totalBalance})</span></span>
                    </div>
                    <div className="flex justify-between items-center bg-[#f7f9f2] p-3 rounded-xl border border-[#1b2620]/5">
                      <span className="text-xs font-bold text-[#1b2620]/60">KYC Status</span>
                      {data.user.kyc_verified ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded"><ShieldCheck size={12}/> Verified</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded"><ShieldAlert size={12}/> Pending</span>
                      )}
                    </div>
                  </div>

                  <Link href="/en/profile" className="w-full bg-[#1b2620] text-white text-center text-sm font-bold py-2.5 rounded-xl hover:bg-[#0a0f0c] transition-colors mb-2">
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            <div className="xl:col-span-2 flex flex-col gap-6">
              
              <div id="balance-overview" className=" bg-white rounded-3xl p-8 border border-[#1b2620]/10 relative overflow-hidden flex flex-col min-h-[380px] shadow-sm">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h2 className="text-[#1b2620]/60 text-sm font-bold mb-1">Total Balance</h2>
                    <div className="flex items-end gap-3">
                       <span className="text-4xl font-extrabold tracking-tight text-[#1b2620]">{data.user.totalBalance} AGV <span className="text-lg text-neutral-400 font-medium ml-2">(~${data.user.totalBalance})</span></span>
                       <span className="text-[#1b2620] text-sm font-bold flex items-center mb-1 bg-[#c8e639] px-2 py-0.5 rounded shadow-sm"><ArrowUpRight size={14} className="mr-1"/> 2.92%</span>
                    </div>
                  </div>
                  <div className="flex bg-[#f7f9f2] p-1 rounded-full border border-[#1b2620]/10">
                     <button className="px-4 py-1.5 text-xs font-bold text-[#1b2620]/40 hover:text-[#1b2620] transition-colors rounded-full">1 year</button>
                     <button className="px-4 py-1.5 text-xs font-bold text-[#1b2620]/40 hover:text-[#1b2620] transition-colors rounded-full">6 month</button>
                     <button className="px-4 py-1.5 text-xs font-bold text-[#1b2620]/40 hover:text-[#1b2620] transition-colors rounded-full">3 month</button>
                     <button className="px-4 py-1.5 text-xs font-bold bg-white text-[#1b2620] rounded-full shadow-sm border border-[#1b2620]/5">1 month</button>
                  </div>
                </div>

                <div className="flex-1 w-full -ml-4 mt-4 relative z-10 min-h-[200px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.balanceData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                         <defs>
                           <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#1b2620" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#1b2620" stopOpacity={0}/>
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
                         <Area type="monotone" dataKey="balance" stroke="#1b2620" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#1b2620]/10 relative z-10">
                   <div className="flex items-center gap-3 text-sm">
                      <span className="text-[#1b2620]/60 font-bold">Average annual rate</span>
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
                 
                 <div id="prospectus-card" className="bg-gradient-to-br from-[#1b2620] to-[#0a0f0c] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-lg">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8e639]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                    <div className="relative z-10">
                       <h3 className="text-3xl font-extrabold text-white leading-tight mb-3">Trusted by Thousands<br/>Join Us Today!</h3>
                       <p className="text-white/60 text-sm font-bold w-4/5 leading-relaxed">Secure, reliable, and trusted by agricultural investors worldwide.</p>
                       
                       <div className="flex -space-x-3 mt-6">
                          <div className="w-10 h-10 rounded-full bg-white border-2 border-[#1b2620] flex items-center justify-center text-xs font-bold text-[#1b2620] z-30">US</div>
                          <div className="w-10 h-10 rounded-full bg-[#c8e639] border-2 border-[#1b2620] flex items-center justify-center text-xs font-bold text-[#1b2620] z-20">EU</div>
                          <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-[#1b2620] flex items-center justify-center text-xs font-bold text-white z-10">+</div>
                       </div>
                    </div>
                    <button className="w-full bg-[#c8e639] text-[#1b2620] font-extrabold py-3.5 rounded-xl mt-6 relative z-10 shadow-[0_0_15px_rgba(200,230,57,0.2)] hover:shadow-[0_0_25px_rgba(200,230,57,0.4)] transition-all hover:scale-[1.02]">
                       Request Prospectus
                    </button>
                 </div>

                 <div id="investment-chart" className="bg-white rounded-3xl p-6 border border-[#1b2620]/10 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                         <h3 className="text-[#1b2620]/60 text-xs uppercase tracking-wider font-extrabold mb-1">Investments</h3>
                         <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold text-[#1b2620]">{data.user.totalInvestments} AGV <span className="text-xs text-neutral-400 font-medium ml-1">(~${data.user.totalInvestments})</span></span>
                            <span className="text-[#1b2620] text-[10px] font-bold flex items-center bg-[#c8e639] px-1.5 py-0.5 rounded shadow-sm"><ArrowUpRight size={10}/> 1.52%</span>
                         </div>
                       </div>
                       <div className="flex gap-2">
                          <button className="flex items-center gap-1 bg-[#f7f9f2] border border-[#1b2620]/10 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1b2620]/60 hover:text-[#1b2620] transition-colors">
                            Sort <ArrowDownLeft size={12} className="rotate-180" />
                          </button>
                          <button className="flex items-center gap-1 bg-[#f7f9f2] border border-[#1b2620]/10 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1b2620]/60 hover:text-[#1b2620] transition-colors">
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
                             <Tooltip cursor={{fill: 'rgba(27,38,32,0.02)'}} contentStyle={{ backgroundColor: '#1b2620', border: 'none', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                             <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {data.investmentData.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={entry.highlight ? "#c8e639" : "#e2e8e4"} />
                                ))}
                             </Bar>
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

              </div>

            </div>
            
            <div className="flex flex-col gap-6">
               
               <div id="wallet-card" className="bg-[#f7f9f2] rounded-3xl p-6 border border-[#1b2620]/10 shadow-sm relative overflow-hidden h-[420px] flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
                  
                  <div className="flex justify-between items-center mb-8 relative z-10">
                     <h3 className="text-[#1b2620] font-extrabold text-sm tracking-wide uppercase">My cards</h3>
                     <button className="bg-white hover:bg-[#c8e639] text-[#1b2620] text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1 border border-[#1b2620]/10 shadow-sm">
                        + Add new
                     </button>
                  </div>
                  
                  <div className="relative flex-1 flex flex-col items-center justify-center">
                     
                     <div className="absolute top-0 w-[85%] h-12 bg-[#e2e8e4] rounded-t-2xl border border-[#1b2620]/5 shadow-sm scale-95 translate-y-0"></div>
                     <div className="absolute top-4 w-[92%] h-12 bg-[#f0f4ec] rounded-t-2xl border border-[#1b2620]/5 shadow-md scale-[0.98] translate-y-0"></div>
                     
                     <div className="relative z-10 w-full bg-[#1b2620] rounded-2xl p-6 border border-[#1b2620]/10 shadow-xl mt-8 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8e639]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                        <div className="flex justify-between items-start mb-8 relative z-10">
                           <span className="text-white font-extrabold text-xl tracking-wider">VISA</span>
                           <div className="w-10 h-8 rounded bg-gradient-to-br from-gray-200 to-gray-400 opacity-90 border border-gray-300"></div>
                        </div>
                        <p className="text-white/60 text-xs font-bold mb-1 relative z-10">Balance</p>
                        <div className="flex justify-between items-end relative z-10">
                           <span className="text-2xl font-extrabold text-white">{data.user.totalBalance} AGV <span className="text-xs text-white/50 font-medium ml-1">(~${data.user.totalBalance})</span></span>
                           <span className="text-[#1b2620] text-[10px] font-extrabold bg-[#c8e639] px-2 py-1 rounded shadow-sm flex items-center gap-0.5"><ArrowUpRight size={10}/> 3.52%</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4 mt-6 relative z-10">
                     <button className="flex-1 bg-white hover:bg-[#f0f4ec] border border-[#1b2620]/10 text-[#1b2620] font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ArrowDownLeft size={16} /> Request
                     </button>
                     <button className="flex-1 bg-[#1b2620] hover:bg-[#0a0f0c] text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                        <ArrowUpRight size={16} className="text-[#c8e639]" /> Transfer
                     </button>
                  </div>
               </div>

               <div id="recent-transactions" className="bg-white rounded-3xl p-6 border border-[#1b2620]/10 shadow-sm flex-1 min-h-[300px]">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-[#1b2620] font-extrabold text-sm tracking-wide uppercase">Recent Transactions</h3>
                     <button className="text-[#1b2620]/40 hover:text-[#1b2620] text-xs font-bold transition-colors">View All</button>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                     {data.transactions.map((tx: any) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#f7f9f2] transition-colors cursor-pointer border border-transparent hover:border-[#1b2620]/5">
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold ${tx.type === 'in' ? 'bg-[#c8e639]/20 text-[#1b2620]' : 'bg-[#1b2620]/5 text-[#1b2620]'}`}>
                                 {tx.name.substring(0, 1)}
                              </div>
                              <div>
                                 <p className="text-[#1b2620] font-bold text-sm mb-0.5">{tx.name}</p>
                                 <p className="text-[#1b2620]/40 text-[11px] font-bold">{tx.date}</p>
                              </div>
                           </div>
                           <span className={`font-extrabold text-sm ${tx.type === 'in' ? 'text-green-600' : 'text-[#1b2620]'}`}>
                              {tx.type === 'in' ? '+' : '-'}{tx.rawAmount.toLocaleString('en-US', {minimumFractionDigits: 2})} AGV
                              <span className="text-[10px] opacity-60 ml-1 font-medium">(~${tx.rawAmount.toLocaleString('en-US', {minimumFractionDigits: 2})})</span>
                           </span>
                        </div>
                     ))}
                  </div>
               </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
