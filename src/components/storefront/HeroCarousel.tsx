"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Headphones, ArrowRight, ChevronLeft, ChevronRight, Bot, Code, GraduationCap, TrendingUp } from "lucide-react";
import { HeroSlideData } from "@/types";

interface HeroCarouselProps {
  slides?: HeroSlideData[];
}

export function HeroCarousel({ slides = [] }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  const fallbackSlides: HeroSlideData[] = [
    {
      id: "slide-1",
      headline: "Premium Digital Products & Professional Services",
      description:
        "Get the best AI tools, premium apps, online courses, web development services and digital marketing solutions — all in one place.",
      badge: "Your Digital Growth Partner",
      ctaText: "Explore Products",
      ctaUrl: "/products",
      displayOrder: 1,
      isActive: true,
    },
    {
      id: "slide-2",
      headline: "Supercharge Workflow With AI Subscriptions & Licenses",
      description:
        "Access ChatGPT Plus, Midjourney, Adobe Creative Cloud, and developer software with instant activation and local Bangladesh payment methods.",
      badge: "Instant Delivery Guaranteed",
      ctaText: "Browse AI Tools",
      ctaUrl: "/categories/ai-subscriptions",
      displayOrder: 2,
      isActive: true,
    },
  ];

  const activeSlides = slides && slides.length > 0 ? slides : fallbackSlides;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const slide = activeSlides[current];

  return (
    <section className="relative overflow-hidden bg-[#050812] py-12 lg:py-20 border-b border-[#1B2A45]/40">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#8B3DFF]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101A30] border border-[#00D9FF]/40 text-[#00D9FF] text-xs font-semibold shadow-[0_0_15px_rgba(0,217,255,0.15)]">
              <Zap className="h-3.5 w-3.5 text-[#00D9FF]" />
              <span>{slide.badge || "Your Digital Growth Partner"}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.15]">
              Premium{" "}
              <span className="text-[#00D9FF] underline decoration-[#00D9FF]/30 decoration-wavy">
                Digital
              </span>{" "}
              Products <br className="hidden sm:inline" />& Professional{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563FF] to-[#8B3DFF]">
                Services
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed max-w-xl">
              {slide.description}
            </p>

            {/* Micro Feature Indicators */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-medium text-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#00D9FF]/15 text-[#00D9FF]">
                  <Zap className="h-3.5 w-3.5" />
                </span>
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#2563FF]/15 text-[#2563FF]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#8B3DFF]/15 text-[#8B3DFF]">
                  <Headphones className="h-3.5 w-3.5" />
                </span>
                <span>24/7 Support</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4 flex items-center gap-4">
              <Link
                href={slide.ctaUrl || "/products"}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] text-white font-semibold text-sm shadow-[0_0_25px_rgba(0,217,255,0.35)] hover:shadow-[0_0_35px_rgba(0,217,255,0.5)] hover:brightness-110 active:scale-95 transition-all"
              >
                <span>{slide.ctaText || "Explore Products"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Visual / Illustration (Futuristic 3D Tech Laptop) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
              {/* Central Glowing Orb */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00D9FF]/20 via-[#2563FF]/20 to-[#8B3DFF]/30 rounded-full blur-2xl animate-pulse" />

              {/* Futuristic Cyber Device Mockup Card */}
              <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#101A30] to-[#080D1B] border border-[#1B2A45] p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-md">
                {/* Device Screen Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1B2A45]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[10px] text-[#94A3B8] font-mono">digitalhub.system.v2</div>
                </div>

                {/* Device Screen Center */}
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] p-[3px] shadow-[0_0_30px_rgba(0,217,255,0.4)] mb-4">
                    <div className="w-full h-full bg-[#080D1B] rounded-[13px] flex items-center justify-center">
                      <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#8B3DFF] font-black">
                        ▶
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#F8FAFC]">Digital Ecosystem</h3>
                  <p className="text-xs text-[#94A3B8] mt-1 max-w-xs">
                    Curated digital services & software ready for instant fulfillment.
                  </p>
                </div>

                {/* Floating Category Badges */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0B1224] border border-[#1B2A45] text-xs">
                    <Bot className="h-4 w-4 text-[#00D9FF]" />
                    <span className="text-[#F8FAFC] font-medium">AI Tools</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0B1224] border border-[#1B2A45] text-xs">
                    <Code className="h-4 w-4 text-emerald-400" />
                    <span className="text-[#F8FAFC] font-medium">Web Dev</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0B1224] border border-[#1B2A45] text-xs">
                    <GraduationCap className="h-4 w-4 text-amber-400" />
                    <span className="text-[#F8FAFC] font-medium">Courses</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0B1224] border border-[#1B2A45] text-xs">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    <span className="text-[#F8FAFC] font-medium">Marketing</span>
                  </div>
                </div>
              </div>

              {/* Floating Ambient Holographic Badges */}
              <div className="absolute -top-3 -right-3 p-3 rounded-xl bg-[#101A30]/90 border border-cyan-400/30 text-cyan-400 shadow-lg shadow-cyan-500/20 backdrop-blur-md hidden sm:flex items-center gap-2 text-xs font-bold animate-bounce">
                <Bot className="h-4 w-4" />
                <span>AI</span>
              </div>
              <div className="absolute -bottom-2 -left-2 p-3 rounded-xl bg-[#101A30]/90 border border-purple-400/30 text-purple-400 shadow-lg shadow-purple-500/20 backdrop-blur-md hidden sm:flex items-center gap-2 text-xs font-bold">
                <Code className="h-4 w-4" />
                <span>{"</>"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Dots & Controls (if multiple slides) */}
        {activeSlides.length > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
              className="p-1.5 rounded-full bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#00D9FF] transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === current ? "w-8 bg-[#00D9FF]" : "w-2 bg-[#1B2A45]"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % activeSlides.length)}
              className="p-1.5 rounded-full bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#00D9FF] transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
