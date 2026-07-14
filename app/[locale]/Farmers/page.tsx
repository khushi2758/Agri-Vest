"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapPin, Search, Navigation } from "lucide-react";
import NavBar from "../navbar";
import Footer from "../Footer";

export default function FarmersDirectory() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [filteredFarmers, setFilteredFarmers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [nearMeActive, setNearMeActive] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchFarmers() {
      try {
        const res = await fetch("/api/farmers");
        if (res.ok) {
          const data = await res.json();
          setFarmers(data);
          setFilteredFarmers(data);
        }
      } catch (e) {}
    }

    async function fetchCurrentUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
        }
      } catch (e) {}
    }

    fetchFarmers();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    let result = farmers;

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(lower) ||
          f.location.toLowerCase().includes(lower)
      );
    }

    if (nearMeActive) {
      result = result.filter((_, idx) => idx % 2 === 0);
    }

    setFilteredFarmers(result);
  }, [search, nearMeActive, farmers]);

  return (
    <div className="min-h-screen bg-[#f7f9f2] font-sans">
      <NavBar />

      <main className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-black text-[#1b2620] tracking-tight uppercase md:text-5xl">
            Farmer Directory
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-[#1b2620]/60 font-medium">
            Discover verified agricultural producers within our global network. Find local partners and invest in sustainable farming.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-8 bg-white p-3 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search farmers or regions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#c8e639] outline-none text-[#1b2620] font-bold"
            />
          </div>

          <button
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
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map((farmer, idx) => (
            <motion.div
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
