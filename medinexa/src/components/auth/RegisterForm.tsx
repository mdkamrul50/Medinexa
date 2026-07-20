'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiActivity, FiPhone, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { FaApple, FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { authClient } from '@/lib/auth-client';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

const strengthConfig = [
  { level: 0, label: '', color: 'bg-slate-200 dark:bg-slate-700' },
  { level: 1, label: 'Weak', color: 'bg-red-500' },
  { level: 2, label: 'Fair', color: 'bg-orange-500' },
  { level: 3, label: 'Good', color: 'bg-yellow-500' },
  { level: 4, label: 'Strong', color: 'bg-emerald-500' },
];

export default function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptTerms) {
      setError('You must accept the Terms of Service and Privacy Policy');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 5) {
      setError('Password must be at least 5 characters');
      return;
    }

    if (!/[a-zA-Z]/.test(password)) {
      setError('Password must contain at least one letter');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number');
      return;
    }

    setIsLoading(true);

    const { error: signUpError } = await authClient.signUp.email({
      name: `${firstName} ${lastName}`.trim(),
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message || signUpError.statusText || 'Registration failed');
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  const getPasswordStrength = () => {
    if (!password) return { level: 0 };
    const len = password.length;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (len < 5) return { level: 1 };
    if (len < 8 || !hasLetter || !hasNumber) return { level: 2 };
    if (len < 12) return { level: 3 };
    return { level: 4 };
  };

  const strength = getPasswordStrength();
  const currentStrength = strengthConfig[strength.level];

  const inputBase =
    'w-full pl-11 pr-4 py-3.5 rounded-xl border bg-slate-50/80 dark:bg-slate-800/40 text-sm font-medium text-heading placeholder:text-muted/50 outline-none transition-all duration-300';

  const inputFocus = (field: string) =>
    focusedField === field
      ? 'border-primary shadow-lg shadow-primary/15 ring-4 ring-primary/10'
      : 'border-border group-hover:border-slate-300 dark:group-hover:border-slate-600';

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
        className="relative rounded-3xl border border-border/40 bg-card/50 backdrop-blur-2xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 p-8 sm:p-10 lg:p-12 overflow-hidden"
      >
        <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-80" />

        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />

        <form onSubmit={handleSubmit} className="relative space-y-5">
          <motion.div variants={itemVariants} className="text-center">
            <div className="relative inline-flex mb-5">
              <div className="absolute -inset-3 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-2xl blur-lg" />
              <motion.div
                whileHover={{ scale: 1.05, rotate: -3 }}
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/25"
              >
                <FiActivity className="h-8 w-8" />
              </motion.div>
            </div>
            <h1 className="text-[26px] sm:text-[28px] font-bold text-heading tracking-tight leading-tight">
              Create your account
            </h1>
            <p className="text-sm text-body mt-1.5 max-w-xs mx-auto leading-relaxed">
              Get started with Medinexa healthcare platform
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-sm font-semibold text-heading tracking-tight">
                First name
              </label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted group-focus-within:text-primary transition-colors duration-300 pointer-events-none" />
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="John"
                  autoComplete="given-name"
                  className={`${inputBase} ${inputFocus('firstName')}`}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-sm font-semibold text-heading tracking-tight">
                Last name
              </label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted group-focus-within:text-primary transition-colors duration-300 pointer-events-none" />
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Doe"
                  autoComplete="family-name"
                  className={`${inputBase} ${inputFocus('lastName')}`}
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="regEmail" className="text-sm font-semibold text-heading tracking-tight">
                Email address
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted group-focus-within:text-primary transition-colors duration-300 pointer-events-none" />
                <input
                  id="regEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('regEmail')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@hospital.com"
                  autoComplete="email"
                  className={`${inputBase} ${inputFocus('regEmail')}`}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-semibold text-heading tracking-tight">
                Phone number
              </label>
              <div className="relative group">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted group-focus-within:text-primary transition-colors duration-300 pointer-events-none" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="+1 (555) 000-0000"
                  autoComplete="tel"
                  className={`${inputBase} ${inputFocus('phone')}`}
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1.5">
            <label htmlFor="regPassword" className="text-sm font-semibold text-heading tracking-tight">
              Password
            </label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted group-focus-within:text-primary transition-colors duration-300 pointer-events-none" />
              <input
                id="regPassword"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('regPassword')}
                onBlur={() => setFocusedField(null)}
                placeholder="Create a strong password"
                autoComplete="new-password"
                className={`${inputBase} pr-12 ${inputFocus('regPassword')}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff className="h-4.5 w-4.5" /> : <FiEye className="h-4.5 w-4.5" />}
              </button>
            </div>
            {password && (
              <div className="pt-2 space-y-2">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                        level <= strength.level
                          ? currentStrength.color
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ${currentStrength.color.replace('bg-', 'text-')}`}>
                  {currentStrength.label}
                  {currentStrength.label && ' password'}
                </p>
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-heading tracking-tight">
              Confirm password
            </label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted group-focus-within:text-primary transition-colors duration-300 pointer-events-none" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                className={`${inputBase} pr-12 ${inputFocus('confirmPassword')}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <FiEyeOff className="h-4.5 w-4.5" /> : <FiEye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <div
                onClick={() => setAcceptTerms(!acceptTerms)}
                className={`mt-0.5 h-5 w-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                  acceptTerms
                    ? 'bg-primary border-primary shadow-sm shadow-primary/25'
                    : 'border-border group-hover:border-slate-300 dark:group-hover:border-slate-600'
                }`}
              >
                {acceptTerms && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </div>
              <span className="text-sm text-body group-hover:text-heading transition-colors leading-relaxed">
                I accept the{' '}
                <a href="/terms" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  Privacy Policy
                </a>
              </span>
            </label>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3"
            >
              <FiAlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
              <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={isLoading ? {} : { scale: 1.02, boxShadow: '0 8px 30px rgba(37, 99, 235, 0.3)' }}
              whileTap={isLoading ? {} : { scale: 0.98 }}
              className="relative w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-semibold text-[15px] shadow-md shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow overflow-hidden group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out" />
              {isLoading ? (
                <FiLoader className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-card/70 backdrop-blur-xl px-4 text-muted font-medium">
                Or continue with
              </span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
            {[
              { icon: <FcGoogle className="h-5 w-5" />, label: 'Google' },
              { icon: <FaApple className="h-5 w-5 text-heading" />, label: 'Apple' },
              {
                icon: <FaFacebook className="h-5 w-5" style={{ color: '#1877F2' }} />,
                label: 'Facebook',
              },
            ].map(({ icon, label }) => (
              <motion.button
                key={label}
                type="button"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center py-3 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all"
                aria-label={`Sign up with ${label}`}
              >
                {icon}
              </motion.button>
            ))}
          </motion.div>

          <motion.p variants={itemVariants} className="text-center text-sm text-body">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </a>
          </motion.p>
        </form>
      </motion.div>
    </motion.div>
  );
}
