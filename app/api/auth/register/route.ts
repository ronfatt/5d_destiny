import { UserStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { claimGuestData, createSession, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string; displayName?: string };
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();
    const displayName = body.displayName?.trim() || null;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashPassword(password),
        displayName,
        status: UserStatus.ACTIVE
      },
      select: { id: true, email: true, displayName: true }
    });

    await claimGuestData(user.id);
    await createSession(user.id);

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    console.error("POST /api/auth/register failed", error);
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
