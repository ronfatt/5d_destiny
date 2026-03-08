import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    platform: "ai-destiny-platform-architecture-v1",
    modules: [
      "user-input",
      "ziwei-chart-engine",
      "card-engine",
      "five-dimension-engine",
      "ai-interpretation",
      "report-generation"
    ],
    status: "skeleton_ready"
  });
}
