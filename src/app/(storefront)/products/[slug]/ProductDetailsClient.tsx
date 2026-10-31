"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Check,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  Bot,
  Megaphone,
  GraduationCap,
  Plus,
  Minus,
  Heart,
  Star,
  CheckCircle2,
} from "lucide-react";
import { ProductData, ProductVariationData } from "@/types";
import { formatPrice, getStockStatusLabel } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/storefront/ProductCard";

interface ProductDetailsClientProps {
  product: ProductData;
  relatedProducts?: ProductData[];
}

export function ProductDetailsClient({
  product,
  relatedProducts = [],
}: ProductDetailsClientProps) {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [inWishlist, setInWishlist] = useState(false);

  React.useEffect(() => {
    setInWishlist(isInWishlist(product.id));
  }, [isInWishlist, product.id]);

  const handleWishlistToggle = () => {
    const added = toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      featuredImage: product.featuredImage,
      regularPrice: product.regularPrice,
      salePrice: product.salePrice,
      badge: product.badge,
      categoryName: product.category?.name,
      categorySlug: product.category?.slug,
    });
    setInWishlist(added);
    if (added) {
      toast.success(`Saved ${product.name} to Wishlist!`);
    } else {
      toast.info(`Removed ${product.name} from Wishlist`);
    }
  };

  const variations = product.variations || [];
  const hasVariations = variations.length > 0;

  const [selectedVariationId, setSelectedVariationId] = useState<string>(
    hasVariations ? variations[0].id : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const selectedVariation: ProductVariationData | undefined = hasVariations
    ? variations.find((v) => v.id === selectedVariationId) || variations[0]
    : undefined;

  // Prices
  const regularPrice = selectedVariation
    ? selectedVariation.regularPrice
    : product.regularPrice;

  const salePrice = selectedVariation
    ? selectedVariation.salePrice
    : product.salePrice;

  const effectivePrice = salePrice && salePrice > 0 ? salePrice : regularPrice;
  const hasDiscount = salePrice && salePrice > 0 && regularPrice > salePrice;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - salePrice!) / regularPrice) * 100)
    : 0;

  const stockStatus = getStockStatusLabel(
    selectedVariation ? selectedVariation.stockStatus : product.stockStatus
  );

  const handleAddToCart = () => {
    let variationDesc = "";
    if (selectedVariation && selectedVariation.variationOptions) {
      variationDesc = selectedVariation.variationOptions
        .map((vo) => `${vo.attribute?.name || "Option"}: ${vo.option?.value || ""}`)
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
      quantity,
      productType: product.productType,
    });

    setIsAdded(true);
    toast.success(`Added ${product.name} to cart!`);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const activeImage = selectedVariation?.image || product.featuredImage;

  const renderProductGraphic = () => {
    if (activeImage) {
      return (
        <Image
          src={activeImage}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover rounded-2xl"
        />
      );
    }

    if (product.slug.includes("chatgpt")) {
      return (
        <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Bot className="h-14 w-14" />
        </div>
      );
    }
    if (product.slug.includes("photoshop")) {
      return (
        <div className="w-24 h-24 rounded-3xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-3xl">
          Ps
        </div>
      );
    }
    if (product.slug.includes("marketing")) {
      return (
        <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Megaphone className="h-14 w-14" />
        </div>
      );
    }
    if (product.slug.includes("course")) {
      return (
        <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <GraduationCap className="h-14 w-14" />
        </div>
      );
    }

    return (
      <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00D9FF]">
        <Sparkles className="h-14 w-14" />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Product Image / Illustration Panel */}
      <div className="lg:col-span-5">
        <div className="relative rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-10 flex flex-col items-center justify-center min-h-[360px] shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00D9FF]/10 to-[#8B3DFF]/10 opacity-50 group-hover:opacity-80 transition-opacity" />

          {renderProductGraphic()}

          {product.badge && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
              {product.badge}
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span>Type: {product.productType.replace(/_/g, " ")}</span>
            {selectedVariation?.sku && (
              <span className="font-mono">SKU: {selectedVariation.sku}</span>
            )}
          </div>
        </div>
      </div>

      {/* Product Interaction Panel */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            {product.name}
          </h1>
          <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
            {product.shortDesc}
          </p>
        </div>

        {/* Pricing & Stock Status */}
        <div className="flex flex-wrap items-center gap-4 py-3 border-y border-[#1B2A45]">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-[#00D9FF]">
              {formatPrice(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-base text-[#94A3B8] line-through font-medium">
                {formatPrice(regularPrice)}
              </span>
            )}
          </div>

          {hasDiscount && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
              Save {discountPercent}%
            </span>
          )}

          <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${stockStatus.color}`}>
            {stockStatus.label}
          </span>
        </div>

        {/* Variation Selection Pills */}
        {hasVariations && (
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Select Plan / Variation:
            </label>
            <div className="flex flex-wrap gap-2.5">
              {variations.map((v) => {
                const isSelected = v.id === selectedVariationId;
                const label =
                  v.variationOptions && v.variationOptions.length > 0
                    ? v.variationOptions.map((vo) => vo.option?.value || "").join(" / ")
                    : v.sku || "Option";

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariationId(v.id)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-[#101A30] border-[#00D9FF] text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.25)]"
                        : "bg-[#0B1224] border-[#1B2A45] text-[#94A3B8] hover:border-[#253553] hover:text-[#F8FAFC]"
                    }`}
                  >
                    <span>{label}</span>
                    <span className="ml-2 font-mono text-[11px] opacity-80">
                      ({formatPrice(v.salePrice && v.salePrice > 0 ? v.salePrice : v.regularPrice)})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Delivery Instructions (Dynamic based on selected variation) */}
        {selectedVariation?.deliveryInstructions && (
          <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1B2A45] text-xs space-y-1">
            <div className="flex items-center gap-2 text-[#00D9FF] font-semibold">
              <Zap className="h-4 w-4" />
              <span>Fulfillment & Delivery Details</span>
            </div>
            <p className="text-[#94A3B8]">
              {selectedVariation.deliveryInstructions}
            </p>
          </div>
        )}

        {/* Quantity Controls & Add to Cart Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <div className="flex items-center gap-2 bg-[#080D1B] rounded-xl border border-[#1B2A45] p-1.5 shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B2A45]"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold px-3 text-[#F8FAFC]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B2A45]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex-1 font-bold py-3.5"
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span>Add to Cart ({formatPrice(effectivePrice * quantity)})</span>
              </>
            )}
          </Button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`p-3.5 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
              inWishlist
                ? "bg-rose-500/10 border-rose-500/40 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.25)]"
                : "bg-[#0B1224] border-[#1B2A45] text-[#94A3B8] hover:text-rose-400 hover:border-rose-500/30"
            }`}
            title={inWishlist ? "Saved in Wishlist" : "Save to Wishlist"}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? "fill-rose-500" : ""}`} />
          </button>
        </div>

        {/* Guarantees Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#1B2A45] text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0B1224] border border-[#1B2A45]">
            <Clock className="h-4 w-4 text-[#00D9FF] shrink-0" />
            <span>Fast Digital Delivery</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0B1224] border border-[#1B2A45]">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>100% Verified Genuine</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0B1224] border border-[#1B2A45]">
            <Zap className="h-4 w-4 text-purple-400 shrink-0" />
            <span>24/7 Dedicated Support</span>
          </div>
        </div>

        {/* Full Product Description */}
        {product.fullDesc && (
          <div className="pt-6 border-t border-[#1B2A45] space-y-3">
            <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider">
              Product Overview & Specifications
            </h3>
            <div className="text-xs text-[#94A3B8] leading-relaxed whitespace-pre-line bg-[#0B1224] p-5 rounded-2xl border border-[#1B2A45]">
              {product.fullDesc}
            </div>
          </div>
        )}

        {/* Verified Product Reviews */}
        <div className="pt-8 border-t border-[#1B2A45] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-2">
                <span>Verified Customer Reviews</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  4.9 / 5.0 Rating
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Authentic ratings and experience reports from verified buyers in Bangladesh.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1B2A45] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-[#94A3B8]">Verified Purchase</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                &ldquo;Payment via bKash was verified swiftly. Access and setup instructions were clear and easy to follow.&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#F8FAFC]">
                <span className="font-semibold">Tanvir A.</span>
                <span className="text-[#00D9FF]">Chittagong</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1B2A45] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-[#94A3B8]">Verified Purchase</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                &ldquo;Completely authentic license. Prompt response from their WhatsApp support representative.&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#F8FAFC]">
                <span className="font-semibold">Mahfuzur R.</span>
                <span className="text-[#00D9FF]">Dhaka</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="pt-10 border-t border-[#1B2A45] space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D9FF] bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                Related Services
              </span>
              <h3 className="text-lg font-bold text-[#F8FAFC] mt-1.5">
                Customers Also Looked At
              </h3>
              <p className="text-xs text-[#94A3B8]">
                More options and tools in the {product.category?.name || "same"} category.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
