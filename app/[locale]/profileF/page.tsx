"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";

// Drop this in wherever your existing dropdownOpen / data / handleLogout /
// handleDeleteAccount already live — this shows just the two dropdowns wired
// together, with the Profile button controlling the profile card.

export default function prifilef({ data, handleLogout, handleDeleteAccount }: any) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="relative">

      {/* your existing trigger that opens the account menu */}
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        className="text-[#1b2620]/40 hover:text-[#1b2620] transition-all"
      >
        Account
      </button>

      {/* account menu: Profile / Settings / Logout / Delete Account */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-2 z-40"
          >
            <button
              onClick={() => {
                setDropdownOpen(false);
                setIsProfileOpen(true);
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <User size={14} /> Profile
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                router.push("/en/Settings");
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Settings size={14} /> Settings
            </button>

            <div className="h-px w-full bg-gray-100 my-1" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <LogOut size={14} /> Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 mt-1"
            >
              <Trash2 size={14} /> Delete Account
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* profile card: opened by the "Profile" item above, same motion language */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-14 right-0 w-72 wallet-card-soft rounded-2xl p-5 z-50 flex flex-col"
          >
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
                <span className="text-sm font-extrabold text-[#1b2620]">
                  {data.user.totalBalance} AGV{" "}
                  <span className="text-[10px] text-neutral-400 font-medium ml-1">(~${data.user.totalBalance})</span>
                </span>
              </div>
              <div className="flex justify-between items-center bg-black/[0.03] p-3 rounded-xl border border-black/5">
                <span className="text-xs font-bold text-[#1b2620]/60">KYC Status</span>
                {data.user.kyc_verified ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#c1ed7a] bg-[#c1ed7a]/10 px-2 py-1 rounded">
                    <ShieldCheck size={12} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                    <ShieldAlert size={12} /> Pending
                  </span>
                )}
              </div>
            </div>

            <Link
              href="/en/profile"
              className="w-full bg-[#1b2620] text-white text-center text-sm font-bold py-2.5 rounded-xl hover:bg-black transition-colors mb-2"
            >
              Edit Profile & KYC
            </Link>
            <button
              onClick={() => {
                setIsProfileOpen(false);
                handleLogout();
              }}
              className="w-full bg-red-50 text-red-600 text-center text-sm font-bold py-2.5 rounded-xl hover:bg-red-100 transition-colors"
            >
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}