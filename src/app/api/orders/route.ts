import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      name,
      email,
      phone,
      address,
      notes,
      paymentMethod,
      transactionId,
      senderNumber,
      items,
    } = body;

    // 1. Basic validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty." },
        { status: 400 }
      );
    }

    // 2. Server-side price recalculation & verification (Never trust client prices!)
    let computedSubtotal = 0;
    const validatedOrderItems: {
      productId?: string | null;
      variationId?: string | null;
      productName: string;
      variationDesc?: string | null;
      productImage?: string | null;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      deliveryStatus: string;
      deliveryNotes?: string | null;
    }[] = [];

    for (const item of items) {
      const qty = Math.max(1, Number(item.quantity) || 1);

      // Fetch actual product from DB
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          variations: {
            where: { id: item.variationId || undefined },
            include: {
              variationOptions: {
                include: {
                  attribute: true,
                  option: true,
                },
              },
            },
          },
        },
      });

      if (!dbProduct || dbProduct.isDeleted || !dbProduct.isPublished) {
        return NextResponse.json(
          {
            success: false,
            message: `Product "${item.name}" is no longer available. Please update your cart.`,
          },
          { status: 400 }
        );
      }

      let unitPrice = dbProduct.regularPrice;
      let variationDesc = "";
      let deliveryInstructions = "";

      if (item.variationId && dbProduct.variations.length > 0) {
        const dbVariation = dbProduct.variations[0];
        unitPrice = dbVariation.salePrice && dbVariation.salePrice > 0
          ? dbVariation.salePrice
          : dbVariation.regularPrice;

        variationDesc = dbVariation.variationOptions
          .map((vo) => `${vo.attribute.name}: ${vo.option.value}`)
          .join(", ");
        deliveryInstructions = dbVariation.deliveryInstructions || "";
      } else {
        unitPrice = dbProduct.salePrice && dbProduct.salePrice > 0
          ? dbProduct.salePrice
          : dbProduct.regularPrice;
      }

      const itemTotal = unitPrice * qty;
      computedSubtotal += itemTotal;

      validatedOrderItems.push({
        productId: dbProduct.id,
        variationId: item.variationId || null,
        productName: dbProduct.name,
        variationDesc: variationDesc || item.variationDesc || null,
        productImage: item.image || dbProduct.featuredImage || null,
        quantity: qty,
        unitPrice: unitPrice,
        totalPrice: itemTotal,
        deliveryStatus: "PENDING",
        deliveryNotes: deliveryInstructions || null,
      });
    }

    const orderNumber = generateOrderNumber();
    const isManualMobilePayment = ["bkash", "nagad", "rocket"].includes(paymentMethod);

    // Initial order status
    let initialStatus = "PENDING";
    if (isManualMobilePayment) {
      initialStatus = transactionId ? "PAYMENT_UNDER_REVIEW" : "AWAITING_PAYMENT";
    } else if (paymentMethod === "cod") {
      initialStatus = "PROCESSING";
    }

    // 3. Create Order & Items inside a Database Transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id || null,
          guestName: !session?.user?.id ? name : null,
          guestEmail: !session?.user?.id ? email.toLowerCase().trim() : null,
          guestPhone: !session?.user?.id ? phone : null,
          billingName: name,
          billingEmail: email.toLowerCase().trim(),
          billingPhone: phone,
          billingAddress: address || null,
          notes: notes || null,
          paymentMethod: paymentMethod,
          status: initialStatus,
          subtotal: computedSubtotal,
          discount: 0,
          total: computedSubtotal,
          currency: "BDT",
          items: {
            create: validatedOrderItems,
          },
          activityLog: {
            create: {
              action: "order_created",
              details: JSON.stringify({
                placedBy: session?.user?.email || "Guest",
                paymentMethod,
                total: computedSubtotal,
              }),
            },
          },
        },
      });

      // 4. If transaction ID is provided at checkout, record manual payment submission
      if (isManualMobilePayment && transactionId) {
        await tx.paymentSubmission.create({
          data: {
            orderId: order.id,
            method: paymentMethod,
            transactionId: transactionId.trim(),
            senderNumber: senderNumber ? senderNumber.trim() : phone.trim(),
            amount: computedSubtotal,
            status: "PENDING", // Pending manual verification by admin
          },
        });

        await tx.orderActivity.create({
          data: {
            orderId: order.id,
            action: "payment_submitted",
            details: JSON.stringify({
              method: paymentMethod,
              transactionId: transactionId.trim(),
              senderNumber: senderNumber || phone,
              amount: computedSubtotal,
              status: "PENDING_VERIFICATION",
            }),
          },
        });
      }

      // 5. Automatically increment totalSold count for each purchased product
      for (const item of items) {
        if (item.productId) {
          const qty = Math.max(1, Number(item.quantity) || 1);
          try {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                totalSold: { increment: qty },
              },
            });
          } catch (err) {
            console.error("Failed to increment product totalSold:", err);
          }
        }
      }

      return order;
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      orderNumber: newOrder.orderNumber,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
