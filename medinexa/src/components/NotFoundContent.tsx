'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiActivity, FiArrowLeft, FiHome } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.04, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export default function NotFoundContent() {
  const router = useRouter();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative"
    >
      <div className="absolute -inset-6 bg-gradient-to-br from-primary/15 via-secondary/5 to-transparent rounded-3xl blur-3xl opacity-60 dark:opacity-40" />

      <motion.div
        variants={cardVariants}
        className="relative rounded-3xl border border-border/40 bg-card/50 backdrop-blur-2xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 p-10 sm:p-12 overflow-hidden"
      >
        <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-80" />

        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />

        <div className="relative text-center space-y-6">
          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.div
              variants={pulseVariants}
              animate="animate"
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/25"
            >
              <FiActivity className="h-8 w-8" />
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-[120px] sm:text-[140px] font-black leading-none tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              404
            </h1>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl sm:text-3xl font-bold text-heading tracking-tight">
              Page Not Found
            </h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-body text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <motion.a
              href="/"
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(37, 99, 235, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-semibold text-sm shadow-md shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out" />
              <FiHome className="h-4.5 w-4.5" />
              <span>Back to Home</span>
            </motion.a>

            <motion.button
              onClick={() => router.back()}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-border bg-slate-50/50 dark:bg-slate-800/20 text-heading font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer"
            >
              <FiArrowLeft className="h-4.5 w-4.5" />
              <span>Go Back</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
