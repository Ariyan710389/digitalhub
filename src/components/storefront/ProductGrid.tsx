"use client";

import React, { useState, useMemo } from "react";
import { ProductData, CategoryData } from "@/types";
import { ProductCard } from "./ProductCard";
import { CategorySidebar, FilterState } from "./CategorySidebar";
import { SlidersHorizontal, X, Sparkles, AlertCircle } from "lucide-react";

interface ProductGridProps {
  products: ProductData[];
  categories?: CategoryData[];
  title?: string;
  showFilters?: boolean;
}

const initialFilters: FilterState = {
  categorySlug: "all",
  searchQuery: "",
  minPrice: "",
  maxPrice: "",
  stockStatus: "ALL",
  sortBy: "featured",
};

export function ProductGrid({
  products,
  categories = [],
  title = "All Digital Products & Services",
  showFilters = true,
}: ProductGridProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Derive categories if not explicitly passed
  const derivedCategories: CategoryData[] = useMemo(() => {
    if (categories && categories.length > 0) return categories;

    const catMap = new Map<string, CategoryData>();
    products.forEach((p) => {
      if (p.category) {
        catMap.set(p.category.slug, {
          id: p.category.id || p.category.slug,
          name: p.category.name,
          slug: p.category.slug,
          isActive: true,
          displayOrder: 0,
        });
      }
    });
    return Array.from(catMap.values());
  }, [categories, products]);

  // Multi-criteria filtering logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Category filter
        if (filters.categorySlug !== "all" && p.category?.slug !== filters.categorySlug) {
          return false;
        }

        // 2. Search query (title, shortDesc, category)
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = (p.shortDesc || "").toLowerCase().includes(q);
          const matchCat = (p.category?.name || "").toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        // Calculate effective price for price range filtering
        const effectivePriceBDT =
          (p.salePrice && p.salePrice > 0 ? p.salePrice : p.regularPrice) / 100;

        // 3. Min price filter
        if (filters.minPrice !== "" && effectivePriceBDT < Number(filters.minPrice)) {
          return false;
        }

        // 4. Max price filter
        if (filters.maxPrice !== "" && effectivePriceBDT > Number(filters.maxPrice)) {
          return false;
        }

        // 5. Stock / Offer status
        if (filters.stockStatus === "IN_STOCK" && p.stockStatus === "OUT_OF_STOCK") {
          return false;
        }
        if (filters.stockStatus === "ON_SALE") {
          const hasDiscount = p.salePrice && p.salePrice > 0 && p.regularPrice > p.salePrice;
          if (!hasDiscount) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice && a.salePrice > 0 ? a.salePrice : a.regularPrice;
        const priceB = b.salePrice && b.salePrice > 0 ? b.salePrice : b.regularPrice;

        if (filters.sortBy === "price_asc") return priceA - priceB;
        if (filters.sortBy === "price_desc") return priceB - priceA;
        if (filters.sortBy === "name_asc") return a.name.localeCompare(b.name);
        return 0; // "featured" maintains database / catalog order
      });
  }, [products, filters]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const activeFilterCount =
    (filters.categorySlug !== "all" ? 1 : 0) +
    (filters.searchQuery !== "" ? 1 : 0) +
    (filters.minPrice !== "" || filters.maxPrice !== "" ? 1 : 0) +
    (filters.stockStatus !== "ALL" ? 1 : 0) +
    (filters.sortBy !== "featured" ? 1 : 0);

  return (
    <section id="catalog-section" className="py-14 bg-[#050812]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D9FF] bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                Complete Catalog
              </span>
              <div className="w-8 h-[1px] bg-[#1B2A45]" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#F8FAFC]">
              {title}
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Explore authentic AI subscriptions, professional design & development tools, and marketing packages.
            </p>
          </div>

          {/* Mobile Filter Toggle Button */}
          {showFilters && (
            <div className="lg:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1224] border border-[#1B2A45] hover:border-[#00D9FF]/40 text-xs font-bold text-[#F8FAFC] shadow-lg transition-all"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#00D9FF]" />
                <span>Filter & Categories</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#00D9FF] text-[#050812] text-[10px] font-extrabold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Layout Grid: Left Sidebar + Right Products Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Category Sidebar (Desktop) */}
          {showFilters && (
            <div className="hidden lg:block shrink-0">
              <CategorySidebar
                categories={derivedCategories}
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
                totalProductsCount={products.length}
                filteredCount={filteredProducts.length}
              />
            </div>
          )}

          {/* Right Product Grid Area */}
          <div className="flex-1 w-full min-w-0">
            {/* Active Filter Chips Bar */}
            {activeFilterCount > 0 && (
              <div className="mb-4 p-3 rounded-xl bg-[#0B1224] border border-[#1B2A45] flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Active Filters:
                </span>

                {filters.categorySlug !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-[#00D9FF] border border-cyan-500/30 text-xs font-semibold">
                    Category: {derivedCategories.find((c) => c.slug === filters.categorySlug)?.name || filters.categorySlug}
                    <button
                      onClick={() => setFilters({ ...filters, categorySlug: "all" })}
                      className="hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-[#00D9FF] border border-cyan-500/30 text-xs font-semibold">
                    &quot;{filters.searchQuery}&quot;
                    <button
                      onClick={() => setFilters({ ...filters, searchQuery: "" })}
                      className="hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {(filters.minPrice !== "" || filters.maxPrice !== "") && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-[#00D9FF] border border-cyan-500/30 text-xs font-semibold">
                    Price: ৳{filters.minPrice || 0} - ৳{filters.maxPrice || "Max"}
                    <button
                      onClick={() => setFilters({ ...filters, minPrice: "", maxPrice: "" })}
                      className="hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.stockStatus !== "ALL" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-[#00D9FF] border border-cyan-500/30 text-xs font-semibold">
                    {filters.stockStatus === "IN_STOCK" ? "In Stock" : "Offers Only"}
                    <button
                      onClick={() => setFilters({ ...filters, stockStatus: "ALL" })}
                      className="hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="ml-auto text-[11px] font-bold text-rose-400 hover:underline"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-12 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#00D9FF] mx-auto">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#F8FAFC]">No products found</h3>
                  <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                    No items match your active filters. Try clearing your search keyword, adjusting the price range, or selecting another category.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#2563FF] text-[#050812] text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#070B16] border-l border-[#1B2A45] p-5 h-full overflow-y-auto z-10 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B2A45]">
                <h3 className="text-sm font-bold text-[#F8FAFC]">Filters & Categories</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <CategorySidebar
                categories={derivedCategories}
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
                totalProductsCount={products.length}
                filteredCount={filteredProducts.length}
              />
            </div>

            <div className="pt-4 border-t border-[#1B2A45]">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#2563FF] text-[#050812] font-bold text-xs shadow-lg"
              >
                Apply Filters ({filteredProducts.length} Products)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
