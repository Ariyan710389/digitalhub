import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface VariationPricingInput {
  id: string;
  sellPrice: number;
  regularPrice?: number | null;
}

interface UpdatePricingPayload {
  productId: string;
  sellPrice: number; // in Taka
  regularPrice?: number | null; // in Taka
  variations?: VariationPricingInput[];
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body: UpdatePricingPayload = await req.json();
    const { productId, sellPrice, regularPrice, variations } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    if (sellPrice === undefined || sellPrice === null || Number(sellPrice) < 0) {
      return NextResponse.json(
        { error: "Valid Sell Price (বিক্রয় মূল্য) in BDT is required" },
        { status: 400 }
      );
    }

    // Convert Taka to paisa (1 BDT = 100 paisa)
    const baseSellPaisa = Math.round(Number(sellPrice) * 100);
    const baseRegularPaisa =
      regularPrice !== undefined && regularPrice !== null && Number(regularPrice) > 0
        ? Math.round(Number(regularPrice) * 100)
        : null;

    // Determine DB regularPrice and salePrice
    let dbRegularPrice: number;
    let dbSalePrice: number | null = null;

    if (baseRegularPaisa && baseRegularPaisa > baseSellPaisa) {
      // Strike-through original price is higher than sell price
      dbRegularPrice = baseRegularPaisa;
      dbSalePrice = baseSellPaisa;
    } else {
      // No discount or regular price is equal/lower than sell price
      dbRegularPrice = baseSellPaisa;
      dbSalePrice = null;
    }

    // Perform database updates inside a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update base product pricing
      await tx.product.update({
        where: { id: productId },
        data: {
          regularPrice: dbRegularPrice,
          salePrice: dbSalePrice,
        },
      });

      // 2. Update variations if provided
      if (variations && Array.isArray(variations) && variations.length > 0) {
        for (const v of variations) {
          if (!v.id) continue;

          const vSellPaisa = Math.round(Number(v.sellPrice || 0) * 100);
          const vRegularPaisa =
            v.regularPrice !== undefined && v.regularPrice !== null && Number(v.regularPrice) > 0
              ? Math.round(Number(v.regularPrice) * 100)
              : null;

          let vDbRegularPrice: number;
          let vDbSalePrice: number | null = null;

          if (vRegularPaisa && vRegularPaisa > vSellPaisa) {
            vDbRegularPrice = vRegularPaisa;
            vDbSalePrice = vSellPaisa;
          } else {
            vDbRegularPrice = vSellPaisa;
            vDbSalePrice = null;
          }

          await tx.productVariation.update({
            where: { id: v.id },
            data: {
              regularPrice: vDbRegularPrice,
              salePrice: vDbSalePrice,
            },
          });
        }
      }
    });

    // Revalidate public caches so the storefront updates immediately
    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/categories");
      revalidatePath("/categories/[slug]", "page");
      revalidatePath("/products/[slug]", "page");
      revalidatePath("/admin/products");
    } catch (revalidateErr) {
      console.warn("Revalidation warning:", revalidateErr);
    }

    return NextResponse.json({
      success: true,
      message: "Product prices updated successfully",
      updatedPrices: {
        regularPrice: dbRegularPrice,
        salePrice: dbSalePrice,
      },
    });
  } catch (error: any) {
    console.error("Update pricing error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update product prices" },
      { status: 500 }
    );
  }
}
