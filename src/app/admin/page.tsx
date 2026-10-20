import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, getOrderStatusLabel } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingCart,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  Users,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardOverview() {
  // Query Real Stats
  const totalOrdersCount = await prisma.order.count();
  const pendingOrdersCount = await prisma.order.count({
    where: {
      status: { in: ["PENDING", "AWAITING_PAYMENT", "PAYMENT_UNDER_REVIEW"] },
    },
  });

  // Confirmed Revenue ONLY (Paid or Completed orders)
  const confirmedOrders = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "COMPLETED"] },
    },
    select: { total: true },
  });
  const confirmedRevenue = confirmedOrders.reduce((acc, curr) => acc + curr.total, 0);

  // Pending Manual Payment Submissions
  const pendingPaymentsCount = await prisma.paymentSubmission.count({
    where: { status: "PENDING" },
  });

  // Recent 6 Orders
  const recentOrders = await prisma.order.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      paymentSubmissions: true,
    },
  });

  // Total Products Count
  const totalProductsCount = await prisma.product.count({
    where: { isDeleted: false },
  });

  // Total Customers Count
  const totalCustomersCount = await prisma.user.count({
    where: { role: "CUSTOMER" },
  });

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC]">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Real-time sales, order fulfillment, and manual payment verification metrics.
          </p>
        </div>

        {pendingPaymentsCount > 0 && (
          <Link
            href="/admin/payments"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-colors animate-pulse"
          >
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>{pendingPaymentsCount} Payment Verification{pendingPaymentsCount === 1 ? "" : "s"} Pending</span>
          </Link>
        )}
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Confirmed Revenue */}
        <div className="p-5 rounded-2xl bg-[#0B1224] border border-[#1B2A45] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8]">Confirmed Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#00D9FF]">
            {formatPrice(confirmedRevenue)}
          </div>
          <div className="text-[10px] text-[#94A3B8]">
            Only verified and completed orders
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-[#0B1224] border border-[#1B2A45] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8]">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#F8FAFC]">
            {totalOrdersCount}
          </div>
          <div className="text-[10px] text-[#94A3B8]">
            {pendingOrdersCount} pending processing
          </div>
        </div>

        {/* Pending Payments */}
        <div className="p-5 rounded-2xl bg-[#0B1224] border border-[#1B2A45] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8]">Pending Payments</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400">
            {pendingPaymentsCount}
          </div>
          <div className="text-[10px] text-[#94A3B8]">
            Awaiting admin manual review
          </div>
        </div>

        {/* Catalog Items */}
        <div className="p-5 rounded-2xl bg-[#0B1224] border border-[#1B2A45] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8]">Active Catalog</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#F8FAFC]">
            {totalProductsCount} Products
          </div>
          <div className="text-[10px] text-[#94A3B8]">
            {totalCustomersCount} registered customers
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1B2A45] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#F8FAFC]">Recent Orders</h2>
            <p className="text-xs text-[#94A3B8]">Latest customer orders placed on the platform.</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#00D9FF] hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#94A3B8]">
            No orders found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2A45] text-[#94A3B8] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Order Number</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A45]/40">
                {recentOrders.map((order) => {
                  const status = getOrderStatusLabel(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-[#101A30]/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#00D9FF]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-3 text-[#F8FAFC]">
                        {order.billingName || order.guestName || "Customer"}
                      </td>
                      <td className="py-3 px-3 uppercase text-[10px] font-bold text-[#94A3B8]">
                        {order.paymentMethod || "N/A"}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#F8FAFC]">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/order/${order.orderNumber}`}
                          className="text-[#00D9FF] hover:underline font-semibold"
                        >
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
