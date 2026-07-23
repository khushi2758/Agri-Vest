"use client";
import { useState } from "react";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";
import NavBar from "../navbar";
import HelpTourButton from "../HelpTourButton";
export const homeSteps = [
  {
    target: "#home-hero",
    disableBeacon: true,
    content:
      "Welcome to AgriVest. This is the Home section where you can learn about our platform's mission. AgriVest connects investors, farmers, landowners, and agronomists to promote smart, secure, and sustainable agriculture.",
  },
];
export const homeSpeech = [
  {
    target: "#home-hero",
    text:
      "Welcome to AgriVest. This is the Home section. Here you can learn about our platform and how it connects investors, farmers, landowners, and agronomists through smart farmland investment and sustainable agriculture.",
  },
];
const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

const LeafIcon = ({ className = "", fill = "currentColor" }: { className?: string; fill?: string }) => (
  <svg viewBox="0 0 24 24" fill={fill} className={className}>
    <path d="M20 4C11 4 4 11 4 20c0 0 9-1 14-6s6-10 6-10-8 1-14 6" opacity="0" />
    <path d="M5 19c0-7.7 6.3-14 14-14 0 7.7-6.3 14-14 14z" />
    <path d="M5 19c3-2 6.5-5.5 9-9" stroke="#F7F9F2" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  </svg>
);

const DOTS = 4;

