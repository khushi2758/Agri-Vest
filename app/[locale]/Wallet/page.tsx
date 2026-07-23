"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { walletSteps } from "./tourw";
import HelpTourButton from "../HelpTourButton";
import Link from "next/link";
import { useAuth } from "../context/auth-context"; // adjust relative path to match this file's location
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Cell } from "recharts";
import { 
  Search, RefreshCcw, Bell, Moon, Home, LayoutDashboard, 
  BarChart2, Wallet, Briefcase, Calendar, Settings, LogOut, 
  ArrowUpRight, ArrowDownLeft, ChevronDown, User, ShieldCheck, ShieldAlert, Lock
} from "lucide-react";

// Per-role wallet capabilities and copy.
// Deposit/Invest are investor-only. Everyone else can withdraw their
// earnings and view their own payment history, just under role-specific labels.
type WalletRoleConfig = {
  canDeposit: boolean;
  canWithdraw: boolean;
  depositLabel: string;
  withdrawLabel: string;
  historyLabel: string;
};

const ROLE_WALLET_CONFIG: Record<string, WalletRoleConfig> = {
  investor: {
    canDeposit: true,
    canWithdraw: true,
    depositLabel: "Deposit Money",
    withdrawLabel: "Withdraw Returns",
    historyLabel: "Portfolio Transactions",
  },
  farmer: {
    canDeposit: false,
    canWithdraw: true,
    depositLabel: "Deposit Money",
    withdrawLabel: "Withdraw Farming Income",
    historyLabel: "Payment History",
  },
  landowner: {
    canDeposit: false,
    canWithdraw: true,
    depositLabel: "Deposit Money",
    withdrawLabel: "Withdraw Earnings",
    historyLabel: "Payment History",
  },
  agronomist: {
    canDeposit: false,
    canWithdraw: true,
    depositLabel: "Deposit Money",
    withdrawLabel: "Withdraw Earnings",
    historyLabel: "Consultation Payment History",
  },
};

const DEFAULT_WALLET_CONFIG: WalletRoleConfig = {
  canDeposit: false,
  canWithdraw: false,
  depositLabel: "Deposit Money",
  withdrawLabel: "Withdraw",
  historyLabel: "Transactions",
};

