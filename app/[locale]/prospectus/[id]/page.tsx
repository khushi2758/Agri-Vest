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

export default function ProspectusPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;
  const locale = resolvedParams.locale;

  const property = FARMLANDS.find(f => f.id === propertyId) || FARMLANDS[0];

  return (
    <div className="min-h-screen bg-[#b8cb8a] font-sans relative selection:bg-[#c8e639] selection:text-black">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <Image src="/bga.jpg" alt="" fill priority className="object-cover opacity-10" />
         <div className="absolute inset-0 bg-gradient-to-br from-[#8c8c81]/90 via-[#749a86] to-[#374f42]" />
      </div>

      <div className="relative z-10">
        <NavBar />
        
        <div className="mx-auto max-w-[900px] px-6 pt-12 pb-24 md:px-0">
          
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link href={`/${locale}/property/${property.id}`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 shadow-sm backdrop-blur-md">
              <ArrowLeft size={16} /> Back to Property
            </Link>
          </motion.div>

          {/* Document Container */}
          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white/50"
          >
            {/* Header */}
            <div className="bg-[#1b2620] text-white p-10 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8e639]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-[#c8e639] mb-4">
                  <FileText size={20} />
                  <span className="text-sm font-extrabold uppercase tracking-widest">Confidential Offering Memorandum</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Investment Prospectus</h1>
                <h2 className="text-2xl text-white/80 font-medium pb-8 border-b border-white/20 mb-8">{property.name}</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Target Yield</p>
                    <p className="text-2xl font-extrabold text-[#c8e639]">{property.yield}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Fund Size</p>
                    <p className="text-2xl font-extrabold text-white">{property.totalGoal}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Min Investment</p>
                    <p className="text-2xl font-extrabold text-white">{property.minInvestment}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Sponsor</p>
                    <p className="text-lg font-bold text-white mt-1 leading-tight">{property.sponsor}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-10 md:p-16 bg-white text-[#2a3307]">
              
              {/* Executive Summary */}
              <section className="mb-14">
                <h3 className="flex items-center gap-2 text-xl font-extrabold uppercase tracking-widest border-b-2 border-[#e0e8cd] pb-3 mb-6">
                  <Landmark className="text-[#8da514]" /> 1. Executive Summary
                </h3>
                <p className="text-lg leading-relaxed mb-4 text-[#3f4a10]">
                  This memorandum outlines the investment opportunity for <strong>{property.name}</strong>, a premium agricultural asset located in {property.location}. The sponsor, {property.sponsor}, is seeking to raise {property.totalGoal} to modernize irrigation systems, implement AI-driven agronomy, and secure operational capital for the upcoming planting seasons.
                </p>
                <p className="text-lg leading-relaxed text-[#3f4a10]">
                  Investors in this syndicate will acquire fractionalized equity via a dedicated SPV (Special Purpose Vehicle) mapped directly to the land's title, offering a direct pass-through of agricultural yields and land appreciation.
                </p>
              </section>

              {/* Financial Structure */}
              <section className="mb-14">
                <h3 className="flex items-center gap-2 text-xl font-extrabold uppercase tracking-widest border-b-2 border-[#e0e8cd] pb-3 mb-6">
                  <BadgeDollarSign className="text-[#8da514]" /> 2. Financial Structure
                </h3>
                <div className="bg-[#f7f9f2] rounded-2xl p-6 border border-[#e0e8cd]">
                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-[#e0e8cd]">
                        <th className="py-4 font-bold text-[#343d07]">Estimated Annual Cash Yield</th>
                        <td className="py-4 font-extrabold text-[#67780f] text-right">{property.yield}</td>
                      </tr>
                      <tr className="border-b border-[#e0e8cd]">
                        <th className="py-4 font-bold text-[#343d07]">Target IRR (Internal Rate of Return)</th>
                        <td className="py-4 font-extrabold text-[#67780f] text-right">14.5% - 17.2%</td>
                      </tr>
                      <tr className="border-b border-[#e0e8cd]">
                        <th className="py-4 font-bold text-[#343d07]">Hold Period</th>
                        <td className="py-4 font-extrabold text-[#67780f] text-right">5 - 7 Years</td>
                      </tr>
                      <tr className="border-b border-[#e0e8cd]">
                        <th className="py-4 font-bold text-[#343d07]">Management Fee</th>
                        <td className="py-4 font-extrabold text-[#67780f] text-right">1.25% Annually</td>
                      </tr>
                      <tr>
                        <th className="py-4 font-bold text-[#343d07]">Sponsor Promote (Carry)</th>
                        <td className="py-4 font-extrabold text-[#67780f] text-right">15% over 8% hurdle</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Operations & Tech */}
              <section className="mb-14">
                <h3 className="flex items-center gap-2 text-xl font-extrabold uppercase tracking-widest border-b-2 border-[#e0e8cd] pb-3 mb-6">
                  <TrendingUp className="text-[#8da514]" /> 3. Operational Strategy
                </h3>
                <p className="text-lg leading-relaxed mb-6 text-[#3f4a10]">
                  The property is transitioning to high-efficiency precision farming. Capital expenditures will be directed toward implementing deep-soil sensors, drone-based spectral imaging, and automated harvesting machinery. This technological overlay is projected to decrease water usage by 22% and fertilizer costs by 15%, drastically improving net operating income (NOI).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#1b2620] text-white p-6 rounded-2xl">
                    <h4 className="text-lg font-extrabold mb-2 text-[#c8e639]">Phase 1 (Months 1-6)</h4>
                    <p className="text-sm text-white/80">Land acquisition, soil remediation, and installation of IoT telemetry infrastructure.</p>
                  </div>
                  <div className="bg-[#1b2620] text-white p-6 rounded-2xl">
                    <h4 className="text-lg font-extrabold mb-2 text-[#c8e639]">Phase 2 (Months 7-12)</h4>
                    <p className="text-sm text-white/80">First harvest cycle under new management. Optimization of drone scouting routes.</p>
                  </div>
                </div>
              </section>

              {/* Risk Factors */}
              <section className="mb-14">
                <h3 className="flex items-center gap-2 text-xl font-extrabold uppercase tracking-widest border-b-2 border-[#e0e8cd] pb-3 mb-6">
                  <ShieldAlert className="text-[#8da514]" /> 4. Risk Factors & Disclosures
                </h3>
                <div className="bg-red-50 text-red-900 p-6 rounded-2xl border border-red-100">
                  <ul className="list-disc pl-5 space-y-3 text-sm font-medium">
                    <li><strong>Agricultural Risk:</strong> Crop yields are subject to weather conditions, climate change, pests, and disease.</li>
                    <li><strong>Market Risk:</strong> Commodity prices fluctuate globally. A drop in commodity prices will directly impact revenue.</li>
                    <li><strong>Illiquidity:</strong> Investments in agricultural real estate are highly illiquid. There is no secondary market for these shares.</li>
                    <li><strong>Regulatory Risk:</strong> Changes in water rights, environmental laws, or agricultural subsidies can adversely affect profitability.</li>
                  </ul>
                </div>
              </section>

              {/* Footer Actions */}
              <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-xs text-gray-400 max-w-sm text-center sm:text-left">
                  This document does not constitute an offer to sell or a solicitation of an offer to buy any securities. Read full legal disclosures before investing.
                </p>
                
                <div className="flex gap-4 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors">
                    <Download size={18} /> PDF
                  </button>
                  <Link href={`/${locale}/property/${property.id}`} className="flex-1 sm:flex-none">
                    <button className="w-full flex items-center justify-center bg-[#c8e639] hover:bg-[#a8c718] text-[#1b2620] font-extrabold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                      Invest Now
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          </motion.article>

        </div>
        <Footer />
      </div>
    </div>
  );
}
