import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    system: "destiny-card-system-v1",
    decks: {
      archetype: 14,
      energy: 22,
      event: 14,
      total: 50
    },
    status: "spec_ready"
  });
}
