"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  MapPin,
  Share2,
  Bookmark,
  ArrowUpRight,
  ArrowRight,
  Droplets,
  Wind,
  Thermometer,
  Sprout,
  Tractor,
  Sun,
  Wheat,
  MessageCircle,
} from "lucide-react";
import NavBar from "../navbar";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

/* ---------- Telemetry data (mock — swap for live sensor feed) ---------- */

const TELEMETRY = [
  { label: "Soil moisture", value: "32.4%", delta: "+1.8% today", icon: Droplets },
  { label: "Air quality index", value: "8.2", delta: "Good · steady", icon: Wind },
  { label: "Soil temperature", value: "18.2°C", delta: "+0.4° today", icon: Thermometer },
];

const MOISTURE_TREND = [22, 26, 24, 29, 31, 28, 33, 30, 34, 32, 35, 32.4];

// Static per-metric sparkline data. Deterministic (no Math.random()) so server
// and client render identically — randomizing at render time causes hydration
// mismatches since the server and client would each roll different numbers.
const TELEMETRY_TRENDS: Record<string, number[]> = {
  "Soil moisture": [22, 26, 24, 29, 31, 28, 33, 30, 34, 32, 35, 32.4],
  "Air quality index": [7.1, 7.4, 7.2, 7.8, 8.0, 7.6, 8.3, 8.1, 7.9, 8.2, 8.0, 8.2],
  "Soil temperature": [15.8, 16.2, 16.9, 17.1, 16.7, 17.4, 17.8, 17.5, 18.0, 17.8, 18.1, 18.2],
};

const RISK_FACTORS = [
  { label: "Weather volatility", level: "Low", pct: 25 },
  { label: "Market liquidity", level: "Medium", pct: 55 },
  { label: "Operator track record", level: "Strong", pct: 90 },
];

const TIMELINE = [
  {
    title: "Land preparation",
    desc: "Soil enrichment and irrigation upgrades completed.",
    date: "Mar 2026",
    status: "done",
  },
  {
    title: "Spring planting",
    desc: "Corn seed sown across all 438 hectares.",
    date: "Apr 2026",
    status: "done",
  },
  {
    title: "Growth monitoring",
    desc: "Active — tracked via satellite and ground sensors.",
    date: "Now",
    status: "active",
  },
  {
    title: "Mid-season treatment",
    desc: "Nutrient application and pest control administered.",
    date: "Jul 2026",
    status: "upcoming",
  },
  {
    title: "Fall harvest",
    desc: "Projected yield collection and sale to grain buyers.",
    date: "Oct 2026",
    status: "upcoming",
  },
];

const SIMILAR = [
  { name: "Blue Ridge Apple Orchard", location: "Virginia, USA", ret: "12.4%", icon: Sprout },
  { name: "Wheat Lea Co-operative", location: "Kansas, USA", ret: "11.2%", icon: Wheat },
  { name: "Golden Sprout Vineyard", location: "California, USA", ret: "9.8%", icon: Sun },
];

/* ---------- Small building blocks ---------- */

