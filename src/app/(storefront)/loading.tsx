import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050812] py-12 px-4 sm:px-6 lg:px-8 animate-pulse">
      {/* Top glowing progress line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] z-50 animate-pulse shadow-[0_0_12px_rgba(0,217,255,0.8)]" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="rounded-3xl bg-[#0B1224]/80 border border-[#1B2A45] p-8 space-y-4">
          <div className="h-4 w-32 bg-[#1B2A45] rounded-full" />
          <div className="h-8 w-72 bg-[#101A30] rounded-xl" />
          <div className="h-4 w-96 bg-[#1B2A45]/60 rounded-full" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-5 space-y-4 flex flex-col"
            >
              <div className="w-full h-40 bg-[#101A30] rounded-xl flex items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-[#1B2A45]" />
              </div>
              <div className="h-5 w-3/4 bg-[#1B2A45] rounded-lg" />
              <div className="h-3 w-full bg-[#1B2A45]/50 rounded" />
              <div className="h-3 w-2/3 bg-[#1B2A45]/50 rounded" />
              <div className="pt-4 flex items-center justify-between border-t border-[#1B2A45]">
                <div className="h-6 w-20 bg-[#101A30] rounded-lg" />
                <div className="h-8 w-24 bg-[#00D9FF]/20 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
