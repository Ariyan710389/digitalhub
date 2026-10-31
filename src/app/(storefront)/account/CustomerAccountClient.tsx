"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  User,
  Package,
  Clock,
  ShieldCheck,
  ChevronRight,
  Copy,
  Check,
  Zap,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogOut,
  HelpCircle,
  MessageSquare,
  GraduationCap,
  Bot,
  Laptop,
  Heart,
  Trash2,
  Phone,
  Mail,
  Edit3,
  Layers,
  Save,
  Loader2,
} from "lucide-react";
import { formatPrice, getOrderStatusLabel } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";

export interface AccountItemData {
  id: string;
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  paymentMethod?: string | null;
  transactionId?: string | null;
  createdAt: string;
  productName: string;
  variationDesc?: string | null;
  productImage?: string | null;
  productSlug?: string | null;
  productType?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryStatus: string;
  deliveryNotes?: string | null;
  orderNotes?: string[];
}

export interface AccountOrderData {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentMethod?: string | null;
  total: number;
  itemsCount: number;
  items: {
    productName: string;
    variationDesc?: string | null;
    quantity: number;
    totalPrice: number;
  }[];
  transactionId?: string | null;
}

interface CustomerAccountClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    role: string;
    createdAt?: string;
  };
  purchasedItems: AccountItemData[];
  orders: AccountOrderData[];
  whatsappNumber?: string;
}