export default function AgriVestHero() {
  const [activeDot, setActiveDot] = useState(0);

  return (
    <div className={`${baloo.variable} ${jakarta.variable}`}>
      <main  id="home-hero"
        className="relative min-h-screen overflow-x-hidden text-[#1b2620]"
        style={{
          fontFamily: "var(--font-jakarta), sans-serif",
          background:
            "radial-gradient(ellipse 900px 700px at 78% 45%, #eaf6c8 0%, transparent 60%), #f7f9f2",
        }}
      >
        {/* side rail label */}
        <div className="fixed left-7 top-0 bottom-0 hidden md:flex items-center z-[5] pointer-events-none">
          <HelpTourButton steps={ homeSteps} speechSections={homeSpeech}/>
          <span
            className="inline-block text-[10.5px] font-semibold tracking-[0.22em] uppercase text-[#1b2620]/50"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Verified Farmland · Real Yield · Est. AgriVest
          </span>
        </div>

          <NavBar/>

        {/* right dot nav */}
        <div className="fixed right-7 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3.5 z-10">
          {Array.from({ length: DOTS }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveDot(i)}
              aria-label={`View farm ${i + 1}`}
              aria-selected={activeDot === i}
              className={`w-[9px] h-[9px] rounded-full border-[1.5px] border-[#1b2620] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8bba16] focus-visible:outline-offset-[3px] ${
                activeDot === i ? "bg-[#1b2620] scale-[1.15]" : "bg-transparent"
              }`}
            />
          ))}
        </div>

        <div className="w-full flex items-center px-[6vw] min-h-screen">
          <div className="w-full max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.05fr] items-center gap-10 py-[150px] md:py-[120px] text-center md:text-left">
            {/* copy column */}
            <div>
              <div className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[0.14em] uppercase text-[#4a5a12] bg-[#c8e639]/20 pl-2.5 pr-3.5 py-1.5 rounded-full mb-6">
                <LeafIcon className="w-[13px] h-[13px]" fill="#4a5a12" />
                Invest Smart. Grow Together.
              </div>

             

              <h1
                className="font-bold leading-[1.04] tracking-tight mb-5 text-[38px] md:text-[52px] lg:text-[58px]"
                style={{ fontFamily: "var(--font-baloo), sans-serif" }}
              >
                Empowering  <span className="text-[#6e9b5e]">Agriculture</span> Through 
                <br />
                Farmland
              </h1>

              <p className="text-[15.5px] leading-relaxed text-[#1b2620]/60 max-w-[38ch] mb-7 mx-auto md:mx-0">
               AgriVest is an AI-powered farmland investment platform that connects farmers and investors. It enables secure land investments, smart farm management, real-time portfolio tracking, and AI-driven insights, making agriculture more transparent, accessible, and sustainable.
              </p>

           
            </div>

            {/* art column */}
            <div className="relative flex items-center justify-center mt-6 md:mt-0">
              <div
                className="relative flex items-center justify-center rounded-full w-[min(480px,88vw)] h-[min(480px,88vw)]"
                style={{
                  background: "linear-gradient(155deg, #eef2df 0%, #dfe8c4 45%, #cddba0 100%)",
                  boxShadow: "0 40px 70px -30px rgba(74,90,18,0.3)",
                }}
              >
                {/* rotating badge */}
                <svg viewBox="0 0 100 100" className="absolute top-[2%] right-[6%] w-24 h-24">
                  <g className="badge-spin" style={{ transformOrigin: "center" }}>
                    <circle cx="50" cy="50" r="46" fill="#1b2620" />
                    <path
                      id="badgeCircle"
                      fill="none"
                      d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0"
                    />
                    <text
                      fontFamily="var(--font-jakarta), sans-serif"
                      fontSize="7.2"
                      fontWeight="700"
                      letterSpacing="1.5"
                      fill="#c8e639"
                    >
                      <textPath href="#badgeCircle" startOffset="0%">
                        SOIL VERIFIED · GPS SURVEYED · SOIL VERIFIED · GPS SURVEYED ·
                      </textPath>
                    </text>
                  </g>
                  <svg x="34" y="32" width="32" height="32" viewBox="0 0 24 24" fill="#c8e639">
                    <path d="M5 19c0-7.7 6.3-14 14-14 0 7.7-6.3 14-14 14z" />
                  </svg>
                </svg>

                {/* hand-built farmland plot illustration */}
                <div className="plot-float w-[78%]">
                  <svg viewBox="0 0 320 260" width="100%" height="100%">
                    <defs>
                      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#3a4a1c" floodOpacity="0.2" />
                      </filter>
                    </defs>

                    <g filter="url(#soft)">
                      {/* soil base plot */}
                      <ellipse cx="160" cy="150" rx="128" ry="82" fill="#B8905F" stroke="#96703E" strokeWidth="2" />

                      {/* GPS boundary dashes */}
                      <ellipse
                        cx="160"
                        cy="150"
                        rx="120"
                        ry="76"
                        fill="none"
                        stroke="#FFFCF6"
                        strokeWidth="2"
                        strokeDasharray="7 8"
                        strokeLinecap="round"
                        opacity="0.8"
                      />

                      {/* crop rows */}
                      <path d="M46 120 Q160 96 274 120" stroke="#6E9B5E" strokeWidth="9" fill="none" strokeLinecap="round" />
                      <path d="M40 142 Q160 116 280 142" stroke="#7FAE6D" strokeWidth="9" fill="none" strokeLinecap="round" />
                      <path d="M36 166 Q160 138 284 166" stroke="#6E9B5E" strokeWidth="9" fill="none" strokeLinecap="round" />
                      <path d="M42 188 Q160 162 278 188" stroke="#7FAE6D" strokeWidth="9" fill="none" strokeLinecap="round" />

                      {/* furrow stitch lines on each row */}
                      <path d="M46 120 Q160 96 274 120" stroke="#FFFCF6" strokeWidth="1.4" strokeDasharray="4 6" fill="none" opacity="0.5" />
                      <path d="M36 166 Q160 138 284 166" stroke="#FFFCF6" strokeWidth="1.4" strokeDasharray="4 6" fill="none" opacity="0.5" />

                      {/* seed markers */}
                      <circle cx="90" cy="120" r="3" fill="#F2C94C" />
                      <circle cx="150" cy="112" r="3" fill="#F2C94C" />
                      <circle cx="210" cy="118" r="3" fill="#F2C94C" />
                      <circle cx="110" cy="166" r="3" fill="#F2C94C" />
                      <circle cx="170" cy="158" r="3" fill="#F2C94C" />
                      <circle cx="230" cy="166" r="3" fill="#F2C94C" />

                      {/* sun rays, top corner */}
                      <g transform="translate(258,44)">
                        <circle cx="0" cy="0" r="16" fill="#F2C94C" stroke="#D9AE33" strokeWidth="2" />
                        <path d="M0 -26 L0 -20M18 -18 L14 -14M26 0 L20 0M18 18 L14 14M0 26 L0 20M-18 18 L-14 14M-26 0 L-20 0M-18 -18 L-14 -14" stroke="#D9AE33" strokeWidth="2.5" strokeLinecap="round" />
                      </g>

                      {/* sprout at center */}
                      <g transform="translate(160,96)">
                        <path d="M0 20 L0 0" stroke="#4a5a12" strokeWidth="3" strokeLinecap="round" />
                        <path d="M0 6c0-8 8-12 14-10-2 8-8 12-14 10z" fill="#8bba16" />
                        <path d="M0 12c0-7-8-10-14-8 2 7 8 10 14 8z" fill="#6E9B5E" />
                      </g>
                    </g>
                  </svg>
                </div>

                {/* stat chip */}
                <div className="absolute left-[2%] bottom-[10%] md:left-[2%] max-md:left-1/2 max-md:-translate-x-1/2 max-md:-bottom-[4%] bg-[#FFFCF6] rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-[0_18px_34px_-18px_rgba(74,90,18,0.3)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#4a5a12" strokeWidth="2" className="w-[26px] h-[26px] shrink-0">
                    <path d="M5 19c0-7.7 6.3-14 14-14 0 7.7-6.3 14-14 14z" />
                  </svg>
                  <div>
                    <div className="font-bold text-[15px] leading-none" style={{ fontFamily: "var(--font-baloo), sans-serif" }}>
                      1,240
                    </div>
                    <div className="text-[9.5px] font-semibold text-[#1b2620]/50 uppercase tracking-wide mt-0.5">
                      Acres funded
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .plot-float {
          animation: plotFloat 5.5s ease-in-out infinite;
        }
        @keyframes plotFloat {
          0%,
          100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-12px) rotate(-0.5deg);
          }
        }

        .badge-spin {
          animation: badgeSpin 14s linear infinite;
        }
        @keyframes badgeSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .yield-path {
          stroke-dasharray: 90;
          stroke-dashoffset: 90;
          animation: yieldDraw 2.6s ease-in-out infinite;
        }
        @keyframes yieldDraw {
          0% {
            stroke-dashoffset: 90;
            opacity: 0.3;
          }
          45% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          70% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -90;
            opacity: 0.3;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .plot-float {
            animation: none;
            transform: rotate(-2deg);
          }
          .badge-spin {
            animation: none;
          }
          .yield-path {
            animation: none;
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}