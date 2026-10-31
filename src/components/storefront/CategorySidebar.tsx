"use client";

import React from "react";
import {
  Layers,
  Sparkles,
  Bot,
  Megaphone,
  Code,
  GraduationCap,
  SlidersHorizontal,
  X,
  Check,
  RotateCcw,
  Search,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { CategoryData } from "@/types";

export interface FilterState {
  categorySlug: string;
  searchQuery: string;
  minPrice: number | "";
  maxPrice: number | "";
  stockStatus: string; // "ALL" | "IN_STOCK" | "ON_SALE"
  sortBy: "featured" | "price_asc" | "price_desc" | "name_asc";
}

interface CategorySidebarProps {
  categories: CategoryData[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalProductsCount: number;
  filteredCount: number;
}

const getCategoryIcon = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes("ai") || s.includes("chatgpt")) return <Bot className="w-4 h-4 text-emerald-400" />;
  if (s.includes("marketing")) return <Megaphone className="w-4 h-4 text-cyan-400" />;
  if (s.includes("dev") || s.includes("web")) return <Code className="w-4 h-4 text-purple-400" />;
  if (s.includes("course")) return <GraduationCap className="w-4 h-4 text-amber-400" />;
  return <Layers className="w-4 h-4 text-[#00D9FF]" />;
};

export function CategorySidebar({
  categories,
  filters,
  onFilterChange,
  onReset,
  totalProductsCount,
  filteredCount,
}: CategorySidebarProps) {
  const handleCategorySelect = (slug: string) => {
    onFilterChange({ ...filters, categorySlug: slug });
  };

  const handlePriceChange = (field: "minPrice" | "maxPrice", val: string) => {
    const num = val === "" ? "" : Math.max(0, Number(val));
    onFilterChange({ ...filters, [field]: num });
  };

  const handleStockChange = (val: string) => {
    onFilterChange({ ...filters, stockStatus: val });
  };

  const handleSortChange = (val: FilterState["sortBy"]) => {
    onFilterChange({ ...filters, sortBy: val });
  };

  const hasActiveFilters =
    filters.categorySlug !== "all" ||
    filters.searchQuery !== "" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.stockStatus !== "ALL" ||
    filters.sortBy !== "featured";

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-5">
      {/* Top Sidebar Header */}
      <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00D9FF]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Filters & Categories
            </h3>
            <span className="text-[10px] text-[#00D9FF]">
              {filteredCount} of {totalProductsCount} Products
            </span>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-rose-400 transition-colors"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Filter Block 1: Search */}
      <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-4 space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block">
          Keyword Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search software, courses..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full bg-[#080D1B] border border-[#1B2A45] rounded-xl py-2 pl-8 pr-7 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
          />
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Block 2: Categories List */}
      <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-4 space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block pb-1 border-b border-[#1B2A45]">
          Categories (ক্যাটাগরি)
        </label>

        <div className="space-y-1 pt-1">
          {/* All Categories Option */}
          <button
            onClick={() => handleCategorySelect("all")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              filters.categorySlug === "all"
                ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_12px_rgba(0,217,255,0.3)]"
                : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A30]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00D9FF]" />
              <span>All Catalog Items</span>
            </div>
            {filters.categorySlug === "all" && <Check className="w-3.5 h-3.5" />}
          </button>

          {/* Individual Categories */}
          {categories.map((c) => {
            const isSelected = filters.categorySlug === c.slug;
            return (
              <button
                key={c.id}
                onClick={() => handleCategorySelect(c.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_12px_rgba(0,217,255,0.3)]"
                    : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A30]"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {getCategoryIcon(c.slug)}
                  <span className="truncate">{c.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Block 3: Price Range */}
      <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-4 space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block">
          Price Range (৳ BDT)
        </label>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-[#94A3B8] block mb-1">Min Price</span>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#00D9FF]">
                ৳
              </span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                className="w-full bg-[#080D1B] border border-[#1B2A45] rounded-xl py-1.5 pl-6 pr-2 text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#94A3B8] block mb-1">Max Price</span>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#00D9FF]">
                ৳
              </span>
              <input
                type="number"
                min="0"
                placeholder="20000"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                className="w-full bg-[#080D1B] border border-[#1B2A45] rounded-xl py-1.5 pl-6 pr-2 text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
              />
            </div>
          </div>
        </div>

        {/* Quick price presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            onClick={() => onFilterChange({ ...filters, minPrice: "", maxPrice: 1500 })}
            className="px-2 py-0.5 rounded-lg bg-[#080D1B] border border-[#1B2A45] text-[10px] text-[#94A3B8] hover:text-[#00D9FF] hover:border-[#00D9FF]/40"
          >
            Under ৳1,500
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, minPrice: 1500, maxPrice: 5000 })}
            className="px-2 py-0.5 rounded-lg bg-[#080D1B] border border-[#1B2A45] text-[10px] text-[#94A3B8] hover:text-[#00D9FF] hover:border-[#00D9FF]/40"
          >
            ৳1.5K - ৳5K
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, minPrice: 5000, maxPrice: "" })}
            className="px-2 py-0.5 rounded-lg bg-[#080D1B] border border-[#1B2A45] text-[10px] text-[#94A3B8] hover:text-[#00D9FF] hover:border-[#00D9FF]/40"
          >
            ৳5K+
          </button>
        </div>
      </div>

      {/* Filter Block 4: Availability & Offers */}
      <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-4 space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block">
          Availability & Deals
        </label>

        <div className="space-y-1">
          {[
            { id: "ALL", label: "All Items" },
            { id: "IN_STOCK", label: "Instant Delivery (In Stock)" },
            { id: "ON_SALE", label: "Discounted Offers Only" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleStockChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filters.stockStatus === item.id
                  ? "bg-[#101A30] text-[#00D9FF] border border-[#00D9FF]/30 font-bold"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <span>{item.label}</span>
              {filters.stockStatus === item.id && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00D9FF]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Block 5: Sort Order */}
      <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-4 space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block">
          Sort Products By
        </label>

        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value as FilterState["sortBy"])}
          className="w-full bg-[#080D1B] border border-[#1B2A45] rounded-xl px-3 py-2 text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF] cursor-pointer"
        >
          <option value="featured">Featured & Best Matches</option>
          <option value="price_asc">Price: Low to High (কম থেকে বেশি)</option>
          <option value="price_desc">Price: High to Low (বেশি থেকে কম)</option>
          <option value="name_asc">Name: A to Z</option>
        </select>
      </div>
    </aside>
  );
}
