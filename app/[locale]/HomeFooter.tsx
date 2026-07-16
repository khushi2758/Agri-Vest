"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Sprout,  } from "lucide-react";

function XIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 1.5h3.7l-8.1 9.3 9.5 12.7h-7.4l-5.8-7.6-6.6 7.6H.6l8.6-9.9L0 1.5h7.6l5.3 7 6-7Zm-1.3 19.7h2L6.5 3.6h-2.2l13.3 17.6Z" />
    </svg>
  );
}

function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const COLUMNS = [
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
      { label: "Cookie settings", href: "/cookies" },
    ],
  },
];

const SOCIALS = [
  { icon: XIcon, href: "https://twitter.com", label: "X (Twitter)" },

  { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-900 px-6 py-14 text-neutral-300 md:px-10 ">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto flex max-w-[1100px] flex-col gap-10"
      >
        {/* Top: brand + link columns */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
              <Sprout size={20} className="text-[#c8e639]" />
              AgriVest
            </div>
            <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-neutral-400">
              Bridging the gap between global capital and small-scale farmers
              through transparent, blockchain-secured investment.
            </p>
          </motion.div>

          {COLUMNS.map(({ heading, links }) => (
            <motion.div key={heading} variants={fadeUp}>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">{heading}</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-neutral-300 transition hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div variants={fadeUp}>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">Follow us</p>
            <div className="mt-3 flex gap-2.5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 text-neutral-300 transition hover:border-[#c8e639] hover:text-[#c8e639]"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-3 border-t border-neutral-800 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>© 2024 AgriVest Tech Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c8e639]" />
            All data protected by AI audit
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}