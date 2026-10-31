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
  Trash2,
  Loader2,
  AlertTriangle,
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
  customers: initialCustomers,
  totalCustomers: initialTotalCustomers,
  totalBuyers: initialTotalBuyers,
  totalRevenue,
  totalOrdersCount,
}: CustomersManagementClientProps) {
  const [customerList, setCustomerList] = useState<CustomerData[]>(initialCustomers);
  const [totalCustomersCount, setTotalCustomersCount] = useState(initialTotalCustomers);
  const [totalBuyersCount, setTotalBuyersCount] = useState(initialTotalBuyers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "BUYERS" | "ADMINS">("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Delete Customer State
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const promptDeleteCustomer = (customer: CustomerData) => {
    if (customer.role === "ADMIN") {
      toast.error("Administrator accounts cannot be deleted from the customer manager.");
      return;
    }
    setDeletingCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCustomer = async () => {
    if (!deletingCustomer) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/customers/${deletingCustomer.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete customer account.");
      }

      toast.success(data.message || `Customer ${deletingCustomer.name} deleted successfully.`);

      // Update state
      setCustomerList((prev) => prev.filter((c) => c.id !== deletingCustomer.id));
      setTotalCustomersCount((prev) => Math.max(0, prev - 1));
      if (deletingCustomer.totalOrders > 0) {
        setTotalBuyersCount((prev) => Math.max(0, prev - 1));
      }

      // If details modal was open for this user, close it
      if (selectedCustomer?.id === deletingCustomer.id) {
        setIsDetailModalOpen(false);
        setSelectedCustomer(null);
      }

      setIsDeleteModalOpen(false);
      setDeletingCustomer(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete customer account.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCustomers = customerList.filter((c) => {
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#F8FAFC] flex items-center gap-2">
            <Users className="h-6 w-6 text-[#00D9FF]" />
            <span>Customers & Users Directory (গ্রাহক তালিকা)</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Registered customer accounts, orders history, WhatsApp channels, and account control.
          </p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Customers */}
        <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Registered Accounts
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#F8FAFC] mt-1">
                {totalCustomersCount}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF]">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-[#00D9FF] flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Active authenticated users</span>
          </div>
        </div>

        {/* Buyers Count */}
        <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Paying Customers (ক্রেতা)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                {totalBuyersCount}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>
              {totalCustomersCount > 0
                ? `${Math.round((totalBuyersCount / totalCustomersCount) * 100)}% conversion rate`
                : "0% conversion"}
            </span>
          </div>
        </div>

        {/* Total Orders Placed */}
        <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Total Orders Placed
              </span>
              <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1">
                {totalOrdersCount}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-purple-400 flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Services, tools & courses</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Lifetime Revenue
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#00D9FF] mt-1">
                {formatPrice(totalRevenue)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00D9FF]/20 to-[#8B3DFF]/20 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF]">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-[#94A3B8] flex items-center gap-1">
            <span>Verified paid orders in BDT</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by customer name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080D1B] border border-[#1B2A45] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F8FAFC] placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#00D9FF]"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto scrollbar-none">
          <button
            onClick={() => setRoleFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              roleFilter === "ALL"
                ? "bg-[#00D9FF] text-[#050812]"
                : "bg-[#080D1B] text-[#94A3B8] border border-[#1B2A45] hover:text-[#F8FAFC]"
            }`}
          >
            All Accounts ({customerList.length})
          </button>

          <button
            onClick={() => setRoleFilter("BUYERS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              roleFilter === "BUYERS"
                ? "bg-emerald-400 text-[#050812]"
                : "bg-[#080D1B] text-[#94A3B8] border border-[#1B2A45] hover:text-emerald-400"
            }`}
          >
            Buyers Only ({customerList.filter((c) => c.totalOrders > 0).length})
          </button>

          <button
            onClick={() => setRoleFilter("ADMINS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              roleFilter === "ADMINS"
                ? "bg-amber-400 text-[#050812]"
                : "bg-[#080D1B] text-[#94A3B8] border border-[#1B2A45] hover:text-amber-400"
            }`}
          >
            Admins & Staff ({customerList.filter((c) => c.role === "ADMIN" || c.role === "STAFF").length})
          </button>
        </div>
      </div>

      {/* Main Customers Table */}
      <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1B2A45] bg-[#080D1B] text-[#94A3B8] uppercase tracking-wider text-[10px]">
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
                  const isAccountAdmin = user.role === "ADMIN";

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
                            title="View customer profile details and orders"
                          >
                            <span>Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>

                          {/* Delete Customer Button */}
                          {!isAccountAdmin && (
                            <button
                              type="button"
                              onClick={() => promptDeleteCustomer(user)}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-colors"
                              title="Delete customer account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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
                              #{order.orderNumber}
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

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#1B2A45]">
              {selectedCustomer.role !== "ADMIN" ? (
                <button
                  type="button"
                  onClick={() => promptDeleteCustomer(selectedCustomer)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-semibold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Customer Account</span>
                </button>
              ) : (
                <div />
              )}

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

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setDeletingCustomer(null);
          }
        }}
        maxWidth="md"
        title={
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="text-base font-bold">Delete Customer Account</span>
          </div>
        }
      >
        {deletingCustomer && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 space-y-2">
              <p className="font-semibold">
                Are you sure you want to permanently delete this customer&apos;s account?
              </p>
              <p className="text-rose-300/80 leading-relaxed text-[11px]">
                This will delete their login credentials, saved profile, and account access. Past order receipts will be detached and preserved for store accounting.
              </p>
            </div>

            {/* Customer Summary Card */}
            <div className="p-3.5 rounded-xl bg-[#080D1B] border border-[#1B2A45] space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Customer:</span>
                <span className="font-bold text-[#F8FAFC]">{deletingCustomer.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Email:</span>
                <span className="font-mono text-[#00D9FF]">{deletingCustomer.email}</span>
              </div>
              {deletingCustomer.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Phone:</span>
                  <span className="font-mono text-[#F8FAFC]">{deletingCustomer.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Total Orders:</span>
                <span className="font-semibold text-purple-400">
                  {deletingCustomer.totalOrders} order{deletingCustomer.totalOrders === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1B2A45]">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingCustomer(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#101A30] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B2A45] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteCustomer}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