// ---- shared keyframes / soft-UI utility classes ---------------------------
function SoftUIStyles() {
  return (
    <style jsx global>{`
      @keyframes wallet-float-a {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(50px, -40px) scale(1.08); }
      }
      @keyframes wallet-float-b {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-60px, 45px) scale(1.12); }
      }
      @keyframes wallet-float-c {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(30px, 55px) scale(0.92); }
      }
      @keyframes wallet-fade-up {
        from { opacity: 0; transform: translateY(18px); }
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
      @keyframes wallet-holo {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes wallet-sheen {
        0% { transform: translateX(-120%) rotate(8deg); }
        100% { transform: translateX(220%) rotate(8deg); }
      }
      @keyframes wallet-spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes wallet-bar-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      .wallet-orb {
        position: absolute;
        border-radius: 9999px;
        filter: blur(90px);
        pointer-events: none;
      }
      .wallet-orb-a { animation: wallet-float-a 22s ease-in-out infinite; }
      .wallet-orb-b { animation: wallet-float-b 26s ease-in-out infinite; }
      .wallet-orb-c { animation: wallet-float-c 19s ease-in-out infinite; }

      /* soft card: crisp translucent white with a gentle ambient shadow */
      .wallet-card-soft {
        background: rgba(255, 255, 255, 0.86);
        border: 1px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 2px 4px rgba(23, 31, 24, 0.03), 0 16px 40px rgba(95, 122, 74, 0.10);
      }
      .wallet-card-flat {
        background: rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.7);
      }
      .wallet-pill {
        background: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.8);
      }

      /* holographic card retinted to echo the brand's gradient accent bar */
      .wallet-holo-card {
        background: linear-gradient(120deg, #d9cdf2, #bfe6dd, #dff2a8, #f4efc9, #d9cdf2);
        background-size: 300% 300%;
        animation: wallet-holo 12s ease infinite;
      }

      .wallet-brand-bar {
        height: 3px;
        width: 100%;
        background: linear-gradient(90deg, #8b5cf6, #14b8a6, #c8e639);
        background-size: 200% 100%;
        animation: wallet-bar-shift 8s ease infinite;
      }

      .wallet-fade-up { animation: wallet-fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .wallet-fade-in { animation: wallet-fade-in 0.6s ease both; }
      .wallet-row-in { animation: wallet-row-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }

      .wallet-sheen-wrap { position: relative; overflow: hidden; }
      .wallet-sheen-wrap::after {
        content: "";
        position: absolute;
        top: -50%;
        left: 0;
        width: 35%;
        height: 200%;
        background: linear-gradient(
          100deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.55) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: wallet-sheen 6s ease-in-out infinite;
        pointer-events: none;
      }

      .wallet-hover-lift {
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
      }
      .wallet-hover-lift:hover {
        transform: translateY(-4px);
        box-shadow: 0 24px 50px rgba(95, 122, 74, 0.18);
      }

      @media (prefers-reduced-motion: reduce) {
        .wallet-orb-a, .wallet-orb-b, .wallet-orb-c,
        .wallet-fade-up, .wallet-fade-in, .wallet-row-in,
        .wallet-sheen-wrap::after, .wallet-hover-lift, .wallet-holo-card, .wallet-brand-bar {
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
  { bg: "bg-[#c1ed7a]/25", text: "text-[#4d5c1f]" },
  { bg: "bg-[#c1ed7a]/15", text: "text-[#c1ed7a]" },
  { bg: "bg-[#1b2620]/5", text: "text-[#1b2620]" },
  { bg: "bg-amber-100", text: "text-amber-700" },
];

export default function WalletDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  const walletConfig: WalletRoleConfig =
    (user?.role && ROLE_WALLET_CONFIG[user.role]) || DEFAULT_WALLET_CONFIG;

  const resetActions = () => {
    setAmount("");
    setActionError("");
    setActionSuccess("");
    setActionLoading(false);
  };

  const handleAction = async (type: "deposit" | "withdraw") => {
    if (type === "deposit" && !walletConfig.canDeposit) {
      setActionError("Your role doesn't have permission to deposit funds.");
      return;
    }
    if (type === "withdraw" && !walletConfig.canWithdraw) {
      setActionError("Your role doesn't have permission to withdraw funds.");
      return;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setActionError("Please enter a valid amount");
      return;
    }
    setActionLoading(true);
    setActionError("");
    try {
      const res = await fetch(`/api/wallet/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      const d = await res.json();
      if(res.ok) {
        setActionSuccess(`${type === "deposit" ? "Deposit" : "Withdrawal"} successful!`);
        setTimeout(() => {
          setIsDepositOpen(false);
          setIsWithdrawOpen(false);
          window.location.reload();
        }, 1000);
      } else {
        setActionError(d.error || "Action failed");
      }
    } catch(e) {
      setActionError("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  // Redirect unauthenticated users once the shared auth state has settled
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/en/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading || !user) return;

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
  }, [authLoading, user, router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f3f6e6] flex items-center justify-center relative overflow-hidden">
        <SoftUIStyles />
        <div className="wallet-orb wallet-orb-a w-[500px] h-[500px] bg-[#c1ed7a]/25 -top-32 -right-20" />
        <div className="wallet-orb wallet-orb-b w-[420px] h-[420px] bg-[#c1ed7a]/15 bottom-0 -left-24" />
        <div className="wallet-card-soft rounded-3xl p-8 relative z-10 wallet-fade-in">
          <RefreshCcw className="w-8 h-8 text-[#c1ed7a]" style={{ animation: "wallet-spin-slow 1s linear infinite" }} />
        </div>
      </div>
    );
  }

  if (!user || !data || !data.user) return null;

  return (
    <div className="min-h-screen bg-[#f3f6e6] text-[#1b2620] flex flex-col overflow-hidden font-sans selection:bg-[#c1ed7a] selection:text-[#1b2620]"  >
      <SoftUIStyles />
      <div className="wallet-brand-bar shrink-0" />
      <div className="flex flex-1 overflow-hidden">
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
          <Link href="/en/Wallet" className="p-3 rounded-xl bg-[#c1ed7a] text-[#1b2620] shadow-[0_4px_15px_rgba(200,230,57,0.4)] flex justify-center"><Wallet size={20} /></Link>
          <Link href="/en/Investor" className="p-3 rounded-xl hover:bg-[#f7f9f2] text-[#1b2620]/40 hover:text-[#1b2620] transition-all flex justify-center"><Briefcase size={20} /></Link>
          <Link href="/en/Farmers" className="p-3 rounded-xl hover:bg-[#f7f9f2] text-[#1b2620]/40 hover:text-[#1b2620] transition-all flex justify-center"><Calendar size={20} /></Link>
        </div>
        <div className="flex flex-col gap-6 w-full px-4 mt-auto">
          <button className="p-3 rounded-xl hover:bg-[#f7f9f2] text-[#1b2620]/40 hover:text-[#1b2620] transition-all flex justify-center"><Settings size={20} /></button>
          <button onClick={() => { fetch("/api/auth/logout", {method: "POST"}).then(()=>router.push("/en/login")) }} className="p-3 rounded-xl hover:bg-red-50 text-[#1b2620]/40 hover:text-red-500 transition-all flex justify-center"><LogOut size={20} /></button>
        </div>
        
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden p-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="wallet-orb wallet-orb-a w-[700px] h-[700px] bg-[#c1ed7a]/15 -top-64 -right-20" />
          <div className="wallet-orb wallet-orb-b w-[500px] h-[500px] bg-[#c1ed7a]/10 bottom-0 -left-32" />
          <div className="wallet-orb wallet-orb-c w-[420px] h-[420px] bg-[#8b5cf6]/10 top-1/3 left-1/2" />
        </div>

        <header className="flex justify-between items-center mb-6 relative z-30 wallet-fade-up">
          <div id="search-bar" className="flex items-center wallet-pill rounded-full px-4 py-2 w-96 shadow-sm transition-shadow focus-within:shadow-md">
            <Search size={16} className="text-[#1b2620]/40 mr-3" />
            <input type="text" placeholder="Search merchant or ID..." className="bg-transparent border-none outline-none text-sm w-full text-[#1b2620] placeholder-[#1b2620]/40" />
            <div className="flex items-center gap-1 bg-black/[0.03] px-2 py-0.5 rounded text-[10px] text-[#1b2620]/60 font-bold ml-2">
               <span className="text-xs">⌘</span> Space
            </div>
          </div>
          
          <div className="flex items-center gap-5 relative">
            <button className="text-[#1b2620]/40 hover:text-[#1b2620] transition-all hover:scale-110"><RefreshCcw size={16} /></button>
            <button className="text-[#1b2620]/40 hover:text-[#1b2620] transition-all hover:scale-110 relative">
               <Bell size={16} />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#c1ed7a] rounded-full border border-white"></span>
            </button>
            <button className="text-[#1b2620]/40 hover:text-[#1b2620] transition-all hover:scale-110"><Moon size={6} /></button>
            
            <div id="profile-menu" className="relative" ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-4 border-l border-black/10 cursor-pointer hover:opacity-80 transition-opacity"
              >
                 <div className="flex flex-col items-end">
                   <span className="text-sm font-bold text-[#1b2620]">{data.user.name}</span>
                   <span className="text-xs text-[#1b2620]/40">@{data.user.email.split('@')[0]}</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-[#c1ed7a]/20 border-2 border-[#c1ed7a] flex items-center justify-center text-[#1b2620] font-extrabold uppercase overflow-hidden shadow-sm">
                    {data.user.name.substring(0, 2)}
                 </div>
                 <ChevronDown size={14} className="text-[#1b2620]/40" />
              </div>

              {isProfileOpen && (
                <div className="absolute top-14 right-0 w-72 wallet-card-soft rounded-2xl p-5 z-50 flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-black/5">
                    <div className="w-12 h-12 rounded-full bg-[#c1ed7a]/20 text-[#1b2620] flex items-center justify-center font-extrabold uppercase text-lg">
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
                        <span className="flex items-center gap-1 text-xs font-bold text-[#c1ed7a] bg-[#c1ed7a]/10 px-2 py-1 rounded"><ShieldCheck size={12}/> Verified</span>
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

          {!walletConfig.canDeposit && (
            <div className="wallet-card-soft rounded-2xl p-4 mb-6 flex items-center gap-3 wallet-fade-up">
              <Lock size={16} className="text-[#1b2620]/50 shrink-0" />
              <p className="text-xs font-bold text-[#1b2620]/70">
                Deposits are managed by investors. You can withdraw your earnings and view your {walletConfig.historyLabel.toLowerCase()} below.
              </p>
            </div>
          )}

          {/* stat chips row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 wallet-fade-up">
            <div className="wallet-card-soft wallet-hover-lift rounded-2xl p-5">
              <p className="text-[#1b2620]/50 text-xs font-bold uppercase tracking-wide mb-1">Balance</p>
              <p className="text-xl font-extrabold text-[#1b2620] mb-1">{data.user.totalBalance} AGV</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1b2620] bg-[#c1ed7a] px-2 py-0.5 rounded-full"><ArrowUpRight size={10}/> 2.92% </span>
            </div>
            <div className="wallet-card-soft wallet-hover-lift rounded-2xl p-5">
              <p className="text-[#1b2620]/50 text-xs font-bold uppercase tracking-wide mb-1">Investments</p>
              <p className="text-xl font-extrabold text-[#1b2620] mb-1">{data.user.totalInvestments} AGV</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1b2620] bg-[#c1ed7a] px-2 py-0.5 rounded-full"><ArrowUpRight size={10}/> 1.52% </span>
            </div>
            <div className="wallet-card-soft wallet-hover-lift rounded-2xl p-5">
              <p className="text-[#1b2620]/50 text-xs font-bold uppercase tracking-wide mb-1">Avg. annual rate</p>
              <p className="text-xl font-extrabold text-[#1b2620] mb-1">{data.user.averageAnnualRate} AGV</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1b2620] bg-[#c1ed7a] px-2 py-0.5 rounded-full"><ArrowUpRight size={10}/> 3.52% </span>
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
                       <span className="text-[#1b2620] text-sm font-bold flex items-center mb-1 bg-[#c1ed7a] px-2 py-0.5 rounded-full"><ArrowUpRight size={14} className="mr-1"/> 2.92%</span>
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
                         <div className="w-3 h-3 rounded-sm bg-[#c1ed7a]"></div> Total monthly balance
                      </div>
                   </div>
                </div>
              </div>

              <div  className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[320px]">
                 
                 <div id="prospectus-card" className="bg-[#1b2620] wallet-sheen-wrap rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-lg wallet-fade-up wallet-hover-lift" style={{ animationDelay: "160ms" }}>
                    <div className="wallet-orb wallet-orb-a top-0 right-0 w-64 h-64 bg-[#c1ed7a]/20 -translate-y-1/2 translate-x-1/4"></div>
                    <div className="relative z-10">
                       <h3 className="text-3xl font-extrabold text-white leading-tight mb-3">Trusted by Thousands<br/>Join Us Today!</h3>
                       <p className="text-white/60 text-sm font-bold w-4/5 leading-relaxed">Secure, reliable, and trusted by agricultural investors worldwide.</p>
                       
                       <div className="flex -space-x-3 mt-6">
                          <div className="w-10 h-10 rounded-full bg-white border-2 border-[#1b2620] flex items-center justify-center text-xs font-bold text-[#1b2620] z-30">US</div>
                          <div className="w-10 h-10 rounded-full bg-[#c1ed7a] border-2 border-[#1b2620] flex items-center justify-center text-xs font-bold text-[#1b2620] z-20">EU</div>
                          <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-[#1b2620] flex items-center justify-center text-xs font-bold text-white z-10">+</div>
                       </div>
                    </div>
                    <button className="w-full bg-[#c1ed7a] text-[#1b2620] font-extrabold py-3.5 rounded-xl mt-6 relative z-10 shadow-[0_0_15px_rgba(200,230,57,0.3)] hover:shadow-[0_0_25px_rgba(200,230,57,0.5)] transition-all hover:scale-[1.02]">
                       Request Prospectus
                    </button>
                 </div>

                 <div id="investment-chart" className="wallet-card-soft wallet-hover-lift rounded-3xl p-6 flex flex-col wallet-fade-up" style={{ animationDelay: "220ms" }}>
                    <div className="flex justify-between items-start mb-6">
                       <div>
                         <h3 className="text-[#1b2620]/50 text-xs uppercase tracking-wider font-extrabold mb-1">Net vs Fees</h3>
                         <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold text-[#1b2620]">{data.user.totalInvestments} AGV <span className="text-xs text-neutral-400 font-medium ml-1">(~${data.user.totalInvestments})</span></span>
                            <span className="text-[#1b2620] text-[10px] font-bold flex items-center bg-[#c1ed7a] px-1.5 py-0.5 rounded-full"><ArrowUpRight size={10}/> 1.52%</span>
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
                     <button onClick={() => { resetActions(); setIsAddCardOpen(true); }} className="bg-white hover:bg-[#c1ed7a]/20 text-[#1b2620] text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1 shadow-sm">
                        + Add new
                     </button>
                  </div>
                  
                  <div className="relative flex-1 flex flex-col items-center justify-center">
                     
                     <div className="absolute top-0 w-[85%] h-12 bg-black/[0.02] rounded-t-2xl shadow-sm scale-95 translate-y-0"></div>
                     <div className="absolute top-4 w-[92%] h-12 bg-black/[0.03] rounded-t-2xl shadow-md scale-[0.98] translate-y-0"></div>
                     
                     <div className="relative z-10 w-full wallet-holo-card wallet-sheen-wrap rounded-2xl p-6 shadow-xl mt-8 overflow-hidden transition-transform duration-300 hover:-translate-y-1">
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
                     {walletConfig.canDeposit && (
                       <button onClick={() => { resetActions(); setIsDepositOpen(true); }} className="flex-1 bg-white hover:bg-black/[0.02] border border-black/5 text-[#1b2620] font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                          <ArrowDownLeft size={16} /> {walletConfig.depositLabel}
                       </button>
                     )}
                     {walletConfig.canWithdraw && (
                       <button onClick={() => { resetActions(); setIsWithdrawOpen(true); }} className={`bg-[#1b2620] hover:bg-black text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${walletConfig.canDeposit ? "flex-1" : "w-full"}`}>
                          <ArrowUpRight size={16} className="text-[#c1ed7a]" /> {walletConfig.withdrawLabel}
                       </button>
                     )}
                  </div>
               </div>

               <div id="recent-transactions" className="wallet-card-soft wallet-hover-lift rounded-3xl p-6 flex-1 min-h-[300px] wallet-fade-up" style={{ animationDelay: "260ms" }}>
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-[#1b2620] font-extrabold text-sm tracking-wide uppercase">{walletConfig.historyLabel}</h3>
                     <button onClick={() => setIsViewAllOpen(true)} className="text-[#1b2620]/40 hover:text-[#1b2620] text-xs font-bold transition-colors">View All</button>
                  </div>

                  <div className="flex gap-2 mb-4">
                     <button className="px-3 py-1 rounded-full text-xs font-bold bg-[#1b2620] text-white">All</button>
                     <button className="px-3 py-1 rounded-full text-xs font-bold wallet-pill text-[#1b2620]/50">Spend</button>
                     <button className="px-3 py-1 rounded-full text-xs font-bold wallet-pill text-[#1b2620]/50">Filters</button>
                  </div>
                  
                  <div className="flex flex-col gap-4 overflow-y-auto max-h-[250px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                     <style dangerouslySetInnerHTML={{__html: `::-webkit-scrollbar { display: none; }`}} />
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
                              <span className={`font-extrabold text-sm ${tx.type === 'in' ? 'text-[#c1ed7a]' : 'text-[#1b2620]'}`}>
                                 {tx.type === 'in' ? '+' : '-'}{tx.rawAmount.toLocaleString('en-US', {minimumFractionDigits: 2})} AGV
                                 <span className="text-[10px] opacity-60 ml-1 font-medium">(~${tx.rawAmount.toLocaleString('en-US', {minimumFractionDigits: 2})})</span>
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${tx.type === 'in' ? 'bg-[#c1ed7a] text-[#1b2620]' : 'bg-black/5 text-[#1b2620]/60'}`}>
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

      {/* Modals */}
      {(isDepositOpen || isWithdrawOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b2620]/40 backdrop-blur-sm">
          <div className="wallet-card-soft w-[400px] rounded-3xl p-8 relative">
            <h3 className="text-xl font-extrabold text-[#1b2620] mb-6">
              {isDepositOpen ? walletConfig.depositLabel : walletConfig.withdrawLabel}
            </h3>
            
            <div className="flex flex-col gap-4 mb-6">
              <label className="text-sm font-bold text-[#1b2620]/60">Amount (AGV)</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Enter amount" 
                className="w-full bg-black/5 border-none rounded-xl p-4 text-xl font-bold text-[#1b2620] outline-none"
              />
            </div>

            {actionError && <p className="text-red-500 text-xs font-bold mb-4">{actionError}</p>}
            {actionSuccess && <p className="text-[#c1ed7a] text-xs font-bold mb-4 bg-[#1b2620] px-3 py-2 rounded-lg">{actionSuccess}</p>}

            <div className="flex gap-4">
              <button disabled={actionLoading} onClick={() => { setIsDepositOpen(false); setIsWithdrawOpen(false); }} className="flex-1 py-3.5 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button disabled={actionLoading} onClick={() => handleAction(isDepositOpen ? "deposit" : "withdraw")} className="flex-2 py-3.5 px-4 rounded-xl font-extrabold text-[#1b2620] bg-[#c8e639] hover:bg-[#a8c718] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center">
                {actionLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b2620]/40 backdrop-blur-sm">
          <div className="wallet-card-soft w-[400px] rounded-3xl p-8 relative">
            <h3 className="text-xl font-extrabold text-[#1b2620] mb-6">Link New Card / Account</h3>
            
            <div className="flex flex-col gap-4 mb-6">
              <input type="text" placeholder="Card / Account Number" className="w-full bg-black/5 border-none rounded-xl p-4 text-sm font-bold text-[#1b2620] outline-none" />
              <div className="flex gap-4">
                <input type="text" placeholder="MM/YY" className="w-1/2 bg-black/5 border-none rounded-xl p-4 text-sm font-bold text-[#1b2620] outline-none" />
                <input type="text" placeholder="CVV" className="w-1/2 bg-black/5 border-none rounded-xl p-4 text-sm font-bold text-[#1b2620] outline-none" />
              </div>
            </div>

            {actionSuccess && <p className="text-[#c1ed7a] text-xs font-bold mb-4 bg-[#1b2620] px-3 py-2 rounded-lg">{actionSuccess}</p>}

            <div className="flex gap-4">
              <button onClick={() => setIsAddCardOpen(false)} className="flex-1 py-3.5 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={() => {
                setActionSuccess("Card added securely!");
                setTimeout(() => { setIsAddCardOpen(false); setActionSuccess(""); }, 1500);
              }} className="flex-2 py-3.5 px-4 rounded-xl font-extrabold text-[#1b2620] bg-[#c8e639] hover:bg-[#a8c718] transition-all shadow-lg flex items-center justify-center">
                Save Securely
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b2620]/40 backdrop-blur-sm">
          <div className="wallet-card-soft w-[500px] max-h-[80vh] flex flex-col rounded-3xl p-8 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-[#1b2620]">All {walletConfig.historyLabel}</h3>
              <button onClick={() => setIsViewAllOpen(false)} className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors">
                <span className="text-[#1b2620] font-bold text-sm">✕</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
               {data.transactions.map((tx: any, index: number) => {
                  const palette = TX_COLORS[index % TX_COLORS.length];
                  return (
                  <div key={`modal-${tx.id}`} className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/[0.02] transition-colors cursor-pointer border border-transparent hover:border-black/5">
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
                        <span className={`font-extrabold text-sm ${tx.type === 'in' ? 'text-[#c1ed7a]' : 'text-[#1b2620]'}`}>
                           {tx.type === 'in' ? '+' : '-'}{tx.rawAmount.toLocaleString('en-US', {minimumFractionDigits: 2})} AGV
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${tx.type === 'in' ? 'bg-[#c1ed7a] text-[#1b2620]' : 'bg-black/5 text-[#1b2620]/60'}`}>
                           {tx.type === 'in' ? 'Received' : 'Sent'}
                        </span>
                     </div>
                  </div>
                  );
               })}
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}