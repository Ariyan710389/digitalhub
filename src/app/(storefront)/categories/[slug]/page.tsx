import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductData } from "@/types";
import { ArrowLeft } from "lucide-react";

export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
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
      },
    },
  });

  if (!category) {
    notFound();
  }

  const products: ProductData[] = category.products.map((p) => ({
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
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#00D9FF] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Category Header */}
        <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-8 mb-10 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00D9FF]">
              Category Catalog
            </span>
            <div className="w-8 h-[1px] bg-[#00D9FF]" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F8FAFC]">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-sm text-[#94A3B8] mt-2 max-w-xl">
              {category.description}
            </p>
          )}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-12 text-center">
            <p className="text-sm text-[#94A3B8]">
              No products found in {category.name} yet. Check back soon!
            </p>
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
