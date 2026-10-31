"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatPrice, getOrderStatusLabel } from "@/lib/utils";
import {
  Search,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  AlertTriangle,
  Flag,
  FileText,
  Clock,
  ExternalLink,
  Plus,
  X,
  ShieldCheck,
} from "lucide-react";
import { toast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";

interface OrderItemSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  status: string;
  total: number;
  isFlagged?: boolean;
  flagReason?: string | null;
  notesCount?: number;
  recentNotes?: string[];
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

  // Fraud Management Modal State
  const [selectedOrder, setSelectedOrder] = useState<OrderItemSummary | null>(null);
  const [isFraudModalOpen, setIsFraudModalOpen] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const [adminNoteText, setAdminNoteText] = useState("");
  const [autoCancelOrder, setAutoCancelOrder] = useState(true);
  const [isProcessingFraud, setIsProcessingFraud] = useState(false);

  const filteredOrders = orders.filter((o) => {
    let matchesStatus = true;
    if (statusFilter === "ALL") {
      matchesStatus = true;
    } else if (statusFilter === "FLAGGED") {
      matchesStatus = Boolean(o.isFlagged);
    } else {
      matchesStatus = o.status === statusFilter;
    }

    const matchesSearch =
      search === "" ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerPhone && o.customerPhone.includes(search)) ||
      (o.transactionId && o.transactionId.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);

    // Safeguard: warn if marking as PAID on manual payment without transactionId
    if (
      newStatus === "PAID" &&
      targetOrder &&
      targetOrder.paymentMethod !== "cod" &&
      !targetOrder.transactionId
    ) {
      const confirmMark = window.confirm(
        `Order #${targetOrder.orderNumber} does not have a verified transaction ID. Are you sure you want to mark it as PAID?`
      );
      if (!confirmMark) return;
    }

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

      toast.success(data.message || `Order status updated to ${newStatus}`);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenFraudModal = (order: OrderItemSummary) => {
    setSelectedOrder(order);
    setCustomReason(order.flagReason || "");
    setAdminNoteText("");
    setIsFraudModalOpen(true);
  };

  const handleExecuteFraudAction = async (
    action: "MARK_SUSPICIOUS" | "MARK_FAKE" | "FLAG_REVIEW" | "UNMARK" | "ADD_NOTE"
  ) => {
    if (!selectedOrder) return;

    setIsProcessingFraud(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/flag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reason: customReason.trim() || undefined,
          note: adminNoteText.trim() || undefined,
          cancelOrder: action === "MARK_FAKE" ? autoCancelOrder : false,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to process fraud action");
      }

      toast.success(data.message);

      // Update local state
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== selectedOrder.id) return o;
          return {
            ...o,
            isFlagged: data.order.isFlagged,
            flagReason: data.order.flagReason,
            status: data.order.status,
            notesCount: adminNoteText.trim() ? (o.notesCount || 0) + 1 : o.notesCount,
            recentNotes: adminNoteText.trim()
              ? [adminNoteText.trim(), ...(o.recentNotes || [])]
              : o.recentNotes,
          };
        })
      );

      setIsFraudModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to execute fraud management action");
    } finally {
      setIsProcessingFraud(false);
    }
  };

  const flaggedCount = orders.filter((o) => o.isFlagged).length;

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-xl bg-[#0B1224] border border-[#1B2A45] w-full sm:w-auto scrollbar-none">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "FLAGGED", label: `Flagged / Fraud (${flaggedCount})` },
            { id: "PENDING", label: "Pending" },
            { id: "PAYMENT_UNDER_REVIEW", label: "Under Review" },
            { id: "PAID", label: "Paid" },
            { id: "PROCESSING", label: "Processing" },
            { id: "COMPLETED", label: "Completed" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? tab.id === "FLAGGED"
                    ? "bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                    : "bg-[#00D9FF] text-[#050812]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search order #, customer, phone, TRX..."
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
                  <th className="py-3 px-3">Order Number</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items Summary</th>
                  <th className="py-3 px-3">Method & TRX</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Security & Fraud Status</th>
                  <th className="py-3 px-3">Fulfillment Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A45]/40">
                {filteredOrders.map((order) => {
                  const status = getOrderStatusLabel(order.status);
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-[#101A30]/50 transition-colors">
                      {/* Order Number */}
                      <td className="py-3 px-3 font-mono font-bold text-[#00D9FF]">
                        <Link
                          href={`/order/${order.orderNumber}`}
                          target="_blank"
                          className="hover:underline flex items-center gap-1"
                        >
                          <span>{order.orderNumber}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                        <span className="text-[10px] text-[#94A3B8] font-normal block">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#F8FAFC] block">
                          {order.customerName}
                        </span>
                        <span className="text-[11px] text-[#94A3B8] block truncate max-w-[150px]">
                          {order.customerEmail}
                        </span>
                        {order.customerPhone && (
                          <span className="text-[10px] font-mono text-emerald-400 block">
                            {order.customerPhone}
                          </span>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3 max-w-[200px]">
                        <span className="text-[#F8FAFC] font-medium line-clamp-2">
                          {order.itemsSummary}
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">
                          {order.itemsCount} item{order.itemsCount === 1 ? "" : "s"}
                        </span>
                      </td>

                      {/* Payment Method & TRX */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#F8FAFC] uppercase block">
                          {order.paymentMethod}
                        </span>
                        {order.transactionId ? (
                          <span className="text-[10px] font-mono text-[#00D9FF] bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 inline-block mt-0.5">
                            TRX: {order.transactionId}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#94A3B8]/60 italic block">
                            No TRX submitted
                          </span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="py-3 px-3 font-extrabold text-[#F8FAFC]">
                        {formatPrice(order.total)}
                      </td>

                      {/* Security & Fraud Status Badge */}
                      <td className="py-3 px-3">
                        {order.isFlagged ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                              <ShieldAlert className="w-3 h-3" />
                              <span>Flagged</span>
                            </span>
                            <span className="text-[10px] text-rose-300 font-medium truncate max-w-[140px]">
                              {order.flagReason || "Under Review"}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified Normal</span>
                          </span>
                        )}

                        {order.notesCount && order.notesCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#94A3B8] mt-1">
                            <FileText className="w-3 h-3 text-[#00D9FF]" />
                            <span>{order.notesCount} note{order.notesCount === 1 ? "" : "s"}</span>
                          </span>
                        ) : null}
                      </td>

                      {/* Fulfillment Status Selector */}
                      <td className="py-3 px-3">
                        <select
                          disabled={isUpdating}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition-colors cursor-pointer focus:outline-none ${status.color} bg-[#080D1B]`}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#0B1224] text-[#F8FAFC]">
                              {opt.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Fraud Control Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenFraudModal(order)}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                              order.isFlagged
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500 hover:text-white"
                                : "bg-[#080D1B] text-[#94A3B8] border-[#1B2A45] hover:text-[#F8FAFC] hover:border-[#00D9FF]/40"
                            }`}
                            title="Fraud Review & Notes"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/order/${order.orderNumber}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00D9FF] hover:bg-[#101A30]"
                            title="Inspect Order Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================== FRAUD MANAGEMENT & NOTES MODAL ==================== */}
      <Modal
        isOpen={isFraudModalOpen}
        onClose={() => !isProcessingFraud && setIsFraudModalOpen(false)}
        maxWidth="lg"
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-extrabold text-[#F8FAFC] block">
                Fraud & Security Control
              </span>
              <span className="text-xs text-[#94A3B8] font-mono block">
                Order #{selectedOrder?.orderNumber} ({selectedOrder?.customerName})
              </span>
            </div>
          </div>
        }
      >
        {selectedOrder && (
          <div className="space-y-5">
            {/* Current Status Banner */}
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                selectedOrder.isFlagged
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {selectedOrder.isFlagged ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                )}
                <span>
                  <strong>Current Status:</strong>{" "}
                  {selectedOrder.isFlagged
                    ? `Flagged (${selectedOrder.flagReason || "Suspicious"})`
                    : "Normal / Verified"}
                </span>
              </div>
              <span className="font-extrabold">{formatPrice(selectedOrder.total)}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider block">
                Take Fraud Action:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* 1. Mark as Suspicious */}
                <button
                  type="button"
                  disabled={isProcessingFraud}
                  onClick={() => handleExecuteFraudAction("MARK_SUSPICIOUS")}
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#080D1B] border border-amber-500/30 hover:bg-amber-500/10 text-amber-300 text-xs font-bold transition-all text-left disabled:opacity-50"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="block">Mark as Suspicious</span>
                    <span className="text-[10px] text-[#94A3B8] font-normal">
                      Flag for extra phone verification
                    </span>
                  </div>
                </button>

                {/* 2. Flag for Review */}
                <button
                  type="button"
                  disabled={isProcessingFraud}
                  onClick={() => handleExecuteFraudAction("FLAG_REVIEW")}
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#080D1B] border border-purple-500/30 hover:bg-purple-500/10 text-purple-300 text-xs font-bold transition-all text-left disabled:opacity-50"
                >
                  <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="block">Flag for Review</span>
                    <span className="text-[10px] text-[#94A3B8] font-normal">
                      Manual review queue
                    </span>
                  </div>
                </button>

                {/* 3. Mark as Fake */}
                <button
                  type="button"
                  disabled={isProcessingFraud}
                  onClick={() => handleExecuteFraudAction("MARK_FAKE")}
                  className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all text-left disabled:opacity-50"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="block">Mark as Fake / Fraud</span>
                    <span className="text-[10px] text-rose-300/80 font-normal">
                      Block delivery & cancel order
                    </span>
                  </div>
                </button>

                {/* 4. Unmark / Clear Flag */}
                <button
                  type="button"
                  disabled={isProcessingFraud}
                  onClick={() => handleExecuteFraudAction("UNMARK")}
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#080D1B] border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-300 text-xs font-bold transition-all text-left disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="block">Unmark / Clear Flag</span>
                    <span className="text-[10px] text-[#94A3B8] font-normal">
                      Restore order to normal
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Optional Reason Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#94A3B8] block">
                Flag Reason (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Invalid bKash transaction ID, customer phone unreachable..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full bg-[#080D1B] border border-[#1B2A45] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            {/* Internal Admin Note */}
            <div className="space-y-1.5 pt-2 border-t border-[#1B2A45]">
              <label className="text-xs font-semibold text-[#94A3B8] flex items-center justify-between">
                <span>Add Internal Admin Note:</span>
                <span className="text-[10px] text-[#94A3B8]/60">Staff audit log</span>
              </label>
              <textarea
                rows={2}
                placeholder="Write internal notes about this order verification..."
                value={adminNoteText}
                onChange={(e) => setAdminNoteText(e.target.value)}
                className="w-full bg-[#080D1B] border border-[#1B2A45] rounded-xl p-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
              />
              {adminNoteText.trim() && (
                <button
                  type="button"
                  disabled={isProcessingFraud}
                  onClick={() => handleExecuteFraudAction("ADD_NOTE")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 hover:bg-[#00D9FF] hover:text-[#050812] text-xs font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Note Only</span>
                </button>
              )}
            </div>

            {/* Previous Notes History */}
            {selectedOrder.recentNotes && selectedOrder.recentNotes.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-[#1B2A45]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                  Past Admin Notes:
                </span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedOrder.recentNotes.map((n, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[#080D1B] border border-[#1B2A45] text-[11px] text-[#94A3B8]"
                    >
                      • {n}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="flex items-center justify-end pt-3 border-t border-[#1B2A45]">
              <button
                type="button"
                onClick={() => setIsFraudModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#080D1B] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
