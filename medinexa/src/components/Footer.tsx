'use client';

import { motion } from 'framer-motion';
import { FiActivity, FiMail, FiPhone, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import { FaTwitter, FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <footer className="relative bg-slate-950 text-slate-400 pt-40 pb-12 border-t border-slate-900 overflow-hidden">

      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-secondary/5 blur-3xl -z-10 pointer-events-none" />

      {/* =========================================================
          1. Newsletter Subscription Card (Overlaying FAQ/Footer transition)
          ========================================================= */}
      <div className="absolute top-0 left-0 right-0 -translate-y-1/2 z-25 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 text-left">
              <span className="text-xs font-bold text-primary tracking-widest uppercase mb-2 block">
                Newsletter
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                Stay Updated on Healthcare Innovations
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                Get medical updates, clinical insights, and health advice delivered straight to your inbox.
              </p>
            </div>

            <div className="lg:col-span-5 w-full">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-primary/50 text-sm font-semibold transition-colors"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-sm shadow-md shadow-primary/20 transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <FiArrowRight className="h-4 w-4" />
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* =========================================================
            2. Main Footer Columns Grid
            ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-slate-900 text-left">

          {/* Brand/Logo Column */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-6">
            <a href="#home" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
                <FiActivity className="h-5.5 w-5.5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Medinexa<span className="text-secondary font-black">.</span>
              </span>
            </a>

            <p className="text-sm font-medium text-slate-400 max-w-sm leading-relaxed">
              Next-gen operations unified for modern clinics. Streamlining patient diagnostics, admissions, and appointment routing with bank-grade safety.
            </p>

            {/* Social Icons list */}
            <div className="flex items-center gap-4">
              {[
                { icon: FaTwitter, href: '#twitter', label: 'Twitter' },
                { icon: FaGithub, href: '#github', label: 'Github' },
                { icon: FaLinkedin, href: '#linkedin', label: 'LinkedIn' },
                { icon: FaYoutube, href: '#youtube', label: 'YouTube' }
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={idx}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-900 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors shadow-sm"
                    aria-label={social.label}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Services', 'Doctors', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Services</h4>
            <ul className="space-y-3">
              {[
                'Appointment Booking',
                'Emergency Care',
                'Laboratory',
                'Pharmacy',
                'Medical Records'
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Support</h4>
            <ul className="space-y-3">
              {[
                'Help Center',
                'Privacy Policy',
                'Terms & Conditions',
                'Contact Support',
                'FAQ'
              ].map((support) => (
                <li key={support}>
                  <a
                    href="#support"
                    className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {support}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info column */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="h-4 w-4 text-primary shrink-0 mt-1" />
                <span className="text-xs font-semibold leading-relaxed text-slate-450">
                  121 Clinical Way, Suite 400, New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-semibold text-slate-450">+1 (800) 555-0199</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-semibold text-slate-450">hello@medinexa.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiClock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="text-[11px] font-semibold text-slate-450 leading-tight">
                  <p>Mon - Sun: 24/7</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">Emergency support active</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* =========================================================
            3. Bottom Copyright & Compliance Footer
            ========================================================= */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 text-xs font-semibold text-slate-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6">
            <span>© {currentYear} Medinexa Inc. All rights reserved.</span>
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-slate-400 transition-colors">Cookie Settings</a>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <span>Made with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>for Better Healthcare</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
