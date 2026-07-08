import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { assertAdmin } from "@/lib/security";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!assertAdmin(session?.user?.role)) {
    return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
  }

  return NextResponse.json({
    revenueInCents: 8492000,
    orders: 342,
    customers: 1284,
    products: 86,
    outOfStock: 7,
    topProducts: ["Arcane Vault Pro", "Summoner Duo Box", "Mythic Black Edition"]
  });
}
