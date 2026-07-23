'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMenu, FiX, FiActivity, FiArrowRight, FiSun, FiMoon } from 'react-icons/fi';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#why-choose-us' },
  { name: 'Services', href: '#services' },
  { name: 'Doctors', href: '#doctors' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [activeLink, setActiveLink] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Detect theme on mount to prevent hydration mismatch
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Monitor scroll to trigger active navbar styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border shadow-sm shadow-slate-100/10 py-3' 
            : 'bg-transparent border-b border-transparent py-5'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a href="#home" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
                <FiActivity className="h-5.5 w-5.5" />
              </div>
              <span className="font-bold text-xl text-heading tracking-tight">
                Medinexa<span className="text-secondary font-black">.</span>
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/30 p-1.5 rounded-full">
              {navLinks.map((link) => {
                const isActive = activeLink === link.name;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setActiveLink(link.name)}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-body hover:text-heading'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-white dark:bg-card shadow-sm border border-slate-200/50 dark:border-slate-800 rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {link.name}
                  </a>
                );
              })}
            </nav>

            {/* Actions Panel */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search Toggle */}
              <div className="relative flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.input
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 180, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      type="text"
                      placeholder="Quick search..."
                      className="border border-border rounded-full py-1.5 pl-4 pr-8 text-xs bg-slate-50 dark:bg-slate-800/60 outline-none focus:border-primary/50 focus:bg-white dark:focus:bg-slate-800"
                      autoFocus
                    />
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-body hover:text-heading hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <FiSearch className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-body hover:text-heading hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? (
                  <FiMoon className="h-4.5 w-4.5 text-slate-500 hover:text-primary transition-colors" />
                ) : (
                  <FiSun className="h-4.5 w-4.5 text-yellow-500 hover:text-amber-400 transition-colors" />
                )}
              </button>

              {/* Login Button */}
              <a 
                href="/login" 
                className="text-sm font-bold text-body hover:text-primary transition-colors px-3 py-2"
              >
                Login
              </a>

              {/* Get Started Button */}
              <motion.a
                href="/register"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-blue-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer overflow-hidden group"
              >
                {/* Glow highlight */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out" />
                <span>Get Started</span>
                <FiArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.a>
            </div>

            {/* Mobile Menu Actions Container */}
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white dark:bg-slate-800 text-heading hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm cursor-pointer"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? (
                  <FiMoon className="h-5 w-5 text-slate-500" />
                ) : (
                  <FiSun className="h-5 w-5 text-yellow-500" />
                )}
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white dark:bg-slate-800 text-heading hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm"
              >
                {isMobileMenuOpen ? <FiX className="h-5.5 w-5.5" /> : <FiMenu className="h-5.5 w-5.5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-[65px] left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-border shadow-lg"
          >
            <div className="px-5 py-6 space-y-5">
              {/* Search bar inside mobile menu */}
              <div className="relative">
                <FiSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search clinic, doctors..."
                  className="w-full rounded-xl border border-border bg-slate-50 dark:bg-slate-800/80 py-2.5 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-primary/50 focus:bg-white dark:focus:bg-card"
                />
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = activeLink === link.name;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => {
                        setActiveLink(link.name);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-primary/5 dark:bg-primary/10 text-primary' 
                          : 'text-body hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-heading'
                      }`}
                    >
                      {link.name}
                    </a>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/60 dark:border-slate-700/60">
                <a 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-11 items-center justify-center rounded-xl border border-border bg-transparent text-sm font-bold text-heading hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  Login
                </a>
                <a 
                  href="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white hover:bg-primary/95 transition-all shadow-sm shadow-primary/20"
                >
                  Get Started
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
