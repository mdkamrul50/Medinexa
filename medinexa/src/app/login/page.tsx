import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In - Medinexa',
  description: 'Sign in to your Medinexa healthcare dashboard',
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 py-8">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.5) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/[0.08] via-secondary/[0.04] to-transparent blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-primary/[0.08] via-secondary/[0.04] to-transparent blur-3xl animate-float-reverse" />
        <div className="absolute top-1/4 left-[10%] h-[250px] w-[250px] rounded-full bg-gradient-to-r from-primary/[0.04] via-secondary/[0.04] to-transparent blur-3xl animate-float" style={{ animationDelay: '-3s', animationDuration: '12s' }} />
        <div className="absolute bottom-1/4 right-[10%] h-[250px] w-[250px] rounded-full bg-gradient-to-l from-primary/[0.04] via-secondary/[0.04] to-transparent blur-3xl animate-float-reverse" style={{ animationDelay: '-5s', animationDuration: '14s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-gradient-to-r from-accent/[0.03] via-primary/[0.03] to-transparent blur-3xl animate-float" style={{ animationDelay: '-7s', animationDuration: '18s' }} />
      </div>

      <div className="relative w-full max-w-[460px]">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
