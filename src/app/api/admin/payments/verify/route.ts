import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { submissionId, action, reviewNotes } = body; // action: "APPROVE" | "REJECT"

    if (!submissionId || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Valid submission ID and action (APPROVE or REJECT) required." },
        { status: 400 }
      );
    }

    const submission = await prisma.paymentSubmission.findUnique({
      where: { id: submissionId },
      include: { order: true },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Payment submission not found." },
        { status: 404 }
      );
    }

    const isApprove = action === "APPROVE";
    const newStatus = isApprove ? "VERIFIED" : "REJECTED";
    const newOrderStatus = isApprove ? "PAID" : "FAILED";

    await prisma.$transaction(async (tx) => {
      // 1. Update PaymentSubmission
      await tx.paymentSubmission.update({
        where: { id: submission.id },
        data: {
          status: newStatus,
          reviewedAt: new Date(),
          reviewedById: session.user.id,
          reviewNotes: reviewNotes || null,
        },
      });

      // 2. Update Order Status
      await tx.order.update({
        where: { id: submission.orderId },
        data: {
          status: newOrderStatus,
        },
      });

      // 3. Log Audit & Order Activity
      await tx.orderActivity.create({
        data: {
          orderId: submission.orderId,
          userId: session.user.id,
          action: isApprove ? "payment_verified_approved" : "payment_rejected",
          details: JSON.stringify({
            reviewedBy: session.user.email,
            action,
            reviewNotes,
            trxId: submission.transactionId,
          }),
        },
      });

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: isApprove ? "payment_approved" : "payment_rejected",
          entityType: "PaymentSubmission",
          entityId: submission.id,
          details: JSON.stringify({
            orderNumber: submission.order.orderNumber,
            amount: submission.amount,
          }),
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: isApprove
        ? "Payment verified and approved! Order marked as PAID."
        : "Payment rejected. Order marked as FAILED.",
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify payment." },
      { status: 500 }
    );
  }
}
