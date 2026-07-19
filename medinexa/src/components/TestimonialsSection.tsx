'use client';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { FaStar, FaCheckCircle, FaQuoteLeft } from 'react-icons/fa';
import { FiUsers, FiAward, FiHeart, FiClock } from 'react-icons/fi';

// Counter component for stats strip
function AnimatedCounter({ value, suffix = '', duration = 1.5 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);

    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <span ref={ref} className="tabular-nums font-black text-4xl sm:text-5xl text-heading tracking-tight">
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

interface Testimonial {
  avatar: string;
  name: string;
  city: string;
  rating: number;
  treatment: string;
  text: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    name: 'Emily Watson',
    city: 'San Francisco, CA',
    rating: 5,
    treatment: 'Cardiology Care',
    text: 'The medical care I received through Medinexa was top-notch. Booking was super fast, and the dashboard kept all my reports perfectly organized. Highly recommend their expert team!',
    verified: true
  },
  {
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    name: 'Marcus Vance',
    city: 'Austin, TX',
    rating: 5,
    treatment: 'Neurological Checkup',
    text: 'Consulting with a senior neurologist was never this smooth. The appointment scheduling saved me hours. The absolute gold standard of patient-centric digital health systems.',
    verified: true
  },
  {
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    name: 'Sophia Martinez',
    city: 'New York, NY',
    rating: 5,
    treatment: 'Pediatric Care',
    text: 'As a mother, finding trustable pediatricians quickly is essential. The pediatrician was highly compassionate, and the dashboard analytics were clear. Five-star support!',
    verified: true
  },
  {
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    name: 'Liam O\'Connor',
    city: 'Chicago, IL',
    rating: 5,
    treatment: 'Orthopedic Rehabilitation',
    text: 'Recovering from a knee injury was manageable thanks to the online recovery reports and prompt physiotherapist feedback. Truly exceptional and modern service.',
    verified: true
  },
  {
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80',
    name: 'Jessica Alwi',
    city: 'Seattle, WA',
    rating: 5,
    treatment: 'Dental Care',
    text: 'Outstanding clinic infrastructure and friendly dentists. The platform makes prescription updates and treatment follow-ups completely stress-free. Very convenient.',
    verified: true
  },
  {
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80',
    name: 'Daniel Smith',
    city: 'Los Angeles, CA',
    rating: 5,
    treatment: 'General Medicine',
    text: 'The best hospital portal I have ever used. Everything from consulting a doctor to obtaining lab results is beautifully automated. Medical care at its finest.',
    verified: true
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 15 }
  }
};

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-28 overflow-hidden bg-white dark:bg-slate-950/20 border-t border-border/30">
      
      {/* Decorative Floating Blobs */}
      <div className="absolute top-20 right-[15%] w-72 h-72 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 left-[15%] w-72 h-72 rounded-full bg-secondary/5 blur-3xl -z-10 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================================
            Statistics Strip
            ========================================================= */}
        <div className="mb-24 rounded-3xl border border-border/80 bg-slate-50/80 dark:bg-slate-900/70 backdrop-blur-xl p-8 md:p-12 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-2xl" />
          
          <div className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
              <FiUsers className="h-5.5 w-5.5" />
            </div>
            <AnimatedCounter value={50000} suffix="+" />
            <span className="text-xs font-bold text-muted uppercase mt-2 tracking-wider">Patients Served</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary mb-4">
              <FiAward className="h-5.5 w-5.5" />
            </div>
            <AnimatedCounter value={300} suffix="+" />
            <span className="text-xs font-bold text-muted uppercase mt-2 tracking-wider">Expert Doctors</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
              <FiHeart className="h-5.5 w-5.5" />
            </div>
            <AnimatedCounter value={98} suffix="%" />
            <span className="text-xs font-bold text-muted uppercase mt-2 tracking-wider">Satisfaction Rate</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
              <FiClock className="h-5.5 w-5.5" />
            </div>
            <span className="font-black text-4xl sm:text-5xl text-heading tracking-tight">24/7</span>
            <span className="text-xs font-bold text-muted uppercase mt-2 tracking-wider">Emergency Support</span>
          </div>
        </div>

        {/* =========================================================
            Section Header
            ========================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-wider uppercase mb-4"
          >
            <span>Patient Testimonials</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading tracking-tight mb-5 leading-tight"
          >
            Trusted by Thousands of Patients
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-body font-medium"
          >
            Real experiences from patients who received exceptional healthcare through our platform.
          </motion.p>
        </div>

        {/* =========================================================
            Testimonials Grid
            ========================================================= */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] border border-border/80 hover:border-primary/30 p-8 shadow-sm hover:shadow-[0_25px_60px_rgba(59,130,246,0.06)] transition-all duration-500 overflow-hidden flex flex-col justify-between"
            >
              {/* Gradient Accent Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/3 to-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              <div>
                {/* Quote Icon & Category Badge */}
                <div className="flex items-center justify-between mb-6">
                  <FaQuoteLeft className="h-6 w-6 text-primary/10 group-hover:text-primary/20 transition-colors" />
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary tracking-wide uppercase">
                    {test.treatment}
                  </span>
                </div>

                {/* Rating stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(test.rating)].map((_, i) => (
                    <FaStar key={i} className="h-4.5 w-4.5 text-amber-500" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-sm sm:text-base text-body font-medium leading-relaxed mb-6 group-hover:text-heading transition-colors duration-300">
                  "{test.text}"
                </p>
              </div>

              {/* Patient Profile */}
              <div className="flex items-center justify-between pt-6 border-t border-border/40 mt-auto">
                <div className="flex items-center gap-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={test.avatar} 
                    alt={test.name} 
                    className="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-heading group-hover:text-primary transition-colors leading-tight">
                      {test.name}
                    </h4>
                    <p className="text-xs font-semibold text-muted mt-0.5">{test.city}</p>
                  </div>
                </div>

                {test.verified && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-sm">
                    <FaCheckCircle className="h-3 w-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
