'use client';

import { motion } from 'framer-motion';
import { FiPlay, FiArrowRight, FiUsers, FiClock, FiActivity } from 'react-icons/fi';
import DashboardMockup from './DashboardMockup';

export default function Hero() {
  // Stagger children transition
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Mock trust partners
  const trustPartners = [
    { name: 'Mayo Clinic Health', icon: 'M' },
    { name: 'Johns Hopkins Net', icon: 'J' },
    { name: 'Mount Sinai System', icon: 'S' },
    { name: 'Cleveland Systems', icon: 'C' },
    { name: 'St. Jude Alliance', icon: 'H' },
  ];

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-background flex flex-col justify-center transition-all duration-300">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 dark:opacity-20" />

      {/* Floating Animated Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full bg-gradient-to-tr from-primary/20 to-transparent blur-3xl animate-float -z-10 opacity-70" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] md:w-[450px] h-[300px] md:h-[450px] rounded-full bg-gradient-to-tr from-secondary/20 to-transparent blur-3xl animate-float-reverse -z-10 opacity-70" />
      <div className="absolute top-1/3 right-1/3 translate-x-1/3 w-[200px] h-[200px] rounded-full bg-accent/8 blur-2xl animate-float -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Hero Left: Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Emergency badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 dark:bg-accent/10 text-accent text-xs font-bold tracking-wider uppercase mb-6 shadow-sm shadow-accent/5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span>24/7 Premium Emergency Support</span>
            </motion.div>

            {/* Premium Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-heading leading-[1.1] tracking-tight mb-6"
            >
              Transforming Healthcare Through{' '}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent">
                Smart Operations.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-body max-w-xl mb-8 leading-relaxed font-semibold"
            >
              Unified hospital management SaaS built to streamline doctor workflows, secure patient records, and optimize critical laboratory resources on a single premium platform.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              {/* Primary button */}
              <motion.a
                href="#get-started"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 transition-all cursor-pointer group overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out" />
                <span>Get Started Now</span>
                <FiArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.a>

              {/* Secondary button */}
              <motion.a
                href="#demo"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/60 dark:bg-slate-900/40 backdrop-blur-sm px-8 py-4 text-base font-bold text-heading shadow-sm hover:border-slate-350 dark:hover:border-slate-700 transition-all"
              >
                <FiPlay className="h-4 w-4 text-primary fill-primary/10" />
                <span>Book Demo</span>
              </motion.a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              variants={itemVariants}
              className="mt-14 pt-8 border-t border-border/80 dark:border-slate-800/80 w-full"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
                Trusted by Leading Medical Institutions
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-8 gap-y-4 opacity-75 dark:opacity-85">
                {trustPartners.map((partner, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-heading font-semibold hover:opacity-100 transition-all duration-300">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 border border-border text-[10px] font-black text-slate-750 dark:text-slate-300">
                      {partner.icon}
                    </div>
                    <span className="text-xs tracking-tight text-body">{partner.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Right: Mockup + Floating Badges */}
          <div className="lg:col-span-6 relative mt-12 lg:mt-0 flex justify-center items-center">
            <div className="w-full max-w-[620px] relative px-4 sm:px-6">
              
              {/* Radial glow background layer behind dashboard mockup */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-secondary/15 rounded-3xl blur-3xl -z-10 opacity-80" />

              {/* Main Dashboard Mockup */}
              <DashboardMockup />

              {/* Floating Badge 1: Patient Statistics */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -right-2 top-10 hidden sm:flex items-center gap-3.5 rounded-2xl border border-border bg-card/90 dark:bg-slate-900/90 p-3.5 shadow-xl backdrop-blur-md max-w-[210px] transition-all duration-300 hover:shadow-2xl"
                style={{ y: useFloatAnimation(0) }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FiUsers className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Active Patients</p>
                  <p className="text-base font-extrabold text-heading leading-tight">12,840</p>
                  <span className="text-[9px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded">+18.2% this mo.</span>
                </div>
              </motion.div>

              {/* Floating Badge 2: Doctor Availability Badge */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="absolute -left-6 bottom-16 hidden sm:flex items-center gap-3.5 rounded-2xl border border-border bg-card/90 dark:bg-slate-900/90 p-3.5 shadow-xl backdrop-blur-md max-w-[225px] transition-all duration-300 hover:shadow-2xl"
                style={{ y: useFloatAnimation(1.5) }}
              >
                <div className="flex -space-x-2 shrink-0">
                  {[
                    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=80&q=80',
                    'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=80&q=80',
                    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=80&q=80'
                  ].map((url, i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden bg-slate-100">
                      <img src={url} alt="Doctor avatar" className="h-full w-full object-cover" />
                    </div>
                  ))}
                  <div className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-800 bg-secondary/15 flex items-center justify-center text-[10px] font-bold text-secondary">
                    +15
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Specialists Online</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-heading">18 Available</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge 3: Emergency response rate */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute right-12 -bottom-6 hidden sm:flex items-center gap-3 rounded-2xl border border-border bg-card/90 dark:bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl"
                style={{ y: useFloatAnimation(3) }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <FiClock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-muted uppercase tracking-wider">Response Rate</p>
                  <p className="text-xs font-extrabold text-heading leading-tight">&lt; 3 mins avg.</p>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// React hook to run floating animations in Framer Motion format without triggering hydration mismatch.
import { useTransform, useTime } from 'framer-motion';
function useFloatAnimation(offsetSeconds: number) {
  const time = useTime();
  // We compute a smooth sine wave using the hook
  return useTransform(
    time,
    (latest) => Math.sin((latest / 1000) + offsetSeconds) * 10
  );
}
