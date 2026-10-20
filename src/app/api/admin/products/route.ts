import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productCreateSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  shortDesc: z.string().optional().nullable(),
  fullDesc: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Please select a category"),
  productType: z.string().default("DIGITAL_PRODUCT"),
  badge: z.string().optional().nullable(),
  regularPrice: z.number().int().min(0, "Regular price must be non-negative"), // paisa
  salePrice: z.number().int().optional().nullable(), // paisa
  stockStatus: z.string().default("IN_STOCK"),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  featuredImage: z.string().optional().nullable(),
  variations: z
    .array(
      z.object({
        sku: z.string().optional().nullable(),
        regularPrice: z.number().int().min(0),
        salePrice: z.number().int().optional().nullable(),
        stockStatus: z.string().default("IN_STOCK"),
        isActive: z.boolean().default(true),
        deliveryInstructions: z.string().optional().nullable(),
      })
    )
    .optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = productCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid product data" },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      );
    }

    // Create product and variations in a transaction
    const product = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          shortDesc: data.shortDesc,
          fullDesc: data.fullDesc,
          categoryId: data.categoryId,
          productType: data.productType,
          badge: data.badge,
          regularPrice: data.regularPrice,
          salePrice: data.salePrice,
          stockStatus: data.stockStatus,
          isFeatured: data.isFeatured,
          isPublished: data.isPublished,
          featuredImage: data.featuredImage,
        },
      });

      if (data.variations && data.variations.length > 0) {
        for (const v of data.variations) {
          await tx.productVariation.create({
            data: {
              productId: createdProduct.id,
              sku: v.sku || `${createdProduct.slug.toUpperCase().slice(0, 4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
              regularPrice: v.regularPrice,
              salePrice: v.salePrice,
              stockStatus: v.stockStatus,
              isActive: v.isActive,
              deliveryInstructions: v.deliveryInstructions,
            },
          });
        }
      }

      return createdProduct;
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, isPublished, isFeatured, stockStatus } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(typeof isPublished === "boolean" && { isPublished }),
        ...(typeof isFeatured === "boolean" && { isFeatured }),
        ...(stockStatus && { stockStatus }),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Update product status error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Soft delete
    await prisma.product.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
