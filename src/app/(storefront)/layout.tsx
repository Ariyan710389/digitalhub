import React from "react";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";

export const revalidate = 0; // dynamic data

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let siteSettingsMap: Record<string, string> = {};
  let paymentMethods: any[] = [];

  try {
    const [siteSettingsList, methods] = await Promise.all([
      prisma.siteSetting.findMany(),
      prisma.paymentMethodSetting.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      }),
    ]);

    siteSettingsList.forEach((s) => {
      siteSettingsMap[s.key] = s.value;
    });

    paymentMethods = methods;
  } catch (err) {
    console.error("StorefrontLayout data fetch error:", err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050812] text-[#F8FAFC]">
      <Header siteSettings={siteSettingsMap} />
      <main className="flex-1">{children}</main>
      <Footer siteSettings={siteSettingsMap} paymentMethods={paymentMethods} />
      <CartDrawer />
    </div>
  );
}
