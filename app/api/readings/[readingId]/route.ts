import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ readingId: string }> }
) {
  try {
    const { readingId } = await params;
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = (await request.json()) as { title?: string; note?: string };
    const title = body.title?.trim() || null;
    const note = body.note?.trim() || null;

    const reading = await prisma.destinyReading.findUnique({
      where: { id: readingId },
      select: { id: true, userId: true }
    });

    if (!reading) {
      return NextResponse.json({ error: "Reading not found." }, { status: 404 });
    }

    if (reading.userId !== currentUserId) {
      return NextResponse.json({ error: "You cannot edit this reading." }, { status: 403 });
    }

    const updated = await prisma.destinyReading.update({
      where: { id: readingId },
      data: {
        title,
        note
      },
      select: {
        id: true,
        title: true,
        note: true
      }
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PATCH /api/readings/[readingId] failed", error);
    return NextResponse.json({ error: "Unable to update reading." }, { status: 500 });
  }
}
