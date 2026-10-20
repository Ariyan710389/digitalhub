import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050812] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[#0B1224] border border-[#1B2A45] shadow-[0_0_30px_rgba(0,217,255,0.2)]">
          <span className="text-4xl font-black bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] bg-clip-text text-transparent">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-[#F8FAFC]">Page Not Found</h1>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            The page you are looking for might have been moved, renamed, or does not exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] text-white text-xs font-bold shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#00D9FF]/40 text-xs font-bold transition-all"
          >
            <Search className="h-4 w-4" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
