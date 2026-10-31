import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
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
    const { action, reason, note, cancelOrder } = body;

    const validActions = [
      "MARK_SUSPICIOUS",
      "MARK_FAKE",
      "FLAG_REVIEW",
      "UNMARK",
      "ADD_NOTE",
    ];

    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid order action." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderNotes: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    let isFlagged = order.isFlagged;
    let flagReason = order.flagReason;
    let newStatus = order.status;

    if (action === "MARK_SUSPICIOUS") {
      isFlagged = true;
      flagReason = reason || "Suspicious Activity Detected";
    } else if (action === "MARK_FAKE") {
      isFlagged = true;
      flagReason = reason || "Fake / Fraudulent Order";
      if (cancelOrder) {
        newStatus = "CANCELLED";
      }
    } else if (action === "FLAG_REVIEW") {
      isFlagged = true;
      flagReason = reason || "Under Manual Review";
    } else if (action === "UNMARK") {
      isFlagged = false;
      flagReason = null;
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update Order flags & status
      await tx.order.update({
        where: { id },
        data: {
          isFlagged,
          flagReason,
          status: newStatus,
        },
      });

      // 2. Add Internal Admin Note if text provided
      if (note && note.trim()) {
        await tx.orderNote.create({
          data: {
            orderId: id,
            note: note.trim(),
            isInternal: true,
            authorId: session.user.id,
          },
        });
      }

      // 3. Log Audit & Order Activity
      await tx.orderActivity.create({
        data: {
          orderId: id,
          userId: session.user.id,
          action: `order_flag_${action.toLowerCase()}`,
          details: JSON.stringify({
            adminEmail: session.user.email,
            action,
            reason: flagReason,
            note: note || null,
            previousStatus: order.status,
            newStatus,
          }),
        },
      });

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: `ORDER_${action}`,
          entityType: "Order",
          entityId: id,
          details: JSON.stringify({
            orderNumber: order.orderNumber,
            isFlagged,
            flagReason,
            action,
          }),
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Order updated successfully (${action.replace(/_/g, " ")})`,
      order: {
        id,
        isFlagged,
        flagReason,
        status: newStatus,
      },
    });
  } catch (error: any) {
    console.error("Order flag error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update order flag." },
      { status: 500 }
    );
  }
}
