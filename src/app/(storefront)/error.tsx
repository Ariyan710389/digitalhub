"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#050812] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <AlertCircle className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-[#F8FAFC]">
            Something went wrong
          </h2>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            An unexpected error occurred while loading this page. Please try refreshing or return to the home page.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] text-white text-xs font-bold shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#00D9FF]/40 text-xs font-bold transition-all"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
