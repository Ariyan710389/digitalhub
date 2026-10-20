import React from "react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function RefundPolicyPage() {
  const page = await prisma.page.findUnique({
    where: { slug: "refund-policy" },
  });

  return (
    <div className="py-14 bg-[#050812] min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-8 sm:p-12 shadow-xl space-y-6">
          <div className="border-b border-[#1B2A45] pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00D9FF]">
              Buyer Protection
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mt-1">
              {page?.title || "Refund & Replacement Policy"}
            </h1>
          </div>
          <div className="text-sm text-[#94A3B8] leading-relaxed whitespace-pre-line space-y-4">
            {page?.content || "At DigitalHub, customer satisfaction is our top priority."}
            <p>
              If an account credential, AI subscription, or software license key is invalid or fails activation, our support team will inspect and replace it immediately within 24 hours.
            </p>
            <p>
              If a replacement cannot be provided, you will receive a full 100% refund to your original bKash, Nagad, or Rocket account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
