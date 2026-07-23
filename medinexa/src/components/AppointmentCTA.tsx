'use client';

import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight, FiCalendar, FiClock, FiStar } from 'react-icons/fi';
import { FaCheckCircle, FaUserCheck, FaRegChartBar } from 'react-icons/fa';

const benefits = [
  'Direct booking with board-certified clinical specialists',
  'Instant WhatsApp & SMS confirmation alerts',
  'Fully secure, HIPAA-compliant patient EMR portal',
  'Emergency clinical routing coordination in under 3 minutes'
];

export default function AppointmentCTA() {
  // Slow drift animations for individual layered cards
  const cardFloat = (delay: number) => ({
    animate: {
      y: [0, -8, 0] as number[],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: delay
      }
    }
  });

  return (
    <section id="contact" className="relative py-28 overflow-hidden bg-slate-50 dark:bg-slate-900/20 border-t border-border/30">
      
      {/* Background Glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-secondary/5 dark:bg-secondary/10 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* =========================================================
              Left Side - Copy and Action
              ========================================================= */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-wider uppercase mb-4"
            >
              <span>Instant Scheduling</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3.5xl sm:text-4.5xl md:text-5xl font-extrabold text-heading tracking-tight mb-6 leading-tight"
            >
              Ready to Consult the Best Specialists?
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-body font-medium mb-8"
            >
              Skip the long queues. Secure your online or offline appointment with board-certified clinical experts. Access prescriptions and diagnostics instantly.
            </motion.p>

            {/* Benefits Checklist */}
            <ul className="space-y-4 mb-10 w-full">
              {benefits.map((benefit, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + idx * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <FiCheck className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm sm:text-base text-body font-semibold">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            {/* Action buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4 w-full sm:w-auto"
            >
              <motion.a
                href="/register"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer group"
              >
                <span>Book Appointment</span>
                <FiArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.a>

              <motion.a
                href="#doctors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-white hover:bg-slate-100 px-6 py-3.5 text-sm font-bold text-body hover:text-heading transition-all cursor-pointer"
              >
                <span>View Roster Schedule</span>
              </motion.a>
            </motion.div>
          </div>

          {/* =========================================================
              Right Side - Floating Layered Mockups
              ========================================================= */}
          <div className="lg:col-span-6 relative w-full h-[450px] md:h-[500px] flex items-center justify-center select-none mt-10 lg:mt-0">
            
            {/* 1. Underlying Main Frame (Dashboard Calendar base) */}
            <motion.div 
              {...cardFloat(0)}
              className="absolute w-[80%] md:w-[70%] aspect-[4/3] bg-white dark:bg-slate-950/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-5"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-primary h-4 w-4" />
                  <span className="text-xs font-bold text-heading">Clinic Scheduler</span>
                </div>
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-muted mb-2">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-heading">
                <span className="text-muted/40">28</span><span className="text-muted/40">29</span><span className="text-muted/40">30</span>
                <span className="p-1 rounded bg-primary/10 text-primary border border-primary/20">1</span>
                <span>2</span><span>3</span><span>4</span>
                <span>5</span><span>6</span><span className="p-1 rounded bg-secondary/15 text-secondary border border-secondary/20">7</span>
                <span>8</span><span>9</span><span>10</span><span>11</span>
              </div>
            </motion.div>

            {/* 2. Doctor Card (Floating Top-Right) */}
            <motion.div 
              {...cardFloat(1.5)}
              className="absolute -top-4 right-[5%] w-[48%] bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-lg p-4 flex gap-3 items-center z-10 hover:shadow-xl transition-all"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&h=100&q=80" 
                alt="Sarah Jenkins"
                className="h-10 w-10 rounded-full object-cover shadow-sm shrink-0 border border-border"
              />
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-heading leading-tight truncate">Dr. Sarah Johnson</p>
                <p className="text-[9px] text-primary font-bold">Chief Cardiologist</p>
                <div className="flex items-center gap-0.5 mt-1">
                  <FiStar className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                  <span className="text-[9px] font-bold text-heading">4.9</span>
                </div>
              </div>
            </motion.div>

            {/* 3. Patient Queue Status Card (Floating Left-Middle) */}
            <motion.div 
              {...cardFloat(0.8)}
              className="absolute bottom-16 -left-[2%] w-[45%] bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/85 rounded-2xl shadow-lg p-4 z-10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-muted uppercase">Active Queue</span>
                <span className="text-[8px] font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded-full border border-secondary/20">Synced</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FaUserCheck className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold text-heading truncate leading-tight">Patient admission #492</p>
                  <p className="text-[8px] text-muted mt-0.5 font-semibold">2 min remaining</p>
                </div>
              </div>
            </motion.div>

            {/* 4. Success Notification card (Floating Top-Left) */}
            <motion.div 
              {...cardFloat(2.2)}
              className="absolute top-10 left-[8%] bg-white dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 rounded-full shadow-lg px-4 py-2 flex items-center gap-2 z-20 border-l-4 border-l-emerald-500"
            >
              <FaCheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-heading whitespace-nowrap">Appointment Booked!</span>
            </motion.div>

            {/* 5. Floating Analytics Card (Floating Bottom-Right) */}
            <motion.div 
              {...cardFloat(1.2)}
              className="absolute -bottom-2 right-[2%] w-[48%] bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl p-4 z-10 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[9px] font-bold text-muted uppercase">Weekly Intake</span>
                <FaRegChartBar className="text-secondary h-3 w-3" />
              </div>
              
              <div className="flex items-baseline gap-2.5">
                <span className="text-xl font-bold text-heading tracking-tight">1,280</span>
                <span className="text-[9px] font-bold text-emerald-500 leading-none">+12.5%</span>
              </div>
              
              {/* Mini visual SVG chart */}
              <div className="flex items-end justify-between gap-1 h-8 mt-2 px-0.5">
                {[30, 45, 25, 60, 40, 75, 90].map((h, i) => (
                  <div 
                    key={i} 
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-sm ${i === 6 ? 'bg-gradient-to-t from-secondary to-teal-400' : 'bg-slate-100 dark:bg-slate-800'}`} 
                  />
                ))}
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
