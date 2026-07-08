import { NextResponse, type NextRequest } from "next/server";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(request: NextRequest, limit = 40, windowMs = 60_000) {
  const forwarded = request.headers.get("x-forwarded-for");
  const key = forwarded?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return NextResponse.json({ error: "Muitas tentativas. Tente novamente em instantes." }, { status: 429 });
  }

  return null;
}

export function assertAdmin(role?: string | null) {
  return role === "ADMIN";
}
