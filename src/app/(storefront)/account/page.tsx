import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, getOrderStatusLabel } from "@/lib/utils";
import { User, Package, Clock, ShieldCheck, ChevronRight } from "lucide-react";

export const revalidate = 0;

export default async function CustomerAccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        include: {
          items: true,
          paymentSubmissions: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="py-12 bg-[#050812] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 sm:p-8 mb-10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00D9FF] to-[#8B3DFF] p-[2px]">
                <div className="w-full h-full bg-[#070B16] rounded-[14px] flex items-center justify-center text-cyan-400 font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                    {user.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-1">{user.email}</p>
                {user.phone && (
                  <p className="text-xs font-mono text-[#94A3B8]">{user.phone}</p>
                )}
              </div>
            </div>

            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-colors"
              >
                <span>Go to Admin Dashboard</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#1B2A45] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#F8FAFC]">Your Orders & Subscriptions</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Track fulfillment and activation status for all your purchased items.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#101A30] text-xs font-bold text-[#00D9FF] border border-[#1B2A45]">
              {user.orders.length} Order{user.orders.length === 1 ? "" : "s"}
            </span>
          </div>

          {user.orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-10 w-10 text-[#94A3B8]/50 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">No orders yet</h3>
              <p className="text-xs text-[#94A3B8] mt-1 mb-5">
                Explore our catalog of AI subscriptions, apps, and digital services.
              </p>
              <Link
                href="/products"
                className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#2563FF] text-xs font-bold text-white shadow-lg"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1B2A45] text-[#94A3B8] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Order Number</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Items</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1B2A45]/50">
                  {user.orders.map((order) => {
                    const status = getOrderStatusLabel(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-[#101A30]/40 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-[#00D9FF]">
                          <Link href={`/order/${order.orderNumber}`} className="hover:underline">
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="py-3.5 px-3 text-[#94A3B8]">
                          {new Date(order.createdAt).toLocaleDateString("en-GB")}
                        </td>
                        <td className="py-3.5 px-3 text-[#F8FAFC]">
                          {order.items.length} item{order.items.length === 1 ? "" : "s"}
                        </td>
                        <td className="py-3.5 px-3 uppercase text-[11px] text-[#94A3B8] font-bold">
                          {order.paymentMethod || "N/A"}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-[#F8FAFC]">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <Link
                            href={`/order/${order.orderNumber}`}
                            className="inline-flex items-center gap-1 text-[#00D9FF] hover:underline font-semibold"
                          >
                            <span>View</span>
                            <ChevronRight className="h-3 w-3" />
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
    </div>
  );
}
