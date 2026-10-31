import React from "react";
import { Zap, ShieldCheck, Headphones, WalletCards } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-[#00D9FF]" />,
      title: "Instant Digital Delivery",
      description:
        "Get instant access credentials, license keys, or downloadable files immediately after payment verification.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#8B3DFF]" />,
      title: "100% Genuine & Verified",
      description:
        "All software licenses, AI subscriptions, and templates are authenticated and backed by full warranty.",
    },
    {
      icon: <WalletCards className="w-6 h-6 text-[#2563FF]" />,
      title: "Local Bangladesh Payments",
      description:
        "Pay seamlessly in BDT via bKash, Nagad, Rocket, or Cash on Delivery where applicable. No foreign card required.",
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#00D9FF]" />,
      title: "24/7 Priority Support",
      description:
        "Our Bangladesh-based support team is always available via WhatsApp, Telegram, or ticket to assist your setup.",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#00D9FF] bg-[#00D9FF]/10 px-3 py-1 rounded-full border border-[#00D9FF]/20 inline-block mb-3">
          Why Choose Us
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
          The Most Trusted Digital Marketplace in Bangladesh
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
          Experience frictionless access to global AI tools, developer software, and marketing services without international payment hassles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="group rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-6 hover:border-[#00D9FF]/40 hover:shadow-[0_0_20px_rgba(0,217,255,0.15)] transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-[#101A30] border border-[#1B2A45] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              {f.icon}
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC] mb-2 group-hover:text-[#00D9FF] transition-colors">
              {f.title}
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
