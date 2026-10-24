"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CreditCard,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

export interface PaymentMethodItem {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  merchantNumber?: string | null;
  accountType?: string | null;
  instructions?: string | null;
  isActive: boolean;
}

interface CheckoutClientProps {
  paymentMethods: PaymentMethodItem[];
}

export function CheckoutClient({ paymentMethods }: CheckoutClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotal, clearCart } = useCartStore();

  const total = getTotal();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  // Default to first active payment method or bkash
  const activeMethods = paymentMethods.length > 0 ? paymentMethods : [
    {
      id: "bkash",
      name: "bKash",
      slug: "bkash",
      displayName: "bKash",
      merchantNumber: "+880 1873168818",
      accountType: "Personal",
      instructions: "Go to your bKash App or dial *247#. Select 'Send Money', enter the number below and the exact order total amount. Once done, enter the Transaction ID (TrxID) below.",
      isActive: true,
    }
  ];

  const [paymentMethod, setPaymentMethod] = useState<string>(
    activeMethods[0]?.slug || "bkash"
  );
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prepopulate if user is logged in
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
        phone: session.user.phone || prev.phone,
      }));
    }
  }, [session]);

  const currentMethod =
    activeMethods.find((m) => m.slug === paymentMethod) || activeMethods[0];

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    toast.info("Copied number to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError("Please fill in your name, email, and phone number.");
      return;
    }

    // Require transaction ID if mobile payment selected
    if (["bkash", "nagad", "rocket"].includes(paymentMethod)) {
      if (!transactionId.trim()) {
        setError("Please enter the Transaction ID (TrxID) for verification.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          transactionId: transactionId.trim() || null,
          senderNumber: senderNumber.trim() || formData.phone.trim(),
          items: items.map((i) => ({
            productId: i.productId,
            variationId: i.variationId,
            name: i.name,
            variationDesc: i.variationDesc,
            quantity: i.quantity,
            price: i.price,
            image: i.image,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit order");
      }

      // Success
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order/${data.orderNumber}`);
    } catch (err: any) {
      setError(err.message || "An error occurred while placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 bg-[#050812] text-center">
        <div className="max-w-md mx-auto p-8 rounded-2xl bg-[#0B1224] border border-[#1B2A45]">
          <ShoppingBag className="h-12 w-12 text-[#94A3B8] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#F8FAFC] mb-2">Your cart is empty</h2>
          <p className="text-xs text-[#94A3B8] mb-6">
            Please add digital products or services to your cart before proceeding to checkout.
          </p>
          <Link href="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#050812] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#94A3B8] hover:text-[#00D9FF] transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
            Checkout & Payment
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Complete your order with secure local Bangladesh mobile financial services.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Contact & Payment Info */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer Details */}
              <div className="p-6 rounded-2xl bg-[#0B1224] border border-[#1B2A45] space-y-4">
                <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] text-xs font-bold">
                    1
                  </span>
                  Customer & Delivery Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                      Email Address (for fulfillment) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. tanvir@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                      Mobile Number (BD) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 017XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                      Billing Address (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mirpur, Dhaka"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                    Order / Custom Requirements Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter project details, preferred activation email, or specific instructions..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF] resize-none"
                  />
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="p-6 rounded-2xl bg-[#0B1224] border border-[#1B2A45] space-y-5">
                <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] text-xs font-bold">
                    2
                  </span>
                  Select Payment Method
                </h2>

                {/* Method Options Radio Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {activeMethods.map((method) => {
                    const isSelected = paymentMethod === method.slug;
                    return (
                      <button
                        type="button"
                        key={method.slug}
                        onClick={() => setPaymentMethod(method.slug)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? "bg-[#101A30] border-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.2)] text-[#F8FAFC]"
                            : "bg-[#080D1B] border-[#1B2A45] text-[#94A3B8] hover:border-[#253553]"
                        }`}
                      >
                        <span className="text-xs font-bold">{method.displayName}</span>
                        <span className="text-[10px] text-[#94A3B8]">
                          {method.slug === "cod" ? "On Delivery" : "Mobile Pay"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Payment Instructions Box */}
                <div className="p-5 rounded-xl bg-[#080D1B] border border-[#1B2A45] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#F8FAFC]">
                        {currentMethod?.displayName || "Payment"} Instructions
                      </h4>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-relaxed">
                        {currentMethod?.instructions ||
                          "Send Money to our personal receiving number and submit your Transaction ID below."}
                      </p>
                    </div>
                  </div>

                  {/* Receiving Number Box */}
                  {currentMethod?.merchantNumber && (
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1224] border border-[#00D9FF]/30">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block">
                          RECEIVING NUMBER ({currentMethod.accountType || "PERSONAL ACCOUNT"})
                        </span>
                        <span className="text-sm font-mono font-bold text-[#00D9FF]">
                          {currentMethod.merchantNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyNumber(currentMethod.merchantNumber!)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#101A30] border border-[#1B2A45] hover:border-[#00D9FF] text-xs text-[#F8FAFC] transition-colors"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-[#00D9FF]" />
                        )}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  )}

                  {/* Transaction ID & Sender inputs for mobile payment */}
                  {paymentMethod !== "cod" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-medium text-[#F8FAFC] mb-1">
                          Transaction ID (TrxID) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 9J3K8L2M1"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full rounded-xl bg-[#0B1224] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#F8FAFC] mb-1">
                          Sender Mobile Number
                        </label>
                        <input
                          type="tel"
                          placeholder={formData.phone || "e.g. 018XXXXXXXX"}
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          className="w-full rounded-xl bg-[#0B1224] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF] font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-[#0B1224] border border-[#1B2A45] space-y-6 sticky top-28">
                <h2 className="text-base font-bold text-[#F8FAFC]">Order Summary</h2>

                {/* Items preview */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-2 border-b border-[#1B2A45]/50 gap-3"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-[#F8FAFC] truncate">
                          {item.name}
                        </div>
                        {item.variationDesc && (
                          <div className="text-[11px] text-[#00D9FF] truncate">
                            {item.variationDesc}
                          </div>
                        )}
                        <div className="text-[10px] text-[#94A3B8]">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-bold text-[#F8FAFC] shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2.5 text-xs pt-2">
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Fulfillment Fee</span>
                    <span className="text-emerald-400 font-medium">Free</span>
                  </div>
                  <div className="pt-3 border-t border-[#1B2A45] flex justify-between text-base font-bold text-[#F8FAFC]">
                    <span>Total Amount</span>
                    <span className="text-lg text-[#00D9FF]">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full text-sm font-bold py-3.5"
                >
                  Confirm & Place Order
                </Button>

                {/* Security notes */}
                <div className="space-y-2 pt-2 border-t border-[#1B2A45] text-[11px] text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Manual verification by authorized administrator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#00D9FF] shrink-0" />
                    <span>Status notifications and fulfillment tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
