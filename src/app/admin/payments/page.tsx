import React from "react";
import { prisma } from "@/lib/prisma";
import { PaymentVerificationClient } from "./PaymentVerificationClient";

export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const rawSubmissions = await prisma.paymentSubmission.findMany({
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          billingName: true,
          billingEmail: true,
          total: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  const submissions = rawSubmissions.map((s) => ({
    id: s.id,
    orderId: s.orderId,
    orderNumber: s.order.orderNumber,
    customerName: s.order.billingName || "Customer",
    customerEmail: s.order.billingEmail || "",
    method: s.method,
    transactionId: s.transactionId,
    senderNumber: s.senderNumber,
    amount: s.amount,
    status: s.status,
    submittedAt: s.submittedAt.toISOString(),
    reviewNotes: s.reviewNotes,
  }));

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#F8FAFC]">
          Manual Payment Verification
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Review customer bKash, Nagad, and Rocket Transaction IDs before releasing digital products or services.
        </p>
      </div>

      <PaymentVerificationClient initialSubmissions={submissions} />
    </div>
  );
}
