import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminSidebarClient } from "@/components/admin/AdminSidebarClient";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin Panel | DigitalHub",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Protected: Only ADMIN or STAFF
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    redirect("/login?callbackUrl=/admin");
  }

  // Get count of orders for notification badge
  let pendingOrdersCount = 0;
  try {
    pendingOrdersCount = await prisma.order.count();
  } catch (err) {
    console.error("Order count error:", err);
  }

  return (
    <div className="min-h-screen bg-[#050812] text-[#F8FAFC] flex flex-col md:flex-row">
      {/* Dynamic Admin Sidebar matching reference design */}
      <AdminSidebarClient
        user={session.user}
        orderCount={pendingOrdersCount}
      />

      {/* Main Admin Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-[#050812] min-w-0">
        {children}
      </main>
    </div>
  );
}
