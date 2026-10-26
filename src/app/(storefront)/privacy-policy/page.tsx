import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Privacy Policy | DigitalHub Bangladesh",
  description:
    "Review DigitalHub's privacy policy regarding data collection, order processing, and customer privacy protection in Bangladesh.",
  alternates: {
    canonical: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function PrivacyPolicyPage() {
  const page = await prisma.page.findUnique({
    where: { slug: "privacy-policy" },
  });

  return (
    <div className="py-14 bg-[#050812] min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-8 sm:p-12 shadow-xl space-y-6">
          <div className="border-b border-[#1B2A45] pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00D9FF]">
              Legal Information
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mt-1">
              {page?.title || "Privacy Policy"}
            </h1>
          </div>
          <div className="text-sm text-[#94A3B8] leading-relaxed whitespace-pre-line space-y-4">
            {page?.content || "At DigitalHub, we prioritize your security and data privacy..."}
            <p>
              We collect only the essential information needed to fulfill your digital orders: name, email address, and phone number for payment verification.
            </p>
            <p>
              We never store sensitive mobile banking PINs or OTPs. All mobile financial transactions (bKash, Nagad, Rocket) are verified manually using official transaction identifiers provided by authorized carriers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
