"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  ExternalLink,
  Users,
  TrendingUp,
  Tag,
  Search,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { formatPrice, getStockStatusLabel } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";

export interface VariationData {
  id: string;
  sku: string | null;
  regularPrice: number; // in paisa
  salePrice: number | null; // in paisa
  isActive: boolean;
  variationOptions: Array<{
    attribute: { name: string };
    option: { value: string };
  }>;
}

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  badge: string | null;
  productType: string;
  stockStatus: string;
  isPublished: boolean;
  regularPrice: number; // in paisa
  salePrice: number | null; // in paisa
  category: { name: string } | null;
  variations: VariationData[];
}

export interface ProductStatItem {
  product: ProductData;
  timesTaken: number;
  uniqueClients: number;
}

interface AdminProductsCatalogClientProps {
  initialProducts: ProductStatItem[];
  grandTotalSales: number;
  totalUniqueClients: number;
}

interface VariationPriceEditState {
  id: string;
  label: string;
  sku: string;
  sellPrice: number | "";
  regularPrice: number | "";
}

export function AdminProductsCatalogClient({
  initialProducts,
  grandTotalSales,
  totalUniqueClients,
}: AdminProductsCatalogClientProps) {
  const [products, setProducts] = useState<ProductStatItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form Edit State
  const [baseSellPrice, setBaseSellPrice] = useState<number | "">("");
  const [baseRegularPrice, setBaseRegularPrice] = useState<number | "">("");
  const [variationEdits, setVariationEdits] = useState<VariationPriceEditState[]>([]);

  // Open modal for a product
  const handleOpenPriceModal = (product: ProductData) => {
    setSelectedProduct(product);

    // If product has variations, prioritize the first variation for base values so it matches customer view
    const firstVar = product.variations && product.variations.length > 0 ? product.variations[0] : null;
    const sourceRegPrice = firstVar ? firstVar.regularPrice : product.regularPrice;
    const sourceSalePrice = firstVar ? firstVar.salePrice : product.salePrice;

    const currentSell =
      sourceSalePrice && sourceSalePrice > 0
        ? Math.round(sourceSalePrice / 100)
        : Math.round(sourceRegPrice / 100);

    const currentRegular =
      sourceSalePrice && sourceSalePrice > 0 && sourceRegPrice > sourceSalePrice
        ? Math.round(sourceRegPrice / 100)
        : "";

    setBaseSellPrice(currentSell);
    setBaseRegularPrice(currentRegular);

    // Variations in Taka
    const vStates: VariationPriceEditState[] = (product.variations || []).map((v) => {
      const vSell =
        v.salePrice && v.salePrice > 0
          ? Math.round(v.salePrice / 100)
          : Math.round(v.regularPrice / 100);

      const vRegular =
        v.salePrice && v.salePrice > 0 && v.regularPrice > v.salePrice
          ? Math.round(v.regularPrice / 100)
          : "";

      const label =
        v.variationOptions && v.variationOptions.length > 0
          ? v.variationOptions.map((vo) => vo.option.value).join(" / ")
          : v.sku || "Standard";

      return {
        id: v.id,
        label,
        sku: v.sku || "",
        sellPrice: vSell,
        regularPrice: vRegular,
      };
    });

    setVariationEdits(vStates);
    setIsModalOpen(true);
  };

  const handleVariationChange = (
    id: string,
    field: "sellPrice" | "regularPrice",
    val: string
  ) => {
    const num = val === "" ? "" : Number(val);
    setVariationEdits((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: num } : item))
    );

    // If changing the first variation, sync base state as well
    if (variationEdits.length > 0 && variationEdits[0].id === id) {
      if (field === "sellPrice") setBaseSellPrice(num);
      if (field === "regularPrice") setBaseRegularPrice(num);
    }
  };

  const handleSavePrices = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const isSingleTier = !selectedProduct.variations || selectedProduct.variations.length <= 1;

    let targetSell = baseSellPrice;
    let targetRegular = baseRegularPrice;

    if (isSingleTier) {
      if (targetSell === "" || Number(targetSell) < 0) {
        toast.error("Please enter a valid Sell Price (বিক্রয় মূল্য).");
        return;
      }
    } else {
      // Multi-variation: ensure each variation has a valid price
      for (const v of variationEdits) {
        if (v.sellPrice === "" || Number(v.sellPrice) < 0) {
          toast.error(`Please enter a valid Sell Price for: ${v.label}`);
          return;
        }
      }
      targetSell = variationEdits[0]?.sellPrice ?? baseSellPrice;
      targetRegular = variationEdits[0]?.regularPrice ?? baseRegularPrice;
    }

    setIsSaving(true);

    try {
      const payload = {
        productId: selectedProduct.id,
        sellPrice: Number(targetSell),
        regularPrice: targetRegular === "" ? null : Number(targetRegular),
        variations: isSingleTier
          ? selectedProduct.variations.map((v) => ({
              id: v.id,
              sellPrice: Number(targetSell),
              regularPrice: targetRegular === "" ? null : Number(targetRegular),
            }))
          : variationEdits.map((v) => ({
              id: v.id,
              sellPrice: Number(v.sellPrice),
              regularPrice: v.regularPrice === "" ? null : Number(v.regularPrice),
            })),
      };

      const res = await fetch("/api/admin/products/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update prices");
      }

      // Optimistically update local state so table and UI reflect new prices immediately
      const updatedSellPaisa = Math.round(Number(targetSell) * 100);
      const updatedRegularPaisa =
        targetRegular && Number(targetRegular) > Number(targetSell)
          ? Math.round(Number(targetRegular) * 100)
          : updatedSellPaisa;
      const updatedSalePaisa =
        targetRegular && Number(targetRegular) > Number(targetSell)
          ? updatedSellPaisa
          : null;

      setProducts((prev) =>
        prev.map((item) => {
          if (item.product.id !== selectedProduct.id) return item;

          let updatedVariations: VariationData[] = [];

          if (isSingleTier) {
            updatedVariations = item.product.variations.map((v) => ({
              ...v,
              regularPrice: updatedRegularPaisa,
              salePrice: updatedSalePaisa,
            }));
          } else {
            updatedVariations = item.product.variations.map((v) => {
              const edit = variationEdits.find((e) => e.id === v.id);
              if (!edit) return v;

              const vSellPaisa = Math.round(Number(edit.sellPrice) * 100);
              const vRegPaisa =
                edit.regularPrice && Number(edit.regularPrice) > Number(edit.sellPrice)
                  ? Math.round(Number(edit.regularPrice) * 100)
                  : vSellPaisa;
              const vSalePaisa =
                edit.regularPrice && Number(edit.regularPrice) > Number(edit.sellPrice)
                  ? vSellPaisa
                  : null;

              return {
                ...v,
                regularPrice: vRegPaisa,
                salePrice: vSalePaisa,
              };
            });
          }

          return {
            ...item,
            product: {
              ...item.product,
              regularPrice: updatedRegularPaisa,
              salePrice: updatedSalePaisa,
              variations: updatedVariations,
            },
          };
        })
      );

      toast.success(`Prices updated and synced with customer storefront for ${selectedProduct.name}!`);
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save prices");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.product.name.toLowerCase().includes(q) ||
      item.product.slug.toLowerCase().includes(q) ||
      (item.product.category?.name || "").toLowerCase().includes(q)
    );
  });

  const isSingleTierProduct = !selectedProduct?.variations || selectedProduct.variations.length <= 1;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC]">
            Products & Variations Catalog
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage your digital products, services, sell prices, offer discounts, and track client orders.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] text-[#050812] font-bold text-xs shadow-[0_0_15px_rgba(0,217,255,0.3)] hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0B1224] border border-[#1B2A45] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Total Catalog Products
            </span>
            <span className="text-xl font-black text-[#F8FAFC] block mt-0.5">
              {products.length} Items
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00D9FF]">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1224] border border-[#1B2A45] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Total Services Taken (বিক্রয় সংখ্যা)
            </span>
            <span className="text-xl font-black text-[#00D9FF] block mt-0.5">
              {grandTotalSales} বার বিক্রি
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1224] border border-[#1B2A45] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Total Clients Served (গ্রাহক সংখ্যা)
            </span>
            <span className="text-xl font-black text-purple-400 block mt-0.5">
              {totalUniqueClients} জন গ্রাহক
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Catalog Table Container */}
      <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 shadow-xl space-y-4">
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1B2A45] pb-4">
          <div>
            <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <span>Catalog & Price Control</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-[#00D9FF] border border-cyan-500/30">
                Customer View Synced
              </span>
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Click &quot;Edit Price&quot; on any product to update the Sell Price and Offer / Regular Price shown to customers.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search product or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080D1B] text-xs text-[#F8FAFC] pl-8 pr-3 py-2 rounded-xl border border-[#1B2A45] focus:outline-none focus:border-[#00D9FF]"
            />
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1B2A45] text-[#94A3B8] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Customer View Price (বিক্রয় ও অফার মূল্য)</th>
                <th className="py-3 px-3">Total Sold / Clients</th>
                <th className="py-3 px-3">Variations</th>
                <th className="py-3 px-3">Stock Status</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2A45]/40">
              {filteredProducts.map(({ product: p, timesTaken, uniqueClients }) => {
                const stock = getStockStatusLabel(p.stockStatus);

                // Prioritize first variation price so table matches customer view 1:1
                const firstVar = p.variations && p.variations.length > 0 ? p.variations[0] : null;
                const activeReg = firstVar ? firstVar.regularPrice : p.regularPrice;
                const activeSale = firstVar ? firstVar.salePrice : p.salePrice;

                const hasDiscount = activeSale && activeSale > 0 && activeReg > activeSale;
                const effectiveSellPrice = hasDiscount ? activeSale! : activeReg;

                return (
                  <tr key={p.id} className="hover:bg-[#101A30]/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-[#F8FAFC] block">{p.name}</span>
                      {p.badge && (
                        <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {p.badge}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-[#94A3B8]">
                      {p.category?.name || "Uncategorized"}
                    </td>

                    <td className="py-3.5 px-3 text-[#94A3B8] text-[11px]">
                      {p.productType.replace(/_/g, " ")}
                    </td>

                    {/* Pricing Column - Exact Customer View Price */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-[#00D9FF] text-sm">
                            {formatPrice(effectiveSellPrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-[11px] text-[#94A3B8] line-through font-medium">
                              {formatPrice(activeReg)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#94A3B8]/70">
                          {hasDiscount ? "Offer Active (কাটাকুটি মূল্য)" : "Regular Price"}
                        </span>
                      </div>
                    </td>

                    {/* Total Sold / Clients Column */}
                    <td className="py-3.5 px-3">
                      {timesTaken > 0 ? (
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-xs text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded-md border border-[#00D9FF]/30">
                              {timesTaken} বার বিক্রি
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-semibold mt-1">
                            {uniqueClients} জন গ্রাহক
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold text-[#94A3B8]/80">
                            0 বার
                          </span>
                          <span className="text-[10px] text-[#94A3B8]/60">
                            এখনো কেউ নেয়নি
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-[#F8FAFC]">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#080D1B] border border-[#1B2A45] text-[11px]">
                        <Layers className="w-3 h-3 text-[#00D9FF]" />
                        <span>{p.variations.length} option{p.variations.length === 1 ? "" : "s"}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${stock.color}`}>
                        {stock.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${
                          p.isPublished
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                        }`}
                      >
                        {p.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenPriceModal(p)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 hover:bg-[#00D9FF] hover:text-[#050812] transition-all shadow-sm"
                          title="Edit Sell Price & Offer Price"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          <span>Edit Price</span>
                        </button>

                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A30]"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== PRICE EDIT MODAL ==================== */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSaving && setIsModalOpen(false)}
        maxWidth="2xl"
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00D9FF]">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-extrabold text-[#F8FAFC] block">
                Edit Product Pricing (মূল্য পরিবর্তন)
              </span>
              <span className="text-xs text-[#94A3B8] font-normal block">
                {selectedProduct?.name} ({selectedProduct?.category?.name || "Digital Service"})
              </span>
            </div>
          </div>
        }
      >
        {selectedProduct && (
          <form onSubmit={handleSavePrices} className="space-y-6">
            {/* Guide Info Box */}
            <div className="p-3.5 rounded-xl bg-[#080D1B] border border-cyan-500/20 text-xs text-[#94A3B8] space-y-1">
              <div className="flex items-center gap-2 text-[#00D9FF] font-bold">
                <HelpCircle className="w-4 h-4" />
                <span>মূল্য নির্ধারণ সহায়িকা (Pricing Guide):</span>
              </div>
              <p className="leading-relaxed">
                • <strong>Sell Price (বিক্রয় মূল্য ৳):</strong> কাস্টমার যে দাম দিয়ে প্রোডাক্টটি কিনবে (বাধ্যতামূলক)।
              </p>
              <p className="leading-relaxed">
                • <strong>Offer / Regular Price (পূর্বের মূল্য ৳):</strong> ডিসকাউন্ট/অফার দেখাতে চাইলে পূর্বের দাম লিখুন (যেমন: <s>৳5,000</s> কেটে ৳3,000 দেখাবে)। অফার না থাকলে এটি খালি রাখুন।
              </p>
              <p className="leading-relaxed text-emerald-400 font-medium">
                ✓ এখানে সংরক্ষিত দাম সরাসরি কাস্টমার ভিউ (হোমপেজ, ক্যাটাগরি, প্রোডাক্ট পেজ ও কার্ট)-এ সাথে সাথে লাইভ হবে।
              </p>
            </div>

            {/* Case 1: Single Tier Product (e.g. Online Course Bundle, Adobe Photoshop) */}
            {isSingleTierProduct ? (
              <div className="rounded-2xl bg-[#080D1B] border border-[#1B2A45] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1B2A45]/60 pb-2">
                  <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
                    <span>Product Pricing (স্টোরফ্রন্ট মূল্য)</span>
                  </h4>
                  {selectedProduct.variations.length === 1 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-[#00D9FF] border border-cyan-500/30">
                      Tier: {selectedProduct.variations[0].sku || "Default Tier"}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                      Sell Price (বিক্রয় মূল্য ৳) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#00D9FF]">
                        ৳
                      </span>
                      <input
                        type="number"
                        required
                        min="0"
                        value={baseSellPrice}
                        onChange={(e) =>
                          setBaseSellPrice(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        placeholder="e.g. 3000"
                        className="w-full bg-[#101A30] border border-[#1B2A45] rounded-xl py-2 pl-8 pr-3 text-sm font-bold text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
                      />
                    </div>
                    <span className="text-[10px] text-[#94A3B8] block mt-1">
                      Customer pays this price
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                      Offer / Regular Price (পূর্বের কাটাকুটি মূল্য ৳)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#94A3B8]">
                        ৳
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={baseRegularPrice}
                        onChange={(e) =>
                          setBaseRegularPrice(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        placeholder="e.g. 5000 (Optional)"
                        className="w-full bg-[#101A30] border border-[#1B2A45] rounded-xl py-2 pl-8 pr-3 text-sm font-bold text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
                      />
                    </div>
                    <span className="text-[10px] text-[#94A3B8] block mt-1">
                      Shown as crossed-out discount (<s>৳5,000</s>)
                    </span>
                  </div>
                </div>

                {/* Dynamic Live Preview */}
                <div className="p-3.5 rounded-xl bg-[#101A30] border border-[#1B2A45] flex items-center justify-between text-xs">
                  <span className="text-[#94A3B8] font-medium">Customer View Preview:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#00D9FF] text-base">
                      ৳{baseSellPrice || 0}
                    </span>
                    {baseRegularPrice && Number(baseRegularPrice) > Number(baseSellPrice || 0) && (
                      <>
                        <span className="text-xs text-[#94A3B8] line-through font-medium">
                          ৳{baseRegularPrice}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          {Math.round(
                            ((Number(baseRegularPrice) - Number(baseSellPrice)) /
                              Number(baseRegularPrice)) *
                              100
                          )}
                          % OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Case 2: Multi-Tier Product (e.g. ChatGPT Plus with 1M, 3M, 1Y; Web Development with E-commerce, Landing) */
              <div className="rounded-2xl bg-[#080D1B] border border-[#1B2A45] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1B2A45]/60 pb-2">
                  <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Package / Tier Pricing ({variationEdits.length} Options)</span>
                  </h4>
                  <span className="text-[10px] text-purple-400 font-medium">
                    Storefront dropdown options
                  </span>
                </div>

                <div className="space-y-3.5">
                  {variationEdits.map((v, idx) => {
                    const hasVDiscount =
                      v.regularPrice !== "" &&
                      v.sellPrice !== "" &&
                      Number(v.regularPrice) > Number(v.sellPrice);

                    return (
                      <div
                        key={v.id}
                        className="p-4 rounded-xl bg-[#101A30] border border-[#1B2A45] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-500/10 text-[#00D9FF] border border-cyan-500/30">
                              {v.label}
                            </span>
                            {idx === 0 && (
                              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                Default Storefront Display
                              </span>
                            )}
                            {v.sku && (
                              <span className="text-[10px] font-mono text-[#94A3B8]">
                                SKU: {v.sku}
                              </span>
                            )}
                          </div>

                          {/* Variation Discount Badge */}
                          {hasVDiscount && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {Math.round(
                                ((Number(v.regularPrice) - Number(v.sellPrice)) /
                                  Number(v.regularPrice)) *
                                  100
                              )}
                              % DISCOUNT
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#F8FAFC] mb-1">
                              Sell Price (বিক্রয় মূল্য ৳) <span className="text-rose-400">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#00D9FF]">
                                ৳
                              </span>
                              <input
                                type="number"
                                required
                                min="0"
                                value={v.sellPrice}
                                onChange={(e) =>
                                  handleVariationChange(v.id, "sellPrice", e.target.value)
                                }
                                placeholder="e.g. 1200"
                                className="w-full bg-[#0B1224] border border-[#1B2A45] rounded-lg py-1.5 pl-7 pr-3 text-xs font-bold text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-[#F8FAFC] mb-1">
                              Offer / Regular Price (পূর্বের কাটাকুটি মূল্য ৳)
                            </label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#94A3B8]">
                                ৳
                              </span>
                              <input
                                type="number"
                                min="0"
                                value={v.regularPrice}
                                onChange={(e) =>
                                  handleVariationChange(v.id, "regularPrice", e.target.value)
                                }
                                placeholder="e.g. 1800 (Optional)"
                                className="w-full bg-[#0B1224] border border-[#1B2A45] rounded-lg py-1.5 pl-7 pr-3 text-xs font-bold text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1B2A45]">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B2A45] transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#2563FF] text-[#050812] text-xs font-extrabold shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#050812] border-t-transparent rounded-full animate-spin" />
                    <span>Saving & Syncing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Pricing (মূল্য সংরক্ষণ করুন)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
