"use client";

import React, { useState } from "react";
import { ProductData } from "@/types";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGridProps {
  products: ProductData[];
  title?: string;
  showFilters?: boolean;
}

const filterTabs = [
  { label: "All", categorySlug: "all" },
  { label: "AI Subscription", categorySlug: "ai-subscriptions" },
  { label: "Premium Apps", categorySlug: "premium-apps" },
  { label: "Digital Marketing", categorySlug: "digital-marketing" },
  { label: "Web Development", categorySlug: "web-development" },
  { label: "Courses", categorySlug: "online-courses" },
  { label: "Software", categorySlug: "software" },
];

export function ProductGrid({
  products,
  title = "Latest Products",
  showFilters = true,
}: ProductGridProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredProducts =
    selectedFilter === "all"
      ? products
      : products.filter((p) => p.category?.slug === selectedFilter);

  return (
    <section className="py-14 bg-[#050812]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
              {title}
            </h2>
            <div className="w-12 h-[2px] bg-gradient-to-r from-[#00D9FF] to-transparent rounded-full hidden sm:block" />
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {filterTabs.map((tab) => {
                const isActive = selectedFilter === tab.categorySlug;
                return (
                  <button
                    key={tab.categorySlug}
                    onClick={() => setSelectedFilter(tab.categorySlug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-[#00D9FF] text-[#050812] font-semibold shadow-[0_0_15px_rgba(0,217,255,0.3)]"
                        : "bg-[#0B1224] text-[#94A3B8] border border-[#1B2A45] hover:border-[#00D9FF]/40 hover:text-[#F8FAFC]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-12 text-center">
            <p className="text-sm text-[#94A3B8]">
              No products found in this category. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
