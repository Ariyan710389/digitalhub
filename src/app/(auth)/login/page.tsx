"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-8 sm:p-10 shadow-2xl z-10">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] p-[2px]">
            <div className="w-full h-full bg-[#070B16] rounded-[10px] flex items-center justify-center text-cyan-400 font-bold">
              ▶
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#F8FAFC]">
            Digital<span className="text-[#00D9FF]">Hub</span>
          </span>
        </Link>
        <h1 className="text-xl font-bold text-[#F8FAFC]">Sign In to Your Account</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Access your purchased digital services, orders, and subscriptions.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] pl-10 pr-4 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
            />
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-[#94A3B8]">
              Password
            </label>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] pl-10 pr-4 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
            />
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full text-xs font-bold py-3 mt-2"
        >
          <span>Sign In</span>
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#1B2A45] text-center text-xs text-[#94A3B8]">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[#00D9FF] hover:underline font-semibold"
        >
          Create an account
        </Link>
      </div>

      {/* Demo Credentials Hint */}
      <div className="mt-4 p-3 rounded-xl bg-[#080D1B] border border-[#1B2A45] text-[11px] text-[#94A3B8] space-y-1">
        <div className="font-semibold text-[#F8FAFC]">Demo Credentials:</div>
        <div>Admin: <code className="text-[#00D9FF]">admin@digitalhub.com</code> / <code className="text-[#00D9FF]">Admin@12345</code></div>
        <div>Customer: <code className="text-emerald-400">customer@gmail.com</code> / <code className="text-emerald-400">Customer@12345</code></div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050812]">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#8B3DFF]/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={<div className="text-xs text-[#94A3B8]">Loading authentication...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
