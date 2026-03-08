import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "5d-destiny",
    timestamp: new Date().toISOString()
  });
}
