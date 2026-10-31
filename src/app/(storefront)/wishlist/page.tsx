"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Sparkles, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (item: (typeof items)[0]) => {
    const effectivePrice =
      item.salePrice && item.salePrice > 0 ? item.salePrice : item.regularPrice;

    addItem({
      id: item.productId,
      productId: item.productId,
      name: item.name,
      image: item.featuredImage || null,
      price: effectivePrice,
      regularPrice: item.regularPrice,
      quantity: 1,
    });

    toast.success(`Added ${item.name} to cart!`);
  };

  if (!mounted) {
    return (
      <div className="min-h-[60vh] bg-[#050812] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00D9FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#050812] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A45] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-2">
              <Link href="/" className="hover:text-[#00D9FF] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#F8FAFC]">My Wishlist</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] flex items-center gap-2.5">
              <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
              <span>Saved Items & Wishlist</span>
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Keep track of software licenses, AI subscriptions, and courses you want to buy later.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearWishlist}
                className="px-3.5 py-2 rounded-xl bg-[#0B1224] border border-[#1B2A45] text-xs font-semibold text-[#94A3B8] hover:text-rose-400 hover:border-rose-500/40 transition-colors"
              >
                Clear Wishlist
              </button>
              <Link
                href="/products"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#2563FF] text-xs font-bold text-[#050812] hover:opacity-90 transition-opacity"
              >
                Explore More
              </Link>
            </div>
          )}
        </div>

        {/* Wishlist Items Grid */}
        {items.length === 0 ? (
          <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-12 sm:p-16 text-center space-y-5 max-w-xl mx-auto shadow-2xl">
            <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <Heart className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-[#F8FAFC]">Your Wishlist is Empty</h2>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                You haven&apos;t added any products to your wishlist yet. Browse our catalog and click the heart icon on any product!
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] text-white text-xs font-bold shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:opacity-95 transition-opacity"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((item) => {
              const effectivePrice =
                item.salePrice && item.salePrice > 0 ? item.salePrice : item.regularPrice;
              const hasDiscount =
                item.salePrice && item.salePrice > 0 && item.regularPrice > item.salePrice;

              return (
                <div
                  key={item.productId}
                  className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] hover:border-[#00D9FF]/40 p-4 flex flex-col justify-between transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,217,255,0.12)]"
                >
                  <div className="space-y-3">
                    {/* Top Row: Category / Badge & Remove */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#00D9FF] bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {item.categoryName || "Digital Product"}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image / Graphic */}
                    <Link
                      href={`/products/${item.slug}`}
                      className="block aspect-video rounded-xl bg-[#080D1B] border border-[#1B2A45] overflow-hidden relative group/img"
                    >
                      {item.featuredImage ? (
                        <Image
                          src={item.featuredImage}
                          alt={item.name}
                          fill
                          className="object-cover group-hover/img:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#00D9FF]">
                          <Sparkles className="w-8 h-8" />
                        </div>
                      )}
                    </Link>

                    {/* Title */}
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#00D9FF] transition-colors truncate">
                        {item.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-[#00D9FF]">
                        {formatPrice(effectivePrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-[#94A3B8] line-through">
                          {formatPrice(item.regularPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-3 border-t border-[#1B2A45] flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 hover:bg-[#00D9FF] hover:text-[#050812] text-xs font-bold transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                    <Link
                      href={`/products/${item.slug}`}
                      className="px-3 py-2 rounded-xl bg-[#101A30] border border-[#1B2A45] hover:border-[#00D9FF]/40 text-xs font-medium text-[#F8FAFC] transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
