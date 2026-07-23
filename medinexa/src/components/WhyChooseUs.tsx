'use client';

import { motion, type Variants } from 'framer-motion';
import { 
  FiPhoneCall, FiAward, FiCalendar, 
  FiFolder, FiActivity, FiShield, FiArrowRight 
} from 'react-icons/fi';

const features = [
  {
    icon: FiPhoneCall,
    title: '24/7 Emergency Support',
    description: 'Instant patient dispatch and doctor routing pipelines. Get clinical emergency coordination with sub-3 minute response guarantees.',
    colorClass: 'from-orange-500/20 to-amber-500/20',
    iconBg: 'bg-accent/10 text-accent',
    badgeColor: 'bg-accent/5 dark:bg-accent/10 text-accent border-accent/20 dark:border-accent/30',
    hoverClass: 'hover:shadow-[0_20px_50px_rgba(249,115,22,0.06)] hover:border-accent/30'
  },
  {
    icon: FiAward,
    title: 'Expert Medical Team',
    description: 'Verified qualifications, ratings, and roster schedules of board-certified clinical experts, synchronized in real-time.',
    colorClass: 'from-blue-500/20 to-primary/20',
    iconBg: 'bg-primary/10 text-primary',
    badgeColor: 'bg-primary/5 dark:bg-primary/10 text-primary border-primary/20 dark:border-primary/30',
    hoverClass: 'hover:shadow-[0_20px_50px_rgba(37,99,235,0.06)] hover:border-primary/30'
  },
  {
    icon: FiCalendar,
    title: 'Smart Appointment Scheduling',
    description: 'Autonomous patient scheduling with SMS notifications and custom calendars integrated into doctor calendars.',
    colorClass: 'from-teal-500/20 to-secondary/20',
    iconBg: 'bg-secondary/10 text-secondary',
    badgeColor: 'bg-secondary/5 dark:bg-secondary/10 text-secondary border-secondary/20 dark:border-secondary/30',
    hoverClass: 'hover:shadow-[0_20px_50px_rgba(20,184,166,0.06)] hover:border-secondary/30'
  },
  {
    icon: FiFolder,
    title: 'Digital Medical Records (EMR)',
    description: 'Secure, indexed electronic health database allowing real-time history inspection, prescription updates, and diagnostic reports.',
    colorClass: 'from-teal-500/20 to-secondary/20',
    iconBg: 'bg-secondary/10 text-secondary',
    badgeColor: 'bg-secondary/5 dark:bg-secondary/10 text-secondary border-secondary/20 dark:border-secondary/30',
    hoverClass: 'hover:shadow-[0_20px_50px_rgba(20,184,166,0.06)] hover:border-secondary/30'
  },
  {
    icon: FiActivity,
    title: 'Fast Laboratory Service',
    description: 'Accelerated diagnostic queues connecting clinics directly to pathology labs. Results processed and push-notified automatically.',
    colorClass: 'from-blue-500/20 to-primary/20',
    iconBg: 'bg-primary/10 text-primary',
    badgeColor: 'bg-primary/5 dark:bg-primary/10 text-primary border-primary/20 dark:border-primary/30',
    hoverClass: 'hover:shadow-[0_20px_50px_rgba(37,99,235,0.06)] hover:border-primary/30'
  },
  {
    icon: FiShield,
    title: 'Secure Patient Data',
    description: 'HIPAA and GDPR-compliant encryption standards guarding communications, payment logs, and clinical history files.',
    colorClass: 'from-orange-500/20 to-amber-500/20',
    iconBg: 'bg-accent/10 text-accent',
    badgeColor: 'bg-accent/5 dark:bg-accent/10 text-accent border-accent/20 dark:border-accent/30',
    hoverClass: 'hover:shadow-[0_20px_50px_rgba(249,115,22,0.06)] hover:border-accent/30'
  }
];

export default function WhyChooseUs() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="services" className="relative py-28 overflow-hidden bg-slate-50 dark:bg-slate-900/20">
      {/* Background shape */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-slate-200/50 dark:from-slate-800/40 to-transparent blur-3xl -z-10 opacity-60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-wider uppercase mb-4"
          >
            <span>Why Choose Medinexa</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading tracking-tight mb-5 leading-tight"
          >
            Engineered for Modern Clinical Excellence
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-body font-medium"
          >
            Designed with inputs from healthcare professionals, Medinexa delivers security, performance, and simplicity. We handle the complexity so you can focus on patient care.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className={`group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6.5 shadow-sm shadow-slate-100/50 dark:shadow-none transition-all duration-300 ${feature.hoverClass}`}
              >
                {/* Glow Background Gradient effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 ${feature.colorClass}`} />
                
                <div>
                  {/* Top Bar inside Card: Icon + Category Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105 duration-300 ${feature.iconBg}`}>
                      <Icon className="h-5.5 w-5.5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${feature.badgeColor}`}>
                      Features
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-heading mb-3 group-hover:text-primary transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-body leading-relaxed mb-6 font-medium">
                    {feature.description}
                  </p>
                </div>

                {/* Learn More link */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary cursor-pointer group-hover:gap-2 transition-all">
                  <span>Learn details</span>
                  <FiArrowRight className="h-3.5 w-3.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
