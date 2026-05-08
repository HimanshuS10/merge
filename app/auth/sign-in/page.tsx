'use client';

import { useActionState } from 'react';
import { signInWithEmail } from './actions';
import Link from 'next/link';
import Image from 'next/image';

export default function SignInForm() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080b14] p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-[#0c0f1a] border border-white/[0.06] rounded-2xl px-8 pt-8 pb-7">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/LogoMain.png"
              alt="Merge"
              width={120}
              height={0}
              sizes="100vw"
              style={{ width: '45%', height: 'auto' }}
              className="object-contain"
            />
          </div>

          <h1 className="text-lg font-semibold text-white text-center mb-1">Welcome back</h1>
          <p className="text-sm text-white/35 text-center mb-7">
            Sign in to your account to continue.
          </p>

          <form action={formAction} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                id="email" name="email" type="email" required
                placeholder="you@company.com"
                className="block w-full px-3 py-2.5 text-sm text-white bg-white/[0.03] border border-white/[0.06] rounded-xl placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                  Password
                </label>
                <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                id="password" name="password" type="password" required
                placeholder="••••••••"
                className="block w-full px-3 py-2.5 text-sm text-white bg-white/[0.03] border border-white/[0.06] rounded-xl placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all"
              />
            </div>

            {/* Error */}
            {state?.error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/[0.08] border border-red-500/20 px-3.5 py-2.5 text-sm text-red-400/80">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                {state.error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 bg-white hover:bg-white/90 active:bg-white/80 text-[#080b14] text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:cursor-pointer mt-2"
            >
              {isPending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-white/25 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" className="text-white/50 hover:text-white/80 transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
      </div>
    </div>
  );
}
