import React from "react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function TermsConditionsPage() {
  const page = await prisma.page.findUnique({
    where: { slug: "terms-conditions" },
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
              {page?.title || "Terms and Conditions"}
            </h1>
          </div>
          <div className="text-sm text-[#94A3B8] leading-relaxed whitespace-pre-line space-y-4">
            {page?.content || "By accessing and using DigitalHub, you agree to our terms of service..."}
            <p>
              1. <strong>Digital Subscriptions & Licenses:</strong> AI tools, software licenses, and online courses are provided strictly for the purchaser&apos;s legitimate use under the specified duration.
            </p>
            <p>
              2. <strong>Delivery Timelines:</strong> Standard digital items are dispatched within 15 to 60 minutes after payment verification is completed by our administrative team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
