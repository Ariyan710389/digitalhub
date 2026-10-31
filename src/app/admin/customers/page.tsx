import React from "react";
import { prisma } from "@/lib/prisma";
import { CustomersManagementClient, CustomerData } from "./CustomersManagementClient";

export const revalidate = 0; // Real-time user directory

export default async function AdminCustomersPage() {
  // Query all users and their orders
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
        },
      },
    },
  });

  // Also query all orders to capture any orders where billingEmail matches user email
  const allOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  // Group all orders by user ID or email
  let grandTotalRevenue = 0;
  let buyersCount = 0;
  let grandTotalOrders = 0;

  const customers: CustomerData[] = users.map((u) => {
    const userEmailLower = u.email.toLowerCase().trim();

    // Combine orders linked via userId and orders matching billingEmail
    const matchedOrdersMap = new Map<string, typeof allOrders[0]>();

    // Directly linked orders
    u.orders.forEach((o) => matchedOrdersMap.set(o.id, o));

    // Matching email orders
    allOrders.forEach((o) => {
      const bEmail = (o.billingEmail || o.guestEmail || "").toLowerCase().trim();
      if (bEmail === userEmailLower) {
        matchedOrdersMap.set(o.id, o);
      }
    });

    const userOrders = Array.from(matchedOrdersMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const validPaidOrders = userOrders.filter(
      (o) => o.status === "PAID" || o.status === "COMPLETED" || o.status === "PROCESSING"
    );

    const userTotalSpent = validPaidOrders.reduce((sum, o) => sum + o.total, 0);

    if (userOrders.length > 0) {
      buyersCount++;
      grandTotalOrders += userOrders.length;
    }
    grandTotalRevenue += userTotalSpent;

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt.toISOString(),
      totalOrders: userOrders.length,
      totalSpent: userTotalSpent,
      lastOrderDate: userOrders[0]?.createdAt.toISOString() || null,
      orders: userOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        total: o.total,
        status: o.status,
        paymentMethod: o.paymentMethod,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((i) => ({
          id: i.id,
          productName: i.productName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      })),
    };
  });

  return (
    <CustomersManagementClient
      customers={customers}
      totalCustomers={users.length}
      totalBuyers={buyersCount}
      totalRevenue={grandTotalRevenue}
      totalOrdersCount={grandTotalOrders}
    />
  );
}
