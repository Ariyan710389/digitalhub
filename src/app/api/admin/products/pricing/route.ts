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
      // Fetch existing variations for this product to ensure proper sync
      const existingVariations = await tx.productVariation.findMany({
        where: { productId },
        orderBy: { createdAt: "asc" },
      });

      // 1. If product has exactly 1 variation (e.g., Lifetime Access, 1 Year):
      // The single variation MUST ALWAYS be 100% in sync with the base price!
      if (existingVariations.length === 1) {
        const singleVar = existingVariations[0];
        // If variation input is provided with specific numbers, use them, otherwise use base price
        const vInput = variations && variations.length > 0 ? variations[0] : null;

        let vRegular = dbRegularPrice;
        let vSale = dbSalePrice;

        if (vInput) {
          const vSellPaisa = Math.round(Number(vInput.sellPrice || 0) * 100);
          const vRegPaisa =
            vInput.regularPrice !== undefined && vInput.regularPrice !== null && Number(vInput.regularPrice) > 0
              ? Math.round(Number(vInput.regularPrice) * 100)
              : null;

          if (vRegPaisa && vRegPaisa > vSellPaisa) {
            vRegular = vRegPaisa;
            vSale = vSellPaisa;
          } else {
            vRegular = vSellPaisa;
            vSale = null;
          }
        }

        // Sync both base product and the single variation to these exact prices
        await tx.product.update({
          where: { id: productId },
          data: {
            regularPrice: vRegular,
            salePrice: vSale,
          },
        });

        await tx.productVariation.update({
          where: { id: singleVar.id },
          data: {
            regularPrice: vRegular,
            salePrice: vSale,
          },
        });

        dbRegularPrice = vRegular;
        dbSalePrice = vSale;
      }
      // 2. If product has multiple variations (e.g., 1 Month, 3 Months, 1 Year):
      else if (existingVariations.length > 1 && variations && variations.length > 0) {
        let firstVarRegular = dbRegularPrice;
        let firstVarSale = dbSalePrice;

        for (let i = 0; i < variations.length; i++) {
          const v = variations[i];
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

          if (i === 0) {
            firstVarRegular = vDbRegularPrice;
            firstVarSale = vDbSalePrice;
          }

          await tx.productVariation.update({
            where: { id: v.id },
            data: {
              regularPrice: vDbRegularPrice,
              salePrice: vDbSalePrice,
            },
          });
        }

        // Update base product to match the first variation (storefront starting price)
        await tx.product.update({
          where: { id: productId },
          data: {
            regularPrice: firstVarRegular,
            salePrice: firstVarSale,
          },
        });

        dbRegularPrice = firstVarRegular;
        dbSalePrice = firstVarSale;
      }
      // 3. Simple product without variations:
      else {
        await tx.product.update({
          where: { id: productId },
          data: {
            regularPrice: dbRegularPrice,
            salePrice: dbSalePrice,
          },
        });
      }
    });

    // Revalidate public caches across the entire storefront layout
    try {
      revalidatePath("/", "layout");
      revalidatePath("/products");
      revalidatePath("/categories");
      revalidatePath("/admin/products");
    } catch (revalidateErr) {
      console.warn("Revalidation warning:", revalidateErr);
    }

    return NextResponse.json({
      success: true,
      message: "Product prices updated successfully and synchronized with customer storefront",
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
