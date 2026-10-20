"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatPrice, getPaymentStatusLabel } from "@/lib/utils";
import { Check, X, Clock, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

interface SubmissionItem {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  method: string;
  transactionId?: string | null;
  senderNumber?: string | null;
  amount: number;
  status: string;
  submittedAt: string;
  reviewNotes?: string | null;
}

interface Props {
  initialSubmissions: SubmissionItem[];
}

export function PaymentVerificationClient({ initialSubmissions }: Props) {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(initialSubmissions);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "VERIFIED" | "REJECTED">("PENDING");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filtered = submissions.filter((s) => {
    const matchesFilter = filter === "ALL" || s.status === filter;
    const matchesSearch =
      search === "" ||
      s.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (s.transactionId && s.transactionId.toLowerCase().includes(search.toLowerCase())) ||
      (s.senderNumber && s.senderNumber.includes(search));
    return matchesFilter && matchesSearch;
  });

  const handleVerify = async (submissionId: string, action: "APPROVE" | "REJECT") => {
    setProcessingId(submissionId);
    try {
      const res = await fetch("/api/admin/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, action }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Action failed");
      }

      toast.success(data.message);

      // Update local state
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? { ...s, status: action === "APPROVE" ? "VERIFIED" : "REJECTED" }
            : s
        )
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to process verification.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0B1224] border border-[#1B2A45] w-full sm:w-auto">
          {(["PENDING", "VERIFIED", "REJECTED", "ALL"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab
                  ? "bg-[#00D9FF] text-[#050812]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              {tab === "PENDING"
                ? "Pending Review"
                : tab === "VERIFIED"
                ? "Approved"
                : tab === "REJECTED"
                ? "Rejected"
                : "All"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search TrxID, order #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B1224] text-xs text-[#F8FAFC] pl-8 pr-3 py-2 rounded-xl border border-[#1B2A45] focus:outline-none focus:border-[#00D9FF]"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
        </div>
      </div>

      {/* Submissions Table Card */}
      <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 shadow-xl">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#94A3B8]">
            No payment submissions found matching this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2A45] text-[#94A3B8] uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Order #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-3">Transaction ID (TrxID)</th>
                  <th className="py-3 px-3">Sender Phone</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A45]/40">
                {filtered.map((item) => {
                  const statusInfo = getPaymentStatusLabel(item.status);
                  const isPending = item.status === "PENDING";
                  const isProcessing = processingId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-[#101A30]/40 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-[#00D9FF]">
                        <Link href={`/order/${item.orderNumber}`} className="hover:underline">
                          {item.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-[#F8FAFC] block truncate max-w-[120px]">
                          {item.customerName}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] block truncate max-w-[120px]">
                          {item.customerEmail}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 uppercase text-[11px] font-bold text-[#F8FAFC]">
                        {item.method}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-cyan-300 bg-[#080D1B] rounded px-2">
                        {item.transactionId || "N/A"}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#F8FAFC]">
                        {item.senderNumber || "N/A"}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#F8FAFC]">
                        {formatPrice(item.amount)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={isProcessing}
                              onClick={() => handleVerify(item.id, "APPROVE")}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold transition-all disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              disabled={isProcessing}
                              onClick={() => handleVerify(item.id, "REJECT")}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-bold transition-all disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#94A3B8] italic">Reviewed</span>
                        )}
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
