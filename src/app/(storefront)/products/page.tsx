import React from "react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductData } from "@/types";

export const revalidate = 30; // ISR cache for fast page loads

export default async function AllProductsPage() {
  const rawProducts = await prisma.product.findMany({
    where: { isPublished: true, isDeleted: false },
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

  const products: ProductData[] = rawProducts.map((p) => ({
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

  return (
    <div className="py-12 bg-[#050812] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-8 mb-10 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00D9FF]">
              Complete Catalog
            </span>
            <div className="w-8 h-[1px] bg-[#00D9FF]" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F8FAFC]">
            All Digital Products & Services
          </h1>
          <p className="text-sm text-[#94A3B8] mt-2 max-w-xl">
            Explore authentic AI subscriptions, professional design & development tools, and marketing packages.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
