import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CheckoutClient, PaymentMethodItem } from "./CheckoutClient";

export const revalidate = 0; // Always fresh payment methods directly from database

export const metadata: Metadata = {
  title: "Secure Checkout | DigitalHub Bangladesh",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage() {
  let methods: PaymentMethodItem[] = [];

  try {
    const rawMethods = await prisma.paymentMethodSetting.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    methods = rawMethods.map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      displayName: m.displayName,
      merchantNumber: m.merchantNumber,
      accountType: m.accountType,
      instructions: m.instructions,
      isActive: m.isActive,
    }));
  } catch (err) {
    console.error("Failed to load payment methods in checkout page:", err);
  }

  return <CheckoutClient paymentMethods={methods} />;
}
