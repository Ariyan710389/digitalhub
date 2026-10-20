import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductData } from "@/types";
import { Search, ArrowLeft } from "lucide-react";

export const revalidate = 0;

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let products: ProductData[] = [];

  if (query) {
    const rawProducts = await prisma.product.findMany({
      where: {
        isPublished: true,
        isDeleted: false,
        OR: [
          { name: { contains: query } },
          { shortDesc: { contains: query } },
          { fullDesc: { contains: query } },
          {
            category: {
              name: { contains: query },
            },
          },
        ],
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          select: { id: true, url: true, alt: true },
          orderBy: { displayOrder: "asc" },
        },
        variations: {
          where: { isActive: true },
          include: {
            variationOptions: {
              include: {
                attribute: true,
                option: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    products = rawProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDesc: p.shortDesc,
      fullDesc: p.fullDesc,
      categoryId: p.categoryId,
      productType: p.productType,
      featuredImage: p.featuredImage,
      isFeatured: p.isFeatured,
      isPublished: p.isPublished,
      badge: p.badge,
      seoTitle: p.seoTitle,
      seoDesc: p.seoDesc,
      regularPrice: p.regularPrice,
      salePrice: p.salePrice,
      stockQty: p.stockQty,
      stockStatus: p.stockStatus,
      trackStock: p.trackStock,
      totalSold: p.totalSold,
      category: p.category,
      images: p.images,
      variations: p.variations.map((v) => ({
        id: v.id,
        productId: v.productId,
        sku: v.sku,
        regularPrice: v.regularPrice,
        salePrice: v.salePrice,
        image: v.image,
        stockQty: v.stockQty,
        stockStatus: v.stockStatus,
        isActive: v.isActive,
        deliveryInstructions: v.deliveryInstructions,
        variationOptions: v.variationOptions.map((vo) => ({
          attribute: {
            id: vo.attribute.id,
            name: vo.attribute.name,
            slug: vo.attribute.slug,
          },
          option: {
            id: vo.option.id,
            value: vo.option.value,
          },
        })),
      })),
    }));
  }

  return (
    <div className="py-12 bg-[#050812] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#00D9FF] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Search Results Header */}
        <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-8 mb-10 shadow-xl">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#00D9FF] mb-2">
            <Search className="h-4 w-4" />
            <span>Search Results</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
            {query ? (
              <>
                Results for &ldquo;<span className="text-[#00D9FF]">{query}</span>&rdquo;
              </>
            ) : (
              "All Search Results"
            )}
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Found {products.length} product{products.length === 1 ? "" : "s"} matching your keyword.
          </p>
        </div>

        {/* Results */}
        {products.length === 0 ? (
          <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-12 text-center max-w-md mx-auto">
            <Search className="h-10 w-10 text-[#94A3B8]/50 mx-auto mb-3" />
            <h2 className="text-base font-bold text-[#F8FAFC] mb-1">No products found</h2>
            <p className="text-xs text-[#94A3B8] mb-6">
              Try searching with different keywords like &quot;ChatGPT&quot;, &quot;Photoshop&quot;, or &quot;Marketing&quot;.
            </p>
            <Link
              href="/products"
              className="inline-block px-5 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#2563FF] text-xs font-bold text-white"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
