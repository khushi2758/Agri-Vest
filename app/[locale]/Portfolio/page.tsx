"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HelpTourButton from "../HelpTourButton";
import {portfolioSteps} from "./tourp"
import { 
  Search, Home, LayoutDashboard, BarChart2, Wallet, 
  Briefcase, Calendar, Settings, LogOut, Loader2, Plus, 
  TrendingUp, Activity, CheckCircle2, DollarSign, Clock, Users 
} from "lucide-react";

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
      <div className="min-h-screen bg-[#f7f9f2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c8e639] animate-spin" />
      </div>
    );
  }

  if (!data) return null;

   return (
    <div className="min-h-screen bg-[#f7f9f2] text-[#1b2620] flex overflow-hidden font-sans selection:bg-[#c8e639] selection:text-black">
      <HelpTourButton steps={portfolioSteps} />

      <aside  className="w-64 bg-white border-r border-gray-100 flex flex-col py-6 shrink-0 z-20 shadow-sm">
        <div className="px-8 mb-8 flex items-center gap-3">
          <div  className="w-8 h-8 rounded-lg bg-[#1b2620] flex items-center justify-center" >
            <Briefcase size={16} strokeWidth={2} className="text-[#c8e639]" />
          </div>
          <span className="font-extrabold tracking-widest text-lg">AGRI-VEST</span>
        </div>
        
        <div id="portfolio-search" className="px-6 mb-8">
          <div className="flex items-center bg-[#f7f9f2] border border-gray-200 rounded-lg px-3 py-2 w-full">
            <Search size={14} strokeWidth={2} className="text-gray-400 mr-2" />
            <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-xs w-full text-[#1b2620] placeholder-gray-400" />
          </div>
        </div>

        <div  className="flex flex-col gap-2 w-full px-4 flex-1">
          <Link id="nav-products" href="/en/Explore" aria-label="Products" className="px-4 py-2.5 rounded-lg hover:bg-[#f7f9f2] text-gray-500 hover:text-[#1b2620] transition-all flex items-center gap-3 text-sm font-bold">
            <LayoutDashboard size={16} strokeWidth={2} /> Products
          </Link>
          <Link id="nav-portfolio" href="/en/Portfolio" aria-label="Portfolio" className="px-4 py-2.5 rounded-lg bg-[#f7f9f2] border border-gray-200 text-[#1b2620] transition-all flex items-center gap-3 text-sm font-bold relative shadow-sm">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#c8e639] rounded-r"></div>
            <BarChart2 size={16} strokeWidth={2.5} className="text-[#1b2620]" /> Portfolio
          </Link>
          <Link id="nav-wallet" href="/en/Wallet" aria-label="Wallet" className="px-4 py-2.5 rounded-lg hover:bg-[#f7f9f2] text-gray-500 hover:text-[#1b2620] transition-all flex items-center gap-3 text-sm font-bold">
            <Wallet size={16} strokeWidth={2} /> Wallet
          </Link>
          <Link id="nav-achievement" href="/en/Investor" aria-label="Achievement" className="px-4 py-2.5 rounded-lg hover:bg-[#f7f9f2] text-gray-500 hover:text-[#1b2620] transition-all flex items-center gap-3 text-sm font-bold">
            <TrendingUp size={16} strokeWidth={2} /> Achievement
          </Link>
          <Link id="nav-settings" href="/en/profile" aria-label="Settings" className="px-4 py-2.5 rounded-lg hover:bg-[#f7f9f2] text-gray-500 hover:text-[#1b2620] transition-all flex items-center gap-3 text-sm font-bold">
            <Settings size={16} strokeWidth={2} /> Settings
          </Link>
        </div>
        
        <div className="px-4 mt-auto">
          <div className="bg-[#f7f9f2] rounded-xl p-4 border border-gray-200">
            <p className="text-xs font-bold text-gray-500 mb-3">All members</p>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-[#f7f9f2] flex items-center justify-center text-[10px] font-bold">JD</div>
              <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-[#f7f9f2] flex items-center justify-center text-[10px] font-bold">AB</div>
              <div className="w-8 h-8 rounded-full bg-[#1b2620] border-2 border-[#f7f9f2] flex items-center justify-center text-[10px] font-bold text-[#c8e639]">+2</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto p-8 relative">
        <div id="portfolio-header" className="flex justify-between items-end mb-10">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-extrabold text-[#1b2620]">Investment Roadmap {new Date().getFullYear()}</h1>
              <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">Show: All Projects ▾</span>
            </div>
          </div>
          <button id="add-project" className="flex items-center gap-2 bg-[#1b2620] hover:bg-[#0a0f0c] text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md">
            <Plus size={16} strokeWidth={2.5} className="text-[#c8e639]" /> Add new
          </button>
        </div>

        {!data.hasInvestments ? (
          <div id="portfolio-stats" className="flex-1 flex flex-col  items-center justify-center border-2 border-dashed border-gray-200 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-[#f7f9f2] rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Briefcase className="text-[#1b2620]" size={32} strokeWidth={2} />
            </div>
            <h2 className="text-xl font-extrabold text-[#1b2620] mb-2">No Portfolio Events Yet</h2>
            <p className="text-gray-500 text-sm font-bold max-w-sm text-center">Your portfolio roadmap will automatically populate here once you make your first investment.</p>
            <Link href="/en/Explore" className="mt-6 bg-[#1b2620] text-[#c8e639] px-6 py-2.5 rounded-lg text-sm font-extrabold hover:opacity-90 transition-opacity shadow-md">Explore Opportunities</Link>
          </div>
        ) : (
          <>
            <div  className="grid grid-cols-5 gap-4 mb-10">
              
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-32">
                <div className="flex items-end gap-1 mb-2">
                   {[40, 70, 45, 90, 60, 80, 50, 100, 70, 85].map((h, i) => (
                     <div key={i} className="w-2 bg-[#1b2620] rounded-t-sm" style={{height: `${h}%`, opacity: 0.3 + (i * 0.07)}}></div>
                   ))}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dynamics</p>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-extrabold">{data.kpi.totalTasks} task</span>
                    <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-xs font-bold">+4.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-32">
                <div className="flex items-end gap-1 mb-2">
                   {[60, 40, 80, 50, 70, 90, 60, 100, 50, 75].map((h, i) => (
                     <div key={i} className="w-2 bg-[#c8e639] rounded-t-sm" style={{height: `${h}%`}}></div>
                   ))}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Progress</p>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-extrabold">{data.kpi.completedTasks} complete</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 mb-1 tracking-wider">01.01.{new Date().getFullYear()}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold">${data.kpi.spentThisMonth.toLocaleString()}</span>
                  </div>
                  <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-xs font-bold">+1.5%</span>
                </div>
                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-5 h-5 rounded-full bg-[#f7f9f2] flex items-center justify-center border border-gray-200"><DollarSign size={10} strokeWidth={2} className="text-[#1b2620]"/></div>
                  <span className="text-[10px] font-bold text-gray-500 leading-tight">Spent on projects<br/>this month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 mb-1 tracking-wider">01.01.{new Date().getFullYear()}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold">${data.kpi.spentThisYear.toLocaleString()}</span>
                  </div>
                  <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-xs font-bold">+3.1%</span>
                </div>
                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-5 h-5 rounded-full bg-[#f7f9f2] flex items-center justify-center border border-gray-200"><Activity size={10} strokeWidth={2} className="text-[#1b2620]"/></div>
                  <span className="text-[10px] font-bold text-gray-500 leading-tight">Spent on projects<br/>this year</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 mb-1 tracking-wider">01.01.{new Date().getFullYear()}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold">{data.kpi.timeBeforeDeadlineAvg} month</span>
                  </div>
                  <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-xs font-bold">+4.3%</span>
                </div>
                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-5 h-5 rounded-full bg-[#f7f9f2] flex items-center justify-center border border-gray-200"><Clock size={10} strokeWidth={2} className="text-[#1b2620]"/></div>
                  <span className="text-[10px] font-bold text-gray-500 leading-tight">Time left before<br/>project deadline</span>
                </div>
              </div>

            </div>

            <div id="roadmap-timeline" className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-x-auto custom-scrollbar">
              <div className="min-w-[800px]">
                
                <div className="flex mb-6 border-b border-gray-100 pb-4">
                  <div className="w-48 shrink-0"><span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Projects</span></div>
                  <div className="flex-1 flex justify-between px-4">
                    {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(day => (
                      <div key={day} className="flex flex-col items-center">
                        <span className="text-sm font-extrabold text-[#1b2620]">{day}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Day</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div id="project-progress" className="flex flex-col gap-6 relative">
                  
                  <div className="absolute top-0 bottom-0 left-48 right-0 flex justify-between px-4 pointer-events-none">
                    {[...Array(18)].map((_, i) => (
                      <div key={i} className="w-px h-full bg-gray-100"></div>
                    ))}
                  </div>

                  {data.timeline.map((project: any, i: number) => {
                    const progressWidth = Math.max(project.progress, 15);
                    const opacity = Math.max(1 - (i * 0.15), 0.5);
                    
                    return (
                      <div key={project.id} className="flex items-center group">
                        <div className="w-48 shrink-0 pr-4">
                          <span className="text-xs font-bold text-gray-600 group-hover:text-[#1b2620] transition-colors">{project.title}</span>
                          <p className="text-[10px] text-gray-400">{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex-1 relative h-12">
                          <div 
                            className="absolute h-full rounded-lg bg-[#1b2620] border border-[#0a0f0c] flex items-center px-4 overflow-hidden shadow-sm transition-all group-hover:shadow-md"
                            style={{ 
                              left: `${(i % 5) * 5}%`, 
                              width: `${40 + (Math.random() * 40)}%`,
                              opacity: opacity
                            }}
                          >
                            <div className="absolute left-0 top-0 bottom-0 bg-[#c8e639]" style={{width: `${progressWidth}%`}}></div>
                            <div className="relative z-10 flex justify-between items-center w-full">
                              <span className={`text-xs font-extrabold truncate max-w-[150px] ${progressWidth > 30 ? 'text-[#1b2620]' : 'text-white'}`}>{project.title}</span>
                              <div className="flex items-center gap-4">
                                <span className={`text-[10px] font-bold flex items-center gap-1 ${progressWidth > 80 ? 'text-[#1b2620]' : 'text-white'}`}>
                                  <CheckCircle2 size={10} strokeWidth={2} className={progressWidth > 80 ? 'text-[#1b2620]' : 'text-[#c8e639]'}/> {project.tasksCompleted}/{project.tasksTotal}
                                </span>
                                <div className="flex -space-x-1.5 opacity-80">
                                  <div className="w-4 h-4 rounded-full bg-gray-200 border border-white"></div>
                                  <div className="w-4 h-4 rounded-full bg-gray-300 border border-white"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

