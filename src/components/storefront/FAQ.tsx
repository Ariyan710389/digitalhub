"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I receive my digital subscription or software license?",
    answer:
      "Once your payment is verified (usually within 5–15 minutes), your credentials, license keys, or access details are automatically made available in your Order Details dashboard and sent to your registered email address.",
  },
  {
    question: "How does bKash / Nagad / Rocket payment verification work?",
    answer:
      "During checkout, select your preferred mobile wallet (bKash, Nagad, or Rocket). Send the exact order amount to our listed Merchant / Personal number using your mobile app. Then submit the Transaction ID (TrxID) and sender number. Our team verifies the transaction swiftly.",
  },
  {
    question: "Are the AI subscriptions (ChatGPT Plus, Claude, Midjourney) private?",
    answer:
      "Yes, we provide authentic private subscriptions configured directly on your email or dedicated accounts depending on the selected plan. Details are clearly specified in each product's plan description.",
  },
  {
    question: "Can I request custom specifications for Web Development or Marketing?",
    answer:
      "Absolutely. When purchasing a digital service package, you can provide initial requirements in the order notes. Our project managers will reach out to you via WhatsApp or Email within 2 hours to confirm roadmap details.",
  },
  {
    question: "What is your refund or replacement policy?",
    answer:
      "We offer a 100% money-back guarantee or immediate replacement if a license key or subscription is invalid or cannot be delivered as described. Please visit our Refund Policy page for full details.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="text-center mb-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#00D9FF] bg-[#00D9FF]/10 px-3 py-1 rounded-full border border-[#00D9FF]/20 inline-flex items-center gap-1.5 mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          Got Questions?
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
          Everything you need to know about purchasing digital products and services in Bangladesh.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-bold text-[#F8FAFC] hover:text-[#00D9FF] transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-[#94A3B8] transition-transform duration-200 shrink-0 ml-4",
                    isOpen && "rotate-180 text-[#00D9FF]"
                  )}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-4 text-xs text-[#94A3B8] leading-relaxed border-t border-[#1B2A45]/50 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
