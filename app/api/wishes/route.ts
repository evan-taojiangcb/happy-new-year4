import { NextRequest, NextResponse } from "next/server";
import { createWish, listWishes } from "@/lib/wish-service";
import { createWishSchema, listWishQuerySchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const parsed = listWishQuerySchema.safeParse({
    limit: request.nextUrl.searchParams.get("limit") ?? "20",
    nextToken: request.nextUrl.searchParams.get("nextToken") ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "参数不合法" }, { status: 400 });
  }

  const result = await listWishes(parsed.data.limit, parsed.data.nextToken);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const parsed = createWishSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "参数不合法" }, { status: 400 });
  }

  const result = await createWish(parsed.data);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.statusCode });
  }

  return NextResponse.json({ wish: result.wish }, { status: result.statusCode });
}
