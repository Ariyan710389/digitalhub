import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Customer ID is required." },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        orders: { select: { id: true } },
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "Customer account not found." },
        { status: 404 }
      );
    }

    // Safety checks
    if (targetUser.id === session.user.id) {
      return NextResponse.json(
        { success: false, message: "You cannot delete your own admin account." },
        { status: 400 }
      );
    }

    if (targetUser.role === "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Administrator accounts cannot be deleted here." },
        { status: 400 }
      );
    }

    // Audit log before deletion
    try {
      await prisma.auditLog.create({
        data: {
          action: "DELETE_CUSTOMER",
          entityType: "User",
          entityId: targetUser.id,
          userId: session.user.id,
          details: JSON.stringify({
            deletedCustomerId: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
            role: targetUser.role,
            totalOrdersLinked: targetUser.orders.length,
            deletedBy: session.user.email,
            deletedAt: new Date().toISOString(),
          }),
        },
      });
    } catch (auditErr) {
      console.warn("Could not write audit log for deleted user:", auditErr);
    }

    // Delete user from database
    // Associated orders will automatically have userId set to null (onDelete: SetNull in schema)
    await prisma.user.delete({
      where: { id: targetUser.id },
    });

    return NextResponse.json({
      success: true,
      message: `Customer account "${targetUser.name}" (${targetUser.email}) has been permanently deleted.`,
    });
  } catch (error: any) {
    console.error("Error deleting customer account:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete customer account.",
      },
      { status: 500 }
    );
  }
}
