import React from "react";
import type { Metadata } from "next";
import { Zap, ShieldCheck, Headphones } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Bangladesh's Premier Digital Marketplace | DigitalHub",
  description:
    "Learn about DigitalHub, our mission to make world-class AI subscriptions, developer licenses, online courses, and digital marketing easily accessible across Bangladesh.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us — DigitalHub Bangladesh",
    description:
      "Empowering Bangladesh with genuine digital tools, AI subscriptions, and development services.",
    url: "https://digitalhub-mocha.vercel.app/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="py-14 bg-[#050812] min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D9FF]">
            About DigitalHub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC]">
            Empowering Bangladesh with Authentic Digital Products
          </h1>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            DigitalHub is Bangladesh&apos;s dedicated digital marketplace providing authentic AI subscriptions, professional applications, online courses, and development services with seamless local payment methods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0B1224] border border-[#1B2A45] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00D9FF]">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Fast Fulfillment</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Automated and semi-automated delivery pipelines ensure credentials arrive in your account dashboard and email without delays.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B1224] border border-[#1B2A45] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Secure Local Payments</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Pay in Bangladeshi Taka (৳) via bKash, Nagad, and Rocket with verified manual payment review and zero risk of fraud.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B1224] border border-[#1B2A45] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Headphones className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC]">24/7 Dedicated Support</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Our support team is available around the clock via WhatsApp, Telegram, and phone to assist with setup and inquiries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