export function CustomerAccountClient({
  user,
  purchasedItems,
  orders,
  whatsappNumber = "8801873168818",
}: CustomerAccountClientProps) {
  const [activeTab, setActiveTab] = useState<"services" | "orders" | "wishlist" | "profile" | "support">("services");
  const [itemTypeFilter, setItemTypeFilter] = useState<"all" | "courses" | "services">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Profile Edit State
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  const { items: wishlistItems, removeItem: removeWishlistItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const isCourseItem = (slug?: string | null, name?: string) => {
    const s = (slug || name || "").toLowerCase();
    return s.includes("course") || s.includes("bundle") || s.includes("masterclass") || s.includes("tutorial");
  };

  const coursesCount = purchasedItems.filter((i) => isCourseItem(i.productSlug, i.productName)).length;
  const servicesCount = purchasedItems.filter((i) => !isCourseItem(i.productSlug, i.productName)).length;

  const filteredPurchasedItems = purchasedItems.filter((item) => {
    if (itemTypeFilter === "courses") return isCourseItem(item.productSlug, item.productName);
    if (itemTypeFilter === "services") return !isCourseItem(item.productSlug, item.productName);
    return true;
  });

  const completedServicesCount = purchasedItems.filter(
    (i) => i.orderStatus === "COMPLETED" || i.deliveryStatus === "DELIVERED"
  ).length;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.info("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg("");

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      setProfileSuccessMsg("Profile information saved successfully.");
      setTimeout(() => setProfileSuccessMsg(""), 4000);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const getCleanWaLink = (orderNumber?: string) => {
    const cleanNum = whatsappNumber.replace(/[^0-9]/g, "");
    const msg = orderNumber
      ? `Hello DigitalHub Support, I need help with my Order #${orderNumber}`
      : `Hello DigitalHub Support, I have a question regarding my account services.`;
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  };

  const renderServiceIcon = (slug?: string | null, name?: string) => {
    const s = (slug || name || "").toLowerCase();
    if (s.includes("chatgpt") || s.includes("ai") || s.includes("bot")) {
      return <Bot className="h-6 w-6 text-emerald-400" />;
    }
    if (isCourseItem(slug, name)) {
      return <GraduationCap className="h-6 w-6 text-amber-400" />;
    }
    if (s.includes("web") || s.includes("dev") || s.includes("design")) {
      return <Laptop className="h-6 w-6 text-purple-400" />;
    }
    return <Zap className="h-6 w-6 text-[#00D9FF]" />;
  };

  return (
    <div className="py-10 bg-[#050812] min-h-screen text-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile & Summary Header Banner */}
        <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00D9FF]/10 via-[#2563FF]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* User Identity */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] p-[2px] shadow-[0_0_20px_rgba(0,217,255,0.3)] shrink-0">
                <div className="w-full h-full bg-[#070B16] rounded-[14px] flex items-center justify-center text-[#00D9FF] font-black text-2xl">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
                    {name || "Valued Customer"}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
                    Customer Account
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-1">{user.email}</p>
                {phone && (
                  <p className="text-xs font-mono text-[#00D9FF]/80 mt-0.5">{phone}</p>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
              <div className="p-3 rounded-2xl bg-[#080D1B] border border-[#1B2A45] text-center min-w-[75px] sm:min-w-[95px]">
                <span className="text-lg sm:text-2xl font-black text-[#00D9FF] block">
                  {servicesCount}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider block mt-0.5">
                  Services
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#080D1B] border border-[#1B2A45] text-center min-w-[75px] sm:min-w-[95px]">
                <span className="text-lg sm:text-2xl font-black text-amber-400 block">
                  {coursesCount}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider block mt-0.5">
                  Courses
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#080D1B] border border-[#1B2A45] text-center min-w-[75px] sm:min-w-[95px]">
                <span className="text-lg sm:text-2xl font-black text-purple-400 block">
                  {orders.length}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider block mt-0.5">
                  Orders
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#080D1B] border border-[#1B2A45] text-center min-w-[75px] sm:min-w-[95px]">
                <span className="text-lg sm:text-2xl font-black text-rose-400 block">
                  {wishlistItems.length}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider block mt-0.5">
                  Saved
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#1B2A45] pb-3 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "services"
                ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_15px_rgba(0,217,255,0.35)]"
                : "bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Purchased Services & Courses</span>
            <span
              className={`px-2 py-0.2 rounded-full text-[10px] ${
                activeTab === "services"
                  ? "bg-[#050812] text-[#00D9FF]"
                  : "bg-[#101A30] text-[#94A3B8]"
              }`}
            >
              {purchasedItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "orders"
                ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_15px_rgba(0,217,255,0.35)]"
                : "bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History</span>
            <span
              className={`px-2 py-0.2 rounded-full text-[10px] ${
                activeTab === "orders"
                  ? "bg-[#050812] text-[#00D9FF]"
                  : "bg-[#101A30] text-[#94A3B8]"
              }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "wishlist"
                ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_15px_rgba(0,217,255,0.35)]"
                : "bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist</span>
            <span
              className={`px-2 py-0.2 rounded-full text-[10px] ${
                activeTab === "wishlist"
                  ? "bg-[#050812] text-[#00D9FF]"
                  : "bg-[#101A30] text-[#94A3B8]"
              }`}
            >
              {wishlistItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_15px_rgba(0,217,255,0.35)]"
                : "bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("support")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "support"
                ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_15px_rgba(0,217,255,0.35)]"
                : "bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support & Help</span>
          </button>
        </div>

        {/* ==================== TAB 1: MY SERVICES & COURSES ==================== */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  Active Services, Subscriptions & Courses
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  Access your purchased digital services, credentials, and course study materials.
                </p>
              </div>

              {/* Sub-filter Pills */}
              <div className="flex items-center gap-1.5 bg-[#080D1B] p-1 rounded-xl border border-[#1B2A45]">
                <button
                  type="button"
                  onClick={() => setItemTypeFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    itemTypeFilter === "all"
                      ? "bg-[#00D9FF] text-[#050812] shadow-sm"
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  All ({purchasedItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setItemTypeFilter("courses")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    itemTypeFilter === "courses"
                      ? "bg-amber-400 text-[#050812] shadow-sm"
                      : "text-[#94A3B8] hover:text-amber-400"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Courses ({coursesCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setItemTypeFilter("services")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    itemTypeFilter === "services"
                      ? "bg-[#2563FF] text-white shadow-sm"
                      : "text-[#94A3B8] hover:text-[#00D9FF]"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Services ({servicesCount})</span>
                </button>
              </div>
            </div>

            {filteredPurchasedItems.length === 0 ? (
              <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#080D1B] border border-[#1B2A45] flex items-center justify-center text-[#94A3B8] mx-auto">
                  {itemTypeFilter === "courses" ? (
                    <GraduationCap className="h-8 w-8 text-amber-400" />
                  ) : (
                    <Zap className="h-8 w-8 text-[#00D9FF]" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#F8FAFC]">
                    {itemTypeFilter === "courses"
                      ? "No purchased courses found"
                      : itemTypeFilter === "services"
                      ? "No active digital services found"
                      : "No purchased services or courses yet"}
                  </h3>
                  <p className="text-xs text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
                    Explore our collection of ChatGPT Plus, Midjourney, development services, and online courses.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] text-white text-xs font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Products & Courses</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredPurchasedItems.map((item) => {
                  const status = getOrderStatusLabel(item.orderStatus);
                  const isCompleted =
                    item.orderStatus === "COMPLETED" || item.deliveryStatus === "DELIVERED";
                  const isProcessing =
                    item.orderStatus === "PROCESSING" || item.orderStatus === "PAID";
                  const isReview = item.orderStatus === "PAYMENT_UNDER_REVIEW";
                  const isCourse = isCourseItem(item.productSlug, item.productName);

                  return (
                    <div
                      key={item.id}
                      className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] hover:border-[#00D9FF]/40 p-6 space-y-5 transition-all shadow-xl flex flex-col justify-between"
                    >
                      {/* Top Header of Card */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#080D1B] border border-[#1B2A45] flex items-center justify-center shrink-0">
                              {renderServiceIcon(item.productSlug, item.productName)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  isCourse ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30"
                                }`}>
                                  {isCourse ? "Online Course" : "Digital Service"}
                                </span>
                              </div>
                              <h3 className="text-sm font-extrabold text-[#F8FAFC] leading-snug">
                                {item.productName}
                              </h3>
                              {item.variationDesc && (
                                <span className="inline-block text-[11px] text-[#00D9FF] font-medium">
                                  {item.variationDesc}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        {/* Order & Date Meta */}
                        <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1 border-t border-[#1B2A45]/60">
                          <span>
                            Order:{" "}
                            <Link
                              href={`/order/${item.orderNumber}`}
                              className="font-mono text-[#00D9FF] hover:underline"
                            >
                              #{item.orderNumber}
                            </Link>
                          </span>
                          <span>{new Date(item.createdAt).toLocaleDateString("en-GB")}</span>
                        </div>
                      </div>

                      {/* Delivery & Access Information Box */}
                      <div className="space-y-3">
                        {item.deliveryNotes ? (
                          <div className="p-3.5 rounded-2xl bg-[#080D1B] border border-cyan-500/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D9FF] flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-[#00D9FF]" />
                                {isCourse ? "Course Access & Drive Links" : "Access Details & Credentials"}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(item.deliveryNotes!, item.id)}
                                className="flex items-center gap-1 text-[10px] font-semibold text-[#94A3B8] hover:text-[#00D9FF] transition-colors"
                              >
                                {copiedId === item.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-xs font-mono text-[#F8FAFC] whitespace-pre-wrap break-words bg-[#050812] p-2.5 rounded-xl border border-[#1B2A45]">
                              {item.deliveryNotes}
                            </p>
                          </div>
                        ) : isCompleted ? (
                          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                            <span>
                              {isCourse
                                ? "Course is active! Access details have been unlocked."
                                : "Service is fully active! Check your confirmation receipt or WhatsApp for direct access."}
                            </span>
                          </div>
                        ) : isProcessing ? (
                          <div className="p-3.5 rounded-2xl bg-[#080D1B] border border-[#1B2A45] text-xs text-[#94A3B8] flex items-center gap-2">
                            <Clock className="w-4 h-4 shrink-0 text-[#00D9FF] animate-pulse" />
                            <span>
                              Our team is currently provisioning your credentials. Delivery within 15–60 minutes.
                            </span>
                          </div>
                        ) : isReview ? (
                          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 shrink-0 text-purple-400" />
                            <span>
                              Payment is under verification. Once approved, credentials will unlock right here.
                            </span>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                            <span>
                              Payment pending. Complete bKash/Nagad transfer to activate this service.
                            </span>
                          </div>
                        )}

                        {/* Customer Notes from Admin */}
                        {item.orderNotes && item.orderNotes.length > 0 && (
                          <div className="p-3 rounded-xl bg-[#080D1B] border border-[#1B2A45] text-xs text-[#94A3B8] space-y-1">
                            <span className="text-[10px] font-bold uppercase text-[#00D9FF]">
                              Support Update:
                            </span>
                            <p>{item.orderNotes[0]}</p>
                          </div>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-2 flex items-center gap-2 border-t border-[#1B2A45]/60">
                        <Link
                          href={`/order/${item.orderNumber}`}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#080D1B] border border-[#1B2A45] hover:border-[#00D9FF]/50 text-center text-xs font-semibold text-[#F8FAFC] hover:text-[#00D9FF] transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>View Order Receipt</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>

                        <a
                          href={getCleanWaLink(item.orderNumber)}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          title="Contact support on WhatsApp for this service"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: ORDER HISTORY ==================== */}
        {activeTab === "orders" && (
          <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#1B2A45] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#F8FAFC]">Complete Order History</h2>
                <p className="text-xs text-[#94A3B8]">
                  Review invoices, transaction verification IDs, and order logs.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#101A30] text-xs font-bold text-[#00D9FF] border border-[#1B2A45]">
                {orders.length} Total Orders
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Package className="h-10 w-10 text-[#94A3B8]/50 mx-auto" />
                <h3 className="text-sm font-semibold text-[#F8FAFC]">No orders found</h3>
                <p className="text-xs text-[#94A3B8]">
                  You have not placed any orders yet.
                </p>
                <Link
                  href="/products"
                  className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#2563FF] text-xs font-bold text-white shadow-lg"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1B2A45] text-[#94A3B8] uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Order Number</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Purchased Items</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B2A45]/50">
                    {orders.map((order) => {
                      const status = getOrderStatusLabel(order.status);
                      return (
                        <tr key={order.id} className="hover:bg-[#101A30]/40 transition-colors">
                          <td className="py-4 px-3 font-mono font-bold text-[#00D9FF]">
                            <Link
                              href={`/order/${order.orderNumber}`}
                              className="hover:underline flex items-center gap-1"
                            >
                              <span>#{order.orderNumber}</span>
                            </Link>
                          </td>
                          <td className="py-4 px-3 text-[#94A3B8] whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString("en-GB")}
                          </td>
                          <td className="py-4 px-3 text-[#F8FAFC] max-w-xs">
                            <div className="space-y-0.5">
                              {order.items.map((i, idx) => (
                                <div key={idx} className="truncate">
                                  <span className="font-semibold">{i.productName}</span>
                                  {i.variationDesc && (
                                    <span className="text-[10px] text-[#94A3B8] ml-1">
                                      ({i.variationDesc})
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-3 uppercase text-[11px] text-[#94A3B8] font-bold">
                            <div>{order.paymentMethod || "N/A"}</div>
                            {order.transactionId && (
                              <div className="text-[10px] font-mono text-[#00D9FF] lowercase">
                                Trx: {order.transactionId}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-3 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${status.color}`}
                            >
                              {status.label}
                            </span>
                          </td>
                          <td className="py-4 px-3 font-bold text-[#00D9FF] whitespace-nowrap">
                            {formatPrice(order.total)}
                          </td>
                          <td className="py-4 px-3 text-right whitespace-nowrap">
                            <Link
                              href={`/order/${order.orderNumber}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#00D9FF] hover:underline px-2.5 py-1 rounded-lg bg-[#101A30] border border-[#1B2A45]"
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
        )}

        {/* ==================== TAB 3: WISHLIST ==================== */}
        {activeTab === "wishlist" && (
          <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#1B2A45] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#F8FAFC]">Saved Wishlist Products</h2>
                <p className="text-xs text-[#94A3B8]">
                  Products and services you saved for later purchase.
                </p>
              </div>
              {wishlistItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {wishlistItems.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Heart className="h-10 w-10 text-[#94A3B8]/40 mx-auto" />
                <h3 className="text-sm font-semibold text-[#F8FAFC]">Your wishlist is empty</h3>
                <p className="text-xs text-[#94A3B8]">
                  Click the heart icon on any product or service card to save it here.
                </p>
                <Link
                  href="/products"
                  className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#2563FF] text-xs font-bold text-white shadow-lg"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.productId}
                    className="p-4 rounded-2xl bg-[#080D1B] border border-[#1B2A45] hover:border-[#00D9FF]/40 space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0B1224] border border-[#1B2A45] overflow-hidden flex items-center justify-center shrink-0">
                        {item.featuredImage ? (
                          <Image
                            src={item.featuredImage}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="w-5 h-5 text-[#00D9FF]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-[#00D9FF] font-semibold block truncate">
                          {item.categoryName || "Digital Product"}
                        </span>
                        <h4 className="text-xs font-bold text-[#F8FAFC] truncate">
                          <Link href={`/products/${item.slug}`} className="hover:underline">
                            {item.name}
                          </Link>
                        </h4>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xs font-black text-[#00D9FF]">
                            {formatPrice(item.salePrice ?? item.regularPrice)}
                          </span>
                          {item.salePrice && (
                            <span className="text-[10px] text-[#94A3B8] line-through">
                              {formatPrice(item.regularPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#1B2A45]">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart({
                            id: item.productId,
                            productId: item.productId,
                            name: item.name,
                            price: item.salePrice ?? item.regularPrice,
                            regularPrice: item.regularPrice,
                            image: item.featuredImage || undefined,
                          });
                          toast.success(`Added ${item.name} to cart!`);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#2563FF] text-[#050812] text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeWishlistItem(item.productId)}
                        className="p-1.5 rounded-lg border border-[#1B2A45] text-[#94A3B8] hover:text-rose-400 hover:border-rose-500/40"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 4: PROFILE SETTINGS ==================== */}
        {activeTab === "profile" && (
          <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 sm:p-8 shadow-xl space-y-6 max-w-2xl">
            <div className="border-b border-[#1B2A45] pb-4">
              <h2 className="text-lg font-bold text-[#F8FAFC]">Personal Profile Information</h2>
              <p className="text-xs text-[#94A3B8]">
                Update your contact details for instant service delivery and notifications.
              </p>
            </div>

            {profileSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#080D1B] border border-[#1B2A45] rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF] pr-10"
                    placeholder="Your Name"
                  />
                  <User className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block mb-1">
                  Registered Email Address (Read-only)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full bg-[#050812] border border-[#1B2A45] rounded-xl px-4 py-2.5 text-xs text-[#94A3B8] cursor-not-allowed pr-10"
                  />
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-[#94A3B8]/60 mt-0.5 block">
                  Email address cannot be changed as it is linked to your login credentials.
                </span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block mb-1">
                  Phone / WhatsApp Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#080D1B] border border-[#1B2A45] rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] font-mono focus:outline-none focus:border-[#00D9FF] pr-10"
                    placeholder="+880 1XXXXXXXXX"
                  />
                  <Phone className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-[#94A3B8]/60 mt-0.5 block">
                  Used by our team to deliver digital credentials and order updates via WhatsApp.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#2563FF] text-[#050812] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-[#1B2A45] flex justify-between items-center">
              <Link
                href="/products"
                className="text-xs text-[#00D9FF] hover:underline font-semibold"
              >
                Continue Shopping &rarr;
              </Link>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: SUPPORT & HELP ==================== */}
        {activeTab === "support" && (
          <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 sm:p-8 shadow-xl space-y-6 max-w-2xl">
            <div className="border-b border-[#1B2A45] pb-4">
              <h2 className="text-lg font-bold text-[#F8FAFC]">Customer Support & Assistance</h2>
              <p className="text-xs text-[#94A3B8]">
                Need help with your course access, digital services, or payment verification?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#080D1B] border border-[#1B2A45] space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Instant WhatsApp Help
                </span>
                <p className="text-xs text-[#94A3B8]">
                  Direct message with our Chittagong support team for fast credential delivery.
                </p>
                <a
                  href={getCleanWaLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors mt-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-[#080D1B] border border-[#1B2A45] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#00D9FF] tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Support Hours
                </span>
                <p className="text-xs text-[#94A3B8]">
                  Saturday to Thursday: 10:00 AM – 11:00 PM (BST)
                </p>
                <p className="text-[11px] text-[#00D9FF] font-semibold">
                  Average response: Under 15 minutes
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080D1B] border border-[#1B2A45] text-xs text-[#94A3B8] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#F8FAFC] tracking-wider block">
                Office & Verification Center
              </span>
              <p>Chandanaish 4370, Chittagong, Bangladesh</p>
              <p className="text-[#00D9FF]">Hotline: +880 1873-168818</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}