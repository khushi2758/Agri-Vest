"use client";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import Model from '@/public/Tree';
import { Suspense } from "react";
import Image from 'next/image';
import crops from '@/public/fild2.jpg';
import { Poppins } from 'next/font/google';
import { motion } from 'motion/react';
import NavBar from '@/app/[locale]/navbar';
import { useTranslations } from 'next-intl';
import Footer from '../Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function page() {
  const t = useTranslations('home');
  const router = useRouter();
  const [isLandowner, setIsLandowner] = useState(false);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const user = await res.json();
          if (user.roles && user.roles.includes('landowner')) {
            setIsLandowner(true);
          }
        }
      } catch (err) {}
    }
    checkUser();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#c7cdb9] font-sans px-14">
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
              <h1 className="text-6xl font-extrabold uppercase leading-[0.95] tracking-tight text-white drop-shadow-sm md:text-7xl">
                {t('header')}
                <br />
                Farming
              </h1>
              <motion.div
                className="mt-8 flex flex-wrap items-center gap-4"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.button
                  variants={fadeUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => router.push('/en/Explore')}
                  className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Explore Farms
                </motion.button>
                {!isLandowner && (
                  <motion.button
                    variants={fadeUp}
                    onClick={() => router.push('/en/Farmers/register')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
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
                  className="object-contain drop-shadow-2xl  pointer-events-none"
                   
                />
              </motion.div>

              <motion.div
                className="mx-auto flex h-[350px] w-[500px] z-10 top-0 translate-y-40 left-[50%] translate-x-[10%] bg-[#c8e639] rounded-full"
                variants={scaleIn}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.3 }}
              />
            </div>

            <motion.div
              className="relative flex flex-row gap-8 text-2xl font-bold text-white drop-shadow-sm md:items-end"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <div className="relative flex flex-row gap-0 text-2xl font-bold text-white drop-shadow-sm md:items-end pl-24">
                <motion.div variants={fadeUp}>
                  <p className="text-xl font-extrabold uppercase tracking-tight text-white drop-shadow-sm md:text-2xl pr-15">
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
                  className="mx-auto flex z-10 bg-[#c8e639] h-[150px] p-4 justify-center items-center rounded-t-full rounded-br-full text-black text-bold"
                >
                  95%
                </motion.div>

                <motion.div
                  variants={scaleIn}
                  whileHover={{ scale: 1.06 }}
                  className="mx-auto flex z-10 bg-[#121212] h-[250px] p-0 justify-center items-center rounded-b-full rounded-tl-full text-bold"
                >
                  <p className="text-white rotate-[-90deg]">increased yields</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-5 grid grid-cols-1 gap-16 pb-16 md:grid-cols-[1fr_0.6fr_1fr]"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="relative flex flex-row gap-0 text-2xl font-bold text-white drop-shadow-sm md:items-end z-10">
              <motion.div variants={fadeUp} className="flex items-end p-2 bg-black">
                <p className="max-w-xs text-xl font-light text-neutral-100">
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
  );
}