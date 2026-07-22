"use client";
import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import Footer from "@/app/[locale]/Footer";
import NavBar from "../../navbar";
import {
  ArrowLeft,
  Download,
  ShieldAlert,
  TrendingUp,
  FileText,
  BadgeDollarSign,
  Landmark,
  Scale
} from "lucide-react";

// Shared Mock Data
const FARMLANDS = [
  {
    id: "sundance-corn-estate",
    name: "Sundance Corn Estate",
    location: "Nebraska, USA",
    yield: "12.4%",
    risk: "Low",
    minInvestment: "$500",
    totalGoal: "$2.3M",
    sponsor: "Plains Harvest LLC",
  },
  {
    id: "blue-ridge-orchard",
    name: "Blue Ridge Apple Orchard",
    location: "Virginia, USA",
    yield: "14.1%",
    risk: "Medium",
    minInvestment: "$1,000",
    totalGoal: "$1.5M",
    sponsor: "Highland Agritech",
  },
  {
    id: "golden-wheat-coop",
    name: "Golden Wheat Co-operative",
    location: "Kansas, USA",
    yield: "10.5%",
    risk: "Low",
    minInvestment: "$250",
    totalGoal: "$4.0M",
    sponsor: "Heartland Co-op",
  },
  {
    id: "emerald-vineyards",
    name: "Emerald Vineyards",
    location: "California, USA",
    yield: "16.8%",
    risk: "High",
    minInvestment: "$5,000",
    totalGoal: "$8.5M",
    sponsor: "Napa Premium Estates",
  },
  {
    id: "dakota-soy-fields",
    name: "Dakota Soy Fields",
    location: "South Dakota, USA",
    yield: "11.2%",
    risk: "Medium",
    minInvestment: "$500",
    totalGoal: "$3.2M",
    sponsor: "Dakota Farming Group",
  }
];

const easeOut = [0.16, 1, 0.3, 1] as const;

