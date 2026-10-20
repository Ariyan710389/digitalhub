import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, getOrderStatusLabel } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Package,
  ArrowRight,
  FileText,
  AlertCircle,
} from "lucide-react";

export const revalidate = 0;

interface OrderPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      paymentSubmissions: {
        orderBy: { submittedAt: "desc" },
      },
      activityLog: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const statusLabel = getOrderStatusLabel(order.status);
  const latestSubmission = order.paymentSubmissions[0];

  return (
    <div className="py-12 bg-[#050812] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header Card */}
        <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 sm:p-10 mb-8 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <span className="text-xs font-semibold text-[#00D9FF] uppercase tracking-wider block mb-1">
            Order Confirmation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Thank You For Your Order!
          </h1>
          <p className="text-xs text-[#94A3B8] mt-2 max-w-md mx-auto">
            Order <span className="text-[#F8FAFC] font-mono font-bold">{order.orderNumber}</span> has been received and logged in our system.
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full border text-xs font-semibold" style={{ borderColor: "rgba(0,217,255,0.3)" }}>
            <span className={`px-2 py-0.5 rounded-md border text-[11px] ${statusLabel.color}`}>
              {statusLabel.label}
            </span>
            <span className="text-[#94A3B8]">
              Method: <strong className="text-[#F8FAFC] uppercase">{order.paymentMethod || "N/A"}</strong>
            </span>
          </div>
        </div>

        {/* Verification Status Notice */}
        {order.status === "PAYMENT_UNDER_REVIEW" && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-300 text-sm">Payment Under Review</h3>
              <p className="text-[#94A3B8] mt-1 leading-relaxed">
                We received your payment submission (TrxID:{" "}
                <span className="font-mono text-[#F8FAFC] font-bold">
                  {latestSubmission?.transactionId || "Submitted"}
                </span>
                ). An administrator will manually verify the transaction and activate your digital services shortly.
              </p>
            </div>
          </div>
        )}

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Purchased Items List */}
          <div className="md:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-[#0B1224] border border-[#1B2A45] space-y-4">
              <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2 border-b border-[#1B2A45] pb-3">
                <Package className="h-4 w-4 text-[#00D9FF]" />
                Purchased Digital Items ({order.items.length})
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 py-2 border-b border-[#1B2A45]/40 last:border-none"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-[#F8FAFC]">{item.productName}</h3>
                      {item.variationDesc && (
                        <p className="text-[11px] text-[#00D9FF] font-medium mt-0.5">
                          {item.variationDesc}
                        </p>
                      )}
                      <p className="text-[10px] text-[#94A3B8] mt-1">
                        Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                      </p>
                      {item.deliveryNotes && (
                        <p className="text-[10px] text-[#94A3B8] italic mt-1 bg-[#080D1B] p-2 rounded-lg border border-[#1B2A45]">
                          Fulfillment Note: {item.deliveryNotes}
                        </p>
                      )}
                    </div>
                    <div className="text-xs font-bold text-[#F8FAFC] shrink-0">
                      {formatPrice(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotals */}
              <div className="pt-3 border-t border-[#1B2A45] space-y-2 text-xs">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#F8FAFC] pt-2 border-t border-[#1B2A45]">
                  <span>Total Paid / Due</span>
                  <span className="text-[#00D9FF]">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-[#0B1224] border border-[#1B2A45] space-y-4 text-xs">
              <h2 className="text-sm font-bold text-[#F8FAFC] border-b border-[#1B2A45] pb-3">
                Customer Information
              </h2>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">
                    Recipient Name
                  </span>
                  <span className="text-[#F8FAFC] font-semibold">
                    {order.billingName || order.guestName || "Customer"}
                  </span>
                </div>

                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">
                    Delivery Email
                  </span>
                  <span className="text-[#F8FAFC] font-semibold">
                    {order.billingEmail || order.guestEmail}
                  </span>
                </div>

                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">
                    Mobile Number
                  </span>
                  <span className="text-[#F8FAFC] font-mono">
                    {order.billingPhone || order.guestPhone}
                  </span>
                </div>

                {order.notes && (
                  <div>
                    <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">
                      Order Notes
                    </span>
                    <p className="text-[#F8FAFC] bg-[#080D1B] p-2 rounded-lg border border-[#1B2A45]">
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#1B2A45] space-y-2 text-[11px] text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Verified order logged in database</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B1224] border border-[#1B2A45] hover:border-[#00D9FF] text-xs font-semibold text-[#F8FAFC] transition-colors"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
