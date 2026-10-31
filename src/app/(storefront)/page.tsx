import React from "react";
import { prisma } from "@/lib/prisma";
import { HeroCarousel } from "@/components/storefront/HeroCarousel";
import { CategorySection } from "@/components/storefront/CategorySection";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { PromoBanner } from "@/components/storefront/PromoBanner";
import { WhyChooseUs } from "@/components/storefront/WhyChooseUs";
import { CustomerReviewsSection } from "@/components/storefront/CustomerReviewsSection";
import { FAQ } from "@/components/storefront/FAQ";
import { Newsletter } from "@/components/storefront/Newsletter";
import { ProductData, CategoryData, HeroSlideData } from "@/types";

export const revalidate = 30; // ISR cache for fast page loads

export default async function HomePage() {
  // Query all data concurrently with Promise.all for maximum speed
  const [rawSlides, rawCategories, rawProducts] = await Promise.all([
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.product.findMany({
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
      take: 12,
    }),
  ]);

  const heroSlides: HeroSlideData[] = rawSlides.map((s) => ({
    id: s.id,
    headline: s.headline,
    description: s.description,
    bgImage: s.bgImage,
    ctaText: s.ctaText,
    ctaUrl: s.ctaUrl,
    badge: s.badge,
    displayOrder: s.displayOrder,
    isActive: s.isActive,
  }));

  const categories: CategoryData[] = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    icon: c.icon,
    displayOrder: c.displayOrder,
    isActive: c.isActive,
  }));

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
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Carousel */}
      <HeroCarousel slides={heroSlides} />

      {/* 2. Category Section */}
      <CategorySection categories={categories} />

      {/* 3. Catalog Products with Left Category Sidebar & Filters */}
      <ProductGrid
        products={products}
        categories={categories}
        title="Complete Catalog & Services"
        showFilters={true}
      />

      {/* 4. Special Offer Banner */}
      <PromoBanner />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Verified Customer Reviews */}
      <CustomerReviewsSection />

      {/* 7. FAQ Section */}
      <FAQ />

      {/* 8. Newsletter Signup */}
      <Newsletter />
    </div>
  );
}
