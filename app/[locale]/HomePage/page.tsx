"use client";
import { Suspense } from "react";
import Image from "next/image";
import crops from "@/public/fild2.jpg";
import { Poppins } from "next/font/google";
import { motion } from "motion/react";
import NavBar from "@/app/[locale]/navbar";
import { useTranslations } from "next-intl";
import Footer from "../Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HelpTourButton from "../HelpTourButton";
import HomeFooter from "../HomeFooter";

const easeOut = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: easeOut } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easeOut } },
};

const HEADING_SIZE: Record<string, string> = {
  hi: "text-5xl md:text-6xl pl-2.5",
  
  fr: "text-3xl md:text-xl",
  de: "text-xl md:text-4xl",
  it: "text-5xl md:text-6xl",
  es: "text-5xl md:text-3xl",
  pt: "text-5xl md:text-6xl",
  ru: "text-5xl md:text-6xl",
  ja: "text-6xl md:text-7xl",
  ko: "text-6xl md:text-7xl",
  zh: "text-6xl md:text-7xl",
};

const BUTTON_GAP: Record<string, string> = {
  hi: "gap-2 flex-row",
  fr: "gap-3",
  de: "gap-1",
  it: "gap-3",
  es: "gap-3",
  pt: "gap-3",
  ru: "gap-2",
  ja: "gap-4",
  ko: "gap-4",
  zh: "gap-4",
};

const STAT_LABEL_SIZE: Record<string, string> = {
  hi: "text-base md:text-lg",
  fr: "text-base md:text-lg",
  de: "text-sm md:text-base",
  it: "text-base md:text-lg",
  es: "text-base md:text-lg",
  pt: "text-base md:text-lg",
  ru: "text-sm md:text-base",
  ja: "text-lg md:text-xl",
  ko: "text-lg md:text-xl",
  zh: "text-lg md:text-xl",
};

const YIELD_LABEL_SIZE: Record<string, string> = {
  hi: "text-xs",
  fr: "text-xs",
  de: "text-xs",
  it: "text-xs",
  es: "text-xs",
  pt: "text-xs",
  ru: "text-xs",
  ja: "text-sm",
  ko: "text-sm",
  zh: "text-sm",
};

const INTRO_TEXT_SIZE: Record<string, string> = {
  hi: "max-w-sm text-lg",
  fr: "max-w-sm text-lg",
  de: "max-w-sm text-lg",
  it: "max-w-sm text-lg",
  es: "max-w-sm text-lg",
  pt: "max-w-sm text-lg",
  ru: "max-w-sm text-base",
  ja: "max-w-xs text-lg",
  ko: "max-w-xs text-lg",
  zh: "max-w-xs text-lg",
};

const STAT_CIRCLE_SIZE: Record<string, string> = {
  hi: "h-full min-h-[150px] w-[15px] ",
  fr: "h-full min-h-[150px] w-[150px]",
  de: "h-full min-h-[160px] w-[150px]",
  it: "h-full min-h-[150px] w-[150px]",
  es: "h-full min-h-[150px] w-[150px]",
  pt: "h-full min-h-[150px] w-[150px]",
  ru: "h-full min-h-[160px] w-[150px]",
  ja: "h-full min-h-[150px] w-[150px]",
  ko: "h-full min-h-[150px] w-[150px]",
  zh: "h-full min-h-[150px] w-[150px]",
};
const FLOATING_IMAGE_POSITION: Record<string, string> = {
  hi: "top-[-10%]",
  fr: "top-[-12%]",
  de: "top-[-8%] ",
  it: "top-[-12%]",
  es: "top-[-12%]",
  pt: "top-[-12%]",
  ru: "top-[-8%]",
  ja: "top-[-14%]",
  ko: "top-[-14%]",
  zh: "top-[-14%]",
};
const EN_FLOATING_IMAGE_POSITION = "top-[-15%] ";

function floatingImageWrapperClass(lang: string) {
  const base = "absolute left-[50%] w-full h-full flex items-center justify-center z-20";
  if (lang === "en") return `${EN_FLOATING_IMAGE_POSITION} ${base}`;
  return `${FLOATING_IMAGE_POSITION[lang] ?? "top-[-12%]"} ${base}`;
}
const EN_STAT_CIRCLE = "h-[150px]";

function statCircleClass(lang: string) {
  const base =
    "mx-auto flex-shrink-0 flex z-10 bg-[#c8e639] p-4 justify-center items-center rounded-t-full rounded-br-full text-black text-bold";
  if (lang === "en") return `${base} ${EN_STAT_CIRCLE}`;
  return `${base} ${STAT_CIRCLE_SIZE[lang] ?? "h-full min-h-[150px] w-[150px]"}`;
}
const EN_INTRO_TEXT = "max-w-xs text-xl";

