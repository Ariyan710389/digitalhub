import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductDetailsClient } from "./ProductDetailsClient";
import { ProductData } from "@/types";

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const rawProduct = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      images: {
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
  });

  if (!rawProduct || rawProduct.isDeleted) {
    notFound();
  }

  const product: ProductData = {
    id: rawProduct.id,
    name: rawProduct.name,
    slug: rawProduct.slug,
    shortDesc: rawProduct.shortDesc,
    fullDesc: rawProduct.fullDesc,
    categoryId: rawProduct.categoryId,
    productType: rawProduct.productType,
    featuredImage: rawProduct.featuredImage,
    isFeatured: rawProduct.isFeatured,
    isPublished: rawProduct.isPublished,
    badge: rawProduct.badge,
    seoTitle: rawProduct.seoTitle,
    seoDesc: rawProduct.seoDesc,
    regularPrice: rawProduct.regularPrice,
    salePrice: rawProduct.salePrice,
    stockQty: rawProduct.stockQty,
    stockStatus: rawProduct.stockStatus,
    trackStock: rawProduct.trackStock,
    totalSold: rawProduct.totalSold,
    category: rawProduct.category,
    images: rawProduct.images,
    variations: rawProduct.variations.map((v) => ({
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
  };

  return (
    <div className="py-10 bg-[#050812] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#94A3B8] mb-8">
          <Link href="/" className="hover:text-[#00D9FF] transition-colors">
            Home
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-[#00D9FF] transition-colors"
              >
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#F8FAFC] font-medium truncate">{product.name}</span>
        </nav>

        {/* Client Product Interaction (Variations, Cart, Price Calc) */}
        <ProductDetailsClient product={product} />
      </div>
    </div>
  );
}
