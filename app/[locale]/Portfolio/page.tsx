"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HelpTourButton from "../HelpTourButton";
import { portfolioSteps } from "./tourp";
import { 
  Search, LayoutDashboard, BarChart2, Wallet, 
  Settings, TrendingUp, Info, RefreshCw, Filter, 
  ChevronRight, TriangleAlert, MinusCircle, FileText, 
  Briefcase, Loader2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ---- shared glass / motion utility classes (same warm language as the other redesigned pages) ----
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
        from { opacity: 0; transform: translateX(-8px); }
        to { opacity: 1; transform: translateX(0); }
      }

      /* plain transparent glass: translucent surface, soft neutral warm shadow, no glow/blur aura */
      .wallet-card-soft {
        background: rgba(255, 252, 244, 0.6);
        backdrop-filter: blur(18px) saturate(140%);
        -webkit-backdrop-filter: blur(18px) saturate(140%);
        border: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow: 0 8px 24px rgba(120, 100, 70, 0.08);
      }
      .wallet-card-flat {
        background: rgba(255, 255, 255, 0.45);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255, 255, 255, 0.55);
      }
      .wallet-pill {
        background: rgba(255, 255, 255, 0.55);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.6);
      }

      .wallet-fade-up { animation: wallet-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .wallet-fade-in { animation: wallet-fade-in 0.6s ease both; }
      .wallet-row-in { animation: wallet-row-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }

      .wallet-hover-lift {
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
      }
      .wallet-hover-lift:hover {
        transform: translateY(-3px);
        box-shadow: 0 16px 32px rgba(120, 100, 70, 0.12);
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

export default function PortfolioPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch("/api/portfolio");
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
    fetchPortfolio();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#b7d0ea] via-[#9dc0b1] to-[#6f8f5e] flex items-center justify-center">
        <SoftUIStyles />
        <div className="wallet-card-soft rounded-3xl p-8 wallet-fade-in">
          <Loader2 className="w-8 h-8 text-[#8fa810] animate-spin" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Mocked chart data mapping to the mockup's visual
  const chartData = [
    { name: "Jul, 2020", invested: 10000, released: 5000 },
    { name: "Oct, 2020", invested: 20000, released: 15000 },
    { name: "Jan, 2021", invested: 30000, released: 35000 },
    { name: "Apr, 2021", invested: 50000, released: 45000 },
    { name: "Now", invested: 67000, released: 50000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b7d0ea] via-[#9dc0b1] to-[#6f8f5e] text-[#8fa810] flex overflow-hidden font-sans selection:bg-[#c8e639] selection:text-black">
      <SoftUIStyles />
      <HelpTourButton steps={portfolioSteps} />

      {/* Sidebar Navigation */}
      <aside className="w-64 wallet-card-flat flex flex-col py-6 shrink-0 z-20">
        <div className="px-8 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#8fa810] flex items-center justify-center">
            <Briefcase size={16} strokeWidth={2} className="text-[#c8e639]" />
          </div>
          <span className="font-extrabold tracking-widest text-lg">AGRI-VEST</span>
        </div>
        
        <div className="px-6 mb-8">
          <div className="flex items-center wallet-pill rounded-lg px-3 py-2 w-full">
            <Search size={14} strokeWidth={2} className="text-gray-400 mr-2" />
            <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-xs w-full text-[#8fa810] placeholder-gray-400" />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full px-4 flex-1">
          <Link href="/en/Explore" className="px-4 py-2.5 rounded-lg hover:bg-white/50 text-gray-500 hover:text-[#8fa810] transition-all flex items-center gap-3 text-sm font-bold">
            <LayoutDashboard size={16} strokeWidth={2} /> Products
          </Link>
          <Link href="/en/Portfolio" className="px-4 py-2.5 rounded-lg wallet-pill text-[#8fa810] transition-all flex items-center gap-3 text-sm font-bold relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#c8e639] rounded-r"></div>
            <BarChart2 size={16} strokeWidth={2.5} /> Portfolio
          </Link>
          <Link href="/en/Wallet" className="px-4 py-2.5 rounded-lg hover:bg-white/50 text-gray-500 hover:text-[#8fa810] transition-all flex items-center gap-3 text-sm font-bold">
            <Wallet size={16} strokeWidth={2} /> Wallet
          </Link>
          <Link href="/en/Investor" className="px-4 py-2.5 rounded-lg hover:bg-white/50 text-gray-500 hover:text-[#8fa810] transition-all flex items-center gap-3 text-sm font-bold">
            <TrendingUp size={16} strokeWidth={2} /> Achievement
          </Link>
          <Link href="/en/profile" className="px-4 py-2.5 rounded-lg hover:bg-white/50 text-gray-500 hover:text-[#8fa810] transition-all flex items-center gap-3 text-sm font-bold">
            <Settings size={16} strokeWidth={2} /> Settings
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto p-8 relative">
        <div className="max-w-7xl mx-auto w-full flex flex-col xl:flex-row gap-6">
          
          {/* Left Column (Main Dashboard) */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex justify-between items-center wallet-card-soft p-6 rounded-2xl wallet-fade-up">
              <h1 className="text-3xl font-extrabold text-[#8fa810]">My Portfolio</h1>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                <span>Valuation date as for <span className="text-[#8fa810]">{new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span></span>
                <RefreshCw size={16} className="text-[#8fa810] ml-1 cursor-pointer hover:rotate-180 transition-transform duration-500" />
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="wallet-card-soft p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 wallet-fade-up" style={{ animationDelay: "80ms" }}>
              
              {/* KPI Cards Column */}
              <div className="col-span-1 flex flex-col gap-4">
                <div className="bg-[#8fa810] rounded-2xl p-5 text-white flex flex-col justify-between h-32 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start z-10">
                    <span className="text-xs font-bold text-white/70">Portfolio Value</span>
                    <Info size={16} className="text-white/50" />
                  </div>
                  <div className="z-10">
                    <h2 className="text-3xl font-extrabold">${((data.portfolioValue || 0) / 1000).toFixed(1)}k</h2>
                    <p className="text-xs font-bold text-white/70 mt-1">Net Value: ${((data.totalInvested || 0) / 1000).toFixed(1)}k</p>
                  </div>
                </div>

                <div className="wallet-card-flat wallet-hover-lift rounded-2xl p-5 flex flex-col justify-between h-32">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-500">Total Invested</span>
                    <Info size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold">${((data.totalInvested || 0) / 1000).toFixed(1)}k</h2>
                    <p className="text-xs font-bold text-gray-500 mt-1">{data.investmentsList?.length || 0} investments · {data.investmentsList?.length || 0} fields</p>
                  </div>
                </div>

                <div className="wallet-card-flat wallet-hover-lift rounded-2xl p-5 flex flex-col justify-between h-32">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-500">Net Multiple</span>
                    <Info size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold">{data.netMultiple || 1.5}x</h2>
                    <p className="text-xs font-bold text-gray-500 mt-1">+{( (data.netMultiple || 1.5) * 100 - 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>

              {/* Chart Column */}
              <div className="col-span-1 md:col-span-2 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <select className="wallet-pill text-sm font-bold rounded-lg px-3 py-1.5 outline-none">
                    <option>All Time</option>
                    <option>This Year</option>
                  </select>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border-2 border-gray-300"></div> Invested</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#f3e8dd]"></div> Released</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#65e85c]"></div> Last 90 days</div>
                  </div>
                </div>
                <div className="flex-1 min-h-62.5 w-full ">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart  data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(27,38,32,0.08)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "bold", fill: "#9ca3af" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "bold", fill: "#9ca3af" }} tickFormatter={(val) => `$${val/1000}k`} />
                      <Tooltip />
                      <Area type="step" dataKey="released" stroke="none" fill="#f3e8dd" isAnimationActive animationDuration={900} animationEasing="ease-out" />
                      <Area type="step" dataKey="invested" stroke="none" fill="#1b2620" isAnimationActive animationDuration={900} animationEasing="ease-out" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Investments Table */}
            <div className="wallet-card-soft p-6 rounded-2xl flex-1 wallet-fade-up" style={{ animationDelay: "140ms" }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-[#8fa810]">Investments</h2>
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 rounded-full wallet-pill flex items-center justify-center hover:bg-white/70 transition-colors"><Search size={16} /></button>
                  <button className="w-10 h-10 rounded-full wallet-pill flex items-center justify-center hover:bg-white/70 transition-colors"><Filter size={16} /></button>
                  <button className="px-4 py-2 rounded-xl wallet-pill text-sm font-bold hover:bg-white/70 transition-colors">Export CSV</button>
                  <Link href="/en/Explore" className="px-4 py-2 rounded-xl bg-[#8fa810] text-white text-sm font-bold hover:bg-black transition-colors">Add Investment</Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-black/10">
                      <th className="pb-3 px-4 font-bold flex items-center gap-1 cursor-pointer hover:text-gray-600">COMPANY/FUND <div className="flex flex-col"><ChevronRight size={8} className="-rotate-90"/><ChevronRight size={8} className="rotate-90"/></div></th>
                      <th className="pb-3 px-4 font-bold">STATUS</th>
                      <th className="pb-3 px-4 font-bold">INVEST DATE</th>
                      <th className="pb-3 px-4 font-bold text-right">INVESTED</th>
                      <th className="pb-3 px-4 font-bold text-right">NET VALUE</th>
                      <th className="pb-3 px-4 font-bold text-right">MULTIPLE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.investmentsList?.map((inv: any, idx: number) => (
                      <tr key={inv.id} className="border-b border-black/5 hover:bg-white/40 transition-colors group wallet-row-in" style={{ animationDelay: `${idx * 40}ms` }}>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${idx % 2 === 0 ? 'bg-indigo-400' : 'bg-purple-500'}`}>
                              {inv.company.charAt(0)}
                            </div>
                            <span className="text-sm font-extrabold text-[#8fa810]">{inv.company}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-[11px] font-extrabold text-green-700 bg-green-50/80 border border-green-200/70 px-2.5 py-1 rounded-md">{inv.status}</span>
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-gray-600">{inv.date}</td>
                        <td className="py-4 px-4 text-sm font-extrabold text-[#8fa810] text-right">${inv.invested.toLocaleString()}</td>
                        <td className="py-4 px-4 text-sm font-extrabold text-[#8fa810] text-right">${inv.netValue.toLocaleString()}</td>
                        <td className="py-4 px-4 text-sm font-bold text-gray-600 text-right">{inv.multiple}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="py-4 px-4 text-xs font-bold text-gray-500">{data.investmentsList?.length || 0} Investments</td>
                      <td colSpan={2}></td>
                      <td className="py-4 px-4 text-sm font-extrabold text-[#8fa810] text-right">${(data.totalInvested || 0).toLocaleString()}</td>
                      <td className="py-4 px-4 text-sm font-extrabold text-[#8fa810] text-right">${((data.totalInvested || 0) * (data.netMultiple || 1.5)).toLocaleString()}</td>
                      <td className="py-4 px-4 text-sm font-bold text-gray-600 text-right">{data.netMultiple || 1.5}x</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (Alerts & Activities) */}
          <div className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
            
            {/* Tax Alert */}
            <div className="bg-[#8fa810] text-white p-5 rounded-2xl flex items-start gap-4 shadow-sm wallet-fade-up" style={{ animationDelay: "60ms" }}>
              <TriangleAlert size={20} className="text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-extrabold mb-1">Submit Tax Information</h4>
                <p className="text-xs text-gray-400 leading-relaxed">For timely tax documents and distributions.</p>
              </div>
            </div>

            {/* Activities Feed */}
            <div className="wallet-card-soft p-6 rounded-2xl flex-1 flex flex-col max-h-150 wallet-fade-up" style={{ animationDelay: "120ms" }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-extrabold text-[#8fa810]">Activities</h3>
                <span className="text-xs font-bold text-gray-500 hover:text-black cursor-pointer flex items-center gap-1">View All <ChevronRight size={14}/></span>
              </div>

              <div className="flex flex-col gap-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none pr-2">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">LATEST TRANSACTIONS</h4>
                  <div className="flex flex-col gap-5">
                    {data.activitiesList?.map((act: any, i: number) => (
                      <div key={act.id} className="flex gap-4 group cursor-pointer wallet-row-in" style={{ animationDelay: `${160 + i * 45}ms` }}>
                        <div className="w-10 h-10 rounded-xl wallet-pill flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform relative">
                          <FileText size={16} className="text-blue-500" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <BarChart2 size={10} className="text-[#8fa810]" />
                          </div>
                        </div>
                        <div className="flex-1 border-b border-black/5 pb-4">
                          <h5 className="text-sm font-extrabold text-[#8fa810] mb-0.5">{act.title}</h5>
                          <p className="text-[11px] font-bold text-gray-500">{act.subtitle}</p>
                          <span className="text-[10px] font-bold text-gray-400 block mt-1">{act.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}