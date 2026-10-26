import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  CustomerAccountClient,
  AccountItemData,
  AccountOrderData,
} from "./CustomerAccountClient";

export const revalidate = 0; // Dynamic real-time customer dashboard

export const metadata: Metadata = {
  title: "My Account & Purchased Services | DigitalHub",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CustomerAccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account");
  }

  const [user, rawOrders, siteSettings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.order.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { billingEmail: session.user.email?.toLowerCase().trim() },
          { guestEmail: session.user.email?.toLowerCase().trim() },
        ],
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                productType: true,
                featuredImage: true,
              },
            },
          },
        },
        paymentSubmissions: {
          orderBy: { submittedAt: "desc" },
          take: 1,
        },
        orderNotes: {
          where: { isInternal: false },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.siteSetting.findMany({
      where: { key: "social_whatsapp" },
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  // Extract all purchased items across customer orders
  const purchasedItems: AccountItemData[] = [];
  rawOrders.forEach((order) => {
    order.items.forEach((item) => {
      purchasedItems.push({
        id: item.id,
        orderId: order.id,
        orderNumber: order.orderNumber,
        orderStatus: order.status,
        paymentMethod: order.paymentMethod,
        transactionId: order.paymentSubmissions[0]?.transactionId || null,
        createdAt: order.createdAt.toISOString(),
        productName: item.productName,
        variationDesc: item.variationDesc,
        productImage: item.productImage || item.product?.featuredImage || null,
        productSlug: item.product?.slug || null,
        productType: item.product?.productType || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        deliveryStatus: item.deliveryStatus,
        deliveryNotes: item.deliveryNotes,
        orderNotes: order.orderNotes.map((n) => n.note),
      });
    });
  });

  const orders: AccountOrderData[] = rawOrders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    status: order.status,
    paymentMethod: order.paymentMethod,
    total: order.total,
    itemsCount: order.items.length,
    items: order.items.map((i) => ({
      productName: i.productName,
      variationDesc: i.variationDesc,
      quantity: i.quantity,
      totalPrice: i.totalPrice,
    })),
    transactionId: order.paymentSubmissions[0]?.transactionId || null,
  }));

  const whatsappSetting = siteSettings.find((s) => s.key === "social_whatsapp");

  return (
    <CustomerAccountClient
      user={{
        ...user,
        createdAt: user.createdAt?.toISOString(),
      }}
      purchasedItems={purchasedItems}
      orders={orders}
      whatsappNumber={whatsappSetting?.value || "8801873168818"}
    />
  );
}
