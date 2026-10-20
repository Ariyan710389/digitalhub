import React from "react";
import Link from "next/link";
import { ArrowRight, Users, Package, Award, Sparkles, Laptop } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="py-14 bg-[#050812]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B1224] via-[#080D1B] to-[#101A30] border border-[#1B2A45] p-8 sm:p-12 shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#8B3DFF]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] text-[11px] font-bold uppercase tracking-wider">
                Special Offer
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
                Build Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF]">
                  Digital Future
                </span>
              </h2>

              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-md">
                Premium tools, expert services and valuable resources to help you
                work smarter, learn faster and grow bigger.
              </p>

              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#2563FF] text-white text-xs font-bold shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:brightness-110 active:scale-95 transition-all"
                >
                  <span>Explore All Products</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Middle Graphic */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="relative w-48 h-36 rounded-2xl bg-[#101A30]/80 border border-[#1B2A45] p-4 flex flex-col items-center justify-center shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00D9FF] to-[#8B3DFF] p-[2px] mb-2">
                  <div className="w-full h-full bg-[#070B16] rounded-[10px] flex items-center justify-center text-cyan-400">
                    <Laptop className="h-6 w-6" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#F8FAFC]">All-In-One Hub</span>
                <span className="text-[10px] text-[#94A3B8]">Instant digital activations</span>
              </div>
            </div>

            {/* Right Side Stats */}
            <div className="lg:col-span-3 space-y-6 lg:border-l lg:border-[#1B2A45]/80 lg:pl-8">
              {/* Stat 1 */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#101A30] border border-[#1B2A45] flex items-center justify-center text-[#00D9FF] shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-[#F8FAFC]">10K+</div>
                  <div className="text-xs text-[#94A3B8]">Happy Customers</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#101A30] border border-[#1B2A45] flex items-center justify-center text-purple-400 shrink-0">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-[#F8FAFC]">500+</div>
                  <div className="text-xs text-[#94A3B8]">Digital Products</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#101A30] border border-[#1B2A45] flex items-center justify-center text-emerald-400 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-[#F8FAFC]">99%</div>
                  <div className="text-xs text-[#94A3B8]">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
