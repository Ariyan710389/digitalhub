import React, { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductDetailsClient } from "./ProductDetailsClient";
import { ProductData } from "@/types";

export const revalidate = 60; // ISR cache for fast page loads
export const dynamicParams = true;

const siteUrl = process.env.NEXTAUTH_URL || "https://digitalhub-mocha.vercel.app";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// React cache deduplicates DB calls between generateMetadata and Page component
const getProduct = cache(async (slug: string) => {
  return await prisma.product.findUnique({
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
});

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { isPublished: true, isDeleted: false },
      select: { slug: true },
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch (error) {
    console.error("generateStaticParams products error:", error);
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProduct(slug);

    if (!product || product.isDeleted || !product.isPublished) {
      return {
        title: "Product Not Found",
        robots: { index: false, follow: false },
      };
    }

    const title = product.seoTitle || `${product.name} | DigitalHub Bangladesh`;
    const description =
      product.seoDesc ||
      product.shortDesc ||
      `Buy authentic ${product.name} in Bangladesh with instant bKash, Nagad, and Rocket payments at DigitalHub. 100% genuine guaranteed.`;

    const productCanonical = `/products/${slug}`;
    const ogImage = product.featuredImage || "/images/logo.jpg";

    return {
      title,
      description,
      alternates: {
        canonical: productCanonical,
      },
      openGraph: {
        title,
        description,
        url: `${siteUrl}${productCanonical}`,
        type: "website",
        images: [
          {
            url: ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`,
            width: 800,
            height: 600,
            alt: product.name,
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
      title: "Product | DigitalHub",
    };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const rawProduct = await getProduct(slug);

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
  };

  // Structured Data (JSON-LD)
  const effectivePriceBDT = (
    (product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice) / 100
  ).toFixed(2);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc || product.name,
    image: product.featuredImage ? [product.featuredImage] : [`${siteUrl}/images/logo.jpg`],
    sku: product.variations?.[0]?.sku || product.slug,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: "BDT",
      price: effectivePriceBDT,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stockStatus === "OUT_OF_STOCK"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "DigitalHub",
      },
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
      ...(product.category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: product.category.name,
              item: `${siteUrl}/categories/${product.category.slug}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: `${siteUrl}/products/${product.slug}`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: product.name,
              item: `${siteUrl}/products/${product.slug}`,
            },
          ]),
    ],
  };

  return (
    <div className="py-10 bg-[#050812] min-h-screen">
      {/* Schema.org Product & BreadcrumbList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsSchema),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#94A3B8] mb-8">
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
