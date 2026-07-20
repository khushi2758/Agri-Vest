"use client";
import { useEffect, useRef, useState } from "react";
import { User, Mail, Phone, MapPin, ShieldCheck, ShieldAlert, Calendar } from "lucide-react";

const user = {
  name: "Amara Osei",
  email: "amara.osei@example.com",
  phone: "+1 (555) 019-2288",
  address: "Accra, Ghana",
  memberSince: "March 2025",
  totalInvested: 18400,
  kycVerified: false,
  avatarInitials: "AO",
};

export default function ProfileCard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);   // your existing account menu
  const [profileCardOpen, setProfileCardOpen] = useState(false); // the new profile card

  const containerRef = useRef<HTMLDivElement>(null);

  // one outside-click handler closes BOTH, since they share this wrapper
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setProfileCardOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block font-sans" ref={containerRef}>

      {/* your existing avatar/menu trigger goes here, toggling dropdownOpen */}
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100"
      >
        <div className="w-8 h-8 rounded-full bg-[#1b2620] flex items-center justify-center text-[#c8e639] text-xs font-bold">
          {user.avatarInitials}
        </div>
      </button>

      {/* your existing account dropdown menu */}
      {dropdownOpen && (
        <div className="z-30 absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-40">
          <button
            onClick={() => {
              setDropdownOpen(false);
              setProfileCardOpen(true); // 👈 open the card instead of router.push
            }}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <User size={14} /> Profile
          </button>
          {/* other menu items (Settings, Sign out, etc.) stay as-is */}
        </div>
      )}

      {/* the profile card, rendered as its own dropdown, anchored to the same wrapper */}
      <div
        className={`absolute right-0 top-[calc(100%+8px)] w-80 origin-top-right z-50 transition-all duration-150 ${
          profileCardOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[#1b2620] flex items-center justify-center text-[#c8e639] font-extrabold text-xl uppercase mb-4">
              {user.avatarInitials}
            </div>
            <p className="text-lg font-extrabold text-[#1b2620]">{user.name}</p>
            <p className="text-sm text-[#1b2620]/50">{user.email}</p>
            <div className="mt-3">
              {user.kycVerified ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                  <ShieldCheck size={13} /> KYC Verified
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                  <ShieldAlert size={13} /> KYC Pending
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#1b2620]/5 pt-5">
            <div className="flex items-center gap-3">
              <Mail size={15} strokeWidth={2} className="text-[#1b2620]/40 shrink-0" />
              <span className="text-sm font-semibold text-[#1b2620]">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={15} strokeWidth={2} className="text-[#1b2620]/40 shrink-0" />
              <span className="text-sm font-semibold text-[#1b2620]">{user.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={15} strokeWidth={2} className="text-[#1b2620]/40 shrink-0" />
              <span className="text-sm font-semibold text-[#1b2620]">{user.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={15} strokeWidth={2} className="text-[#1b2620]/40 shrink-0" />
              <span className="text-sm font-semibold text-[#1b2620]">Member since {user.memberSince}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 pt-5 border-t border-[#1b2620]/5">
            <span className="text-xs font-bold uppercase tracking-wide text-[#1b2620]/50">Total invested</span>
            <span className="text-base font-extrabold text-[#1b2620]">${user.totalInvested.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}