import React from "react";
import { prisma } from "@/lib/prisma";
import { OrdersManagementClient } from "./OrdersManagementClient";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const rawOrders = await prisma.order.findMany({
    include: {
      items: true,
      paymentSubmissions: {
        orderBy: { submittedAt: "desc" },
      },
      orderNotes: {
        orderBy: { createdAt: "desc" },
      },
      activityLog: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const orders = rawOrders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.billingName || o.guestName || "Customer",
    customerEmail: o.billingEmail || o.guestEmail || "",
    customerPhone: o.billingPhone || o.guestPhone || "",
    paymentMethod: o.paymentMethod || "N/A",
    status: o.status,
    total: o.total,
    isFlagged: o.isFlagged,
    flagReason: o.flagReason,
    notesCount: o.orderNotes.length,
    recentNotes: o.orderNotes.map((n) => n.note),
    itemsCount: o.items.length,
    itemsSummary: o.items.map((i) => `${i.productName} (${i.variationDesc || "Standard"}) ×${i.quantity}`).join(", "),
    transactionId: o.paymentSubmissions[0]?.transactionId || null,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#F8FAFC]">
          Orders Management
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Monitor all customer purchases, update fulfillment statuses, and inspect payment records.
        </p>
      </div>

      <OrdersManagementClient initialOrders={orders} />
    </div>
  );
}
