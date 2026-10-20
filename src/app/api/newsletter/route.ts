import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { message: "You are already subscribed to our newsletter!" },
        { status: 200 }
      );
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase(),
      },
    });

    return NextResponse.json(
      { message: "Thank you for subscribing! You'll receive our latest updates & exclusive offers." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