function introTextClass(lang: string) {
  const base = "font-light text-neutral-100";
  if (lang === "en") return `${EN_INTRO_TEXT} ${base}`;
  return `${INTRO_TEXT_SIZE[lang] ?? "max-w-sm text-lg"} ${base}`;
}

const EN_HEADING =
  "text-6xl font-extrabold uppercase leading-[0.95] tracking-tight text-white drop-shadow-sm md:text-7xl";
const EN_BUTTON_GAP = "mt-8 flex flex-row items-center gap-4";
const EN_STAT_LABEL =
  "text-xl font-extrabold uppercase tracking-tight text-white drop-shadow-sm md:text-xl p-15";
const EN_YIELD_LABEL = "text-white rotate-[-90deg]";

function headingClass(lang: string) {
  if (lang === "en") return EN_HEADING;
  const base =
    "font-extrabold uppercase leading-[0.95] tracking-tight text-white drop-shadow-sm";
  return `${base} ${HEADING_SIZE[lang] ?? "text-6xl md:text-7xl"}`;
}

function buttonGapClass(lang: string) {
  if (lang === "en") return EN_BUTTON_GAP;
  return `mt-8 flex flex-wrap items-center ${BUTTON_GAP[lang] ?? "gap-4"}`;
}

function statLabelClass(lang: string) {
  if (lang === "en") return EN_STAT_LABEL;
  const base =
    "font-extrabold uppercase tracking-tight text-white drop-shadow-sm pr-15 leading-snug";
  return `${base} ${STAT_LABEL_SIZE[lang] ?? "text-base md:text-lg"}`;
}

function yieldLabelClass(lang: string) {
  if (lang === "en") return EN_YIELD_LABEL;
  const base = "text-white rotate-[-90deg] whitespace-nowrap font-semibold";
  return `${base} ${YIELD_LABEL_SIZE[lang] ?? "text-xs"}`;
}

