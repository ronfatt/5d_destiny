import { Gender, UserStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedGenders = new Set<Gender>(["MALE", "FEMALE", "OTHER", "UNSPECIFIED"]);

function isTimeValue(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      birthDate?: string;
      birthTime?: string;
      birthLocation?: string;
      timezone?: string;
      gender?: Gender;
    };

    const birthDate = body.birthDate?.trim();
    const birthTime = body.birthTime?.trim();
    const birthLocation = body.birthLocation?.trim();
    const timezone = body.timezone?.trim();
    const gender = body.gender && allowedGenders.has(body.gender) ? body.gender : "UNSPECIFIED";

    if (!birthDate || Number.isNaN(Date.parse(birthDate))) {
      return NextResponse.json({ error: "A valid birth date is required." }, { status: 400 });
    }

    if (!birthTime || !isTimeValue(birthTime)) {
      return NextResponse.json({ error: "A valid birth time is required." }, { status: 400 });
    }

    if (!birthLocation) {
      return NextResponse.json({ error: "Birth location is required." }, { status: 400 });
    }

    if (!timezone) {
      return NextResponse.json({ error: "Timezone is required." }, { status: 400 });
    }

    const created = await prisma.$transaction(async (tx) => {
      const guestSeed = crypto.randomUUID();
      const user = await tx.user.create({
        data: {
          email: `guest+${guestSeed}@5ddestiny.local`,
          passwordHash: `guest:${guestSeed}`,
          displayName: "Guest User",
          status: UserStatus.ACTIVE
        }
      });

      return tx.birthProfile.create({
        data: {
          userId: user.id,
          birthDate: new Date(`${birthDate}T00:00:00.000Z`),
          birthTime,
          birthLocation,
          timezone,
          gender,
          source: "web_mvp_guest"
        },
        select: {
          id: true,
          birthDate: true,
          birthTime: true,
          birthLocation: true,
          timezone: true,
          gender: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      });
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/birth-profiles failed", error);
    return NextResponse.json({ error: "Unable to save birth profile." }, { status: 500 });
  }
}
