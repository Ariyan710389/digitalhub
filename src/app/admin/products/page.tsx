import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, getStockStatusLabel } from "@/lib/utils";
import { Package, Plus, ExternalLink } from "lucide-react";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    include: {
      category: { select: { name: true } },
      variations: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC]">
            Products & Variations Catalog
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage your digital products, services, subscriptions, and variations.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] text-[#050812] font-bold text-xs shadow-[0_0_15px_rgba(0,217,255,0.3)] hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1B2A45] text-[#94A3B8] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Price / Range</th>
                <th className="py-3 px-3">Variations</th>
                <th className="py-3 px-3">Stock Status</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Storefront</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2A45]/40">
              {products.map((p) => {
                const stock = getStockStatusLabel(p.stockStatus);
                return (
                  <tr key={p.id} className="hover:bg-[#101A30]/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-[#F8FAFC] block">{p.name}</span>
                      {p.badge && (
                        <span className="text-[10px] text-purple-400 font-semibold">
                          Badge: {p.badge}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-[#94A3B8]">
                      {p.category?.name || "Uncategorized"}
                    </td>

                    <td className="py-3.5 px-3 text-[#94A3B8] text-[11px]">
                      {p.productType.replace(/_/g, " ")}
                    </td>

                    <td className="py-3.5 px-3 font-bold text-[#00D9FF]">
                      {p.salePrice && p.salePrice > 0
                        ? formatPrice(p.salePrice)
                        : formatPrice(p.regularPrice)}
                    </td>

                    <td className="py-3.5 px-3 text-[#F8FAFC]">
                      {p.variations.length} option{p.variations.length === 1 ? "" : "s"}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${stock.color}`}>
                        {stock.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${
                          p.isPublished
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                        }`}
                      >
                        {p.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[#00D9FF] hover:underline font-semibold"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
