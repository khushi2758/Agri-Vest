"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Users,
  BellRing,
  Activity,
  Globe
} from "lucide-react";
import NavBar from "../navbar";

export default function PortfolioDashboard() {
  const [topInvestors, setTopInvestors] = useState<any[]>([]);
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchTopInvestors() {
      try {
        const res = await fetch("/api/investors/top");
        if (res.ok) {
          const data = await res.json();
          setTopInvestors(data.topInvestors || []);
          const followingMap: Record<string, boolean> = {};
          if (data.following) {
            data.following.forEach((id: string) => { followingMap[id] = true; });
          }
          setFollowing(followingMap);
        }
      } catch (e) {
      }
    }
    
    async function fetchCurrentUser() {
      try {
        const res = await fetch("/api/wallet");
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch (e) {
      }
    }
    
    fetchCurrentUser();
    fetchTopInvestors();
  }, []);

  const handleFollow = async (id: string, name: string) => {
    const isNowFollowing = !following[id];
    
    
    setFollowing(prev => ({ ...prev, [id]: isNowFollowing }));
    
    if (isNowFollowing) {
      setNotification(`You are now following ${name}. Notifications enabled for new trades.`);
      setTimeout(() => setNotification(null), 4000);
    }
    
    try {
      await fetch("/api/investors/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: id, action: isNowFollowing ? "follow" : "unfollow" })
      });
    } catch (e) {
      
      setFollowing(prev => ({ ...prev, [id]: !isNowFollowing }));
    }
  };

  return (
     <div className="min-h-screen bg-[#b8cb8a] px-6 pb-20 font-sans md:px-14 selection:bg-[#1b2620] selection:text-[#c8e639]">
      <NavBar/>

      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1b2620] text-white px-6 py-4 rounded-xl shadow-2xl border border-[#c8e639]/30 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-[#c8e639]/20 flex items-center justify-center">
              <BellRing className="text-[#c8e639] w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="text-sm font-extrabold">{notification}</p>
              <p className="text-xs text-white/60 font-medium">Real-time alerts active</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
     
      <div className="mx-auto max-w-300 px-6 py-10 md:px-10">
        
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border-2 border-[#bccd91] bg-[#1b2620] p-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8e639]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-px w-4 bg-[#c8e639]" />
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#c8e639]">Social Trading</p>
              </div>
              <h2 className="text-2xl font-black text-white mt-2">Top Performers Leaderboard</h2>
              <p className="mt-1.5 text-sm text-white/60">Follow elite investors to receive real-time notifications on their trades and portfolio rebalancing.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3">
               <Activity className="text-[#c8e639] w-5 h-5" />
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Active Traders</span>
                  <span className="text-sm font-black text-white">2,481 Global</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {topInvestors.map((investor) => {
              const isFollowing = following[investor.id];
              const isCurrentUser = currentUser && (currentUser.id === investor.id || currentUser.name === investor.name);
              
              return (
                <div key={investor.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex flex-col justify-between group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#c8e639] to-[#8da514] flex items-center justify-center text-[#1b2620] font-black text-lg shadow-lg">
                        {investor.avatar}
                      </div>
                      <div>
                        <h4 className="text-white font-extrabold text-base leading-tight">{investor.name} {isCurrentUser && "(You)"}</h4>
                        <p className="text-white/40 text-xs font-bold flex items-center gap-1 mt-1">
                          <Globe className="w-3 h-3" /> {investor.focus}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">YTD Return</p>
                      <p className="text-[#c8e639] font-black text-xl">{investor.roi}</p>
                    </div>
                    
                    {!isCurrentUser && (
                      <button 
                        onClick={() => handleFollow(investor.id, investor.name)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md ${
                          isFollowing 
                          ? "bg-white/10 text-white border border-white/20 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30" 
                          : "bg-[#c8e639] text-[#1b2620] hover:bg-[#b8d434]"
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Following
                          </>
                        ) : (
                          <>
                            <Users className="w-4 h-4" /> Follow
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

      </div>
    </div>
  );
}