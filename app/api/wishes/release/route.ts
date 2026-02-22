import { NextResponse } from "next/server";
import { releaseWishes } from "@/lib/wish-service";

export async function POST(request: Request) {
  const authHeader = request.headers.get("x-release-key");
  const expected = process.env.RELEASE_API_KEY;

  if (expected && authHeader !== expected) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await releaseWishes();
  return NextResponse.json({ updated: result.count });
}
