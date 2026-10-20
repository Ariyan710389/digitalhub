"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, getTotal, getItemCount } =
    useCartStore();

  const total = getTotal();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) closeCart();
    };
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#050812]/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#080D1B] border-l border-[#1B2A45] h-full flex flex-col z-10 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1B2A45] bg-[#070B16]">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-[#F8FAFC]">Your Cart</h2>
            <span className="flex items-center justify-center h-5 px-2 text-xs font-bold rounded-full bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30">
              {itemCount}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A30] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-[#0B1224] border border-[#1B2A45] flex items-center justify-center mb-4 text-[#94A3B8]">
                <ShoppingBag className="h-10 w-10 text-[#94A3B8]/60" />
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">Your cart is empty</h3>
              <p className="text-sm text-[#94A3B8] max-w-xs mb-6">
                Add some amazing digital products or services to get started!
              </p>
              <Button
                variant="primary"
                onClick={closeCart}
                className="w-auto px-6"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3.5 rounded-xl bg-[#0B1224] border border-[#1B2A45] hover:border-[#253553] transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-[#101A30] border border-[#1B2A45] flex items-center justify-center shrink-0 overflow-hidden text-cyan-400">
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

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-[#F8FAFC] truncate">
                    {item.name}
                  </h4>
                  {item.variationDesc && (
                    <p className="text-xs text-[#00D9FF] mt-0.5 truncate font-medium">
                      {item.variationDesc}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-sm font-semibold text-[#00D9FF]">
                      {formatPrice(item.price)}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 bg-[#080D1B] rounded-lg border border-[#1B2A45] p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B2A45]"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-semibold px-2 text-[#F8FAFC]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B2A45]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-[#94A3B8] hover:text-rose-400 transition-colors ml-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with totals & action */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#1B2A45] bg-[#070B16] space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#94A3B8]">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#F8FAFC]">
                <span>Total</span>
                <span className="text-lg text-[#00D9FF]">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Link href="/checkout" onClick={closeCart} className="block w-full">
                <Button variant="primary" size="lg" className="w-full">
                  Proceed to Checkout <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/cart" onClick={closeCart} className="block w-full">
                <Button variant="secondary" size="md" className="w-full">
                  View Full Cart
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
