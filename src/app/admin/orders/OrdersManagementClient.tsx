"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatPrice, getOrderStatusLabel } from "@/lib/utils";
import { Search, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/Toast";

interface OrderItemSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  status: string;
  total: number;
  itemsCount: number;
  itemsSummary: string;
  transactionId?: string | null;
  createdAt: string;
}

interface Props {
  initialOrders: OrderItemSummary[];
}

const statusOptions = [
  "PENDING",
  "AWAITING_PAYMENT",
  "PAYMENT_UNDER_REVIEW",
  "PAID",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
  "FAILED",
];

export function OrdersManagementClient({ initialOrders }: Props) {
  const [orders, setOrders] = useState<OrderItemSummary[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchesSearch =
      search === "" ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      (o.transactionId && o.transactionId.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update status");
      }

      toast.success(data.message);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-xl bg-[#0B1224] border border-[#1B2A45] w-full sm:w-auto scrollbar-none">
          {["ALL", "PENDING", "PAYMENT_UNDER_REVIEW", "PAID", "PROCESSING", "COMPLETED", "CANCELLED"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === tab
                    ? "bg-[#00D9FF] text-[#050812]"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                {tab.replace(/_/g, " ")}
              </button>
            )
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search order #, customer, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B1224] text-xs text-[#F8FAFC] pl-8 pr-3 py-2 rounded-xl border border-[#1B2A45] focus:outline-none focus:border-[#00D9FF]"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 shadow-xl">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#94A3B8]">
            No orders match the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2A45] text-[#94A3B8] uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Order #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Products</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A45]/40">
                {filteredOrders.map((order) => {
                  const statusInfo = getOrderStatusLabel(order.status);
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-[#101A30]/40 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-[#00D9FF]">
                        <Link href={`/order/${order.orderNumber}`} className="hover:underline">
                          {order.orderNumber}
                        </Link>
                        <span className="block text-[10px] text-[#94A3B8] font-normal">
                          {new Date(order.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-[#F8FAFC] block truncate max-w-[130px]">
                          {order.customerName}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] block truncate max-w-[130px]">
                          {order.customerEmail}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] font-mono block">
                          {order.customerPhone}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-[#F8FAFC] max-w-[180px]">
                        <p className="truncate text-xs" title={order.itemsSummary}>
                          {order.itemsSummary}
                        </p>
                        <span className="text-[10px] text-[#00D9FF]">
                          {order.itemsCount} line item{order.itemsCount === 1 ? "" : "s"}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="uppercase text-[11px] font-bold text-[#F8FAFC] block">
                          {order.paymentMethod}
                        </span>
                        {order.transactionId && (
                          <span className="font-mono text-[10px] text-cyan-300 block truncate max-w-[90px]">
                            Trx: {order.transactionId}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 font-bold text-[#F8FAFC]">
                        {formatPrice(order.total)}
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <select
                          disabled={isUpdating}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-[#080D1B] border border-[#1B2A45] text-xs text-[#F8FAFC] rounded-lg px-2 py-1 font-medium focus:outline-none focus:border-[#00D9FF] cursor-pointer"
                        >
                          {statusOptions.map((st) => (
                            <option key={st} value={st} className="bg-[#0B1224]">
                              {st.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
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
