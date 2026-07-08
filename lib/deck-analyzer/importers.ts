import type { AnalyzeDeckInput, DeckCard } from "@/lib/deck-analyzer/types";
import { basicLands, knownCards, rolePatterns } from "@/lib/deck-analyzer/knowledge";

type ParsedLine = {
  name: string;
  quantity: number;
  section?: string;
};

const sectionNames = new Map(
  [
    ["commander", "Commander"],
    ["comandante", "Commander"],
    ["commanders", "Commander"],
    ["creatures", "Creatures"],
    ["criaturas", "Creatures"],
    ["instants", "Instants"],
    ["instantaneas", "Instants"],
    ["sorceries", "Sorceries"],
    ["feiticos", "Sorceries"],
    ["artifacts", "Artifacts"],
    ["artefatos", "Artifacts"],
    ["enchantments", "Enchantments"],
    ["encantamentos", "Enchantments"],
    ["planeswalkers", "Planeswalkers"],
    ["lands", "Lands"],
    ["terrenos", "Lands"],
    ["sideboard", "Sideboard"],
    ["maybeboard", "Maybeboard"]
  ].map(([key, value]) => [key.toLowerCase(), value])
);

function decodeHtml(input: string) {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeCardName(name: string) {
  return name
    .replace(/\s+\([A-Z0-9]{2,6}\)\s*\d+.*$/i, "")
    .replace(/\s+\[[^\]]+\]\s*$/i, "")
    .replace(/\s+#\d+.*$/i, "")
    .replace(/\s+\*F\*$/i, "")
    .replace(/\s+\*CMDR\*$/i, "")
    .replace(/\s+\/\/.*$/i, (match) => (match.includes("/") ? match : ""))
    .replace(/\s+/g, " ")
    .trim();
}

function parseQuantityLine(line: string, section?: string): ParsedLine | null {
  const cleaned = line.replace(/^[-*\u2022]\s*/, "").trim();
  const first = cleaned.match(/^(\d{1,3})\s*x?\s+(.+)$/i);
  if (first) {
    return {
      quantity: Number(first[1]),
      name: normalizeCardName(first[2]),
      section
    };
  }

  const last = cleaned.match(/^(.+?)\s+x?(\d{1,3})$/i);
  if (last) {
    return {
      quantity: Number(last[2]),
      name: normalizeCardName(last[1]),
      section
    };
  }

  return null;
}

function isIgnoredLine(line: string) {
  const lower = line.toLowerCase();
  return (
    !line ||
    lower.startsWith("//") ||
    lower.startsWith("#") ||
    lower.includes("total cards") ||
    lower.includes("total de cartas") ||
    lower.includes("export") ||
    lower.includes("sideboard") ||
    lower === "deck"
  );
}

export function parseDeckText(input: string) {
  const warnings: string[] = [];
  const rawLines = decodeHtml(input)
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed = new Map<string, ParsedLine>();
  let currentSection: string | undefined;
  let commander = "";
  let deckName = "";

  for (const rawLine of rawLines) {
    const line = rawLine.replace(/\t+/g, " ").trim();
    const lower = line.toLowerCase().replace(/:$/, "");

    if (lower.startsWith("deck:") || lower.startsWith("nome:")) {
      deckName = line.split(":").slice(1).join(":").trim();
      continue;
    }

    if (lower.startsWith("commander:") || lower.startsWith("comandante:")) {
      currentSection = "Commander";
      const direct = line.split(":").slice(1).join(":").trim();
      if (direct) {
        commander = normalizeCardName(direct.replace(/^1\s*x?\s+/i, ""));
        parsed.set(commander.toLowerCase(), { name: commander, quantity: 1, section: "Commander" });
      }
      continue;
    }

    if (sectionNames.has(lower)) {
      currentSection = sectionNames.get(lower);
      continue;
    }

    if (isIgnoredLine(line)) continue;

    const item = parseQuantityLine(line, currentSection);
    if (!item || !item.name || item.quantity <= 0) continue;

    const key = item.name.toLowerCase();
    const existing = parsed.get(key);
    parsed.set(key, existing ? { ...existing, quantity: existing.quantity + item.quantity } : item);

    if (!commander && item.section === "Commander") {
      commander = item.name;
    }
  }

  const cards = Array.from(parsed.values());
  if (!cards.length) {
    warnings.push("Nenhuma carta foi reconhecida. Cole uma lista no formato '1 Sol Ring' ou importe um arquivo de texto.");
  }

  if (!commander) {
    commander = cards.find((card) => card.section === "Commander")?.name ?? cards[0]?.name ?? "Comandante nao identificado";
    warnings.push("Comandante inferido automaticamente. Revise o nome antes de tomar decisoes competitivas.");
  }

  return {
    cards,
    commander,
    deckName: deckName || `${commander} Commander`,
    warnings
  };
}

function isLandByName(name: string, section?: string) {
  const lower = name.toLowerCase();
  return (
    section === "Lands" ||
    basicLands.includes(lower) ||
    /\b(tower|orchard|pool|confluence|brass|tomb|sanctum|temple|triome|pathway|garden|grave|crypt|foundry|shrine|islet|vista|strand|catacombs|mesa|rainforest|marsh|delta|foothills|heath|forest|island|swamp|mountain|plains)\b/i.test(lower)
  );
}

function guessCmc(name: string, roles: string[], section?: string) {
  if (isLandByName(name, section)) return 0;
  if (roles.includes("counterspell") || roles.includes("removal")) return 2;
  if (roles.includes("ramp")) return 2;
  if (roles.includes("boardWipe")) return 5;
  if (roles.includes("finisher") || roles.includes("winCondition")) return 5;
  return 3;
}

function guessColors(name: string) {
  const lower = name.toLowerCase();
  const colors = new Set<string>();
  if (lower === "plains" || /\bwhite|swords|path|teferi|heliod|sun|austere|farewell|enlightened\b/i.test(lower)) colors.add("W");
  if (lower === "island" || /\bblue|counter|swan|mystic|thassa|brain|niv|curiosity|study|remora|cyclonic\b/i.test(lower)) colors.add("U");
  if (lower === "swamp" || /\bblack|demonic|vampiric|toxic|reanimate|blood|sanguine|necropotence|arena|torment\b/i.test(lower)) colors.add("B");
  if (lower === "mountain" || /\bred|chaos|dockside|kiki|zealous|breach|blasphemous|squee\b/i.test(lower)) colors.add("R");
  if (lower === "forest" || /\bgreen|cultivate|kodama|nature|craterhoof|finale|beast|heroic|eternal witness|food chain|sabertooth\b/i.test(lower)) colors.add("G");
  return Array.from(colors);
}

export function hydrateCards(lines: ParsedLine[]): DeckCard[] {
  return lines.map((line) => {
    const key = line.name.toLowerCase();
    const knowledge = knownCards[key];
    const roles = new Set(knowledge?.roles ?? []);

    if (isLandByName(line.name, line.section)) {
      roles.add("land");
      if (!basicLands.includes(key)) roles.add("fix");
    }

    for (const [role, pattern] of rolePatterns) {
      if (pattern.test(line.name)) roles.add(role);
    }

    const roleList = Array.from(roles);
    const colors = knowledge?.colors ?? guessColors(line.name);
    const isLand = roleList.includes("land");

    return {
      name: line.name,
      quantity: line.quantity,
      section: line.section,
      roles: roleList,
      cmc: knowledge?.cmc ?? guessCmc(line.name, roleList, line.section),
      colors,
      price: knowledge?.price ?? (isLand ? 1.5 : 6)
    };
  });
}

function extractDeckTextFromHtml(html: string) {
  const clean = decodeHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "\n")
    .replace(/<style[\s\S]*?<\/style>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(div|p|li|tr|td|span|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n");

  const candidateLines = clean
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => /^(\d{1,3}\s*x?\s+|.+\s+x?\d{1,3}$)/i.test(line));

  return candidateLines.join("\n");
}

export async function resolveDeckInput(input: AnalyzeDeckInput) {
  if (input.sourceType !== "url") {
    return {
      text: input.input,
      warnings: [] as string[]
    };
  }

  const warnings: string[] = [];
  try {
    const url = new URL(input.input);
    const response = await fetch(url, {
      headers: {
        "user-agent": "MagicTheGaloDeckAnalyzer/1.0"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      warnings.push(`Nao foi possivel baixar o deck do link informado (${response.status}).`);
      return { text: input.input, warnings };
    }

    const html = await response.text();
    const extracted = extractDeckTextFromHtml(html);
    if (extracted.split("\n").length < 20) {
      warnings.push("O link foi acessado, mas a lista exportavel nao ficou clara. Cole a exportacao em texto para maior precisao.");
    }

    return {
      text: extracted || input.input,
      warnings
    };
  } catch {
    warnings.push("URL invalida ou indisponivel. Use um link publico ou cole a lista em texto.");
    return {
      text: input.input,
      warnings
    };
  }
}
