"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Bot,
  Layers,
  Megaphone,
  Code,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Check,
} from "lucide-react";
import { ProductData, ProductVariationData } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { toast } from "@/components/ui/Toast";

interface ProductCardProps {
  product: ProductData;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const variations = product.variations || [];
  const hasVariations = variations.length > 0;

  // Active variation selection
  const [selectedVariationId, setSelectedVariationId] = useState<string>(
    hasVariations ? variations[0].id : ""
  );
  const [isAdded, setIsAdded] = useState(false);

  const selectedVariation: ProductVariationData | undefined = hasVariations
    ? variations.find((v) => v.id === selectedVariationId) || variations[0]
    : undefined;

  // Calculate prices based on variation or simple product
  const regularPrice = selectedVariation
    ? selectedVariation.regularPrice
    : product.regularPrice;

  const salePrice = selectedVariation
    ? selectedVariation.salePrice
    : product.salePrice;

  const effectivePrice = salePrice && salePrice > 0 ? salePrice : regularPrice;

  // Product logo / placeholder icon based on slug/category
  const renderProductIcon = () => {
    if (product.featuredImage) {
      return (
        <Image
          src={product.featuredImage}
          alt={product.name}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      );
    }

    if (product.slug.includes("chatgpt")) {
      return (
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Bot className="h-7 w-7" />
        </div>
      );
    }
    if (product.slug.includes("photoshop") || product.slug.includes("adobe")) {
      return (
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-lg">
          Ps
        </div>
      );
    }
    if (product.slug.includes("marketing")) {
      return (
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Megaphone className="h-7 w-7" />
        </div>
      );
    }
    if (product.slug.includes("web-development") || product.slug.includes("dev")) {
      return (
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-base">
          {"</>"}
        </div>
      );
    }
    if (product.slug.includes("course")) {
      return (
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <GraduationCap className="h-7 w-7" />
        </div>
      );
    }

    return (
      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00D9FF]">
        <Sparkles className="h-7 w-7" />
      </div>
    );
  };

  const handleAddToCart = () => {
    let variationDesc = "";
    if (selectedVariation && selectedVariation.variationOptions) {
      variationDesc = selectedVariation.variationOptions
        .map((vo) => `${vo.attribute.name}: ${vo.option.value}`)
        .join(", ");
    }

    addItem({
      id: selectedVariation ? `${product.id}_${selectedVariation.id}` : product.id,
      productId: product.id,
      variationId: selectedVariation?.id || null,
      name: product.name,
      variationDesc: variationDesc || undefined,
      image: selectedVariation?.image || product.featuredImage || null,
      price: effectivePrice,
      regularPrice: regularPrice,
      quantity: 1,
      productType: product.productType,
    });

    setIsAdded(true);
    toast.success(`Added ${product.name} to cart!`);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "popular":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "best seller":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "trending":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      case "new":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      default:
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-[#0B1224] border border-[#1B2A45] hover:border-[#00D9FF]/40 p-4 sm:p-5 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,217,255,0.12)] hover:-translate-y-1">
      {/* Top row: Icon & Badge */}
      <div className="flex items-start justify-between gap-2 mb-4">
        {renderProductIcon()}

        {product.badge && (
          <span
            className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border tracking-wide uppercase ${getBadgeStyle(
              product.badge
            )}`}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Product Titles */}
      <div className="space-y-1.5 mb-4">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#00D9FF] transition-colors leading-snug truncate">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
          {product.shortDesc || "High quality verified digital product."}
        </p>
      </div>

      {/* Pricing Row */}
      <div className="flex items-baseline gap-2 mb-3.5">
        <span className="text-lg font-extrabold text-[#00D9FF]">
          {formatPrice(effectivePrice)}
        </span>
        {salePrice && salePrice > 0 && regularPrice > salePrice && (
          <span className="text-xs text-[#94A3B8] line-through font-medium">
            {formatPrice(regularPrice)}
          </span>
        )}
      </div>

      {/* Variation Selector Dropdown (if variations exist) */}
      {hasVariations && (
        <div className="relative mb-4">
          <select
            value={selectedVariationId}
            onChange={(e) => setSelectedVariationId(e.target.value)}
            className="w-full appearance-none rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3 py-2 text-xs font-medium text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF] cursor-pointer"
          >
            {variations.map((v) => {
              const label =
                v.variationOptions && v.variationOptions.length > 0
                  ? v.variationOptions.map((vo) => vo.option.value).join(" / ")
                  : v.sku || "Option";
              return (
                <option key={v.id} value={v.id} className="bg-[#0B1224] text-[#F8FAFC]">
                  {label}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#94A3B8]">
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto space-y-2">
        <button
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white transition-all shadow-[0_0_15px_rgba(0,217,255,0.2)] active:scale-95 ${
            isAdded
              ? "bg-emerald-600 shadow-emerald-500/20"
              : "bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] hover:brightness-110"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
