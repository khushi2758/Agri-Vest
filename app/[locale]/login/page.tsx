"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Mail, Lock, Fingerprint, Loader2 } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "", otp: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"credentials" | "otp" | "success">("credentials");
  
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
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
        setError(data.error || "Login failed");
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
      
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#1b2620]/5 relative z-10">
        
        <div className="w-full md:w-1/2 p-12 lg:p-16 flex flex-col">
          <div className="mb-12">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-[#1b2620] p-2 rounded-xl group-hover:bg-[#c8e639] transition-colors">
                <Leaf className="text-[#c8e639] group-hover:text-[#1b2620] w-6 h-6 transition-colors" />
              </div>
              <span className="text-2xl font-black text-[#1b2620] tracking-tight">Agri-Vest</span>
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold text-[#1b2620] mb-3 tracking-tight">Welcome back</h1>
            <p className="text-[#1b2620]/60 font-medium mb-10">
              {step === "credentials" ? "Access your portfolio" : step === "success" ? "Authentication successful" : "Enter OTP sent to your email"}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                {error}
              </div>
            )}

            {step === "credentials" && (
              <form onSubmit={requestOTP} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#1b2620] uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1b2620]/40 w-5 h-5" />
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-bold text-[#1b2620] focus:outline-none focus:border-[#c8e639] focus:ring-1 focus:ring-[#c8e639] transition-all" placeholder="investor@example.com" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#1b2620] uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1b2620]/40 w-5 h-5" />
                    <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-bold text-[#1b2620] focus:outline-none focus:border-[#c8e639] focus:ring-1 focus:ring-[#c8e639] transition-all" placeholder="••••••••" />
                  </div>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-[#1b2620] hover:bg-black text-white font-extrabold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-8 shadow-[0_10px_20px_rgba(27,38,32,0.1)] hover:shadow-[0_15px_25px_rgba(27,38,32,0.2)] disabled:opacity-70">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue to OTP"}
                </button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleLogin} className="space-y-6">
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
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-[#1b2620]" /> : "Verify & Login"}
                </button>
                <div className="text-center">
                  <button type="button" onClick={() => setStep("credentials")} className="text-xs font-extrabold text-[#1b2620]/40 hover:text-[#1b2620] uppercase tracking-widest transition-colors">
                    Back to email
                  </button>
                </div>
              </form>
            )}

            {step === "success" && (
              <div className="bg-green-50 p-8 rounded-2xl border border-green-100 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-extrabold text-[#1b2620] mb-2">Login Successful</h3>
                <p className="text-sm font-bold text-neutral-500">Redirecting to your dashboard...</p>
                <Loader2 className="w-5 h-5 text-green-600 animate-spin mt-4" />
              </div>
            )}
          </div>

          <div className="mt-12 text-center text-sm font-bold text-[#1b2620]/60">
            Don't have an account? <Link href="/en/register" className="text-[#1b2620] hover:text-[#8da514] font-extrabold border-b-2 border-[#c8e639] pb-0.5 transition-colors">Sign up</Link>
          </div>
        </div>

        <div className="hidden md:block w-1/2 bg-[#1b2620] relative p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c8e639_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#c8e639]/20 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-8">
                <ShieldCheck className="text-[#c8e639] w-4 h-4" />
                <span className="text-white text-xs font-bold tracking-widest uppercase">Bank-Grade Security</span>
              </div>
              <h2 className="text-5xl font-black text-white leading-tight mb-6">Invest in the<br/>future of food.</h2>
              <p className="text-white/60 font-medium text-lg leading-relaxed max-w-md">Secure, tokenized agricultural assets that yield real returns while supporting global food security.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#c8e639] flex items-center justify-center font-black text-[#1b2620]">24%</div>
                <div>
                  <h4 className="text-white font-extrabold text-sm">Average Annual Return</h4>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Platform Wide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
