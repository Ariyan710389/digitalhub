import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paymentSubmissionSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = paymentSubmissionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { orderId, method, transactionId, senderNumber } = result.data;

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    // Create payment submission
    const submission = await prisma.paymentSubmission.create({
      data: {
        orderId: order.id,
        method,
        transactionId,
        senderNumber,
        amount: order.total,
        status: "PENDING", // Never automatically verify manual payment!
      },
    });

    // Update order status to PAYMENT_UNDER_REVIEW
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAYMENT_UNDER_REVIEW",
      },
    });

    // Record order activity
    await prisma.orderActivity.create({
      data: {
        orderId: order.id,
        action: "manual_payment_submitted",
        details: JSON.stringify({
          submissionId: submission.id,
          method,
          transactionId,
          senderNumber,
          amount: order.total,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment submitted successfully! Our team will verify it shortly.",
      submission,
    });
  } catch (error: any) {
    console.error("Payment submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit payment details." },
      { status: 500 }
    );
  }
}
