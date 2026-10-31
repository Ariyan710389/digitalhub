"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  ShieldCheck,
  UserCheck,
  TrendingUp,
  AlertCircle,
  X,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { formatPrice, getOrderStatusLabel } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";

export interface CustomerOrderSummary {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentMethod: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  orders: CustomerOrderSummary[];
}

interface CustomersManagementClientProps {
  customers: CustomerData[];
  totalCustomers: number;
  totalBuyers: number;
  totalRevenue: number;
  totalOrdersCount: number;
}

export function CustomersManagementClient({
  customers,
  totalCustomers,
  totalBuyers,
  totalRevenue,
  totalOrdersCount,
}: CustomersManagementClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "BUYERS" | "ADMINS">("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getCleanPhone = (phone?: string | null) => {
    if (!phone) return "";
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.length === 11 && clean.startsWith("01")) {
      clean = "88" + clean;
    }
    return clean;
  };

  const getWhatsAppLink = (phone?: string | null, name?: string) => {
    const clean = getCleanPhone(phone);
    if (!clean) return "";
    const greeting = name ? `Hello ${name},` : "Hello,";
    const msg = `${greeting} greetings from DigitalHub Support! How can we assist you today?`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (roleFilter === "BUYERS") {
      return c.totalOrders > 0;
    }
    if (roleFilter === "ADMINS") {
      return c.role === "ADMIN" || c.role === "STAFF";
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#00D9FF]" />
            <span>Customer & User Directory</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            View registered user profiles, login details, contact numbers, and purchase history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#0B1224] border border-[#1B2A45] text-xs font-mono text-[#00D9FF]">
            {filteredCustomers.length} Showing of {customers.length} Users
          </span>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Users */}
        <div className="p-4 rounded-2xl bg-[#0B1224] border border-[#1B2A45] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Total Registered Users
            </span>
            <span className="text-2xl font-black text-[#F8FAFC] block mt-0.5">
              {totalCustomers}
            </span>
            <span className="text-[10px] text-cyan-400">Total accounts created</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00D9FF]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Buyers / Paying Clients */}
        <div className="p-4 rounded-2xl bg-[#0B1224] border border-[#1B2A45] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Active Buyers (সার্ভিস গ্রহীতা)
            </span>
            <span className="text-2xl font-black text-emerald-400 block mt-0.5">
              {totalBuyers}
            </span>
            <span className="text-[10px] text-emerald-400/80">Placed at least 1 order</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Total Orders Placed */}
        <div className="p-4 rounded-2xl bg-[#0B1224] border border-[#1B2A45] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Total Customer Orders
            </span>
            <span className="text-2xl font-black text-purple-400 block mt-0.5">
              {totalOrdersCount}
            </span>
            <span className="text-[10px] text-purple-400/80">Across all catalog items</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Total Customer Spent */}
        <div className="p-4 rounded-2xl bg-[#0B1224] border border-[#1B2A45] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Total Customer Revenue
            </span>
            <span className="text-2xl font-black text-[#00D9FF] block mt-0.5">
              {formatPrice(totalRevenue)}
            </span>
            <span className="text-[10px] text-[#00D9FF]/80">Confirmed purchases</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00D9FF]">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 shadow-xl space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1B2A45] pb-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setRoleFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                roleFilter === "ALL"
                  ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_12px_rgba(0,217,255,0.3)]"
                  : "bg-[#080D1B] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              All Users ({customers.length})
            </button>

            <button
              onClick={() => setRoleFilter("BUYERS")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                roleFilter === "BUYERS"
                  ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_12px_rgba(0,217,255,0.3)]"
                  : "bg-[#080D1B] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              Buyers with Orders ({totalBuyers})
            </button>

            <button
              onClick={() => setRoleFilter("ADMINS")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                roleFilter === "ADMINS"
                  ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_12px_rgba(0,217,255,0.3)]"
                  : "bg-[#080D1B] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              Admins & Staff
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080D1B] text-xs text-[#F8FAFC] pl-8 pr-8 py-2 rounded-xl border border-[#1B2A45] focus:outline-none focus:border-[#00D9FF]"
            />
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1B2A45] text-[#94A3B8] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">User Profile (নাম)</th>
                <th className="py-3 px-3">Email Address (ইমেইল)</th>
                <th className="py-3 px-3">Phone Number (মোবাইল)</th>
                <th className="py-3 px-3">Joined Date (তারিখ)</th>
                <th className="py-3 px-3">Orders & Spent (ক্রয়)</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2A45]/40">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#94A3B8]">
                    No customers found matching &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((user) => {
                  const cleanPhone = getCleanPhone(user.phone);
                  const waLink = getWhatsAppLink(user.phone, user.name);

                  return (
                    <tr key={user.id} className="hover:bg-[#101A30]/50 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00D9FF] to-[#8B3DFF] p-[1.5px] shrink-0">
                            <div className="w-full h-full bg-[#070B16] rounded-[10px] flex items-center justify-center font-bold text-xs text-[#00D9FF]">
                              {getInitials(user.name)}
                            </div>
                          </div>
                          <div>
                            <span className="font-bold text-[#F8FAFC] block">{user.name}</span>
                            <span className="text-[10px] font-mono text-[#94A3B8]/70">
                              ID: {user.id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 group">
                          <Mail className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                          <a
                            href={`mailto:${user.email}`}
                            className="font-medium text-[#F8FAFC] hover:text-[#00D9FF] transition-colors truncate max-w-[180px]"
                            title={user.email}
                          >
                            {user.email}
                          </a>
                          <button
                            onClick={() => handleCopy(user.email, "Email")}
                            className="opacity-0 group-hover:opacity-100 p-1 text-[#94A3B8] hover:text-[#00D9FF] transition-opacity"
                            title="Copy Email"
                          >
                            {copiedText === user.email ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-3">
                        {user.phone ? (
                          <div className="flex items-center gap-1.5 group">
                            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <a
                              href={`tel:${user.phone}`}
                              className="font-mono font-semibold text-[#F8FAFC] hover:text-emerald-400 transition-colors"
                            >
                              {user.phone}
                            </a>
                            <button
                              onClick={() => handleCopy(user.phone!, "Phone")}
                              className="opacity-0 group-hover:opacity-100 p-1 text-[#94A3B8] hover:text-emerald-400 transition-opacity"
                              title="Copy Phone"
                            >
                              {copiedText === user.phone ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#94A3B8]/50 italic">Not set</span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-3 text-[#94A3B8]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                          <span className="text-[11px]">{formatDate(user.createdAt)}</span>
                        </div>
                      </td>

                      {/* Orders & Total Spent */}
                      <td className="py-3.5 px-3">
                        {user.totalOrders > 0 ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-[#00D9FF]">
                              {formatPrice(user.totalSpent)}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-semibold">
                              {user.totalOrders} order{user.totalOrders === 1 ? "" : "s"} placed
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-[11px] text-[#94A3B8]/60 font-medium">
                              0 orders
                            </span>
                            <span className="text-[10px] text-[#94A3B8]/40">No purchases yet</span>
                          </div>
                        )}
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${
                            user.role === "ADMIN"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : user.role === "STAFF"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                              : "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Direct WhatsApp button if phone exists */}
                          {waLink && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-[#050812] transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* View Customer Details & Order History */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCustomer(user);
                              setIsDetailModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#0B1224] border border-[#1B2A45] hover:border-[#00D9FF]/50 text-[#F8FAFC] hover:text-[#00D9FF] transition-all"
                          >
                            <span>Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== CUSTOMER DETAILS MODAL ==================== */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        maxWidth="2xl"
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00D9FF] to-[#8B3DFF] p-[1.5px] shrink-0">
              <div className="w-full h-full bg-[#070B16] rounded-[10px] flex items-center justify-center font-bold text-sm text-[#00D9FF]">
                {getInitials(selectedCustomer?.name)}
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold text-[#F8FAFC] block">
                {selectedCustomer?.name}
              </span>
              <span className="text-xs text-[#94A3B8] font-normal block">
                Customer Profile & Order History
              </span>
            </div>
          </div>
        }
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Contact Details Card */}
            <div className="rounded-2xl bg-[#080D1B] border border-[#1B2A45] p-4 space-y-3">
              <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>Contact & Account Information</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#101A30] border border-[#1B2A45]">
                  <span className="text-[10px] text-[#94A3B8] block uppercase">Email Address</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-semibold text-[#F8FAFC] truncate">
                      {selectedCustomer.email}
                    </span>
                    <button
                      onClick={() => handleCopy(selectedCustomer.email, "Email")}
                      className="p-1 text-[#94A3B8] hover:text-[#00D9FF]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#101A30] border border-[#1B2A45]">
                  <span className="text-[10px] text-[#94A3B8] block uppercase">Phone Number</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono font-semibold text-[#F8FAFC]">
                      {selectedCustomer.phone || "Not provided"}
                    </span>
                    {selectedCustomer.phone && (
                      <button
                        onClick={() => handleCopy(selectedCustomer.phone!, "Phone")}
                        className="p-1 text-[#94A3B8] hover:text-[#00D9FF]"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#101A30] border border-[#1B2A45]">
                  <span className="text-[10px] text-[#94A3B8] block uppercase">Registered On</span>
                  <span className="font-semibold text-[#F8FAFC] mt-1 block">
                    {formatDate(selectedCustomer.createdAt)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#101A30] border border-[#1B2A45]">
                  <span className="text-[10px] text-[#94A3B8] block uppercase">Lifetime Spend</span>
                  <span className="font-extrabold text-[#00D9FF] text-sm mt-1 block">
                    {formatPrice(selectedCustomer.totalSpent)} ({selectedCustomer.totalOrders} Orders)
                  </span>
                </div>
              </div>

              {/* Quick Communication Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1B2A45]">
                {selectedCustomer.phone && (
                  <>
                    <a
                      href={getWhatsAppLink(selectedCustomer.phone, selectedCustomer.name)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-[#050812] text-xs font-bold transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Customer</span>
                    </a>

                    <a
                      href={`tel:${selectedCustomer.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-[#00D9FF] border border-cyan-500/30 hover:bg-[#00D9FF] hover:text-[#050812] text-xs font-bold transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Mobile</span>
                    </a>
                  </>
                )}

                <a
                  href={`mailto:${selectedCustomer.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101A30] text-[#F8FAFC] border border-[#1B2A45] hover:border-[#00D9FF]/40 text-xs font-semibold transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            {/* Orders Placed by Customer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                  <span>Order History & Purchased Services ({selectedCustomer.orders.length})</span>
                </h4>
              </div>

              {selectedCustomer.orders.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#080D1B] border border-[#1B2A45] text-center text-xs text-[#94A3B8]">
                  <p>This customer has created an account but hasn&apos;t placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {selectedCustomer.orders.map((order) => {
                    const status = getOrderStatusLabel(order.status);
                    return (
                      <div
                        key={order.id}
                        className="p-3.5 rounded-xl bg-[#080D1B] border border-[#1B2A45] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#00D9FF]">
                              {order.orderNumber}
                            </span>
                            <span className="text-[10px] text-[#94A3B8]">
                              • {formatDate(order.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${status.color}`}
                            >
                              {status.label}
                            </span>
                            <span className="font-extrabold text-xs text-[#F8FAFC]">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {order.items.map((item) => (
                            <span
                              key={item.id}
                              className="px-2 py-0.5 rounded-lg bg-[#101A30] border border-[#1B2A45] text-[11px] text-[#94A3B8]"
                            >
                              {item.productName} (x{item.quantity})
                            </span>
                          ))}
                        </div>

                        <div className="pt-1 flex items-center justify-between text-[11px] text-[#94A3B8]">
                          <span>Method: <strong className="text-[#F8FAFC] uppercase">{order.paymentMethod || "N/A"}</strong></span>
                          <Link
                            href={`/order/${order.orderNumber}`}
                            target="_blank"
                            className="text-[#00D9FF] hover:underline font-semibold flex items-center gap-1"
                          >
                            <span>Inspect Order</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Close */}
            <div className="flex items-center justify-end pt-3 border-t border-[#1B2A45]">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#101A30] text-[#F8FAFC] hover:bg-[#1B2A45] transition-colors"
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
