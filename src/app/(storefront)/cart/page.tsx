"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const total = getTotal();

  return (
    <div className="py-12 bg-[#050812] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1B2A45]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Shopping Cart
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Review your selected digital products, variations, and licenses.
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-16 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#101A30] border border-[#1B2A45] flex items-center justify-center mx-auto mb-4 text-[#94A3B8]">
              <ShoppingBag className="h-8 w-8 text-[#94A3B8]/60" />
            </div>
            <h2 className="text-lg font-bold text-[#F8FAFC] mb-2">
              Your cart is empty
            </h2>
            <p className="text-xs text-[#94A3B8] mb-6">
              Looks like you haven't added any products or services yet.
            </p>
            <Link href="/products">
              <Button variant="primary" size="md">
                Browse All Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0B1224] border border-[#1B2A45] hover:border-[#253553] transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-xl bg-[#101A30] border border-[#1B2A45] flex items-center justify-center shrink-0 overflow-hidden text-[#00D9FF]">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="h-7 w-7" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#F8FAFC] truncate">
                        {item.name}
                      </h3>
                      {item.variationDesc && (
                        <p className="text-xs text-[#00D9FF] font-medium mt-0.5 truncate">
                          {item.variationDesc}
                        </p>
                      )}
                      <div className="text-xs text-[#94A3B8] mt-1">
                        Unit price: {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:justify-end">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-[#080D1B] rounded-xl border border-[#1B2A45] p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B2A45]"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-xs font-bold px-3 text-[#F8FAFC]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B2A45]"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Subtotal for item */}
                    <div className="text-sm font-bold text-[#00D9FF] min-w-[70px] text-right">
                      {formatPrice(item.price * item.quantity)}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-[#101A30] transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-6 space-y-6 sticky top-28">
                <h2 className="text-base font-bold text-[#F8FAFC]">Order Summary</h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Items Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Delivery Charge</span>
                    <span className="text-emerald-400 font-medium">Free (Instant)</span>
                  </div>
                  <div className="pt-3 border-t border-[#1B2A45] flex justify-between text-base font-bold text-[#F8FAFC]">
                    <span>Estimated Total</span>
                    <span className="text-[#00D9FF]">{formatPrice(total)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="block w-full">
                  <Button variant="primary" size="lg" className="w-full">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>

                <div className="space-y-2 pt-2 border-t border-[#1B2A45] text-[11px] text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-[#00D9FF]" />
                    <span>Instant fulfillment on confirmed payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Verified Bangladesh mobile payments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
