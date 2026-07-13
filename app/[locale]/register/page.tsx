"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Mail, Lock, User, Phone, Globe, Fingerprint, Loader2 } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    name: "",
    email: "", 
    password: "", 
    role: "investor",
    phone: "",
    preferred_language: "en",
    otp: "" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"details" | "otp" | "success">("details");

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError("Please fill all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("otp");
        setTimeLeft(600);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("success");
        setTimeout(() => {
          router.push("/en");
        }, 1500);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9f2] flex items-center justify-center p-6 selection:bg-[#c8e639] selection:text-[#1b2620]">
      <div className="absolute top-0 left-0 w-full h-96 bg-[#c8e639]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>
      
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse border border-[#1b2620]/5 relative z-10">
        
        <div className="w-full md:w-1/2 p-12 lg:p-16 flex flex-col">
          <div className="mb-10">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-[#1b2620] p-2 rounded-xl group-hover:bg-[#c8e639] transition-colors">
                <Leaf className="text-[#c8e639] group-hover:text-[#1b2620] w-6 h-6 transition-colors" />
              </div>
              <span className="text-2xl font-black text-[#1b2620] tracking-tight">Agri-Vest</span>
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold text-[#1b2620] mb-3 tracking-tight">Create account</h1>
            <p className="text-[#1b2620]/60 font-medium mb-8">
              {step === "details" ? "Start your agricultural investment journey" : step === "success" ? "Registration successful" : "Verify your email to continue"}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                {error}
              </div>
            )}

            {step === "details" && (
              <form onSubmit={requestOTP} className="space-y-5">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-extrabold text-[#1b2620] uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1b2620]/40 w-5 h-5" />
                      <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-[#1b2620] focus:outline-none focus:border-[#c8e639] focus:ring-1 focus:ring-[#c8e639] transition-all" placeholder="John Doe" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-extrabold text-[#1b2620] uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1b2620]/40 w-5 h-5" />
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-[#1b2620] focus:outline-none focus:border-[#c8e639] focus:ring-1 focus:ring-[#c8e639] transition-all" placeholder="investor@example.com" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#1b2620] uppercase tracking-widest ml-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1b2620]/40 w-5 h-5" />
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-[#1b2620] focus:outline-none focus:border-[#c8e639] focus:ring-1 focus:ring-[#c8e639] transition-all" placeholder="+1 234 567" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#1b2620] uppercase tracking-widest ml-1">Account Type</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1b2620] focus:outline-none focus:border-[#c8e639] focus:ring-1 focus:ring-[#c8e639] transition-all appearance-none cursor-pointer">
                      <option value="investor">Investor</option>
                      <option value="farmer">Farmer (Producer)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-extrabold text-[#1b2620] uppercase tracking-widest ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1b2620]/40 w-5 h-5" />
                      <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-[#1b2620] focus:outline-none focus:border-[#c8e639] focus:ring-1 focus:ring-[#c8e639] transition-all" placeholder="••••••••" />
                    </div>
                  </div>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-[#1b2620] hover:bg-black text-white font-extrabold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-[0_10px_20px_rgba(27,38,32,0.1)] hover:shadow-[0_15px_25px_rgba(27,38,32,0.2)] disabled:opacity-70">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue to Verify"}
                </button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="bg-[#f7f9f2] p-6 rounded-2xl border border-[#c8e639]/30 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#c8e639]/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                  <Fingerprint className="w-10 h-10 text-[#c8e639] mb-4" />
                  <input required type="text" name="otp" value={formData.otp} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-center tracking-[0.5em] font-mono text-2xl font-black text-[#1b2620] focus:outline-none focus:border-[#c8e639] focus:ring-2 focus:ring-[#c8e639] transition-all shadow-inner" placeholder="------" maxLength={6} />
                  
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Expires in:</span>
                    <span className={`text-sm font-black font-mono ${timeLeft < 60 ? 'text-red-500' : 'text-[#8da514]'}`}>{formatTime(timeLeft)}</span>
                  </div>
                </div>

                <button disabled={loading || timeLeft === 0} type="submit" className="w-full bg-[#c8e639] hover:bg-[#b5d326] text-[#1b2620] font-extrabold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(200,230,57,0.2)] hover:shadow-[0_15px_25px_rgba(200,230,57,0.3)] disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-[#1b2620]" /> : "Verify & Create Account"}
                </button>
                <div className="text-center">
                  <button type="button" onClick={() => setStep("details")} className="text-xs font-extrabold text-[#1b2620]/40 hover:text-[#1b2620] uppercase tracking-widest transition-colors">
                    Back to edit details
                  </button>
                </div>
              </form>
            )}

            {step === "success" && (
              <div className="bg-green-50 p-8 rounded-2xl border border-green-100 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-extrabold text-[#1b2620] mb-2">Account Created</h3>
                <p className="text-sm font-bold text-neutral-500">Redirecting to your dashboard...</p>
                <Loader2 className="w-5 h-5 text-green-600 animate-spin mt-4" />
              </div>
            )}
          </div>

          <div className="mt-10 text-center text-sm font-bold text-[#1b2620]/60">
            Already have an account? <Link href="/en/login" className="text-[#1b2620] hover:text-[#8da514] font-extrabold border-b-2 border-[#c8e639] pb-0.5 transition-colors">Sign in</Link>
          </div>
        </div>

        <div className="hidden md:block w-1/2 bg-[#1b2620] relative p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#c8e639_1px,transparent_1px),linear-gradient(to_bottom,#c8e639_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#c8e639]/20 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-8">
                <Globe className="text-[#c8e639] w-4 h-4" />
                <span className="text-white text-xs font-bold tracking-widest uppercase">Global AGV Currency</span>
              </div>
              <h2 className="text-5xl font-black text-white leading-tight mb-6">Invest securely<br/>anywhere.</h2>
              <p className="text-white/60 font-medium text-lg leading-relaxed max-w-md">Our unified AGV token system ensures frictionless international investments backed by real cryptographic ledgers.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl">
                <ShieldCheck className="text-[#c8e639] w-6 h-6 mb-3" />
                <h4 className="text-white font-extrabold text-sm mb-1">Immutable</h4>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Data Ledger</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl">
                <Leaf className="text-[#c8e639] w-6 h-6 mb-3" />
                <h4 className="text-white font-extrabold text-sm mb-1">Sustainable</h4>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Growth focus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
