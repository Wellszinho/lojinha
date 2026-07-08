import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { analyzeDeck } from "@/lib/deck-analyzer/analysis";
import { rateLimit } from "@/lib/security";

const deckAnalyzerSchema = z.object({
  sourceType: z.enum(["text", "url", "file"]),
  input: z.string().min(10, "Informe uma lista, link ou arquivo exportado."),
  game: z.string().optional(),
  format: z.string().optional(),
  commander: z.string().optional(),
  deckName: z.string().optional()
});

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 10);
  if (limited) return limited;

  const payload = await request.json();
  const parsed = deckAnalyzerSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Entrada invalida.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const analysis = await analyzeDeck(parsed.data);
  return NextResponse.json({ analysis });
}
