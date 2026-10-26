import React from "react";
import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Support & FAQ — Help Center | DigitalHub Bangladesh",
  description:
    "Find answers to frequently asked questions about bKash/Nagad payments, account delivery, license warranties, and digital service onboarding at DigitalHub.",
  alternates: {
    canonical: "/support",
  },
  openGraph: {
    title: "Support & FAQ — DigitalHub Bangladesh",
    description:
      "24/7 customer help center for digital orders, payment verification, and refund guarantees.",
    url: "https://digitalhub-mocha.vercel.app/support",
    type: "website",
  },
};

export default function SupportPage() {
  const faqs = [
    {
      q: "How fast do I receive my digital subscription or software license?",
      a: "Once your payment via bKash, Nagad, or Rocket is manually verified by our team, account access or keys are sent to your dashboard and email within 15 to 60 minutes.",
    },
    {
      q: "How does the manual payment verification process work?",
      a: "After sending money to our verified personal number, submit your Transaction ID (TrxID) and sender number at checkout. Our finance team matches this against official statement feeds and approves your order.",
    },
    {
      q: "Are the AI subscriptions (ChatGPT Plus, Midjourney) official?",
      a: "Yes. We provision official access licenses or invites through authorized distributor and partner channels with full replacement guarantees.",
    },
    {
      q: "Can I order custom Web Development or Digital Marketing services?",
      a: "Absolutely. Select your preferred package or pages, provide your requirements in the order notes, and our team will initiate onboarding via phone and email within 24 hours.",
    },
    {
      q: "What if my software key or account doesn't work?",
      a: "We offer a 100% replacement or money-back guarantee. Contact support via WhatsApp or email with your order number for an immediate resolution.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div className="py-14 bg-[#050812] min-h-[70vh]">
      {/* Schema.org FAQPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D9FF]">
            Help Center
          </span>
          <h1 className="text-3xl font-extrabold text-[#F8FAFC]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Everything you need to know about purchasing, payments, and digital delivery on DigitalHub.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0B1224] border border-[#1B2A45] space-y-2 hover:border-[#00D9FF]/30 transition-colors"
            >
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 text-[#00D9FF] shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed pl-6.5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
