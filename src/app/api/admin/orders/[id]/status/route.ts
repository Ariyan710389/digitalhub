import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { status, note } = body;

    const validStatuses = [
      "PENDING",
      "AWAITING_PAYMENT",
      "PAYMENT_UNDER_REVIEW",
      "PAID",
      "PROCESSING",
      "COMPLETED",
      "CANCELLED",
      "REFUNDED",
      "FAILED",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid order status." },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    await prisma.orderActivity.create({
      data: {
        orderId: id,
        userId: session.user.id,
        action: "status_changed",
        details: JSON.stringify({
          newStatus: status,
          updatedBy: session.user.email,
          note: note || null,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}.`,
      order: updated,
    });
  } catch (error: any) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order status." },
      { status: 500 }
    );
  }
}
