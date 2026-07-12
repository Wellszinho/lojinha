import { NextResponse } from "next/server";

type ScryfallCommanderPayload = {
  data?: any[];
  has_more?: boolean;
  next_page?: string;
};

const commanderAliases: Record<string, string> = {
  "asceta sem idade": "oloro",
  "oloro asceta sem idade": "oloro"
};

function normalizeSearch(search: string) {
  const normalized = search
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized.includes("asceta sem idade")) return "oloro";
  return commanderAliases[normalized] ?? normalized;
}

function getIdentityQuery(identity: string) {
  const cleanIdentity = identity.replace(/[^WUBRGC]/gi, "").toLowerCase();
  if (!cleanIdentity) return "";
  if (cleanIdentity === "c") return "id:c";
  return `id>=${cleanIdentity.replaceAll("c", "")}`;
}

function getNameQuery(search: string) {
  const normalized = normalizeSearch(search);
  if (!normalized) return "";

  return normalized
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .map((term) => `name:${term}`)
    .join(" ");
}

function mapCommander(card: any) {
  return {
    name: card.name,
    color_identity: card.color_identity ?? [],
    edhrec_rank: card.edhrec_rank ?? null,
    released_at: card.released_at ?? null,
    oracle_text: card.oracle_text ?? card.card_faces?.[0]?.oracle_text ?? "",
    type_line: card.type_line ?? "",
    prices: card.prices ?? {}
  };
}

async function fetchCommanderPages(firstUrl: URL) {
  const cards: any[] = [];
  let nextUrl: string | null = firstUrl.toString();
  let page = 0;

  while (nextUrl && page < 25) {
    const response: Response = await fetch(nextUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "MagicTheGalo/1.0"
      },
      next: { revalidate: 60 * 60 * 24 }
    });

    if (response.status === 404) return cards;
    if (!response.ok) throw new Error("scryfall_commanders_failed");

    const payload = (await response.json()) as ScryfallCommanderPayload;
    if (Array.isArray(payload.data)) cards.push(...payload.data.map(mapCommander));
    nextUrl = payload.has_more && payload.next_page ? payload.next_page : null;
    page += 1;
  }

  return cards;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const identity = searchParams.get("identity") ?? "";
  const search = searchParams.get("search") ?? "";
  const query = ["is:commander", "legal:commander", "game:paper", search ? "" : getIdentityQuery(identity), getNameQuery(search)]
    .filter(Boolean)
    .join(" ");

  const url = new URL("https://api.scryfall.com/cards/search");
  url.searchParams.set("unique", "cards");
  url.searchParams.set("order", "edhrec");
  url.searchParams.set("q", query);

  try {
    const data = await fetchCommanderPages(url);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [], error: "Nao foi possivel buscar comandantes agora." }, { status: 200 });
  }
}
