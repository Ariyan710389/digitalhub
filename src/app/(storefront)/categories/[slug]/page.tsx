import React, { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductData } from "@/types";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60; // ISR cache for fast page loads
export const dynamicParams = true;

const siteUrl = process.env.NEXTAUTH_URL || "https://digitalhub-mocha.vercel.app";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// React cache deduplicates DB calls between generateMetadata and Page component
const getCategory = cache(async (slug: string) => {
  return await prisma.category.findUnique({
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
});

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return categories.map((c) => ({ slug: c.slug }));
  } catch (error) {
    console.error("generateStaticParams categories error:", error);
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const category = await getCategory(slug);

    if (!category || !category.isActive) {
      return {
        title: "Category Not Found",
        robots: { index: false, follow: false },
      };
    }

    const title = `${category.name} in Bangladesh | DigitalHub`;
    const description =
      category.description ||
      `Explore premium ${category.name} solutions with instant delivery and secure bKash, Nagad, and Rocket payments in Bangladesh at DigitalHub.`;

    const categoryCanonical = `/categories/${slug}`;
    const ogImage = category.image || "/images/logo.jpg";

    return {
      title,
      description,
      alternates: {
        canonical: categoryCanonical,
      },
      openGraph: {
        title,
        description,
        url: `${siteUrl}${categoryCanonical}`,
        type: "website",
        images: [
          {
            url: ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`,
            width: 800,
            height: 600,
            alt: category.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`],
      },
    };
  } catch {
    return {
      title: "Category | DigitalHub",
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

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
      variationOptions: (v.variationOptions || []).map((vo) => ({
        attribute: {
          id: vo.attribute?.id || "",
          name: vo.attribute?.name || "",
          slug: vo.attribute?.slug || "",
        },
        option: {
          id: vo.option?.id || "",
          value: vo.option?.value || "",
        },
      })),
    })),
  }));

  // Structured Data (CollectionPage + BreadcrumbList)
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description || `Browse authentic ${category.name} at DigitalHub Bangladesh.`,
    url: `${siteUrl}/categories/${category.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((prod, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/products/${prod.slug}`,
        name: prod.name,
      })),
    },
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: `${siteUrl}/categories`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${siteUrl}/categories/${category.slug}`,
      },
    ],
  };

  return (
    <div className="py-12 bg-[#050812] min-h-screen">
      {/* Schema.org CollectionPage & BreadcrumbList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsSchema),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#00D9FF] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </nav>

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
