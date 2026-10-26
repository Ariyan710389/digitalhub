import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  Bot,
  Layers,
  Megaphone,
  Code,
  GraduationCap,
  Settings,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const revalidate = 60;

const siteUrl = process.env.NEXTAUTH_URL || "https://digitalhub-mocha.vercel.app";

export const metadata: Metadata = {
  title: "All Categories — Digital Products & Services | DigitalHub",
  description:
    "Explore all digital product and service categories in Bangladesh. AI subscriptions, developer tools, premium software, online courses, and digital marketing packages.",
  alternates: {
    canonical: "/categories",
  },
  openGraph: {
    title: "All Categories — Digital Products & Services | DigitalHub",
    description:
      "Explore all digital product and service categories in Bangladesh with instant bKash, Nagad, and Rocket payments.",
    url: `${siteUrl}/categories`,
    type: "website",
    images: [{ url: "/images/logo.jpg", width: 800, height: 800, alt: "DigitalHub Categories" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Categories — Digital Products & Services | DigitalHub",
    description: "Browse all digital product categories at DigitalHub Bangladesh.",
  },
};

const iconMap: Record<string, React.ReactNode> = {
  Bot: <Bot className="h-7 w-7 text-[#00D9FF]" />,
  Layers: <Layers className="h-7 w-7 text-[#8B3DFF]" />,
  Megaphone: <Megaphone className="h-7 w-7 text-[#2563FF]" />,
  Code: <Code className="h-7 w-7 text-emerald-400" />,
  GraduationCap: <GraduationCap className="h-7 w-7 text-amber-400" />,
  Settings: <Settings className="h-7 w-7 text-sky-400" />,
  FileText: <FileText className="h-7 w-7 text-rose-400" />,
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          products: {
            where: { isPublished: true, isDeleted: false },
          },
        },
      },
    },
    orderBy: { displayOrder: "asc" },
  });

  const categoriesSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Categories — DigitalHub",
    description: "All digital product and service categories available on DigitalHub.",
    url: `${siteUrl}/categories`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categories.map((cat, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${siteUrl}/categories/${cat.slug}`,
        name: cat.name,
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
    ],
  };

  return (
    <div className="py-12 bg-[#050812] min-h-screen">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categoriesSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsSchema),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-8 mb-10 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00D9FF]">
              Explore
            </span>
            <div className="w-8 h-[1px] bg-[#00D9FF]" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F8FAFC]">
            All Categories
          </h1>
          <p className="text-sm text-[#94A3B8] mt-2 max-w-xl">
            Discover verified digital solutions, from AI subscriptions and software licenses to full-stack web development and marketing.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const icon = (cat.icon && iconMap[cat.icon]) || <Sparkles className="h-7 w-7 text-[#00D9FF]" />;
            const count = cat._count.products;

            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0B1224] border border-[#1B2A45] hover:border-[#00D9FF]/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,217,255,0.15)] hover:-translate-y-1"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#080D1B] border border-[#1B2A45] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <h2 className="text-lg font-bold text-[#F8FAFC] group-hover:text-[#00D9FF] transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-2 line-clamp-2 leading-relaxed">
                    {cat.description || "Authentic digital products and premium services."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 mt-4 border-t border-[#1B2A45]/50 text-xs font-medium">
                  <span className="text-[#94A3B8]">
                    {count} {count === 1 ? "Product" : "Products"}
                  </span>
                  <span className="text-[#00D9FF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Browse</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
