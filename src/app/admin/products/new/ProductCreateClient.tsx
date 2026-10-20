"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Package,
  Layers,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { slugify, numberToPaisa } from "@/lib/utils";

interface CategoryOption {
  id: string;
  name: string;
}

interface VariationRow {
  sku: string;
  regularPrice: number; // in Taka
  salePrice: number | "";
  stockStatus: string;
  deliveryInstructions: string;
}

export function ProductCreateClient({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const router = useRouter();

  // Basic Info
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [productType, setProductType] = useState("DIGITAL_SUBSCRIPTION");
  const [badge, setBadge] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");

  // Base Pricing in BDT (Taka)
  const [regularPrice, setRegularPrice] = useState<number | "">("");
  const [salePrice, setSalePrice] = useState<number | "">("");
  const [stockStatus, setStockStatus] = useState("IN_STOCK");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Variations
  const [hasVariations, setHasVariations] = useState(false);
  const [variations, setVariations] = useState<VariationRow[]>([
    {
      sku: "",
      regularPrice: 0,
      salePrice: "",
      stockStatus: "IN_STOCK",
      deliveryInstructions: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
  };

  const addVariationRow = () => {
    setVariations((prev) => [
      ...prev,
      {
        sku: `${slug.toUpperCase().slice(0, 4)}-VAR-${prev.length + 1}`,
        regularPrice: typeof regularPrice === "number" ? regularPrice : 0,
        salePrice: "",
        stockStatus: "IN_STOCK",
        deliveryInstructions: "",
      },
    ]);
  };

  const removeVariationRow = (idx: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateVariation = (
    index: number,
    field: keyof VariationRow,
    value: any
  ) => {
    setVariations((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (regularPrice === "" || Number(regularPrice) < 0) {
      setError("Please enter a valid regular price in BDT (৳).");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        slug,
        categoryId,
        productType,
        badge: badge || null,
        shortDesc: shortDesc || null,
        fullDesc: fullDesc || null,
        featuredImage: featuredImage || null,
        regularPrice: numberToPaisa(Number(regularPrice)),
        salePrice: salePrice !== "" ? numberToPaisa(Number(salePrice)) : null,
        stockStatus,
        isFeatured,
        isPublished,
        variations: hasVariations
          ? variations.map((v) => ({
              sku: v.sku || null,
              regularPrice: numberToPaisa(Number(v.regularPrice)),
              salePrice: v.salePrice !== "" ? numberToPaisa(Number(v.salePrice)) : null,
              stockStatus: v.stockStatus,
              isActive: true,
              deliveryInstructions: v.deliveryInstructions || null,
            }))
          : undefined,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create product");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#00D9FF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-[#F8FAFC]">
              Create New Digital Product
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Add subscriptions, software licenses, digital services, or downloads.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Publishing..." : "Publish Product"}</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* Grid: Left Main, Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Pricing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Basic Information */}
          <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#00D9FF] flex items-center gap-2">
              <Package className="w-4 h-4" />
              General Information
            </h2>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Product Title *
              </label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. ChatGPT Plus Official Subscription"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                URL Slug *
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="chatgpt-plus-official"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Short Description
              </label>
              <Textarea
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Brief 1-2 sentence highlight for catalog cards..."
                rows={2}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Full Description & Specs
              </label>
              <Textarea
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                placeholder="Detailed features, inclusions, redemption steps..."
                rows={5}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Featured Image URL
              </label>
              <Input
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://... or /images/..."
              />
            </div>
          </div>

          {/* Card: Base Pricing */}
          <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#00D9FF]">
              Base Pricing (BDT ৳)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Regular Price (৳) *
                </label>
                <Input
                  type="number"
                  value={regularPrice}
                  onChange={(e) =>
                    setRegularPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="e.g. 1500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Sale Price (৳) (Optional)
                </label>
                <Input
                  type="number"
                  value={salePrice}
                  onChange={(e) =>
                    setSalePrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="e.g. 1200"
                />
              </div>
            </div>
          </div>

          {/* Card: Variations */}
          <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#00D9FF] flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Product Variations
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Enable if this product has plans, durations, or package tiers.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVariations}
                  onChange={(e) => setHasVariations(e.target.checked)}
                  className="rounded border-[#1B2A45] bg-[#0B1224] text-[#00D9FF] w-4 h-4"
                />
                <span className="text-xs font-semibold text-[#F8FAFC]">
                  Enable Variations
                </span>
              </label>
            </div>

            {hasVariations && (
              <div className="space-y-4 pt-3 border-t border-[#1B2A45]">
                {variations.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#101A30] border border-[#1B2A45] space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F8FAFC]">
                        Variation #{idx + 1}
                      </span>
                      {variations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariationRow(idx)}
                          className="p-1 text-[#94A3B8] hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] text-[#94A3B8] mb-1">
                          SKU Identifier
                        </label>
                        <Input
                          value={v.sku}
                          onChange={(e) =>
                            updateVariation(idx, "sku", e.target.value)
                          }
                          placeholder="PRO-1M"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#94A3B8] mb-1">
                          Regular (৳) *
                        </label>
                        <Input
                          type="number"
                          value={v.regularPrice}
                          onChange={(e) =>
                            updateVariation(
                              idx,
                              "regularPrice",
                              Number(e.target.value)
                            )
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#94A3B8] mb-1">
                          Sale (৳)
                        </label>
                        <Input
                          type="number"
                          value={v.salePrice}
                          onChange={(e) =>
                            updateVariation(
                              idx,
                              "salePrice",
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#94A3B8] mb-1">
                        Delivery Instructions
                      </label>
                      <Input
                        value={v.deliveryInstructions}
                        onChange={(e) =>
                          updateVariation(
                            idx,
                            "deliveryInstructions",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Credentials will be sent within 10 minutes"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="secondary"
                  onClick={addVariationRow}
                  className="w-full flex items-center justify-center gap-2 text-xs py-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Variation</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Taxonomy & Organization */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#00D9FF]">
              Organization
            </h2>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#101A30] border border-[#1B2A45] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Product Type
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full bg-[#101A30] border border-[#1B2A45] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
              >
                <option value="DIGITAL_SUBSCRIPTION">
                  AI Subscription / Cloud Tool
                </option>
                <option value="PREMIUM_APP">Premium Application</option>
                <option value="DIGITAL_SERVICE">Professional Service</option>
                <option value="ONLINE_COURSE">Online Video / Course</option>
                <option value="LICENSE_SOFTWARE">Software License Key</option>
                <option value="DIGITAL_DOWNLOAD">Digital Asset / Template</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Promotional Badge
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-[#101A30] border border-[#1B2A45] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
              >
                <option value="">None</option>
                <option value="Popular">Popular</option>
                <option value="Best Seller">Best Seller</option>
                <option value="Trending">Trending</option>
                <option value="New">New</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Stock Status
              </label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
                className="w-full bg-[#101A30] border border-[#1B2A45] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
              >
                <option value="IN_STOCK">In Stock (Available)</option>
                <option value="UNLIMITED">Unlimited Digital Supply</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>

            <div className="pt-2 border-t border-[#1B2A45] space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-[#1B2A45] bg-[#0B1224] text-[#00D9FF] w-4 h-4"
                />
                <span className="text-xs text-[#F8FAFC]">
                  Featured Product (Show on homepage promo)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-[#1B2A45] bg-[#0B1224] text-[#00D9FF] w-4 h-4"
                />
                <span className="text-xs text-[#F8FAFC]">
                  Publish immediately to storefront
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
