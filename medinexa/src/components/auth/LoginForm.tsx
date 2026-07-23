'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiActivity, FiAlertCircle, FiLoader, FiUserPlus } from 'react-icons/fi';
import { authClient } from '@/lib/auth-client';
import { getDefaultRouteForRole, type UserRole } from '@/lib/auth-utils';

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

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect && redirect.startsWith('/')) {
      setRedirectTo(redirect);
    }
  }, [searchParams]);

  const getPostLoginRedirect = (role: UserRole | null): string => {
    if (redirectTo) return redirectTo;
    if (role) return getDefaultRouteForRole(role);
    return '/dashboard';
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email: 'demo@medinexa.com',
      password: 'Demo12345',
      rememberMe: false,
    });

    if (signInError) {
      setError('Demo account not found. Please register first.');
      setIsLoading(false);
      return;
    }

    const { data: sessionData } = await authClient.getSession();
    const role = (sessionData?.user as { role?: UserRole })?.role ?? null;
    setIsLoading(false);
    router.push(getPostLoginRedirect(role));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });

    if (signInError) {
      setError(signInError.message ?? 'Invalid email or password');
      setIsLoading(false);
      return;
    }

    const { data: sessionData } = await authClient.getSession();
    const role = (sessionData?.user as { role?: UserRole })?.role ?? null;
    setIsLoading(false);
    router.push(getPostLoginRedirect(role));
  };

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

        <form onSubmit={handleSubmit} className="relative space-y-6">
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
              Welcome back
            </h1>
            <p className="text-sm text-body mt-1.5 max-w-xs mx-auto leading-relaxed">
              Sign in to access your healthcare dashboard
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-heading tracking-tight">
              Email address
            </label>
            <div className="relative group">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted group-focus-within:text-primary transition-colors duration-300 pointer-events-none" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="you@hospital.com"
                autoComplete="email"
                className={`w-full pl-11 pr-4 py-3.5 rounded-xl border bg-slate-50/80 dark:bg-slate-800/40 text-sm font-medium text-heading placeholder:text-muted/50 outline-none transition-all duration-300 ${
                  focusedField === 'email'
                    ? 'border-primary shadow-lg shadow-primary/15 ring-4 ring-primary/10'
                    : 'border-border group-hover:border-slate-300 dark:group-hover:border-slate-600'
                }`}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-heading tracking-tight">
              Password
            </label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted group-focus-within:text-primary transition-colors duration-300 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full pl-11 pr-12 py-3.5 rounded-xl border bg-slate-50/80 dark:bg-slate-800/40 text-sm font-medium text-heading placeholder:text-muted/50 outline-none transition-all duration-300 ${
                  focusedField === 'password'
                    ? 'border-primary shadow-lg shadow-primary/15 ring-4 ring-primary/10'
                    : 'border-border group-hover:border-slate-300 dark:group-hover:border-slate-600'
                }`}
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
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={`h-5 w-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                  rememberMe
                    ? 'bg-primary border-primary shadow-sm shadow-primary/25'
                    : 'border-border group-hover:border-slate-300 dark:group-hover:border-slate-600'
                }`}
              >
                {rememberMe && (
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
              <span className="text-sm text-body group-hover:text-heading transition-colors">
                Remember me
              </span>
            </label>
            <a
              href="/forgot-password"
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </a>
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
                  <span>Sign In</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <FiArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.div>
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

          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-3">
            <motion.button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Demo login with sample account"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <FiLoader className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <>
                  <FiUserPlus className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold text-primary">Try Demo Account</span>
                </>
              )}
            </motion.button>
          </motion.div>

          <motion.p variants={itemVariants} className="text-center text-sm text-body">
            Don&apos;t have an account?{' '}
            <a
              href="/register"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Create one
            </a>
          </motion.p>
        </form>
      </motion.div>
    </motion.div>
  );
}
