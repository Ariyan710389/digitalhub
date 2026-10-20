import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Full Administrator privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { paymentMethods, siteSettings } = body;

    // 1. Update Payment Methods (bKash, Nagad, Rocket, COD)
    if (paymentMethods && Array.isArray(paymentMethods)) {
      for (const pm of paymentMethods) {
        await prisma.paymentMethodSetting.upsert({
          where: { slug: pm.slug },
          update: {
            merchantNumber: pm.merchantNumber || null,
            accountType: pm.accountType || null,
            instructions: pm.instructions || null,
            isActive: Boolean(pm.isActive),
          },
          create: {
            name: pm.name,
            slug: pm.slug,
            displayName: pm.displayName || pm.name,
            merchantNumber: pm.merchantNumber || null,
            accountType: pm.accountType || null,
            instructions: pm.instructions || null,
            isActive: Boolean(pm.isActive),
          },
        });
      }
    }

    // 2. Update Site Settings (if provided)
    if (siteSettings && typeof siteSettings === "object") {
      for (const [key, val] of Object.entries(siteSettings)) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(val) },
          create: { key, value: String(val), type: "string" },
        });
      }
    }

    // 3. Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "payment_settings_updated",
        entityType: "PaymentMethodSetting",
        details: JSON.stringify({ updatedBy: session.user.email }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment numbers and settings updated successfully without code changes!",
    });
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update settings." },
      { status: 500 }
    );
  }
}