function Sparkline({ data, className = "" }: { data: number[]; className?: string }) {
  const w = 100;
  const h = 32;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="#c8e639" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatDivider() {
  return <div className="hidden h-10 w-px bg-neutral-200 md:block" />;
}

export default function PropertyDetail() {
  return (
    <div className="min-h-screen bg-[#b8cb8a] px-6 pb-20 font-sans md:px-14">
      <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: easeOut }}
            >
              <Image
                src="/bga.jpg"
                alt=""
                fill
                priority
                className="object-cover object-bottom opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#8c8c81]/50 via-[#749a86] to via-[#374f42] " />
            
            </motion.div>
      <style jsx global>{`
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(200, 230, 57, 0.55); }
          100% { box-shadow: 0 0 0 10px rgba(200, 230, 57, 0); }
        }
        @keyframes livedot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .pulse-ring { animation: pulseRing 2s ease-out infinite; }
        .live-dot { animation: livedot 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pulse-ring, .live-dot { animation: none; }
        }
      `}</style>
        <NavBar/>
      <div className="mx-auto max-w-[1200px] pt-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-neutral-700"
        >
          <Link href="/properties" className="hover:text-neutral-900">Properties</Link>
          <ArrowRight size={12} />
          <Link href="/properties?state=nebraska" className="hover:text-neutral-900">Nebraska</Link>
          <ArrowRight size={12} />
          <span className="text-neutral-900">Sundance Corn Estate</span>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="relative h-[340px] w-full overflow-hidden rounded-3xl md:h-[420px] "
        >
         { /* <Image src="/farm-hero.jpg" alt="Sundance Corn Estate aerial view" fill priority className="object-cover" /> */ }
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute right-5 top-5 flex gap-2">
            <button aria-label="Share property" className="flex h-10 w-10 items-center justify-center rounded-full z-10 bg-[#c8e639] border-2 border-[#212224] text-neutral-900 transition  hover:bg-white">
              <Share2 size={16} />
            </button>
            <button aria-label="Save property" className="flex h-10 w-10 items-center justify-center rounded-full z-10 bg-[#c8e639] border-2 border-[#212122] text-neutral-900 transition hover:bg-white">
              <Bookmark size={16} />
            </button>
          </div>
                <Image src="/farm.jpg" alt="Sundance Corn Estate aerial view" fill priority className="object-cover border-2 border-[#c8e639]"  />
                
 <div className=" mb-6 absolute left-5 top-74 flex bg-[#c8e639] border-2 border-[#212224] text-neutral-900 rounded-full px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ">
             <p className=" flex items-center gap-1.5 text-sm font-medium ">
              <MapPin size={14} /> Nebraska, USA · Zone 4b
            </p></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
           
            <h1 className="p-2 px-2 rounded-2xl text-4xl  font-extrabold uppercase leading-[0.95] tracking-tight drop-shadow-sm md:text-6xl border-b-2 border-[#c8e639] inline-block mt-3  ">
              Sundance Corn Estate
            </h1>
           
          </div>
        </motion.div>

        {/* Stat bar */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 -mt-6 mx-2 flex flex-col gap-6 rounded-2xl bg-gray-200/90 p-6 border-2 border-[#c8e639] shadow-lg md:mx-6 md:flex-row md:items-center md:justify-between"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 md:flex md:flex-1 md:items-center">
            {[
              ["Target yield", "12.4%"],
              ["Risk rating", "A-"],
              ["Funding goal", "$2.3M"],
              ["Funded", "82%"],
              ["Min investment", "$500"],
            ].map(([label, value], i) => (
              <motion.div key={label} variants={fadeUp} className="flex items-center gap-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
                  <p className="text-xl font-extrabold text-neutral-900">{value}</p>
                </div>
                {i < 4 && <StatDivider />}
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="flex items-center justify-between gap-6 border-t border-neutral-100 pt-5 md:border-t-0 md:border-l md:pl-6 md:pt-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Projected payout</p>
              <p className="text-xl font-extrabold text-neutral-900">$742,000 <span className="text-sm font-medium text-neutral-500">/ 20 yr</span></p>
            </div>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="whitespace-nowrap rounded-full bg-neutral-900 px-7 py-3 text-sm  border-4 border-[#c8e639] font-semibold text-[#c8e639] transition hover:bg-neutral-800">
              Invest Now
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Live field telemetry — the signature module */}

<motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mt-12 rounded-2xl bg-white/50 p-6 border-2 border-[#c8e639]  md:p-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[#343d07]">Live field telemetry</h2>
            <div className="flex items-center gap-2 rounded-full border-2 border-[#c8e639] bg-gray-900 text-[#c8e639] px-3 py-1.5 text-[11px] font-medium ">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#c8e639]" />
              Updated 4s ago
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 ">
            {TELEMETRY.map(({ label, value, delta, icon: Icon }) => (
              <div key={label} className="rounded-xl bg-white/50 p-5 border-2 border-[#c8e639]">
                <div className="flex items-center justify-between bg-amber-50 rounded-sm px-3 py-1.5 ">
                  <Icon size={16} className="text-[#cbed20]" />
                  <Sparkline data={TELEMETRY_TRENDS[label]} className="h-6 w-16 "  />
                </div>
                <p className="mt-3 text-2xl font-extrabold ">{value}</p>
                <p className="text-[11px] font-medium text-[#67780f]">{label} · {delta}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-white/50 border-2 border-[#c8e639] p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#313a04]">24h soil moisture trend</p>
              <p className="text-sm font-bold text-[#a0bd0f]">32.4%</p>
            </div>
            <Sparkline data={MOISTURE_TREND} className="mt-3 h-16 w-full" />
            <div className="mt-1 flex justify-between text-[10px] text-neutral-500">
              <span>–24h</span><span>–12h</span><span>now</span>
            </div>
          </div>
        </motion.section>

        {/* Farm profile + Investment timeline */} 
        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-[1.0fr_0.9fr] h-full ">
          {/* Farm profile */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="rounded-2xl border-2 border-[#c8e639] bg-white/50 p-6 md:p-8"
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[#343d07]">Farm profile</h2>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-[#3f4a10]">
              Sundance Corn Estate spans 438 hectares of prime corn-belt farmland in Nebraska, run with
              precision irrigation and autonomous farming equipment. The farm has consistently outperformed
              regional yield benchmarks for six consecutive seasons.
            </p>
 
            <h3 className="mt-9 text-xs font-bold uppercase tracking-[0.15em] text-[#343d07]">Risk analysis</h3>
            <div className="mt-4 flex flex-col gap-5">
              {RISK_FACTORS.map(({ label, level, pct }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#3f4a10]">{label}</span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#67780f]">{level}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/60">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: easeOut }}
                      className="h-full rounded-full bg-[#788d0d]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
 
          {/* Investment timeline */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="rounded-2xl border-2 border-[#c8e639] bg-white/50 p-6 md:p-8"
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[#343d07]">Investment timeline</h2>
            <div className="relative mt-5 flex flex-col gap-7 pl-2">
              <div className="absolute bottom-2 left-[15px] top-2 w-px bg-[#879f11]" />
              {TIMELINE.map(({ title, desc, date, status }) => (
                <div key={title} className="relative flex gap-4 pl-6">
                  <span
                    className={`absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 ${
                      status === "active"
                        ? "pulse-ring border-[#9bb421] bg-[#8da514]"
                        : status === "done"
                        ? "border-[#343d07] bg-[#343d07]"
                        : "border-[#67780f]/50 bg-white"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold uppercase tracking-wide text-[#343d07]">{title}</p>
                      <span className="whitespace-nowrap text-xs font-medium text-[#67780f]">{date}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-[#3f4a10]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
  {/* Investor insights */}
            <div className="mt-8 rounded-2xl border-2 border-[#c8e639] bg-white/50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#343d07]">Investor insights</p>
              <dl className="mt-3 grid grid-cols-2 gap-y-2.5 text-sm">
                <dt className="text-[#67780f]">Sponsor</dt>
                <dd className="text-right font-medium text-[#3f4a10]">Plains Harvest LLC</dd>
                <dt className="text-[#67780f]">Tax form</dt>
                <dd className="text-right font-medium text-[#3f4a10]">1099</dd>
                <dt className="text-[#67780f]">Structure</dt>
                <dd className="text-right font-medium text-[#3f4a10]">Direct with sponsor</dd>
                <dt className="text-[#67780f]">Payout</dt>
                <dd className="text-right font-medium text-[#3f4a10]">Annual, after harvest</dd>
              </dl>
              <Link href="/prospectus/sundance-corn-estate" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#343d07] hover:underline">
                View full prospectus <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Similar opportunities */}
        <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, ease: easeOut }} className="mt-16">
          <div className="flex items-center justify-between border-t border-neutral-900/40 pt-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-600">Similar opportunities</h2>
            <Link href="/properties" className="flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:underline">
              View all properties <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {SIMILAR.map(({ name, location, ret, icon: Icon }) => (
              <motion.div key={name} whileHover={{ y: -4 }} transition={{ duration: 0.25 }} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="flex h-28 items-center justify-center bg-[#1f2e14]">
                  <Icon size={30} className="text-[#c8e639]" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-tight text-neutral-900">{name}</p>
                      <p className="text-xs text-neutral-500">{location}</p>
                    </div>
                    <span className="whitespace-nowrap rounded-full bg-[#c8e639]/30 px-2.5 py-1 text-xs font-bold text-neutral-900">{ret}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-20 grid grid-cols-2 gap-8 border-t border-neutral-900/40 pt-10 text-sm sm:grid-cols-4">
          {[
            ["Company", ["About", "Careers", "Press", "Contact"]],
            ["Marketplace", ["Browse farms", "Sell land", "Yield reports"]],
            ["Resources", ["Investor FAQ", "Fund passbook", "Compliance"]],
            ["Support", ["Help center", "Live chat", "System status"]],
          ].map(([heading, links]) => (
            <div key={heading as string}>
              <p className="text-xs font-bold uppercase tracking-wide text-neutral-600">{heading as string}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {(links as string[]).map((link) => (
                  <li key={link}>
                    <Link href="#" className="flex items-center gap-1.5 text-neutral-700 hover:text-neutral-900">
                      {link === "Live chat" && <MessageCircle size={13} />}
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </footer>
      </div>
    </div>
  );
}