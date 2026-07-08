import { NextResponse, type NextRequest } from "next/server";

import { searchCatalog } from "@/lib/catalog";
import { rateLimit } from "@/lib/security";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request);
  if (limited) return limited;

  const query = request.nextUrl.searchParams.get("q") ?? "";
  return NextResponse.json({ query, results: searchCatalog(query) });
}
