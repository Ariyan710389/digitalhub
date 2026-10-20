import React from "react";
import { prisma } from "@/lib/prisma";
import { ProductCreateClient } from "./ProductCreateClient";

export const revalidate = 0;

export default async function AdminNewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { displayOrder: "asc" },
  });

  return <ProductCreateClient categories={categories} />;
}
