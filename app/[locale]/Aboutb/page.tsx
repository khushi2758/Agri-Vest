"use client";
import React, { useEffect, useRef, useState, ReactNode } from "react";

import {
  Leaf, Sprout, LineChart, BrainCircuit, ArrowRight, ArrowUpRight,
  Lock, Eye, Globe2, HandCoins, TrendingUp,
} from "lucide-react";
import Image from "next/image";

// ---- scroll-reveal primitive -------------------------------------------------------------

function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

// ---- liquid glass card -------------------------------------------------------------
// tone="light": translucent white glass, for dark/medium backgrounds, white text
// tone="deep":  translucent white glass, for light backgrounds, dark text
// tone="dark":  translucent ink glass, as a feature/accent panel

function GlassCard({
  children,
  tone = "light",
  className = "",
  hover = true,
}: {
  children: ReactNode;
  tone?: "light" | "dark" | "deep";
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={`water-glass water-glass-${tone} ${hover ? "water-glass-hover" : ""} relative overflow-hidden ${className}`}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ---- eyebrow tag, reused per section for consistent hierarchy -----------------------------

function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6 border ${
        tone === "light"
          ? "bg-black/25 backdrop-blur-sm border-white/15 text-[#c8e639]"
          : "bg-[#0d140f]/8 backdrop-blur-sm border-[#0d140f]/10 text-[#3f7a4f]"
      }`}
    >
      <Leaf size={14} /> {children}
    </span>
  );
}

// ---- curved section seam --------------------------------------------------------
// A wide ellipse in the *current* section's leading color, overlapping the
// previous section, so the boundary reads as a soft wave instead of a hard line.

function WaveSeam({ color }: { color: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2/3 w-[140%] h-20 md:h-28 rounded-[100%] pointer-events-none"
      style={{ background: color }}
    />
  );
}

// ---- on-brand photo frame -------------------------------------------------------------

type BrandPhotoProps = { src: string; alt: string; className?: string };

function BrandPhoto({ src, alt, className = "" }: BrandPhotoProps) {
  return (
    <div className={`relative overflow-hidden water-glass water-glass-light p-2 ${className}`}>
      <div className="relative overflow-hidden bg-amber-300  rounded-[inherit]">
        <Image src={src} alt={alt} width={600} height={500} loading="lazy" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

// ---- content -------------------------------------------------------------

const STEPS = [
  {
    icon: Sprout,
    title: "Farmers list their land",
    body: "A farmer shares field details, crop plan, and the season's funding need — verified on the ground before it reaches an investor.",
  },
  {
    icon: HandCoins,
    title: "Investors fund the season",
    body: "Backers browse verified plots and fund what resonates, from a single field to a whole harvest cycle.",
  },
  {
    icon: TrendingUp,
    title: "Progress and yields flow back",
    body: "Tasks, photos, and portfolio performance update in real time, and returns are shared as the harvest comes in.",
  },
];

const PILLARS = [
  { icon: Lock, title: "Secure Land Investment", body: "Every listed plot is verified and title-checked before it's opened to funding, so capital moves onto real, vetted land.", image: "/field.jpg" },
  { icon: Sprout, title: "Smart Farm Management", body: "Farmers plan, assign, and track field tasks in one place, from irrigation to harvest, with nothing lost between seasons.", image: "/fild.png" },
  { icon: LineChart, title: "Real-Time Portfolio Tracking", body: "Investors watch performance as it happens, not at quarter-end, with balances, yields, and field updates in one dashboard.", image: "/search.png" },
  { icon: BrainCircuit, title: "AI-Driven Insights", body: "Machine learning reads weather, soil, and crop signals to flag risk early and surface where a season is heading.", image: "/ai.png" },
];

const VALUES = [
  { icon: Eye, title: "Transparent", body: "Every dollar and every task is traceable, for the farmer and the investor alike." },
  { icon: Globe2, title: "Accessible", body: "Farmland investment opened up to anyone, not just institutional capital." },
  { icon: Leaf, title: "Sustainable", body: "AI insights favor regenerative practices and efficient resource use, season over season." },
];

// ---- section -------------------------------------------------------------

export default function AgriVestAbout() {
  return (
    <div id="about" className="font-sans">
     

      <section className="relative overflow-hidden text-[#0d140f]">
        <WaveSeam color="#c7cdb9" />
        <div className="absolute inset-0 bg-[#c7cdb9]">
          <Image src="/bg.jpg" alt="" fill className="object-cover object-bottom opacity-[0.15]" />
          <div className="absolute inset-0 bg-linear-to-b from-[#c7cdb9] via-[#daddce] to-[#e8eadf] opacity-90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32">
          <Reveal className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#3f7a4f]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#3f7a4f]">AgriVest</span>
              <span className="w-8 h-px bg-[#3f7a4f]" />
            </div>
            <h3 className="text-3xl md:text-[44px] font-extrabold tracking-tight leading-[1.05] text-[#0d140f]">
              How it works<span className="text-[#c8e639]">.</span>
            </h3>
          </Reveal>

          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-8">
              <Reveal delay={0}>
                <div className="flex flex-col items-center">
                  <span className="text-[120px] font-black text-[#0d140f]/4 leading-none select-none pointer-events-none">1</span>
                </div>
              </Reveal>
              <Reveal delay={140}>
                <div className="flex flex-col items-center">
                  <span className="text-[120px] font-black text-[#0d140f]/4 leading-none select-none pointer-events-none">2</span>
                </div>
              </Reveal>
              <Reveal delay={280}>
                <div className="flex flex-col items-center">
                  <span className="text-[120px] font-black text-[#0d140f]/4 leading-none select-none pointer-events-none">3</span>
                </div>
              </Reveal>
            </div>

            <div className="relative -mt-12">
              <div className="grid grid-cols-3 gap-8 relative z-20">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-center border border-black/4">
                    <Sprout size={24} className="text-[#3f7a4f]" />
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-center border border-black/4">
                    <HandCoins size={24} className="text-[#3f7a4f]" />
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-center border border-black/4">
                    <TrendingUp size={24} className="text-[#3f7a4f]" />
                  </div>
                </div>
              </div>

              <svg
                viewBox="0 0 900 80"
                fill="none"
                className="absolute top-1/2 -translate-y-1/2 left-[16%] w-[68%] h-20 pointer-events-none z-10"
              >
                <path
                  d="M0 40 C100 40, 120 8, 200 8 C280 8, 300 72, 450 72 C600 72, 620 30, 700 30 C780 30, 820 40, 900 40"
                  stroke="#3f7a4f"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="process-path"
                />
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-8">
              <Reveal delay={0}>
                <div className="text-center px-4">
                  <h4 className="font-extrabold text-lg mb-2 text-[#0d140f]">{STEPS[0].title}</h4>
                  <p className="text-[#0d140f]/45 text-[13px] leading-relaxed">{STEPS[0].body}</p>
                </div>
              </Reveal>
              <Reveal delay={140}>
                <div className="text-center px-4">
                  <h4 className="font-extrabold text-lg mb-2 text-[#0d140f]">{STEPS[1].title}</h4>
                  <p className="text-[#0d140f]/45 text-[13px] leading-relaxed">{STEPS[1].body}</p>
                </div>
              </Reveal>
              <Reveal delay={280}>
                <div className="text-center px-4">
                  <h4 className="font-extrabold text-lg mb-2 text-[#0d140f]">{STEPS[2].title}</h4>
                  <p className="text-[#0d140f]/45 text-[13px] leading-relaxed">{STEPS[2].body}</p>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="md:hidden flex flex-col gap-10">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 120}>
                <div className="flex gap-5 items-start">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)] flex items-center justify-center border border-black/4">
                      <step.icon size={20} className="text-[#3f7a4f]" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#3f7a4f] tracking-widest uppercase mb-1 block">Step {i + 1}</span>
                    <h4 className="font-extrabold text-lg mb-1 text-[#0d140f]">{step.title}</h4>
                    <p className="text-[#0d140f]/45 text-sm leading-relaxed">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 2 — PILLARS (meadow pastel, glass with dark text) ============ */}
      <section className="relative overflow-hidden text-[#0d140f]">
        <WaveSeam color="#eef2df" />
        <div className="absolute inset-0 bg-linear-to-b from-[#c8e27b] via-[#8fc48f] to-[#c4d58f]" />
        <div className="absolute inset-0 farmgrid opacity-[0.08]" />
        <div className="absolute top-[10%] right-[-10%] w-105 h-105 rounded-full bg-white/25 blur-[110px] float-slow" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
          <Reveal className="max-w-lg mb-12">
            <Eyebrow tone="dark">What the platform does</Eyebrow>
            <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight leading-[1.02] mb-3">
              Four systems, one dashboard
            </h3>
            <p className="text-[#0d140f]/60 font-medium">Everything a farmer or investor needs on AgriVest, in a single view.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2  justify-center items-center">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <GlassCard tone="deep" className="rounded-3xl flex flex-col sm:flex-row h-full  ">
                  <BrandPhoto src={p.image} alt={p.title} className="w-full sm:w-40 h-440 sm:h-auto  rounded-2xl sm:my-3 sm:ml-3 sm:mr-0 " />
                  <div className="p-6 flex flex-col">
                   
                    <h4 className="font-extrabold text-lg mb-2">{p.title}</h4>
                    <p className="text-[#0d140f]/60 text-sm leading-relaxed">{p.body}</p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 3 — VALUES (cream) ============ */}
      <section className="relative overflow-hidden text-[#0d140f]">
        <WaveSeam color="#f4f7ec" />
        <div className="absolute inset-0 bg-linear-to-b from-[#f4f7ec] to-[#e7efdd]" />
        <div className="absolute top-[-15%] left-[10%] w-105 h-105 rounded-full bg-[#c8e639]/30 blur-[110px] float-slow" />
        <div className="absolute bottom-[-15%] right-[5%] w-95 h-95 rounded-full bg-[#7fb8de]/25 blur-[110px] float-slow-rev" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <Reveal>
              <Eyebrow tone="dark">Why it matters</Eyebrow>
              <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-4">Built around a real season</h3>
              <p className="text-[#0d140f]/60 font-medium leading-relaxed max-w-md">
                Farmland has always been a real asset. AgriVest makes it a transparent, accessible,
                and sustainable one, for the person growing the crop and the person backing it.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 90}>
                  <GlassCard tone="deep" className="rounded-3xl p-6 h-full">
                    <div className="w-10 h-10 rounded-xl bg-[#4f8f66]/15 flex items-center justify-center mb-3">
                      <v.icon size={18} className="text-[#3f7a4f]" />
                    </div>
                    <h4 className="font-extrabold text-sm mb-1.5">{v.title}</h4>
                    <p className="text-[#0d140f]/60 text-xs leading-relaxed font-medium">{v.body}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 5 — CTA (bright lime finale) ============ */}
    <section className="relative overflow-hidden text-white">
        <WaveSeam color="#e7efdd" />
        <div className="absolute inset-0 bg-linear-to-br from-[#e3e4dc] via-[#d9dbd5] to-[#4f8f66]" />
        <div className="absolute top-[-20%] left-[30%] w-150 h-150 rounded-full bg-white/15 blur-[130px] float-slow" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
          <Reveal>
            <GlassCard tone="dark" hover={false} className="rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight leading-tight mb-3">
                  Ready to grow<br className="hidden md:block" /> with AgriVest?
                </h3>
                <p className="text-white/70 font-medium max-w-md">
                  Whether you farm the land or fund it, there's a place for you on the platform.
                </p>
              </div>
              <div className="flex gap-3 shrink-0 flex-wrap">
                <button className="bg-[#dee1cc] text-[#0d140f] font-extrabold px-6 py-3.5 rounded-full flex items-center gap-2 hover:scale-105 hover:shadow-[0_0_30px_rgba(200,230,57,0.4)] transition-all">
                  Explore Farms <ArrowUpRight size={16} />
                </button>
                <button className="water-glass water-glass-light water-glass-hover text-white font-extrabold px-6 py-3.5 rounded-full flex items-center gap-2 transition-all">
                  Become a Farmer <ArrowRight size={16} />
                </button>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>
   
      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }
        .reveal-visible { opacity: 1; transform: translateY(0); }

        /* ---- liquid glass (static — no shine sweep) ---- */
        .water-glass {
          position: relative;
          border-radius: 1.5rem;
          backdrop-filter: blur(22px) saturate(170%);
          -webkit-backdrop-filter: blur(22px) saturate(170%);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
        }
        .water-glass::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(155deg, rgba(255,255,255,0.55), rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.2) 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .water-glass-light { background: rgba(255, 255, 255, 0.14); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.18); }
        .water-glass-dark { background: rgba(10, 15, 12, 0.62); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06); }
        .water-glass-deep { background: rgba(255, 255, 255, 0.55); box-shadow: 0 8px 32px rgba(27, 38, 32, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.7); }
        .water-glass-hover:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.3); }

        .furrow-line { background: repeating-linear-gradient(90deg, rgba(13,20,15,0.25) 0 10px, transparent 10px 20px); }

        .farmgrid {
          background-image:
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at 50% 30%, black 0%, transparent 70%);
        }
        @keyframes floatSlow { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(20px, 30px); } }
        @keyframes floatSlowRev { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-25px, -20px); } }
        .float-slow { animation: floatSlow 14s ease-in-out infinite; }
        .float-slow-rev { animation: floatSlowRev 17s ease-in-out infinite; }
        @keyframes floatBadge { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes floatBadgeRev { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        .float-badge { animation: floatBadge 5s ease-in-out infinite; }
        .float-badge-rev { animation: floatBadgeRev 6s ease-in-out infinite; }

        .process-path {
          stroke-dasharray: 1600;
          stroke-dashoffset: 1600;
          animation: drawPath 2s ease-out forwards;
        }
        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
          .float-slow, .float-slow-rev, .float-badge, .float-badge-rev { animation: none !important; }
          .water-glass-hover:hover { transform: none !important; }
        }
      `}</style>
    </div>
  );
}