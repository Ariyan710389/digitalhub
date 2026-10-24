import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, getStockStatusLabel } from "@/lib/utils";
import { Package, Plus, ExternalLink, Users, TrendingUp, ShoppingBag } from "lucide-react";

export const revalidate = 0; // Dynamic real-time catalog

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    include: {
      category: { select: { name: true } },
      variations: true,
      orderItems: {
        include: {
          order: {
            select: {
              status: true,
              userId: true,
              billingEmail: true,
              guestEmail: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate grand totals across all services
  let grandTotalSales = 0;
  const allCustomerSet = new Set<string>();

  const productStats = products.map((p) => {
    // Filter out cancelled and failed orders
    const validItems = p.orderItems.filter(
      (oi) => oi.order && oi.order.status !== "CANCELLED" && oi.order.status !== "FAILED"
    );

    const timesTaken = validItems.reduce((acc, curr) => acc + curr.quantity, 0) || p.totalSold || 0;

    const customersForProduct = new Set<string>();
    validItems.forEach((oi) => {
      const identifier = oi.order?.userId || oi.order?.billingEmail || oi.order?.guestEmail;
      if (identifier) {
        customersForProduct.add(identifier.toLowerCase().trim());
        allCustomerSet.add(identifier.toLowerCase().trim());
      }
    });

    grandTotalSales += timesTaken;

    return {
      product: p,
      timesTaken,
      uniqueClients: customersForProduct.size,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC]">
            Products & Variations Catalog
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage your digital products, services, subscriptions, and track how many clients purchased each item.
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

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0B1224] border border-[#1B2A45] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Total Catalog Products
            </span>
            <span className="text-xl font-black text-[#F8FAFC] block mt-0.5">
              {products.length} Items
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00D9FF]">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1224] border border-[#1B2A45] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Total Services Taken (বিক্রয় সংখ্যা)
            </span>
            <span className="text-xl font-black text-[#00D9FF] block mt-0.5">
              {grandTotalSales} বার বিক্রি
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1224] border border-[#1B2A45] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Total Clients Served (গ্রাহক সংখ্যা)
            </span>
            <span className="text-xl font-black text-purple-400 block mt-0.5">
              {allCustomerSet.size} জন গ্রাহক
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1B2A45] pb-3">
          <h2 className="text-sm font-bold text-[#F8FAFC]">Catalog & Sales Breakdown</h2>
          <span className="text-xs text-[#94A3B8]">
            Live order tracking per product/service
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1B2A45] text-[#94A3B8] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Price / Range</th>
                <th className="py-3 px-3">Total Sold / Clients (কতজন নিয়েছে)</th>
                <th className="py-3 px-3">Variations</th>
                <th className="py-3 px-3">Stock Status</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Storefront</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2A45]/40">
              {productStats.map(({ product: p, timesTaken, uniqueClients }) => {
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

                    {/* Total Sold / Clients Column */}
                    <td className="py-3.5 px-3">
                      {timesTaken > 0 ? (
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-xs text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded-md border border-[#00D9FF]/30">
                              {timesTaken} বার বিক্রি
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-semibold mt-1">
                            {uniqueClients} জন গ্রাহক নিয়েছেন
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold text-[#94A3B8]/80">
                            0 বার
                          </span>
                          <span className="text-[10px] text-[#94A3B8]/60">
                            এখনো কেউ নেয়নি
                          </span>
                        </div>
                      )}
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
