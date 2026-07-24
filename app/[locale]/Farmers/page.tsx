"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapPin, Search, Navigation } from "lucide-react";
import NavBar from "../navbar";
import Footer from "../Footer";
import ScreenReaderButton from "../ScreenReaderButton";
import HelpTourButton from "@/app/[locale]/HelpTourButton";
export default function FarmersDirectory() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [filteredFarmers, setFilteredFarmers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [nearMeActive, setNearMeActive] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
const farmerDirectorySteps = [
  {
    target: "#farmer-header",
    content:
      "👋 Welcome to the Farmer Directory. Browse verified farmers, discover agricultural partners, and explore sustainable farming opportunities.",
  },

  {
    target: "#screen-reader",
    content:
      "🔊 Click this button to hear a complete description of this page for improved accessibility.",
  },

  {
    target: "#search-section",
    content:
      "🔍 Use the search tools below to quickly find farmers by name or location.",
  },

  {
    target: "#search-input",
    content:
      "Type a farmer's name, crop, or region to filter the directory instantly.",
  },

  {
    target: "#near-me",
    content:
      "📍 Enable 'Near Me' to view farmers located close to your current location.",
  },

  {
    target: "#farmer-cards",
    content:
      "🌱 These cards display verified farmers. Click any card to learn more about their farm, crops, and available investment opportunities.",
  },
];
const farmerDirectorySpeech = [
    {
      target: "#farmer-header",
      text: "Welcome to the Farmer Directory. This page helps you discover verified farmers across our global agricultural network.",
    },
    {
      target: "#search-section",
      text: "Use the search bar to find farmers by name or location.",
    },
    {
      target: "#near-me",
      text: "Click Near Me to display farmers close to your current location.",
    },
    {
      target: "#farmer-cards",
      text: "These cards display verified farmers along with their location and farming expertise.",
    },
  ]
  useEffect(() => {
    async function fetchFarmers() {
      try {
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (nearMeActive) query.append("nearMe", "true");
        
        const res = await fetch(`/api/farmers?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setFarmers(data);
          setFilteredFarmers(data);
        }
      } catch (e) {}
    }

    const delayDebounce = setTimeout(() => {
      fetchFarmers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, nearMeActive]);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
        }
      } catch (e) {}
    }

    fetchCurrentUser();
  }, []);

  

  return (
    <div className="min-h-screen bg-[#f7f9f2] font-sans">
      <NavBar />
      <HelpTourButton
  steps={farmerDirectorySteps}
  title="Farmer Directory"
  speechSections=  {farmerDirectorySpeech}
/>
      
    

      <main className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          id="farmer-header" className="mb-10 text-center"
        > <div className="flex flex-row justify-center gap-5 items-center"> 
          <h1 className="text-4xl font-black text-[#1b2620] tracking-tight uppercase md:text-5xl ">
            Farmer Directory

          </h1>
          <div id="screen-reader">
          <ScreenReaderButton 
  title="Farmer Directory"
  description="Discover verified agricultural producers within our global network. Find local partners and invest in sustainable farming.."
   size={26}
  />
</div>    </div>
          <p className="mt-4 max-w-2xl mx-auto text-[#1b2620]/60 font-medium">
            Discover verified agricultural producers within our global network. Find local partners and invest in sustainable farming.
          </p>
        </motion.div>

        <motion.div  id="search-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-8 bg-white p-3 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input  id="search-input"
              type="text"
              placeholder="Search farmers or regions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#c8e639] outline-none text-[#1b2620] font-bold"
            />
          </div>

          {currentUser?.role === "landowner" && (
            <button  id="near-me"
              onClick={() => setNearMeActive(!nearMeActive)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all w-full sm:w-auto justify-center ${
                nearMeActive
                  ? "bg-[#1b2620] text-[#c8e639]"
                  : "bg-[#c8e639]/10 text-[#1b2620] hover:bg-[#c8e639]/30"
              }`}
            >
              <Navigation className={`w-4 h-4 ${nearMeActive ? "animate-pulse" : ""}`} />
              {nearMeActive ? "Showing Near You" : "Near Me"}
            </button>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 "  id="farmer-cards">
          {filteredFarmers.map((farmer, idx) => (
            <motion.div
             id={`farmer-card-${farmer.id}`}
              key={farmer.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8e639]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#c8e639]/20 transition-all"></div>
              
              <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#1b2620] text-[#c8e639] flex items-center justify-center font-black text-xl shadow-md">
                  {farmer.avatar}
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1b2620] text-lg leading-tight">
                    {farmer.name}
                  </h3>
                  <p className="flex items-center gap-1 text-sm font-bold text-gray-400 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {farmer.location}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 relative z-10">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Primary Focus</p>
                <div className="flex flex-wrap gap-2">
                  {farmer.crops?.map((c: string) => (
                    <span key={c} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-[#1b2620]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredFarmers.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-bold">No farmers found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
