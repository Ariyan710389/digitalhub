import React from "react";
import { prisma } from "@/lib/prisma";
import { CategoriesManagementClient } from "./CategoriesManagementClient";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: { products: { where: { isDeleted: false } } },
      },
    },
  });

  return <CategoriesManagementClient initialCategories={categories} />;
}
