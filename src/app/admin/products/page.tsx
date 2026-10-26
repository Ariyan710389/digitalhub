import React from "react";
import { prisma } from "@/lib/prisma";
import { AdminProductsCatalogClient } from "./AdminProductsCatalogClient";

export const revalidate = 0; // Dynamic real-time catalog

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    include: {
      category: { select: { name: true } },
      variations: {
        include: {
          variationOptions: {
            include: {
              attribute: true,
              option: true,
            },
          },
        },
        orderBy: { regularPrice: "asc" },
      },
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
      product: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        badge: p.badge,
        productType: p.productType,
        stockStatus: p.stockStatus,
        isPublished: p.isPublished,
        regularPrice: p.regularPrice,
        salePrice: p.salePrice,
        category: p.category,
        variations: p.variations.map((v) => ({
          id: v.id,
          sku: v.sku,
          regularPrice: v.regularPrice,
          salePrice: v.salePrice,
          isActive: v.isActive,
          variationOptions: v.variationOptions.map((vo) => ({
            attribute: { name: vo.attribute.name },
            option: { value: vo.option.value },
          })),
        })),
      },
      timesTaken,
      uniqueClients: customersForProduct.size,
    };
  });

  return (
    <AdminProductsCatalogClient
      initialProducts={productStats}
      grandTotalSales={grandTotalSales}
      totalUniqueClients={allCustomerSet.size}
    />
  );
}