// ---- shared motion variants -------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export default function ProspectusPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;
  const locale = resolvedParams.locale;

  const property = FARMLANDS.find(f => f.id === propertyId) || FARMLANDS[0];

  return (
    <div className="min-h-screen bg-[#ece4d6] font-sans relative selection:bg-[#c8e639] selection:text-black">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <Image src="/bga.jpg" alt="" fill priority className="object-cover opacity-[0.04]" />
      </div>

      <div className="relative z-10">
        <NavBar />
        
        <div className="mx-auto max-w-225 px-6 pt-12 pb-24 md:px-0">
          
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="mb-8"
          >
            <Link href={`/${locale}/property/${property.id}`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b2620]/70 hover:text-[#1b2620] transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 shadow-sm">
              <ArrowLeft size={16} /> Back to Property
            </Link>
          </motion.div>

          {/* Document Container */}
          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="bg-white/55 backdrop-blur-2xl rounded-[2.5rem] shadow-lg overflow-hidden border border-white/60"
          >
            {/* Header */}
            <div className="bg-[#1b2620] text-white p-10 md:p-16 relative overflow-hidden">
              <div
                className="absolute top-10 right-14 w-7 h-7 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle at 30% 30%, #ffffff, #c8e639 60%, #7a8f1f)", boxShadow: "0 4px 10px rgba(0,0,0,0.25)" }}
              />

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: easeOut, delay: 0.15 }}
                className="relative z-10"
              >
                <div className="flex items-center gap-3 text-[#c8e639] mb-4">
                  <FileText size={20} />
                  <span className="text-sm font-extrabold uppercase tracking-widest">Confidential Offering Memorandum</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Investment Prospectus</h1>
                <h2 className="text-2xl text-white/80 font-medium pb-8 border-b border-white/20 mb-8">{property.name}</h2>
                
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                  <motion.div variants={staggerItem}>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Target Yield</p>
                    <p className="text-2xl font-extrabold text-[#c8e639]">{property.yield}</p>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Fund Size</p>
                    <p className="text-2xl font-extrabold text-white">{property.totalGoal}</p>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Min Investment</p>
                    <p className="text-2xl font-extrabold text-white">{property.minInvestment}</p>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Sponsor</p>
                    <p className="text-lg font-bold text-white mt-1 leading-tight">{property.sponsor}</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Content Body */}
            <div className="p-10 md:p-16 bg-white/40 text-[#2a3307]">
              
              {/* Executive Summary */}
              <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="mb-14"
              >
                <h3 className="flex items-center gap-2 text-xl font-extrabold uppercase tracking-widest border-b-2 border-black/10 pb-3 mb-6">
                  <Landmark className="text-[#8da514]" /> 1. Executive Summary
                </h3>
                <p className="text-lg leading-relaxed mb-4 text-[#3f4a10]">
                  This memorandum outlines the investment opportunity for <strong>{property.name}</strong>, a premium agricultural asset located in {property.location}. The sponsor, {property.sponsor}, is seeking to raise {property.totalGoal} to modernize irrigation systems, implement AI-driven agronomy, and secure operational capital for the upcoming planting seasons.
                </p>
                <p className="text-lg leading-relaxed text-[#3f4a10]">
                  Investors in this syndicate will acquire fractionalized equity via a dedicated SPV (Special Purpose Vehicle) mapped directly to the land's title, offering a direct pass-through of agricultural yields and land appreciation.
                </p>
              </motion.section>

              {/* Financial Structure */}
              <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="mb-14"
              >
                <h3 className="flex items-center gap-2 text-xl font-extrabold uppercase tracking-widest border-b-2 border-black/10 pb-3 mb-6">
                  <BadgeDollarSign className="text-[#8da514]" /> 2. Financial Structure
                </h3>
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/60">
                  <motion.table
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    className="w-full text-left"
                  >
                    <tbody>
                      <motion.tr variants={staggerItem} className="border-b border-black/10">
                        <th className="py-4 font-bold text-[#343d07]">Estimated Annual Cash Yield</th>
                        <td className="py-4 font-extrabold text-[#67780f] text-right">{property.yield}</td>
                      </motion.tr>
                      <motion.tr variants={staggerItem} className="border-b border-black/10">
                        <th className="py-4 font-bold text-[#343d07]">Target IRR (Internal Rate of Return)</th>
                        <td className="py-4 font-extrabold text-[#67780f] text-right">14.5% - 17.2%</td>
                      </motion.tr>
                      <motion.tr variants={staggerItem} className="border-b border-black/10">
                        <th className="py-4 font-bold text-[#343d07]">Hold Period</th>
                        <td className="py-4 font-extrabold text-[#67780f] text-right">5 - 7 Years</td>
                      </motion.tr>
                      <motion.tr variants={staggerItem} className="border-b border-black/10">
                        <th className="py-4 font-bold text-[#343d07]">Management Fee</th>
                        <td className="py-4 font-extrabold text-[#67780f] text-right">1.25% Annually</td>
                      </motion.tr>
                      <motion.tr variants={staggerItem}>
                        <th className="py-4 font-bold text-[#343d07]">Sponsor Promote (Carry)</th>
                        <td className="py-4 font-extrabold text-[#67780f] text-right">15% over 8% hurdle</td>
                      </motion.tr>
                    </tbody>
                  </motion.table>
                </div>
              </motion.section>

              {/* Operations & Tech */}
              <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="mb-14"
              >
                <h3 className="flex items-center gap-2 text-xl font-extrabold uppercase tracking-widest border-b-2 border-black/10 pb-3 mb-6">
                  <TrendingUp className="text-[#8da514]" /> 3. Operational Strategy
                </h3>
                <p className="text-lg leading-relaxed mb-6 text-[#3f4a10]">
                  The property is transitioning to high-efficiency precision farming. Capital expenditures will be directed toward implementing deep-soil sensors, drone-based spectral imaging, and automated harvesting machinery. This technological overlay is projected to decrease water usage by 22% and fertilizer costs by 15%, drastically improving net operating income (NOI).
                </p>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <motion.div
                    variants={staggerItem}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25, ease: easeOut }}
                    className="bg-[#1b2620] text-white p-6 rounded-2xl"
                  >
                    <h4 className="text-lg font-extrabold mb-2 text-[#c8e639]">Phase 1 (Months 1-6)</h4>
                    <p className="text-sm text-white/80">Land acquisition, soil remediation, and installation of IoT telemetry infrastructure.</p>
                  </motion.div>
                  <motion.div
                    variants={staggerItem}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25, ease: easeOut }}
                    className="bg-[#1b2620] text-white p-6 rounded-2xl"
                  >
                    <h4 className="text-lg font-extrabold mb-2 text-[#c8e639]">Phase 2 (Months 7-12)</h4>
                    <p className="text-sm text-white/80">First harvest cycle under new management. Optimization of drone scouting routes.</p>
                  </motion.div>
                </motion.div>
              </motion.section>

              {/* Risk Factors */}
              <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="mb-14"
              >
                <h3 className="flex items-center gap-2 text-xl font-extrabold uppercase tracking-widest border-b-2 border-black/10 pb-3 mb-6">
                  <ShieldAlert className="text-[#8da514]" /> 4. Risk Factors & Disclosures
                </h3>
                <div className="bg-red-50/70 backdrop-blur-sm text-red-900 p-6 rounded-2xl border border-red-100/80">
                  <ul className="list-disc pl-5 space-y-3 text-sm font-medium">
                    <li><strong>Agricultural Risk:</strong> Crop yields are subject to weather conditions, climate change, pests, and disease.</li>
                    <li><strong>Market Risk:</strong> Commodity prices fluctuate globally. A drop in commodity prices will directly impact revenue.</li>
                    <li><strong>Illiquidity:</strong> Investments in agricultural real estate are highly illiquid. There is no secondary market for these shares.</li>
                    <li><strong>Regulatory Risk:</strong> Changes in water rights, environmental laws, or agricultural subsidies can adversely affect profitability.</li>
                  </ul>
                </div>
              </motion.section>

              {/* Footer Actions */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="mt-16 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                <p className="text-xs text-[#2a3307]/50 max-w-sm text-center sm:text-left">
                  This document does not constitute an offer to sell or a solicitation of an offer to buy any securities. Read full legal disclosures before investing.
                </p>
                
                <div className="flex gap-4 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/60 backdrop-blur-sm border border-white/60 hover:bg-white/80 text-[#1b2620] font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    <Download size={18} /> PDF
                  </motion.button>
                  <Link href={`/${locale}/property/${property.id}`} className="flex-1 sm:flex-none">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2, ease: easeOut }}
                      className="w-full flex items-center justify-center bg-[#c8e639] hover:bg-[#a8c718] text-[#1b2620] font-extrabold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-colors"
                    >
                      Invest Now
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

            </div>
          </motion.article>

        </div>
        <Footer />
      </div>
    </div>
  );
}