export default function page() {
  const router = useRouter();
  const [isLandowner, setIsLandowner] = useState(false);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const user = await res.json();
          if (user.roles && user.roles.includes("landowner")) {
            setIsLandowner(true);
          }
        }
      } catch (err) {}
    }
    checkUser();
  }, []);

  const homeSteps = [
  {
    target: "#explore",
    disableBeacon: true,
    content:
      "Welcome to Explore. Here you can browse verified farmland investment opportunities, compare projects, and find investments that match your interests.",
  },
  {
    target: "#register",
    content:
      "Use Register to add your farmland to the AgriVest platform. Complete the registration process to verify your land and make it available for investment or management.",
  },
  ];
  const homeSpeech = [
  {
    target: "#explore",
    text:
      "Welcome to the Explore section. Here you can discover verified farmland investment opportunities, compare different projects, and choose investments that best match your financial goals.",
  },
  {
    target: "#register",
    text:
      "This is the Register section. If you are a farmer or landowner, you can register your farmland here by providing the required details. Once verified, your land can be managed or made available for investment through the AgriVest platform.",
  },
];

  function useGoogleLanguage() {
    const [language, setLanguage] = useState("en");

    useEffect(() => {
      const updateLanguage = () => {
        const match = document.cookie.match(/googtrans=\/en\/([a-z-]+)/);
        setLanguage(match?.[1] || "en");
      };

      updateLanguage();

      const interval = setInterval(updateLanguage, 500);

      return () => clearInterval(interval);
    }, []);

    return language;
  }

  const language = useGoogleLanguage();
  const isEnglish = language === "en";

  return (
    <>
    <div className="relative min-h-screen overflow-hidden bg-[#c7cdb9] font-sans px-14">
      <HelpTourButton steps={homeSteps}  speechSections={homeSpeech}/>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: easeOut }}
      >
        <Image
          src="/bg.jpg"
          alt=""
          fill
          priority
          className="object-cover object-bottom opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#bbd2ee] via-[#88c0e8] to-transparent" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-10">
        <NavBar />

        <main className="relative pt-5">
          <motion.div
            className="grid grid-cols-1 pb-15 gap-8 md:grid-cols-[1fr_1.1fr_0.9fr] md:items-center"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div className="relative z-30" variants={fadeUp}>
              <h1 className={headingClass(language)}>
                Smart
                <br />
                Farming
              </h1>

              <motion.div
                className={buttonGapClass(language)}
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.button
                  id="explore"
                  variants={fadeUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => router.push("/en/Explore")}
                  className={`rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 ${
                    isEnglish ? "" : "whitespace-nowrap"
                  }`}
                >
                  Explore Farms
                </motion.button>
                {isLandowner && (
                  <motion.button
                    id="register"
                    variants={fadeUp}
                    onClick={() => router.push("/en/Farmers/register")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className={`flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 ${
                      isEnglish ? "" : "whitespace-nowrap"
                    }`}
                  >
                    Register Farmland
                  </motion.button>
                )}
              </motion.div>
            </motion.div>

            <div>
              <motion.div
                className="absolute top-[-15%] left-0 w-full h-full flex items-center justify-center z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: [0, -14, 0],
                }}
                transition={{
                  opacity: { duration: 0.8, ease: easeOut },
                  y: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8,
                  },
                }}
              >
                <Image
                  src="/ag.png"
                  alt="Floating island with tree"
                  width={550}
                  height={400}
                  className="object-contain drop-shadow-2xl pointer-events-none"
                />
              </motion.div>

              <motion.div
                className={`mx-auto flex h-[350px] w-[500px] z-10 top-0 translate-y-40 left-[50%] translate-x-[10%] bg-[#c8e639] rounded-full
                  ${
                     language === "en"
      ? "bg-[#c8e639]"
      : "bg-transparent"
                  }
                  `}
                variants={scaleIn}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.3 }}
              />
            </div>

            {isEnglish ? (
              <motion.div
                className="relative flex flex-row gap-8 text-2xl font-bold text-white drop-shadow-sm md:items-end"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <div className="relative flex flex-row gap-0 text-2xl font-bold text-white drop-shadow-sm md:items-end pl-24">
                  <motion.div variants={fadeUp}>
                    <p className={statLabelClass(language)}>
                      10,000+
                      <br />
                      Farmers
                      <br />
                      Benefited
                    </p>
                  </motion.div>

                  <motion.div
                    variants={scaleIn}
                    whileHover={{ scale: 1.06 }}
                     className={statCircleClass(language)}
                  >
                    95%
                  </motion.div>

                  <motion.div
                    variants={scaleIn}
                    whileHover={{ scale: 1.06 }}
                    className="mx-auto flex z-10 bg-[#121212] h-[250px] p-0 justify-center items-center rounded-b-full rounded-tl-full text-bold"
                  >
                    <p className={yieldLabelClass(language)}>
                      increased yields
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="relative flex flex-row items-stretch gap-8 text-2xl font-bold text-white drop-shadow-sm"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <div className="relative flex flex-row items-stretch gap-0 pl-24 w-full">
                  <motion.div variants={fadeUp} className="flex items-center py-4">
                    <p className={statLabelClass(language)}>
                      10,000+
                      <br />
                      Farmers
                      <br />
                      Benefited
                    </p>
                  </motion.div>

                  <motion.div
                    variants={scaleIn}
                    whileHover={{ scale: 1.06 }}
                    className="flex-shrink-0 flex z-10 bg-[#c8e639] w-[150px] h-full min-h-[150px] p-4 justify-center items-center rounded-t-full rounded-br-full text-black text-bold"
                  >
                    95%
                  </motion.div>

                  <motion.div
                    variants={scaleIn}
                    whileHover={{ scale: 1.06 }}
                    className="flex-shrink-0 flex z-10 bg-[#121212] w-[80px] h-full min-h-[200px] p-2 justify-center items-center rounded-b-full rounded-tl-full text-bold overflow-hidden"
                  >
                    <p className={yieldLabelClass(language)}>increased yields</p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="mt-5 grid grid-cols-1 gap-16 pb-16 md:grid-cols-[1fr_0.6fr_1fr]"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="relative flex flex-row gap-0 text-2xl font-bold text-white drop-shadow-sm md:items-end z-10">
              <motion.div
                variants={fadeUp}
                className="flex items-end p-2 bg-black"
              ><p className={introTextClass(language)}>
                  Modern farming solutions, technology, and expert support to
                  help farmers grow more.
                </p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="relative aspect-[2/2] min-h-[100px] overflow-hidden bg-[#1f2e14]"
              >
                <Image
                  src="/tomato.jpg"
                  alt="Seedling sprouting from soil"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>

            <motion.div
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col justify-center bg-white p-6 z-10 right-[300px] top-[1/2] translate-x-[350px] shadow-lg"
            >
              <h3 className="text-lg font-extrabold uppercase leading-tight text-neutral-900">
                INVEST IN
                <br />
                AGRICULTURE.
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                A tech-first marketplace connecting farmers and investors with
                transparent, performance-based funding.
              </p>
            </motion.div>
          </motion.div>
        </main>
      </div>
    
    </div>
      <HomeFooter/>
      </>
  );
}