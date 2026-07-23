"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Trash2,
  Globe,
  Bold,
  Bell,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/[locale]/context/auth-context"; 

import { CircleQuestionMark } from "lucide-react";
export const NAV_LINKS = [
  { label: "Home", href: "/HomePage" },
  { label: "Explore", href: "/Explore" },
  { label: "Investor", href: "/Investor" },
  { label: "Farmers", href: "/Farmers" },
  { label: "Agronomist", href: "/Agronomist" },
  { label: "Wallet", href: "/Wallet" },
  { label: "Portfolio", href: "/Portfolio" },
  { label: "About", href: "/About" },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function NavBar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const steps = [
    {
      target: "#home-link",
      content: "Welcome to AgriVest! This is the Home page.",
    },
    {
      target: "#explore-link",
      content: "Discover farmland investment opportunities here.",
    },
    {
      target: "#investor-link",
      content: "Investor dashboard and analytics.",
    },
    {
      target: "#farmers-link",
      content: "Browse verified farmers.",
    },
    {
      target: "#wallet-link",
      content: "Manage your wallet securely.",
    },
    {
      target: "#portfolio-link",
      content: "Track all your investments.",
    },
    {
      target: "#profile-link",
      content:
        "Manage your profile, update your information, and personalize your AgriVest experience.",
    },
    {
      target: "#community-link",
      content:
        "Share your ideas, suggestions, and connect with investors, farmers, and landowners using @mentions.",
    },
  ];
  useEffect(() => {
    const completed = localStorage.getItem("agri-tour");

    if (!completed) {
      setRunTour(true);
    }
  }, []);
  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  // Closes BOTH the account menu and the profile card when clicking outside
  // either of them — they share the same dropdownRef wrapper.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/en/login");
      router.refresh();
    } catch (e) {}
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to permanently delete your account? This cannot be undone.",
      )
    ) {
      try {
        await fetch("/api/auth/delete-account", { method: "POST" });
        router.push("/en/register");
        router.refresh();
      } catch (e) {}
    }
  };

  const handleJoyride = (data: any) => {
    const { status } = data;

    if (status === "finished" || status === "skipped") {
      localStorage.setItem("agri-tour", "true");
      setRunTour(false);
    }
  };
  const speak = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // Single-role access model: a user has exactly one role (user.role),
  // not a set of assigned roles.
  const filteredNavLinks = NAV_LINKS.filter((link) => {
    if (!user) {
      return ["Home", "Explore", "About"].includes(link.label);
    }

    switch (user.role) {
      case "investor":
        return ["Home", "Explore", "Investor", "Portfolio", "Wallet", "About"].includes(link.label);
      case "farmers":
        return ["Home", "Explore", "Farmers", "Wallet", "About"].includes(link.label);
      case "landowner":
        return ["Home", "Explore", "Wallet","Farmers", "About"].includes(link.label);
      case "agronomist":
        return true; // full access
      default:
        return ["Home", "Explore", "About"].includes(link.label);
    }
  
  });

  return (
    <>
      {/*<Joyride
  run={runTour}
  steps={steps}
  continuous = {true}
  scrollToFirstStep= {true}
  onEvent={handleJoyride}
  options={{
    buttons: ["back", "skip", "primary"],
    showProgress: true,
    overlayClickAction: false,
    primaryColor: "#c8e639",
    primaryColor: "#c8e639",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      overlayColor: "rgba(0,0,0,0.45)",
      zIndex: 9999,
      arrowColor: "#ffffff",
     
  }}

/>*/}
      <motion.header
        className="relative flex items-center justify-between py-3 z-30 top-0 bg-transparent backdrop-blur-sm border-b border-neutral-200 w-full px-1 sm:px-6 lg:px-8 text-[#526108] text-bold font-mono"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-neutral-900"
        >
          <span className="text-[#c8e639]">AGRI |</span> VIST
        </Link>

        <nav className="hidden gap-10 text-md font-medium md:flex">
          {filteredNavLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              id={`${label.toLowerCase()}-link`}
              className="relative pb-1"
            >
              <motion.span
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className={
                  active === href
                    ? "text-neutral-900 font-semibold"
                    : "text-[#374106] font-bold"
                }
              >
                {label}
              </motion.span>
              {active === href && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-neutral-900"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => router.push("/en/Community")}
            className="flex items-center justify-center rounded-full p-2 text-neutral-900 transition hover:bg-neutral-100"
            title="Community Feedback"
            id="community-link"
          >
            <Globe size={20} />
          </button>
          {!loading && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                  onClick={() => {
    setDropdownOpen(!dropdownOpen);
    setIsProfileOpen(false);
  }}
                id="profile-link"
                className="flex items-center gap-2 rounded-full border border-neutral-800 px-5 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
              >
             Profile | <User size={16} />  
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
                        router.push("/en/profile");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Settings size={14} /> Settings
                    </button>
                    <div className="h-px w-full bg-gray-100 my-1"></div>
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

              {/* profile card: opened by the "Profile" item above */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute z-50 top-14 bg-yellow-50 right-0 w-72 wallet-card-soft rounded-2xl p-5 flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-black/5 ">
                      <div className="w-12 h-12 rounded-full bg-[#c1ed7a]/20 text-[#1b2620] flex items-center justify-center font-extrabold uppercase text-lg">
                        {user?.name ? user.name.substring(0, 2) : "?"}
                      </div>
                      <div>
                        <p className="font-bold text-[#1b2620]">{user?.name ?? "Unnamed user"}</p>
                        <p className="text-xs text-[#1b2620]/60">{user?.email ?? "—"}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex justify-between items-center bg-black/[0.03] p-3 rounded-xl border border-black/5">
                        <span className="text-xs font-bold text-[#1b2620]/60">Total Balance</span>
                        <span className="text-sm font-extrabold text-[#1b2620]">
                          {user?.totalBalance != null ? (
                            <>
                              {user.totalBalance} AGV{" "}
                              <span className="text-[10px] text-neutral-400 font-medium ml-1">
                                (~${user.totalBalance})
                              </span>
                            </>
                          ) : (
                            <span className="text-[#1b2620]/40 font-medium">—</span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-black/[0.03] p-3 rounded-xl border border-black/5">
                        <span className="text-xs font-bold text-[#1b2620]/60">KYC Status</span>
                        {user?.kyc_verified ? (
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
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full bg-[#1b2620] text-white text-center text-sm font-bold py-2.5 rounded-xl hover:bg-black transition-colors mb-2"
                    >
                      Edit Profile 
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
          ) : !loading ? (
            <>
              <button
                onClick={() => router.push("/en/login")}
                className="rounded-full px-5 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/en/register")}
                className="rounded-full bg-[#1b2620] text-[#c8e639] px-5 py-2 text-sm font-medium transition hover:bg-black hover:shadow-md"
              >
                Register
              </button>
            </>
          ) : null}
          {/*<button
            onClick={() => {
              localStorage.removeItem("agri-tour");
              setRunTour(true);
            }}
          >
            <CircleQuestionMark />
          </button>*/}
        </div>

        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="z-50 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 text-neutral-900 md:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={20} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: easeOut }}
              className="absolute left-0 right-0 top-full z-40 overflow-hidden rounded-2xl bg-white shadow-lg md:hidden"
            >
              <motion.div
                className="flex flex-col gap-1 p-4"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                {filteredNavLinks.map(({ label, href }) => (
                  <motion.div
                    key={label}
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      show: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.3, ease: easeOut },
                      },
                    }}
                  >
                    <Link
                      href={href}
                      onClick={() => {
                        setActive(href);
                        setMobileOpen(false);
                      }}
                      className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        active === label
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-900 hover:bg-neutral-100"
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    show: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.3, ease: easeOut },
                    },
                  }}
                  className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2"
                >
                  <button
                    onClick={() => {
                      router.push("/en/Community");
                      setMobileOpen(false);
                    }}
                    className="w-full flex justify-center items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                  >
                    <Globe size={16} /> Community
                  </button>
                  {!loading && user ? (
                    <>
                      <button
                        onClick={() => {
                          router.push("/en/profile");
                          setMobileOpen(false);
                        }}
                        className="w-full flex justify-center items-center gap-2 rounded-full border border-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
                      >
                        <User size={16} /> Profile
                      </button>
                      <button
                        onClick={() => {
                          router.push("/en/settings");
                          setMobileOpen(false);
                        }}
                        className="w-full flex justify-center items-center gap-2 rounded-full border border-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
                      >
                        <Settings size={16} /> Settings
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }}
                        className="w-full flex justify-center items-center gap-2 rounded-full border border-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteAccount();
                          setMobileOpen(false);
                        }}
                        className="w-full flex justify-center items-center gap-2 rounded-full border border-red-500 px-5 py-2.5 text-sm font-bold text-red-500 transition hover:bg-red-500 hover:text-white mt-2"
                      >
                        <Trash2 size={16} /> Delete Account
                      </button>
                    </>
                  ) : !loading ? (
                    <>
                      <button
                        onClick={() => {
                          router.push("/en/login");
                          setMobileOpen(false);
                        }}
                        className="w-full rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          router.push("/en/register");
                          setMobileOpen(false);
                        }}
                        className="w-full rounded-full bg-[#1b2620] text-[#c8e639] px-5 py-2.5 text-sm font-medium transition hover:bg-black"
                      >
                        Register
                      </button>
                    </>
                  ) : null}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      <div className="h-1 w-full bg-linear-to-r from-[#c8e639] via-[#8fd0c8] to-[#a78bd8]" />
    </>
  );
}