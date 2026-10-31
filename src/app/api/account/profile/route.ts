import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  phone: z.string().min(6, "Valid phone number is required").max(20).optional().nullable(),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = profileUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0]?.message || "Invalid input data." },
        { status: 400 }
      );
    }

    const { name, phone } = result.data;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone: phone || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
