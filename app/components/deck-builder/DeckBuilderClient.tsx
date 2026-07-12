"use client";

import {
  Bot,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  FileText,
  Play,
  Save,
  Search,
  Share2,
  Shuffle,
  Sparkles,
  Wand2,
  X
} from "lucide-react";
import type { DragEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  archetypeOptions,
  colorIdentities,
  commanderFilters,
  commanderPool,
  getColorIdentityById,
  manaColorImages,
  manaColorLabels,
  preferenceQuestions,
  styleOptions,
  suggestColorIdentity,
  type ColorIdentity,
  type ColorIdentityGroup,
  type CommanderFilterId,
  type CommanderProfile,
  type ManaColor
} from "@/lib/deck-builder";
import { cn, formatMoney } from "@/lib/utils";

type DeckCardLine = {
  name: string;
  reason: string;
  expensive?: boolean;
  budgetAlternative?: string;
  premiumAlternative?: string;
};

type DeckSection = {
  title: string;
  target: string;
  cards: DeckCardLine[];
};

type DeckListEntry = {
  name: string;
  quantity: number;
  section: string;
};

type OpeningHandCard = {
  name: string;
  section: string;
};

type DeckSimulationStats = {
  mulligan: number;
  ramp: number;
  draw: number;
  lands: number;
};

type ArenaPhase = "closed" | "intro" | "duel";

type ArenaPermanent = OpeningHandCard & {
  id: string;
  power: number;
  toughness: number;
  isManaSource: boolean;
};

type ArenaState = {
  playerLife: number;
  botLife: number;
  turn: number;
  activeTurn: "player" | "bot";
  playerHand: OpeningHandCard[];
  botHand: OpeningHandCard[];
  playerLibrary: OpeningHandCard[];
  botLibrary: OpeningHandCard[];
  playerBattlefield: ArenaPermanent[];
  botBattlefield: ArenaPermanent[];
  playerDrewThisTurn: boolean;
  playerLandPlayedThisTurn: boolean;
  playerManaSpent: number;
  log: string[];
  winner?: "player" | "bot";
};

type ScryfallCardResponse = {
  image_uris?: {
    normal?: string;
  };
  card_faces?: Array<{
    image_uris?: {
      normal?: string;
    };
  }>;
};

const wizardSections = [
  { title: "Identidade de cores", description: "Escolha as cores ou deixe a IA sugerir com base no plano do deck." },
  { title: "Orcamento", description: "Defina quanto o deck pode custar e se existe teto real de investimento." },
  { title: "Experiencia", description: "Ajuste a lista para iniciante, intermediario, avancado ou competitivo." },
  { title: "Complexidade", description: "Escolha se o deck precisa ser simples ou extremamente tecnico." },
  { title: "Comandante", description: "Veja todos os comandantes que contem as cores escolhidas." },
  { title: "Arquetipo", description: "Defina uma ou mais linhas principais do deck." },
  { title: "Estilo", description: "Modele como o deck deve se comportar na mesa." },
  { title: "Preferencias", description: "Ajuste combos, cartas caras, proxies, banlist e power level." },
  { title: "Resultado", description: "Revise a lista, explicacao, alternativas, otimização, exportacao e simulador." }
];

const identityGroups: ColorIdentityGroup[] = ["Monocolor", "Duas cores", "Tres cores", "Quatro cores", "Cinco cores"];

const budgetPresets = [10000, 30000, 50000, 80000, 100000, 200000, 300000, 500000];

const playerExperienceOptions = ["Nunca joguei", "Iniciante", "Intermediario", "Avancado", "Competitivo"];

const complexityOptions = ["Muito simples", "Facil", "Media", "Dificil", "Extremamente tecnica"];

const optimizationOptions = [
  "Mais barato",
  "Mais competitivo",
  "Mais divertido",
  "Mais consistente",
  "Mais combos",
  "Mais interacao",
  "Mais draw",
  "Mais ramp",
  "Mais remocoes",
  "Mais velocidade",
  "Mais resistencia"
];

const exportOptions = ["LigaMagic", "Moxfield", "Archidekt", "ManaBox", "TappedOut", "Texto", "CSV", "PDF"];

const cardImageCache = new Map<string, string | null>();

const sectionTargets: Record<string, number> = {
  Comandante: 1,
  Terrenos: 36,
  Ramp: 10,
  Draw: 10,
  Tutores: 4,
  Remocoes: 8,
  "Board Wipes": 3,
  Protecoes: 5,
  "Win Conditions": 5,
  Combos: 3,
  Utilidades: 15
};

const basicLandsByColor: Record<ManaColor, string> = {
  W: "Plains",
  U: "Island",
  B: "Swamp",
  R: "Mountain",
  G: "Forest",
  C: "Wastes"
};

const fallbackCardsBySection: Record<string, string[]> = {
  Ramp: [
    "Farseek",
    "Three Visits",
    "Kodama's Reach",
    "Thought Vessel",
    "Fellwar Stone",
    "Talisman of Curiosity",
    "Chromatic Lantern",
    "Sakura-Tribe Elder",
    "Skyshroud Claim",
    "Birds of Paradise"
  ],
  Draw: [
    "Harmonize",
    "Beast Whisperer",
    "Return of the Wildspeaker",
    "Fact or Fiction",
    "Ponder",
    "Preordain",
    "Sign in Blood",
    "Read the Bones",
    "Bident of Thassa",
    "Tome of Legends"
  ],
  Tutores: ["Worldly Tutor", "Mystical Tutor", "Eladamri's Call", "Shared Summons", "Diabolic Tutor"],
  Remocoes: [
    "Beast Within",
    "Generous Gift",
    "Reality Shift",
    "Krosan Grip",
    "Rapid Hybridization",
    "Nature's Claim",
    "Resculpt",
    "Return to Nature"
  ],
  "Board Wipes": ["Blasphemous Act", "Austere Command", "Evacuation", "Crux of Fate"],
  Protecoes: ["Heroic Intervention", "Swiftfoot Boots", "Lightning Greaves", "Tamiyo's Safekeeping", "Counterspell"],
  "Win Conditions": ["Finale of Devastation", "Craterhoof Behemoth", "Overwhelming Stampede", "Aetherflux Reservoir", "Triumph of the Hordes"],
  Combos: ["Isochron Scepter", "Dramatic Reversal", "Walking Ballista", "Freed from the Real"],
  Utilidades: [
    "Eternal Witness",
    "Reclamation Sage",
    "Scavenging Ooze",
    "Commander's Sphere",
    "Reliquary Tower",
    "Bojuka Bog",
    "Hero's Blade",
    "Soul-Guide Lantern",
    "Panharmonicon",
    "Whispersilk Cloak",
    "Sensei's Divining Top",
    "Arcane Lighthouse",
    "Haywire Mite",
    "Mystic Sanctuary",
    "Rogue's Passage"
  ]
};

const initialPreferences = Object.fromEntries(
  preferenceQuestions.map((question) => [question.id, question.options[0]])
) as Record<string, string>;

function ManaPips({ colors, size = "sm" }: { colors: ManaColor[]; size?: "sm" | "md" }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={colors.map((color) => manaColorLabels[color]).join(", ")}>
      {colors.map((color) => (
        <img
          key={color}
          src={manaColorImages[color]}
          alt={manaColorLabels[color]}
          title={manaColorLabels[color]}
          className={cn(
            "rounded-full border border-white/20 bg-black/20 object-contain shadow-[0_0_14px_rgba(255,255,255,.16)]",
            size === "md" ? "size-8" : "size-6"
          )}
        />
      ))}
    </span>
  );
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function sortCommanders(commanders: CommanderProfile[], filter: CommanderFilterId) {
  const tagged = commanders.filter((commander) => commander.tags.includes(filter));
  const base = tagged.length ? tagged : commanders;

  return [...base].sort((left, right) => {
    if (filter === "budget") return left.priceTier.localeCompare(right.priceTier) || right.power - left.power;
    if (filter === "easy") return left.complexity - right.complexity || right.power - left.power;
    if (filter === "hard") return right.complexity - left.complexity || right.power - left.power;
    if (filter === "recent") return right.releaseYear - left.releaseYear;
    if (filter === "old") return left.releaseYear - right.releaseYear;
    return right.power - left.power || left.complexity - right.complexity;
  });
}

function commanderContainsColors(identity: ColorIdentity, commander: CommanderProfile) {
  if (identity.colors.includes("C")) return commander.identity.includes("C");
  return identity.colors.every((color) => commander.identity.includes(color));
}

function estimatePower(commander: CommanderProfile | undefined, preferences: Record<string, string>, archetypes: string[], complexity: string) {
  const base = commander?.power ?? 6;
  const tableBonus = preferences.tablePower === "cEDH" ? 2 : preferences.tablePower === "Power Level 9" ? 1 : 0;
  const comboBonus = archetypes.includes("Combo") || archetypes.includes("Storm") ? 1 : 0;
  const complexityBonus = complexity === "Extremamente tecnica" || complexity === "Dificil" ? 1 : 0;
  const proxyBonus = preferences.proxies === "Sim" ? 1 : 0;
  return Math.min(10, Math.max(1, base + tableBonus + comboBonus + complexityBonus + proxyBonus));
}

function getStrategyLine(identity: ColorIdentity, commander: CommanderProfile | undefined, archetypes: string[], styles: string[]) {
  const commanderName = commander?.name ?? "um comandante compativel";
  const archetypeText = archetypes.length ? archetypes.slice(0, 3).join(", ") : "Value, Ramp e Interacao";
  const styleText = styles.length ? styles.slice(0, 2).join(" + ") : "jogo equilibrado";
  return `A IA montaria uma base ${identity.name} (${identity.code}) em torno de ${commanderName}, priorizando ${archetypeText} e ajustando a lista para ${styleText}.`;
}

function buildDeckSections(commander: CommanderProfile | undefined, identity: ColorIdentity, archetypes: string[], budgetUnlimited: boolean): DeckSection[] {
  const commanderName = commander?.name ?? `${identity.name} Commander`;
  const hasGreen = identity.colors.includes("G");
  const hasBlue = identity.colors.includes("U");
  const hasBlack = identity.colors.includes("B");
  const hasWhite = identity.colors.includes("W");
  const hasRed = identity.colors.includes("R");
  const wantsCombo = archetypes.includes("Combo") || archetypes.includes("Storm");
  const wantsTokens = archetypes.includes("Tokens") || archetypes.includes("Tribal");
  const wantsArtifacts = archetypes.includes("Artifacts");

  return [
    {
      title: "Comandante",
      target: "1 carta",
      cards: [
        {
          name: commanderName,
          reason: "Define a identidade de cores, o plano principal e a forma como a lista sera construida ao redor da mesa."
        }
      ]
    },
    {
      title: "Terrenos",
      target: "36 cartas",
      cards: [
        { name: "Command Tower", reason: "Entra desvirado e gera qualquer cor da identidade do comandante." },
        { name: "Path of Ancestry", reason: "Corrige mana e ainda filtra o topo em decks com criaturas relevantes." },
        { name: hasGreen ? "Yavimaya, Cradle of Growth" : "Exotic Orchard", reason: hasGreen ? "Melhora a base verde e ajuda terrenos a produzirem verde." : "Costuma gerar cores importantes em mesas multiplayer." },
        { name: "Pacote de terrenos basicos", reason: "Mantem consistencia, resiste a hate de terrenos nao basicos e respeita o orcamento." }
      ]
    },
    {
      title: "Ramp",
      target: "10 cartas",
      cards: [
        { name: "Sol Ring", reason: "Acelerador universal de Commander e melhor abertura para quase qualquer lista.", expensive: false },
        { name: "Arcane Signet", reason: "Corrige cores e acelera sem exigir condicao adicional." },
        { name: hasGreen ? "Cultivate" : "Mind Stone", reason: hasGreen ? "Busca terrenos, estabiliza cores e garante land drops." : "Acelera cedo e pode virar compra no late game." },
        { name: hasGreen ? "Nature's Lore" : "Fellwar Stone", reason: hasGreen ? "Ramp eficiente que encontra duals com tipo Floresta." : "Boa pedra de mana em mesas com muitas cores." }
      ]
    },
    {
      title: "Draw",
      target: "10 cartas",
      cards: [
        { name: hasBlue ? "Rhystic Study" : "Skullclamp", reason: hasBlue ? "Fonte premium de vantagem que pune oponentes por jogar no ritmo normal." : "Compra muitas cartas em decks com criaturas pequenas ou tokens.", expensive: hasBlue, budgetAlternative: hasBlue ? "Mystic Remora" : "Village Rites", premiumAlternative: hasBlue ? "The One Ring" : "Necropotence" },
        { name: hasGreen ? "Guardian Project" : "Esper Sentinel", reason: hasGreen ? "Transforma criaturas em fluxo constante de cartas." : "Compra ou taxa recursos dos oponentes desde cedo." },
        { name: hasBlack ? "Night's Whisper" : "Tome of Legends", reason: hasBlack ? "Compra barata e eficiente para manter a mao cheia." : "Funciona bem com comandante atacando ou entrando em jogo." }
      ]
    },
    {
      title: "Tutores",
      target: "3 a 5 cartas",
      cards: [
        { name: hasBlack ? "Demonic Tutor" : hasGreen ? "Finale of Devastation" : "Solve the Equation", reason: "Encontra a carta certa para fechar o plano, buscar resposta ou iniciar uma linha de vitoria.", expensive: true, budgetAlternative: hasBlack ? "Diabolic Tutor" : "Shared Summons", premiumAlternative: "Imperial Seal" },
        { name: wantsArtifacts ? "Fabricate" : "Open the Armory", reason: wantsArtifacts ? "Busca a peca de artefato essencial." : "Encontra equipamento, aura ou protecao importante." }
      ]
    },
    {
      title: "Remocoes",
      target: "8 cartas",
      cards: [
        { name: hasWhite ? "Swords to Plowshares" : hasBlack ? "Feed the Swarm" : "Beast Within", reason: "Remove ameacas problematicas com baixo custo e alta flexibilidade." },
        { name: hasRed ? "Chaos Warp" : hasBlue ? "Pongify" : "Generous Gift", reason: "Resposta versatil para permanentes que podem impedir seu plano." },
        { name: "Respostas pontuais flexiveis", reason: "A IA reserva slots para criaturas, encantamentos, artefatos e permanentes-chave do meta local." }
      ]
    },
    {
      title: "Board Wipes",
      target: "2 a 4 cartas",
      cards: [
        { name: hasWhite ? "Austere Command" : hasRed ? "Blasphemous Act" : "Toxic Deluge", reason: "Limpa a mesa no momento certo sem abandonar o plano principal do deck.", expensive: !hasWhite && !hasRed, budgetAlternative: "Crux of Fate", premiumAlternative: "Cyclonic Rift" },
        { name: hasBlue ? "Cyclonic Rift" : "Nevinyrral's Disk", reason: hasBlue ? "Reseta o ritmo dos oponentes e abre uma janela de vitoria." : "Botao de emergencia para mesas travadas." }
      ]
    },
    {
      title: "Protecoes",
      target: "5 cartas",
      cards: [
        { name: hasGreen ? "Heroic Intervention" : "Swiftfoot Boots", reason: hasGreen ? "Protege a mesa inteira contra wipes e remocoes." : "Mantem o comandante vivo e acelera ataques importantes.", expensive: hasGreen, budgetAlternative: "Tamiyo's Safekeeping", premiumAlternative: "Teferi's Protection" },
        { name: hasWhite ? "Teferi's Protection" : "Lightning Greaves", reason: "Protege o investimento principal e evita perder o jogo para uma unica resposta." }
      ]
    },
    {
      title: "Win Conditions",
      target: "4 a 6 cartas",
      cards: [
        { name: wantsTokens ? "Craterhoof Behemoth" : wantsCombo ? "Aetherflux Reservoir" : "Finale of Devastation", reason: "Converte vantagem acumulada em fechamento real de partida.", expensive: true, budgetAlternative: wantsTokens ? "Overrun" : "Overwhelming Stampede", premiumAlternative: "Craterhoof Behemoth" },
        { name: commanderName, reason: "O comandante tambem funciona como motor ou condicao de vitoria quando protegido." }
      ]
    },
    {
      title: "Combos",
      target: wantsCombo ? "3 pacotes" : "0 a 1 pacote",
      cards: [
        { name: wantsCombo ? "Isochron Scepter + Dramatic Reversal" : "Combo leve opcional", reason: wantsCombo ? "Linha compacta para gerar valor/mana repetidamente com pedras suficientes." : "Mantido como pacote discreto para nao dominar a experiencia casual." },
        { name: hasBlack ? "Reassembling Skeleton + Ashnod's Altar" : "Engine de valor recorrente", reason: hasBlack ? "Base sacrificio simples para aristocrats e mana." : "A IA prefere sinergias que parecam jogo normal antes de virar vitoria." }
      ]
    },
    {
      title: "Utilidades",
      target: "10 a 12 cartas",
      cards: [
        { name: hasGreen ? "Eternal Witness" : "Commander's Sphere", reason: hasGreen ? "Recupera cartas importantes e aumenta resiliencia." : "Corrige mana e compra carta quando nao for mais necessario." },
        { name: "Reliquary Tower", reason: "Evita descartar quando o deck compra muitas cartas." },
        { name: "Graveyard hate flexivel", reason: "Mantem a lista preparada contra reanimator e combos de cemiterio." }
      ]
    }
  ];
}

function getExplanation(
  commander: CommanderProfile | undefined,
  identity: ColorIdentity,
  archetypes: string[],
  styles: string[],
  experience: string,
  complexity: string
) {
  const commanderName = commander?.name ?? `${identity.name} Commander`;
  const archetypeText = archetypes.length ? archetypes.join(", ") : "Value";
  return [
    {
      title: "Por que cada carta foi escolhida",
      text: "Cada slot aparece com uma justificativa funcional: acelerar, comprar, responder, proteger, finalizar ou sustentar o plano do comandante."
    },
    {
      title: "Como o deck joga",
      text: `${commanderName} usa ${identity.code} para desenvolver mana, criar vantagem e transformar ${archetypeText} em pressao progressiva. A curva e ajustada para ${experience.toLowerCase()} e complexidade ${complexity.toLowerCase()}.`
    },
    {
      title: "Como vencer",
      text: "A lista vence acumulando vantagem, protegendo o motor principal e escolhendo a janela certa para combo, ataque letal ou finalizador de alto impacto."
    },
    {
      title: "Quando fazer mulligan",
      text: "Mulligue maos sem duas fontes de mana, sem acelerador ou sem plano ate o turno tres. Maos com ramp, draw e uma interacao costumam ser melhores."
    },
    {
      title: "Melhores jogadas",
      text: "Priorize mana cedo, proteja o comandante antes de expor pecas caras e use remocoes apenas em ameacas que impedem sua vitoria."
    },
    {
      title: "Combos",
      text: styles.includes("Nao quero combos infinitos") ? "A IA evita combos infinitos e prefere sinergias de valor." : "Combos sao incluidos como linhas justificadas, com pecas que tambem funcionam fora do combo."
    },
    {
      title: "Fraquezas",
      text: "O deck pode sofrer contra stax pesado, hate de cemiterio, excesso de wipes ou mesas mais rapidas que seu power level configurado."
    },
    {
      title: "Pontos fortes",
      text: "A principal forca e ter um plano claro, cartas com funcoes definidas e alternativas de upgrade ou economia para cada peca cara."
    }
  ];
}

function isPlaceholderCard(name: string) {
  const lower = name.toLowerCase();
  return (
    lower.includes("pacote") ||
    lower.includes("flexiveis") ||
    lower.includes("opcional") ||
    lower.includes("recorrente") ||
    name.includes(" + ")
  );
}

function addUniqueCard(entries: DeckListEntry[], name: string, section: string) {
  if (isPlaceholderCard(name)) return;
  if (entries.some((entry) => entry.name.toLowerCase() === name.toLowerCase())) return;
  entries.push({ name, quantity: 1, section });
}

function buildDeckList(deckSections: DeckSection[], identity: ColorIdentity) {
  const entries: DeckListEntry[] = [];
  const commander = deckSections.find((section) => section.title === "Comandante")?.cards[0]?.name ?? "Comandante";
  entries.push({ name: commander, quantity: 1, section: "Comandante" });

  const landSection = deckSections.find((section) => section.title === "Terrenos");
  landSection?.cards.forEach((card) => addUniqueCard(entries, card.name, "Terrenos"));

  const currentLandCount = entries.filter((entry) => entry.section === "Terrenos").reduce((sum, entry) => sum + entry.quantity, 0);
  const colors = identity.colors.length ? identity.colors : (["C"] as ManaColor[]);
  const basicTarget = Math.max(0, sectionTargets.Terrenos - currentLandCount);
  colors.forEach((color, index) => {
    const remainingColors = colors.length - index;
    const alreadyAdded = entries
      .filter((entry) => entry.section === "Terrenos" && Object.values(basicLandsByColor).includes(entry.name))
      .reduce((sum, entry) => sum + entry.quantity, 0);
    const quantity = index === colors.length - 1 ? basicTarget - alreadyAdded : Math.floor((basicTarget - alreadyAdded) / remainingColors);
    if (quantity > 0) entries.push({ name: basicLandsByColor[color], quantity, section: "Terrenos" });
  });

  deckSections
    .filter((section) => section.title !== "Comandante" && section.title !== "Terrenos")
    .forEach((section) => {
      const target = sectionTargets[section.title] ?? section.cards.length;
      section.cards.forEach((card) => {
        if (card.name !== commander) addUniqueCard(entries, card.name, section.title);
      });

      const fallback = fallbackCardsBySection[section.title] ?? [];
      let fallbackIndex = 0;
      while (entries.filter((entry) => entry.section === section.title).length < target && fallbackIndex < fallback.length) {
        addUniqueCard(entries, fallback[fallbackIndex], section.title);
        fallbackIndex += 1;
      }
    });

  const currentTotal = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  if (currentTotal < 100) {
    entries.push({ name: identity.colors.includes("G") ? "Forest" : "Wastes", quantity: 100 - currentTotal, section: "Terrenos" });
  }

  return entries;
}

function formatDeckText(entries: DeckListEntry[], format: string) {
  const grouped = entries.reduce<Record<string, DeckListEntry[]>>((acc, entry) => {
    acc[entry.section] = [...(acc[entry.section] ?? []), entry];
    return acc;
  }, {});

  const lines = [`Magic The Galo - Exportacao ${format}`, ""];
  Object.entries(grouped).forEach(([section, cards]) => {
    lines.push(section);
    cards.forEach((card) => lines.push(`${card.quantity} ${card.name}`));
    lines.push("");
  });

  return lines.join("\n");
}

function formatDeckCsv(entries: DeckListEntry[]) {
  return [
    "section,quantity,name",
    ...entries.map((entry) => `"${entry.section}",${entry.quantity},"${entry.name.replaceAll('"', '""')}"`)
  ].join("\n");
}

function downloadTextFile(filename: string, content: string, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyText(content: string) {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    return false;
  }
}

function openPrintableDeck(entries: DeckListEntry[], explanation: Array<{ title: string; text: string }>) {
  const deckText = formatDeckText(entries, "PDF");
  const explanationHtml = explanation.map((item) => `<h2>${item.title}</h2><p>${item.text}</p>`).join("");
  const popup = window.open("", "_blank", "noopener,noreferrer");
  if (!popup) return false;
  popup.document.write(`
    <html>
      <head>
        <title>Magic The Galo - Deck</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #171717; }
          h1 { margin-bottom: 8px; }
          pre { white-space: pre-wrap; border: 1px solid #ddd; padding: 16px; border-radius: 8px; }
          h2 { margin-top: 24px; }
        </style>
      </head>
      <body>
        <h1>Magic The Galo - Deck Builder</h1>
        <pre>${deckText.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</pre>
        ${explanationHtml}
        <script>window.print()</script>
      </body>
    </html>
  `);
  popup.document.close();
  return true;
}

function expandDeckEntries(entries: DeckListEntry[]) {
  return entries
    .filter((entry) => entry.section !== "Comandante")
    .flatMap((entry) => Array.from({ length: entry.quantity }, () => ({ name: entry.name, section: entry.section })));
}

function shuffleCards(cards: OpeningHandCard[]) {
  const shuffled = [...cards];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function drawOpeningHand(entries: DeckListEntry[]) {
  return shuffleCards(expandDeckEntries(entries)).slice(0, 7);
}

function simulateOpeningHands(entries: DeckListEntry[], runs = 3000): DeckSimulationStats {
  const library = expandDeckEntries(entries);
  if (!library.length) return { mulligan: 0, ramp: 0, draw: 0, lands: 0 };

  let mulligan = 0;
  let ramp = 0;
  let draw = 0;
  let lands = 0;

  for (let run = 0; run < runs; run += 1) {
    const hand = shuffleCards(library).slice(0, 7);
    const landCount = hand.filter((card) => card.section === "Terrenos").length;
    const hasRamp = hand.some((card) => card.section === "Ramp");
    const hasDraw = hand.some((card) => card.section === "Draw");

    if (landCount < 2 || landCount > 5 || (landCount === 2 && !hasRamp && !hasDraw)) mulligan += 1;
    if (hasRamp) ramp += 1;
    if (hasDraw) draw += 1;
    if (landCount >= 2) lands += 1;
  }

  return {
    mulligan: Math.round((mulligan / runs) * 100),
    ramp: Math.round((ramp / runs) * 100),
    draw: Math.round((draw / runs) * 100),
    lands: Math.round((lands / runs) * 100)
  };
}

function getOpeningHandTheme(section: string) {
  if (section === "Terrenos") {
    return {
      frame: "linear-gradient(145deg, #1b1713, #4b3a2b)",
      art: "radial-gradient(circle at 35% 25%, rgba(215,180,106,.45), transparent 30%), linear-gradient(135deg, #6b5b43, #19140f)",
      badge: "#8a6c3e"
    };
  }

  if (section === "Ramp") {
    return {
      frame: "linear-gradient(145deg, #102618, #275c39)",
      art: "radial-gradient(circle at 50% 30%, rgba(116,214,128,.55), transparent 32%), linear-gradient(135deg, #2f8a4b, #0d1d13)",
      badge: "#4fb363"
    };
  }

  if (section === "Draw") {
    return {
      frame: "linear-gradient(145deg, #0c2238, #285f8d)",
      art: "radial-gradient(circle at 45% 30%, rgba(128,203,255,.65), transparent 32%), linear-gradient(135deg, #2b74a8, #081521)",
      badge: "#68b7e8"
    };
  }

  if (section === "Remocoes" || section === "Board Wipes") {
    return {
      frame: "linear-gradient(145deg, #33100f, #8a2820)",
      art: "radial-gradient(circle at 45% 25%, rgba(255,113,79,.62), transparent 30%), linear-gradient(135deg, #962d25, #1b0807)",
      badge: "#e25d41"
    };
  }

  if (section === "Protecoes") {
    return {
      frame: "linear-gradient(145deg, #3a3115, #a6812d)",
      art: "radial-gradient(circle at 52% 30%, rgba(255,224,124,.58), transparent 32%), linear-gradient(135deg, #a88131, #1f1808)",
      badge: "#d7b46a"
    };
  }

  if (section === "Combos" || section === "Win Conditions") {
    return {
      frame: "linear-gradient(145deg, #27103a, #7141a1)",
      art: "radial-gradient(circle at 48% 28%, rgba(206,143,255,.62), transparent 33%), linear-gradient(135deg, #7141a1, #130719)",
      badge: "#b77cff"
    };
  }

  return {
    frame: "linear-gradient(145deg, #191b23, #454a58)",
    art: "radial-gradient(circle at 48% 28%, rgba(220,226,235,.48), transparent 32%), linear-gradient(135deg, #5d6472, #101117)",
    badge: "#9aa3b4"
  };
}

function getHandVerdict(stats: DeckSimulationStats | null) {
  if (!stats) return "Aguardando simulacao";
  if (stats.mulligan <= 18 && stats.lands >= 75) return "Mao inicial estavel";
  if (stats.mulligan <= 28) return "Mao jogavel, mas exige leitura";
  return "Mao arriscada, considere mulligan";
}

function getScryfallNamedUrl(cardName: string, mode: "exact" | "fuzzy" = "exact") {
  return `https://api.scryfall.com/cards/named?${mode}=${encodeURIComponent(cardName)}`;
}

function getScryfallImageFromCard(card: ScryfallCardResponse) {
  return card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal ?? null;
}

async function fetchScryfallCardImage(cardName: string) {
  for (const mode of ["exact", "fuzzy"] as const) {
    const response = await fetch(getScryfallNamedUrl(cardName, mode));
    if (!response.ok) continue;

    const card = (await response.json()) as ScryfallCardResponse;
    const imageUrl = getScryfallImageFromCard(card);
    if (imageUrl) return imageUrl;
  }

  return null;
}

function getArenaCardCost(card: OpeningHandCard) {
  if (card.section === "Terrenos") return 0;
  if (card.section === "Ramp" || card.section === "Remocoes" || card.section === "Protecoes") return 2;
  if (card.section === "Draw" || card.section === "Tutores" || card.section === "Utilidades") return 3;
  if (card.section === "Combos") return 4;
  if (card.section === "Board Wipes") return 5;
  if (card.section === "Win Conditions") return 6;
  return 3;
}

function getArenaCardPower(card: OpeningHandCard) {
  if (card.section === "Terrenos") return 0;
  if (card.section === "Ramp" || card.section === "Draw" || card.section === "Protecoes") return 1;
  if (card.section === "Remocoes" || card.section === "Tutores") return 2;
  if (card.section === "Utilidades" || card.section === "Combos") return 3;
  if (card.section === "Win Conditions") return 6;
  return 2;
}

function makeArenaPermanent(card: OpeningHandCard, owner: "player" | "bot", index: number): ArenaPermanent {
  const power = getArenaCardPower(card);
  return {
    ...card,
    id: `${owner}-${card.name}-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    power,
    toughness: Math.max(1, power + 1),
    isManaSource: card.section === "Terrenos" || card.section === "Ramp"
  };
}

function getManaSources(battlefield: ArenaPermanent[]) {
  return battlefield.filter((card) => card.isManaSource).length;
}

function createArenaState(deckList: DeckListEntry[]): ArenaState {
  const playerLibrary = shuffleCards(expandDeckEntries(deckList));
  const botLibrary = shuffleCards(expandDeckEntries(deckList));

  return {
    playerLife: 40,
    botLife: 40,
    turn: 1,
    activeTurn: "player",
    playerHand: playerLibrary.slice(0, 7),
    botHand: botLibrary.slice(0, 7),
    playerLibrary: playerLibrary.slice(7),
    botLibrary: botLibrary.slice(7),
    playerBattlefield: [],
    botBattlefield: [],
    playerDrewThisTurn: false,
    playerLandPlayedThisTurn: false,
    playerManaSpent: 0,
    log: [
      "A arena abriu. Voce esta no play.",
      "Bot do Galo comprou sete cartas e aguarda sua primeira jogada."
    ]
  };
}

function drawArenaCard(state: ArenaState, owner: "player" | "bot"): { state: ArenaState; drawn?: OpeningHandCard } {
  const libraryKey = owner === "player" ? "playerLibrary" : "botLibrary";
  const handKey = owner === "player" ? "playerHand" : "botHand";
  const library = state[libraryKey];
  const drawn = library[0];

  if (!drawn) {
    return {
      state: {
        ...state,
        winner: (owner === "player" ? "bot" : "player") as "player" | "bot",
        log: [`${owner === "player" ? "Voce" : "Bot do Galo"} tentou comprar de um grimorio vazio.`, ...state.log]
      },
      drawn: undefined
    };
  }

  return {
    state: {
      ...state,
      [libraryKey]: library.slice(1),
      [handKey]: [...state[handKey], drawn]
    },
    drawn
  };
}

function castArenaCard(state: ArenaState, owner: "player" | "bot", cardIndex: number): ArenaState {
  const isPlayer = owner === "player";
  const handKey = isPlayer ? "playerHand" : "botHand";
  const battlefieldKey = isPlayer ? "playerBattlefield" : "botBattlefield";
  const opponentBattlefieldKey = isPlayer ? "botBattlefield" : "playerBattlefield";
  const opponentLifeKey = isPlayer ? "botLife" : "playerLife";
  const label = isPlayer ? "Voce" : "Bot do Galo";
  const hand = state[handKey];
  const card = hand[cardIndex];
  if (!card) return state;

  const remainingHand = hand.filter((_, index) => index !== cardIndex);
  const permanent = makeArenaPermanent(card, owner, state[battlefieldKey].length);

  if (card.section === "Remocoes") {
    const targetIndex = state[opponentBattlefieldKey].findIndex((item) => item.section !== "Terrenos");
    if (targetIndex >= 0) {
      const target = state[opponentBattlefieldKey][targetIndex];
      return {
        ...state,
        [handKey]: remainingHand,
        [opponentBattlefieldKey]: state[opponentBattlefieldKey].filter((_, index) => index !== targetIndex),
        log: [`${label} conjurou ${card.name} e removeu ${target.name}.`, ...state.log]
      };
    }

    return {
      ...state,
      [handKey]: remainingHand,
      [opponentLifeKey]: Math.max(0, state[opponentLifeKey] - 2),
      log: [`${label} conjurou ${card.name} e causou 2 de dano direto.`, ...state.log]
    };
  }

  if (card.section === "Board Wipes") {
    return {
      ...state,
      [handKey]: remainingHand,
      playerBattlefield: state.playerBattlefield.filter((item) => item.section === "Terrenos"),
      botBattlefield: state.botBattlefield.filter((item) => item.section === "Terrenos"),
      log: [`${label} limpou a mesa com ${card.name}.`, ...state.log]
    };
  }

  if (card.section === "Draw") {
    const firstDraw = drawArenaCard({ ...state, [handKey]: remainingHand }, owner);
    const secondDraw = drawArenaCard(firstDraw.state, owner);
    return {
      ...secondDraw.state,
      [battlefieldKey]: [...secondDraw.state[battlefieldKey], permanent],
      log: [`${label} conjurou ${card.name} e comprou cartas.`, ...secondDraw.state.log]
    };
  }

  return {
    ...state,
    [handKey]: remainingHand,
    [battlefieldKey]: [...state[battlefieldKey], permanent],
    log: [`${label} colocou ${card.name} na mesa.`, ...state.log]
  };
}

function attackWithBoard(state: ArenaState, owner: "player" | "bot"): ArenaState {
  const isPlayer = owner === "player";
  const battlefield = isPlayer ? state.playerBattlefield : state.botBattlefield;
  const attackers = battlefield.filter((card) => card.section !== "Terrenos");
  const damage = attackers.reduce((sum, card) => sum + Math.max(1, card.power), 0);

  if (!damage) {
    return {
      ...state,
      log: [`${isPlayer ? "Voce" : "Bot do Galo"} ainda nao tem atacantes na mesa.`, ...state.log]
    };
  }

  const lifeKey = isPlayer ? "botLife" : "playerLife";
  const nextLife = Math.max(0, state[lifeKey] - damage);
  return {
    ...state,
    [lifeKey]: nextLife,
    winner: nextLife <= 0 ? owner : state.winner,
    log: [`${isPlayer ? "Voce atacou" : "Bot do Galo atacou"} causando ${damage} de dano.`, ...state.log]
  };
}

function playFirstLand(state: ArenaState, owner: "player" | "bot"): ArenaState {
  const isPlayer = owner === "player";
  const handKey = isPlayer ? "playerHand" : "botHand";
  const landIndex = state[handKey].findIndex((card) => card.section === "Terrenos");
  if (landIndex < 0) return state;

  return playLandAt(state, owner, landIndex);
}

function playLandAt(state: ArenaState, owner: "player" | "bot", cardIndex: number): ArenaState {
  const isPlayer = owner === "player";
  const handKey = isPlayer ? "playerHand" : "botHand";
  const battlefieldKey = isPlayer ? "playerBattlefield" : "botBattlefield";
  const land = state[handKey][cardIndex];
  if (!land || land.section !== "Terrenos") return state;

  return {
    ...state,
    [handKey]: state[handKey].filter((_, index) => index !== cardIndex),
    [battlefieldKey]: [...state[battlefieldKey], makeArenaPermanent(land, owner, state[battlefieldKey].length)],
    log: [`${isPlayer ? "Voce baixou" : "Bot do Galo baixou"} ${land.name}.`, ...state.log]
  };
}

function runBotTurn(state: ArenaState): ArenaState {
  let nextState: ArenaState = {
    ...state,
    activeTurn: "bot",
    log: [`Turno do Bot do Galo.`, ...state.log]
  };

  const drawResult = drawArenaCard(nextState, "bot");
  nextState = {
    ...drawResult.state,
    log: [drawResult.drawn ? `Bot do Galo comprou uma carta.` : "Bot do Galo nao conseguiu comprar.", ...drawResult.state.log]
  };

  nextState = playFirstLand(nextState, "bot");

  const botMana = getManaSources(nextState.botBattlefield);
  const castIndex = nextState.botHand.findIndex((card) => card.section !== "Terrenos" && getArenaCardCost(card) <= botMana);
  if (castIndex >= 0) nextState = castArenaCard(nextState, "bot", castIndex);

  if (nextState.turn > 1) nextState = attackWithBoard(nextState, "bot");

  return {
    ...nextState,
    turn: nextState.turn + 1,
    activeTurn: "player",
    playerDrewThisTurn: false,
    playerLandPlayedThisTurn: false,
    playerManaSpent: 0,
    log: [`Sua prioridade.`, ...nextState.log]
  };
}

export function DeckBuilderClient() {
  const [activeSection, setActiveSection] = useState(0);
  const [colorMode, setColorMode] = useState<"choose" | "auto">("choose");
  const [selectedIdentityId, setSelectedIdentityId] = useState("g");
  const [budget, setBudget] = useState(80000);
  const [budgetUnlimited, setBudgetUnlimited] = useState(false);
  const [playerExperience, setPlayerExperience] = useState("Iniciante");
  const [complexity, setComplexity] = useState("Media");
  const [activeCommanderFilter, setActiveCommanderFilter] = useState<CommanderFilterId>("popular");
  const [commanderSearch, setCommanderSearch] = useState("");
  const [selectedCommanderName, setSelectedCommanderName] = useState("");
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>(["Ramp", "Value"]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["Quero deck divertido", "Quero muita interacao"]);
  const [preferences, setPreferences] = useState<Record<string, string>>(initialPreferences);
  const [optimizationFocus, setOptimizationFocus] = useState("Mais consistente");
  const [handTested, setHandTested] = useState(false);

  const suggestedIdentity = useMemo(
    () => suggestColorIdentity(selectedArchetypes, selectedStyles),
    [selectedArchetypes, selectedStyles]
  );

  const activeIdentity = colorMode === "auto" ? suggestedIdentity : getColorIdentityById(selectedIdentityId);

  const compatibleCommanders = useMemo(() => {
    const search = commanderSearch.trim().toLowerCase();
    const pool = commanderPool.filter((commander) => commanderContainsColors(activeIdentity, commander));
    const searched = search ? pool.filter((commander) => commander.name.toLowerCase().includes(search)) : pool;
    return sortCommanders(searched, activeCommanderFilter);
  }, [activeCommanderFilter, activeIdentity, commanderSearch]);

  const selectedCommander = useMemo(
    () => commanderPool.find((commander) => commander.name === selectedCommanderName),
    [selectedCommanderName]
  );

  const recommendedCommander = compatibleCommanders[0];
  const displayCommander =
    selectedCommander && compatibleCommanders.some((commander) => commander.name === selectedCommander.name)
      ? selectedCommander
      : recommendedCommander;

  const estimatedPower = estimatePower(displayCommander, preferences, selectedArchetypes, complexity);
  const deckSections = buildDeckSections(displayCommander, activeIdentity, selectedArchetypes, budgetUnlimited);
  const explanation = getExplanation(displayCommander, activeIdentity, selectedArchetypes, selectedStyles, playerExperience, complexity);
  const totalCards = 100;
  const displayedCost = budgetUnlimited ? "Sem limite" : formatMoney(budget);
  const progress = Math.round(((activeSection + 1) / wizardSections.length) * 100);

  function updatePreference(questionId: string, value: string) {
    setPreferences((current) => ({ ...current, [questionId]: value }));
  }

  function surpriseMe() {
    const candidates = compatibleCommanders.slice(0, Math.min(compatibleCommanders.length, 8));
    if (!candidates.length) return;
    const index = Math.floor(Math.random() * candidates.length);
    setSelectedCommanderName(candidates[index].name);
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-premium border border-white/10 bg-white/[.045] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-premium border border-gold/30 bg-gold/10 px-3 py-2 text-sm font-bold text-gold">
              <Wand2 className="size-4" />
              Deck Builder Inteligente
            </span>
            <h2 className="mt-4 text-3xl font-black text-frost sm:text-4xl">Monte seu Deck Ideal</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-mist">
              Um configurador premium para Commander: escolha cores, orcamento, experiencia, comandante, estrategia e veja a
              estrutura do deck com justificativas.
            </p>
          </div>
          <div className="min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-mist">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gold transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-2 md:grid-cols-3 xl:grid-cols-9">
          {wizardSections.map((section, index) => (
            <button
              key={section.title}
              type="button"
              onClick={() => setActiveSection(index)}
              className={cn(
                "rounded-premium border p-3 text-left transition",
                activeSection === index ? "border-gold/50 bg-gold/10 text-frost" : "border-white/10 bg-black/15 text-mist hover:text-frost"
              )}
            >
              <span className="block text-sm font-bold">{section.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-premium border border-white/10 bg-white/[.045] p-5">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-2xl font-black text-frost">{wizardSections[activeSection].title}</h3>
              <p className="mt-2 text-sm text-mist">{wizardSections[activeSection].description}</p>
            </div>
            <div className="inline-flex rounded-premium border border-white/10 bg-black/20 p-1">
              <Button type="button" size="sm" variant="ghost" disabled={activeSection === 0} onClick={() => setActiveSection((step) => Math.max(0, step - 1))}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button type="button" size="sm" variant="ghost" disabled={activeSection === wizardSections.length - 1} onClick={() => setActiveSection((step) => Math.min(wizardSections.length - 1, step + 1))}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="pt-5">
            {activeSection === 0 ? (
              <ColorIdentitySection
                colorMode={colorMode}
                setColorMode={setColorMode}
                selectedIdentityId={selectedIdentityId}
                setSelectedIdentityId={setSelectedIdentityId}
                suggestedIdentity={suggestedIdentity}
              />
            ) : null}

            {activeSection === 1 ? (
              <BudgetSection
                budget={budget}
                setBudget={setBudget}
                budgetUnlimited={budgetUnlimited}
                setBudgetUnlimited={setBudgetUnlimited}
              />
            ) : null}

            {activeSection === 2 ? (
              <ChoiceCards options={playerExperienceOptions} selected={playerExperience} onSelect={setPlayerExperience} />
            ) : null}

            {activeSection === 3 ? (
              <ChoiceCards options={complexityOptions} selected={complexity} onSelect={setComplexity} />
            ) : null}

            {activeSection === 4 ? (
              <CommanderSection
                activeIdentity={activeIdentity}
                activeCommanderFilter={activeCommanderFilter}
                setActiveCommanderFilter={setActiveCommanderFilter}
                commanderSearch={commanderSearch}
                setCommanderSearch={setCommanderSearch}
                compatibleCommanders={compatibleCommanders}
                displayCommander={displayCommander}
                setSelectedCommanderName={setSelectedCommanderName}
                surpriseMe={surpriseMe}
              />
            ) : null}

            {activeSection === 5 ? (
              <OptionGrid
                options={archetypeOptions}
                selected={selectedArchetypes}
                onToggle={(value) => setSelectedArchetypes((current) => toggleValue(current, value))}
              />
            ) : null}

            {activeSection === 6 ? (
              <OptionGrid
                options={styleOptions}
                selected={selectedStyles}
                onToggle={(value) => setSelectedStyles((current) => toggleValue(current, value))}
              />
            ) : null}

            {activeSection === 7 ? (
              <PreferencesSection preferences={preferences} updatePreference={updatePreference} />
            ) : null}

            {activeSection === 8 ? (
              <ResultSection
                activeIdentity={activeIdentity}
                deckSections={deckSections}
                explanation={explanation}
                optimizationFocus={optimizationFocus}
                setOptimizationFocus={setOptimizationFocus}
                handTested={handTested}
                setHandTested={setHandTested}
              />
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-between">
            <Button type="button" variant="secondary" disabled={activeSection === 0} onClick={() => setActiveSection((step) => Math.max(0, step - 1))}>
              <ChevronLeft className="size-4" />
              Voltar
            </Button>
            <Button
              type="button"
              disabled={activeSection === wizardSections.length - 1}
              onClick={() => setActiveSection((step) => Math.min(wizardSections.length - 1, step + 1))}
            >
              Continuar
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <aside className="rounded-premium border border-gold/20 bg-gold/10 p-5 xl:sticky xl:top-28 xl:self-start">
          <div className="flex items-center gap-2 text-gold">
            <Sparkles className="size-5" />
            <strong>Previa inteligente</strong>
          </div>
          <h3 className="mt-4 text-2xl font-black text-frost">
            {displayCommander ? `${displayCommander.name} ${activeIdentity.code}` : `${activeIdentity.name} Commander`}
          </h3>
          <p className="mt-3 text-sm leading-6 text-mist">{getStrategyLine(activeIdentity, displayCommander, selectedArchetypes, selectedStyles)}</p>

          <div className="mt-5 grid gap-3">
            <SummaryLine label="Identidade" value={activeIdentity.name} detail={<ManaPips colors={activeIdentity.colors} />} />
            <SummaryLine label="Comandante" value={displayCommander?.name ?? "Aguardando escolha"} />
            <SummaryLine label="Custo do deck" value={displayedCost} />
            <SummaryLine label="Experiencia" value={playerExperience} />
            <SummaryLine label="Complexidade" value={complexity} />
            <SummaryLine label="Power estimado" value={`${estimatedPower}/10`} />
            <SummaryLine label="Cartas" value={`${totalCards} cartas`} />
          </div>

          <div className="mt-5 rounded-premium border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-2">
              <Brain className="size-5 text-gold" />
              <strong className="text-frost">IA com justificativa</strong>
            </div>
            <p className="mt-3 text-sm leading-6 text-mist">
              A lista nunca aparece como pilha de nomes: cada categoria mostra motivo, funcao, alternativas e impacto no plano de jogo.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ColorIdentitySection({
  colorMode,
  setColorMode,
  selectedIdentityId,
  setSelectedIdentityId,
  suggestedIdentity
}: {
  colorMode: "choose" | "auto";
  setColorMode: (mode: "choose" | "auto") => void;
  selectedIdentityId: string;
  setSelectedIdentityId: (id: string) => void;
  suggestedIdentity: ColorIdentity;
}) {
  return (
    <section className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setColorMode("choose")}
          className={cn(
            "rounded-premium border p-4 text-left transition",
            colorMode === "choose" ? "border-gold/50 bg-gold/10" : "border-white/10 bg-black/20 hover:border-white/20"
          )}
        >
          <strong className="text-frost">Escolher as cores primeiro</strong>
          <span className="mt-2 block text-sm leading-6 text-mist">
            Mostra todas as identidades e depois lista comandantes que contem essas cores.
          </span>
        </button>
        <button
          type="button"
          onClick={() => setColorMode("auto")}
          className={cn(
            "rounded-premium border p-4 text-left transition",
            colorMode === "auto" ? "border-gold/50 bg-gold/10" : "border-white/10 bg-black/20 hover:border-white/20"
          )}
        >
          <strong className="text-frost">Deixar a IA sugerir</strong>
          <span className="mt-2 block text-sm leading-6 text-mist">
            A IA sugere uma identidade baseada em arquetipos, estilo e preferencias.
          </span>
        </button>
      </div>

      {colorMode === "auto" ? (
        <div className="rounded-premium border border-violet/30 bg-violet/10 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Bot className="size-5 text-gold" />
            <strong className="text-frost">Sugestao atual: {suggestedIdentity.name}</strong>
            <ManaPips colors={suggestedIdentity.colors} size="md" />
          </div>
          <p className="mt-2 text-sm leading-6 text-mist">{suggestedIdentity.description}</p>
        </div>
      ) : null}

      <div className={cn("grid gap-5", colorMode === "auto" && "opacity-50")}>
        {identityGroups.map((group) => (
          <div key={group}>
            <h4 className="text-sm font-black uppercase text-gold">{group}</h4>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {colorIdentities
                .filter((identity) => identity.group === group)
                .map((identity) => (
                  <button
                    key={identity.id}
                    type="button"
                    disabled={colorMode === "auto"}
                    onClick={() => setSelectedIdentityId(identity.id)}
                    className={cn(
                      "rounded-premium border p-3 text-left transition disabled:pointer-events-none",
                      selectedIdentityId === identity.id && colorMode === "choose"
                        ? "border-gold/50 bg-gold/10"
                        : "border-white/10 bg-black/20 hover:border-gold/30"
                    )}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <strong className="text-frost">{identity.name}</strong>
                      <ManaPips colors={identity.colors} />
                    </span>
                    <span className="mt-1 block text-xs font-bold text-gold">{identity.code}</span>
                    <span className="mt-2 block text-xs leading-5 text-mist">{identity.description}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BudgetSection({
  budget,
  setBudget,
  budgetUnlimited,
  setBudgetUnlimited
}: {
  budget: number;
  setBudget: (value: number) => void;
  budgetUnlimited: boolean;
  setBudgetUnlimited: (value: boolean) => void;
}) {
  return (
    <section className="grid gap-5">
      <div className="rounded-premium border border-white/10 bg-black/20 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-xl font-black text-frost">Custo do deck</h4>
            <p className="mt-1 text-sm text-mist">Esse valor guia escolhas, staples caras e alternativas economicas.</p>
          </div>
          <strong className="text-2xl text-gold">{budgetUnlimited ? "Sem limite" : formatMoney(budget)}</strong>
        </div>
        <input
          type="range"
          min={10000}
          max={500000}
          step={10000}
          value={budget}
          disabled={budgetUnlimited}
          onChange={(event) => setBudget(Number(event.target.value))}
          className="mt-5 w-full accent-[#D7B46A]"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {budgetPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={budgetUnlimited}
              onClick={() => setBudget(preset)}
              className={cn(
                "rounded-premium border px-3 py-2 text-sm font-bold transition disabled:opacity-40",
                budget === preset && !budgetUnlimited ? "border-gold/50 bg-gold/10 text-gold" : "border-white/10 bg-white/[.04] text-mist hover:text-frost"
              )}
            >
              {formatMoney(preset)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setBudgetUnlimited(!budgetUnlimited)}
            className={cn(
              "rounded-premium border px-3 py-2 text-sm font-bold transition",
              budgetUnlimited ? "border-gold/50 bg-gold/10 text-gold" : "border-white/10 bg-white/[.04] text-mist hover:text-frost"
            )}
          >
            Sem limite
          </button>
        </div>
        <label className="mt-5 block text-sm font-bold text-frost">
          Valor personalizado
          <input
            type="number"
            min={100}
            step={50}
            value={Math.round(budget / 100)}
            disabled={budgetUnlimited}
            onChange={(event) => setBudget(Math.max(100, Number(event.target.value) || 100) * 100)}
            className="mt-2 h-11 w-full rounded-premium border border-white/10 bg-black/30 px-3 text-frost outline-none disabled:opacity-40"
          />
        </label>
      </div>
    </section>
  );
}

function ChoiceCards({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (value: string) => void }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={cn(
            "min-h-24 rounded-premium border p-4 text-left transition",
            selected === option ? "border-gold/50 bg-gold/10 text-frost" : "border-white/10 bg-black/20 text-mist hover:text-frost"
          )}
        >
          <strong>{option}</strong>
          <span className="mt-2 block text-sm leading-6 text-mist">
            {option.includes("tecn") || option.includes("Competitivo")
              ? "A IA pode usar linhas mais exigentes, stacks e decisoes de sequencing."
              : "A IA prioriza clareza, consistencia e cartas faceis de entender."}
          </span>
        </button>
      ))}
    </section>
  );
}

function CommanderSection({
  activeIdentity,
  activeCommanderFilter,
  setActiveCommanderFilter,
  commanderSearch,
  setCommanderSearch,
  compatibleCommanders,
  displayCommander,
  setSelectedCommanderName,
  surpriseMe
}: {
  activeIdentity: ColorIdentity;
  activeCommanderFilter: CommanderFilterId;
  setActiveCommanderFilter: (filter: CommanderFilterId) => void;
  commanderSearch: string;
  setCommanderSearch: (value: string) => void;
  compatibleCommanders: CommanderProfile[];
  displayCommander: CommanderProfile | undefined;
  setSelectedCommanderName: (value: string) => void;
  surpriseMe: () => void;
}) {
  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-3 rounded-premium border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-mist">Mostrando comandantes que contem</p>
          <div className="mt-1 flex items-center gap-3">
            <strong className="text-frost">{activeIdentity.name}</strong>
            <ManaPips colors={activeIdentity.colors} />
          </div>
        </div>
        <Button type="button" variant="secondary" onClick={surpriseMe}>
          <Shuffle className="size-4" />
          Surpreenda-me
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="flex min-h-11 flex-1 items-center gap-2 rounded-premium border border-white/10 bg-black/20 px-3">
          <Search className="size-4 text-mist" />
          <input
            value={commanderSearch}
            onChange={(event) => setCommanderSearch(event.target.value)}
            placeholder="Buscar comandante por nome"
            className="w-full bg-transparent text-sm text-frost outline-none placeholder:text-mist"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {commanderFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveCommanderFilter(filter.id)}
              className={cn(
                "rounded-premium border px-3 py-2 text-xs font-bold transition",
                activeCommanderFilter === filter.id
                  ? "border-gold/50 bg-gold/10 text-gold"
                  : "border-white/10 bg-black/20 text-mist hover:text-frost"
              )}
              title={filter.description}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {compatibleCommanders.map((commander) => (
          <button
            key={commander.name}
            type="button"
            onClick={() => setSelectedCommanderName(commander.name)}
            className={cn(
              "rounded-premium border p-4 text-left transition hover:border-gold/35",
              displayCommander?.name === commander.name ? "border-gold/50 bg-gold/10" : "border-white/10 bg-black/20"
            )}
          >
            <span className="flex items-start justify-between gap-3">
              <span>
                <strong className="text-frost">{commander.name}</strong>
                <span className="mt-1 block text-xs text-gold">{commander.archetypes.slice(0, 3).join(" / ")}</span>
              </span>
              <ManaPips colors={commander.identity} />
            </span>
            <span className="mt-3 block text-sm leading-6 text-mist">{commander.summary}</span>
            <span className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/10 px-2 py-1 text-mist">Power {commander.power}</span>
              <span className="rounded-full bg-white/10 px-2 py-1 text-mist">Dificuldade {commander.complexity}</span>
              <span className="rounded-full bg-white/10 px-2 py-1 text-mist">{commander.priceTier}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function PreferencesSection({
  preferences,
  updatePreference
}: {
  preferences: Record<string, string>;
  updatePreference: (questionId: string, value: string) => void;
}) {
  return (
    <section className="grid gap-4">
      {preferenceQuestions.map((question) => (
        <div key={question.id} className="rounded-premium border border-white/10 bg-black/20 p-4">
          <h4 className="font-black text-frost">{question.label}</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {question.options.map((option) => (
              <label
                key={option}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-premium border px-3 py-2 text-sm transition",
                  preferences[question.id] === option
                    ? "border-gold/50 bg-gold/10 text-frost"
                    : "border-white/10 bg-white/[.04] text-mist hover:text-frost"
                )}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={preferences[question.id] === option}
                  onChange={() => updatePreference(question.id, option)}
                  className="size-4 accent-[#D7B46A]"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function ResultSection({
  activeIdentity,
  deckSections,
  explanation,
  optimizationFocus,
  setOptimizationFocus,
  handTested,
  setHandTested
}: {
  activeIdentity: ColorIdentity;
  deckSections: DeckSection[];
  explanation: Array<{ title: string; text: string }>;
  optimizationFocus: string;
  setOptimizationFocus: (value: string) => void;
  handTested: boolean;
  setHandTested: (value: boolean) => void;
}) {
  const [exportStatus, setExportStatus] = useState("");
  const [openingHand, setOpeningHand] = useState<OpeningHandCard[]>([]);
  const [simulationStats, setSimulationStats] = useState<DeckSimulationStats | null>(null);
  const [arenaPhase, setArenaPhase] = useState<ArenaPhase>("closed");
  const [arenaState, setArenaState] = useState<ArenaState | null>(null);
  const deckList = useMemo(() => buildDeckList(deckSections, activeIdentity), [activeIdentity, deckSections]);

  useEffect(() => {
    if (arenaPhase !== "intro") return;
    const timer = window.setTimeout(() => setArenaPhase("duel"), 3200);
    return () => window.clearTimeout(timer);
  }, [arenaPhase]);

  async function handleExport(option: string) {
    const slug =
      option
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "deck";

    if (option === "CSV") {
      const csv = formatDeckCsv(deckList);
      downloadTextFile("magic-the-galo-deck.csv", csv, "text/csv;charset=utf-8");
      const copied = await copyText(csv);
      setExportStatus(copied ? "CSV baixado e copiado para a area de transferencia." : "CSV baixado.");
      return;
    }

    if (option === "PDF") {
      const opened = openPrintableDeck(deckList, explanation);
      setExportStatus(opened ? "PDF aberto em modo de impressao. Escolha salvar como PDF." : "O navegador bloqueou a janela do PDF.");
      return;
    }

    const deckText = formatDeckText(deckList, option);
    downloadTextFile(`magic-the-galo-${slug}.txt`, deckText);
    const copied = await copyText(deckText);
    setExportStatus(copied ? `${option}: arquivo baixado e lista copiada.` : `${option}: arquivo baixado.`);
  }

  async function handleSaveAction(action: "save" | "share" | "duplicate") {
    const deckText = formatDeckText(deckList, "Texto");

    if (action === "save") {
      localStorage.setItem(
        "magic-the-galo-deck-builder",
        JSON.stringify({ savedAt: new Date().toISOString(), deck: deckList })
      );
      setExportStatus("Deck salvo neste navegador.");
      return;
    }

    if (action === "share") {
      const copied = await copyText(window.location.href);
      setExportStatus(copied ? "Link da pagina copiado." : "Nao foi possivel copiar o link automaticamente.");
      return;
    }

    downloadTextFile("magic-the-galo-deck-duplicado.txt", deckText);
    const copied = await copyText(deckText);
    setExportStatus(copied ? "Deck duplicado em arquivo e copiado." : "Deck duplicado em arquivo.");
  }

  function handleOpeningHandTest() {
    const nextArena = createArenaState(deckList);
    setHandTested(true);
    setSimulationStats(simulateOpeningHands(deckList));
    setOpeningHand(nextArena.playerHand);
    setArenaState(nextArena);
    setArenaPhase("intro");
  }

  function closeArena() {
    setArenaPhase("closed");
  }

  function handleArenaDraw() {
    setArenaState((current) => {
      if (!current || current.activeTurn !== "player" || current.winner) return current;
      if (current.playerDrewThisTurn) return { ...current, log: ["Voce ja comprou neste turno.", ...current.log] };

      const result = drawArenaCard(current, "player");
      return {
        ...result.state,
        playerDrewThisTurn: true,
        log: [result.drawn ? `Voce comprou ${result.drawn.name}.` : "Voce nao conseguiu comprar.", ...result.state.log]
      };
    });
  }

  function handleArenaLand() {
    setArenaState((current) => {
      if (!current || current.activeTurn !== "player" || current.winner) return current;
      if (current.playerLandPlayedThisTurn) return { ...current, log: ["Voce ja baixou terreno neste turno.", ...current.log] };
      if (!current.playerHand.some((card) => card.section === "Terrenos")) return { ...current, log: ["Nao ha terreno na sua mao.", ...current.log] };

      const nextState = playFirstLand(current, "player");
      return { ...nextState, playerLandPlayedThisTurn: true };
    });
  }

  function handleArenaCast() {
    setArenaState((current) => {
      if (!current || current.activeTurn !== "player" || current.winner) return current;
      const availableMana = getManaSources(current.playerBattlefield) - current.playerManaSpent;
      const cardIndex = current.playerHand.findIndex((card) => card.section !== "Terrenos" && getArenaCardCost(card) <= availableMana);
      if (cardIndex < 0) return { ...current, log: [`Mana disponivel: ${Math.max(0, availableMana)}. Nenhuma magica pode ser conjurada agora.`, ...current.log] };

      const card = current.playerHand[cardIndex];
      const nextState = castArenaCard(current, "player", cardIndex);
      return { ...nextState, playerManaSpent: current.playerManaSpent + getArenaCardCost(card) };
    });
  }

  function handleArenaPlayCard(cardIndex: number) {
    setArenaState((current) => {
      if (!current || current.activeTurn !== "player" || current.winner) return current;

      const card = current.playerHand[cardIndex];
      if (!card) return current;

      if (card.section === "Terrenos") {
        if (current.playerLandPlayedThisTurn) return { ...current, log: ["Voce ja baixou terreno neste turno.", ...current.log] };
        const nextState = playLandAt(current, "player", cardIndex);
        return { ...nextState, playerLandPlayedThisTurn: true };
      }

      const availableMana = getManaSources(current.playerBattlefield) - current.playerManaSpent;
      const cost = getArenaCardCost(card);
      if (cost > availableMana) {
        return {
          ...current,
          log: [`${card.name} custa ${cost}. Voce tem ${Math.max(0, availableMana)} mana disponivel.`, ...current.log]
        };
      }

      const nextState = castArenaCard(current, "player", cardIndex);
      return { ...nextState, playerManaSpent: current.playerManaSpent + cost };
    });
  }

  function handleArenaAttack() {
    setArenaState((current) => {
      if (!current || current.activeTurn !== "player" || current.winner) return current;
      return attackWithBoard(current, "player");
    });
  }

  function handleArenaPass() {
    setArenaState((current) => {
      if (!current || current.activeTurn !== "player" || current.winner) return current;
      return runBotTurn({ ...current, log: ["Voce passou o turno.", ...current.log] });
    });
  }

  return (
    <section className="grid gap-6">
      <Panel title="Lista completa" icon={<FileText className="size-5" />}>
        <div className="grid gap-3">
          {deckSections.map((section) => (
            <details key={section.title} className="rounded-premium border border-white/10 bg-black/20 p-4" open={section.title === "Comandante"}>
              <summary className="cursor-pointer text-sm font-black text-frost">
                {section.title} <span className="text-gold">({section.target})</span>
              </summary>
              <div className="mt-4 grid gap-3">
                {section.cards.map((card) => (
                  <div key={`${section.title}-${card.name}`} className="rounded-[7px] border border-white/10 bg-white/[.04] p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-frost">{card.name}</strong>
                      {card.expensive ? <span className="rounded-full bg-gold/10 px-2 py-1 text-xs font-bold text-gold">carta cara</span> : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-mist">{card.reason}</p>
                    {card.budgetAlternative || card.premiumAlternative ? (
                      <div className="mt-3 grid gap-2 text-xs text-mist sm:grid-cols-2">
                        {card.budgetAlternative ? <span>Economica: <strong className="text-frost">{card.budgetAlternative}</strong></span> : null}
                        {card.premiumAlternative ? <span>Premium: <strong className="text-frost">{card.premiumAlternative}</strong></span> : null}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </Panel>

      <Panel title="Explicacao da IA" icon={<Brain className="size-5" />}>
        <div className="grid gap-3 md:grid-cols-2">
          {explanation.map((item) => (
            <div key={item.title} className="rounded-premium border border-white/10 bg-black/20 p-4">
              <h4 className="font-black text-frost">{item.title}</h4>
              <p className="mt-2 text-sm leading-6 text-mist">{item.text}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Otimizacao" icon={<Sparkles className="size-5" />}>
        <div className="flex flex-wrap gap-2">
          {optimizationOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOptimizationFocus(option)}
              className={cn(
                "rounded-premium border px-3 py-2 text-sm font-bold transition",
                optimizationFocus === option ? "border-gold/50 bg-gold/10 text-gold" : "border-white/10 bg-black/20 text-mist hover:text-frost"
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-mist">
          Foco atual: <strong className="text-frost">{optimizationFocus}</strong>. A IA recalibraria cortes, upgrades e
          proporcoes de ramp/draw/remocoes antes de fechar a lista.
        </p>
        <Button type="button" className="mt-4">
          <Wand2 className="size-4" />
          Otimizar Deck
        </Button>
      </Panel>

      <Panel title="Exportacao e salvar" icon={<Download className="size-5" />}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h4 className="font-black text-frost">Exportar para</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {exportOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => void handleExport(option)}
                  className="rounded-premium border border-white/10 bg-black/20 px-3 py-2 text-sm font-bold text-mist transition hover:border-gold/40 hover:text-frost"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-black text-frost">Salvar e compartilhar</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => void handleSaveAction("save")}><Save className="size-4" /> Salvar na conta</Button>
              <Button type="button" variant="secondary" onClick={() => void handleSaveAction("share")}><Share2 className="size-4" /> Compartilhar link</Button>
              <Button type="button" variant="secondary" onClick={() => void handleSaveAction("duplicate")}><Copy className="size-4" /> Duplicar deck</Button>
            </div>
          </div>
        </div>
        {exportStatus ? <p className="mt-4 text-sm font-bold text-gold">{exportStatus}</p> : null}
      </Panel>

      <Panel title="Simulador de mao inicial" icon={<Play className="size-5" />}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-black text-frost">Mesa de teste</h4>
            <p className="mt-1 text-sm text-mist">Simule a mao como se estivesse abrindo uma partida real de Commander.</p>
          </div>
          <Button type="button" onClick={handleOpeningHandTest}>
            <Play className="size-4" />
            {handTested ? "Entrar em outra Arena" : "Entrar na Arena"}
          </Button>
        </div>

        <div className="mt-4 rounded-[7px] border border-white/10 bg-black/20 p-4">
          <p className="text-sm leading-6 text-mist">
            Ao testar, voce entra em uma arena com transicao cinematografica, mao real, vida, campo, turno e um bot basico.
          </p>
          {handTested && arenaState ? (
            <button type="button" onClick={() => setArenaPhase("duel")} className="mt-3 text-sm font-black text-gold underline-offset-4 hover:underline">
              Voltar para a ultima arena
            </button>
          ) : null}
        </div>

        {arenaPhase !== "closed" && arenaState ? (
          <ArenaOverlay
            phase={arenaPhase}
            arena={arenaState}
            openingHand={openingHand}
            stats={simulationStats}
            onClose={closeArena}
            onTestAgain={handleOpeningHandTest}
            onDraw={handleArenaDraw}
            onPlayLand={handleArenaLand}
            onCast={handleArenaCast}
            onPlayCard={handleArenaPlayCard}
            onAttack={handleArenaAttack}
            onPass={handleArenaPass}
          />
        ) : null}
      </Panel>
    </section>
  );
}

function OptionGrid({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={cn(
              "flex min-h-14 items-center justify-between gap-3 rounded-premium border px-4 py-3 text-left transition",
              checked ? "border-gold/50 bg-gold/10 text-frost" : "border-white/10 bg-black/20 text-mist hover:text-frost"
            )}
          >
            <span className="text-sm font-bold">{option}</span>
            <span className={cn("grid size-5 place-items-center rounded-full border", checked ? "border-gold bg-gold text-obsidian" : "border-white/20")}>
              {checked ? <CheckCircle2 className="size-4" /> : null}
            </span>
          </button>
        );
      })}
    </section>
  );
}

function SummaryLine({ label, value, detail }: { label: string; value: string; detail?: ReactNode }) {
  return (
    <div className="rounded-premium border border-white/10 bg-black/20 p-3">
      <span className="text-xs font-bold uppercase text-mist">{label}</span>
      <span className="mt-1 flex items-center justify-between gap-3 text-sm font-black text-frost">
        {value}
        {detail}
      </span>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-premium border border-white/10 bg-white/[.045] p-5">
      <div className="mb-4 flex items-center gap-2 text-gold">
        {icon}
        <h3 className="text-lg font-black text-frost">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function HandStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[7px] border border-white/10 bg-black/35 p-3">
      <span className="text-xs font-bold uppercase text-mist">{label}</span>
      <strong className="mt-1 block text-2xl text-frost">{value}</strong>
    </div>
  );
}

function ArenaOverlay({
  phase,
  arena,
  openingHand,
  stats,
  onClose,
  onTestAgain,
  onDraw,
  onPlayLand,
  onCast,
  onPlayCard,
  onAttack,
  onPass
}: {
  phase: ArenaPhase;
  arena: ArenaState;
  openingHand: OpeningHandCard[];
  stats: DeckSimulationStats | null;
  onClose: () => void;
  onTestAgain: () => void;
  onDraw: () => void;
  onPlayLand: () => void;
  onCast: () => void;
  onPlayCard: (cardIndex: number) => void;
  onAttack: () => void;
  onPass: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden bg-black/85 text-frost backdrop-blur-md" style={{ animation: "arenaBackdropIn 520ms ease-out both" }}>
      <ArenaStyles />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(215,180,106,.22),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(93,63,161,.2),transparent_28%)]" />
      {phase === "intro" ? (
        <ArenaIntro openingHand={openingHand} onClose={onClose} />
      ) : (
        <ArenaDuel
          arena={arena}
          stats={stats}
          onClose={onClose}
          onTestAgain={onTestAgain}
          onDraw={onDraw}
          onPlayLand={onPlayLand}
          onCast={onCast}
          onPlayCard={onPlayCard}
          onAttack={onAttack}
          onPass={onPass}
        />
      )}
    </div>
  );
}

function ArenaStyles() {
  return (
    <style>
      {`
        @keyframes arenaBackdropIn {
          from { opacity: 0; transform: scale(1.02); filter: blur(8px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }

        @keyframes arenaPortalSpin {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(.55) rotate(0deg); }
          35% { opacity: 1; transform: translate(-50%, -50%) scale(1.05) rotate(140deg); }
          100% { opacity: .72; transform: translate(-50%, -50%) scale(1.24) rotate(360deg); }
        }

        @keyframes arenaTitleRise {
          0% { opacity: 0; transform: translateY(22px) scale(.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes arenaProgressFill {
          0% { width: 0%; opacity: .3; }
          72% { width: 78%; opacity: 1; }
          100% { width: 100%; opacity: 1; }
        }

        @keyframes arenaCardsSweep {
          0% { opacity: 0; transform: translateY(70px) scale(.82); filter: blur(8px); }
          55% { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        @keyframes arenaDuelReveal {
          0% { opacity: 0; transform: translateY(18px) scale(.985); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
      `}
    </style>
  );
}

function ArenaIntro({ openingHand, onClose }: { openingHand: OpeningHandCard[]; onClose: () => void }) {
  return (
    <div className="relative z-10 grid h-full place-items-center overflow-hidden px-6 text-center">
      <button type="button" onClick={onClose} className="absolute right-5 top-5 grid size-10 place-items-center rounded-full border border-white/10 bg-black/40 text-mist transition hover:text-frost">
        <X className="size-5" />
      </button>
      <div
        className="absolute left-1/2 top-1/2 size-[620px] rounded-full border border-gold/25 bg-gold/5 shadow-[0_0_140px_rgba(215,180,106,.26)]"
        style={{ animation: "arenaPortalSpin 2.8s ease-in-out both" }}
      />
      <div
        className="absolute left-1/2 top-1/2 size-[420px] rounded-full border border-purple-400/25 shadow-[inset_0_0_80px_rgba(93,63,161,.22)]"
        style={{ animation: "arenaPortalSpin 2.8s ease-in-out .18s both reverse" }}
      />
      <div className="relative" style={{ animation: "arenaTitleRise 900ms ease-out 220ms both" }}>
        <span className="text-xs font-black uppercase tracking-[.35em] text-gold">Magic The Galo Arena</span>
        <h2 className="mt-4 text-4xl font-black text-frost sm:text-6xl">Preparando duelo</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-mist">
          O portal esta embaralhando sua mao, preparando o bot e abrindo a mesa de Commander.
        </p>
        <div className="mx-auto mt-8 h-2 max-w-md overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold via-frost to-purple-300 shadow-[0_0_24px_rgba(215,180,106,.65)]"
            style={{ animation: "arenaProgressFill 2.35s cubic-bezier(.2,.8,.2,1) 260ms both" }}
          />
        </div>
        <div className="mt-10 hidden h-60 min-w-[760px] sm:block" style={{ animation: "arenaCardsSweep 1.25s ease-out 780ms both" }}>
          <div className="relative mx-auto h-full">
            {openingHand.map((card, index) => (
              <OpeningHandCardView key={`${card.name}-intro-${index}`} card={card} index={index} total={openingHand.length} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArenaDuel({
  arena,
  stats,
  onClose,
  onTestAgain,
  onDraw,
  onPlayLand,
  onCast,
  onPlayCard,
  onAttack,
  onPass
}: {
  arena: ArenaState;
  stats: DeckSimulationStats | null;
  onClose: () => void;
  onTestAgain: () => void;
  onDraw: () => void;
  onPlayLand: () => void;
  onCast: () => void;
  onPlayCard: (cardIndex: number) => void;
  onAttack: () => void;
  onPass: () => void;
}) {
  const [draggingCardIndex, setDraggingCardIndex] = useState<number | null>(null);
  const [isDropReady, setIsDropReady] = useState(false);
  const playerMana = Math.max(0, getManaSources(arena.playerBattlefield) - arena.playerManaSpent);
  const botMana = getManaSources(arena.botBattlefield);
  const isPlayerTurn = arena.activeTurn === "player" && !arena.winner;
  const draggingCard = draggingCardIndex === null ? null : arena.playerHand[draggingCardIndex];

  function handleBattlefieldDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDropReady(false);
    if (!isPlayerTurn || draggingCardIndex === null) return;
    onPlayCard(draggingCardIndex);
    setDraggingCardIndex(null);
  }

  return (
    <div className="relative z-10 mx-auto flex h-full max-w-[1640px] flex-col gap-3 p-3 sm:p-4" style={{ animation: "arenaDuelReveal 700ms ease-out both" }}>
      <div className="rounded-[8px] border border-gold/25 bg-obsidian/88 p-3 shadow-[0_18px_60px_rgba(0,0,0,.45)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <ArenaBadge label="Voce" value={`${arena.playerLife} vida`} tone="gold" />
            <ArenaBadge label="Bot do Galo" value={`${arena.botLife} vida`} tone="purple" />
            <ArenaBadge label="Turno" value={`${arena.turn} ${arena.activeTurn === "player" ? "Sua prioridade" : "Bot pensando"}`} tone="neutral" />
            <ArenaBadge label="Mana" value={`${playerMana} disponivel`} tone="neutral" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={onTestAgain}>
              <Shuffle className="size-4" />
              Nova Arena
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              <X className="size-4" />
              Sair
            </Button>
          </div>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <HandStat label="Mulligan" value={stats ? `${stats.mulligan}%` : "--"} />
          <HandStat label="Abrir ramp" value={stats ? `${stats.ramp}%` : "--"} />
          <HandStat label="Abrir draw" value={stats ? `${stats.draw}%` : "--"} />
          <HandStat label="Abrir terrenos" value={stats ? `${stats.lands}%` : "--"} />
          <div className="rounded-[7px] border border-gold/30 bg-gold/10 p-3">
            <span className="text-xs font-bold uppercase text-gold">Leitura da IA</span>
            <strong className="mt-1 block text-sm text-frost">{arena.winner ? (arena.winner === "player" ? "Voce venceu" : "Bot venceu") : getHandVerdict(stats)}</strong>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[1fr_310px]">
        <div
          onDragOver={(event) => {
            if (!isPlayerTurn) return;
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
          }}
          onDragEnter={() => {
            if (isPlayerTurn) setIsDropReady(true);
          }}
          onDragLeave={(event) => {
            if (event.currentTarget === event.target) setIsDropReady(false);
          }}
          onDrop={handleBattlefieldDrop}
          className={cn(
            "relative min-h-0 overflow-hidden rounded-[8px] border bg-[radial-gradient(circle_at_50%_45%,rgba(215,180,106,.14),transparent_30%),linear-gradient(145deg,rgba(14,17,22,.86),rgba(3,5,10,.94))] shadow-[inset_0_0_100px_rgba(0,0,0,.72)] transition",
            isDropReady ? "border-gold/70 ring-2 ring-gold/35" : "border-white/10"
          )}
        >
          {draggingCard ? (
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/40 bg-black/70 px-5 py-3 text-sm font-black text-gold shadow-[0_0_34px_rgba(215,180,106,.32)]">
              Solte para {draggingCard.section === "Terrenos" ? "baixar" : "conjurar"} {draggingCard.name}
            </div>
          ) : null}
          <ArenaZone
            title="Campo do Bot"
            life={arena.botLife}
            mana={botMana}
            battlefield={arena.botBattlefield}
            handCount={arena.botHand.length}
            opponent
          />
          <div className="mx-4 border-y border-gold/10 py-2 text-center text-xs font-black uppercase tracking-[.28em] text-gold/80">
            Arena Magic The Galo
          </div>
          <ArenaZone
            title="Seu Campo"
            life={arena.playerLife}
            mana={playerMana}
            battlefield={arena.playerBattlefield}
            handCount={arena.playerHand.length}
          />

          <div className="absolute bottom-3 left-1/2 h-[250px] min-w-[880px] -translate-x-1/2 sm:h-[300px]">
            <div className="relative h-full">
              {arena.playerHand.map((card, index) => (
                <OpeningHandCardView
                  key={`${card.name}-arena-${index}`}
                  card={card}
                  index={index}
                  total={arena.playerHand.length}
                  compact
                  draggable={isPlayerTurn}
                  isDragging={draggingCardIndex === index}
                  onDragStart={() => setDraggingCardIndex(index)}
                  onDragEnd={() => {
                    setDraggingCardIndex(null);
                    setIsDropReady(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <aside className="grid min-h-0 gap-3 rounded-[8px] border border-white/10 bg-obsidian/80 p-3">
          <div>
            <h3 className="text-lg font-black text-frost">Acoes</h3>
            <p className="mt-1 text-xs leading-5 text-mist">
              Arraste uma carta da mao para o seu campo. Terrenos baixam; magicas usam mana disponivel.
            </p>
          </div>
          <div className="grid gap-2">
            <Button type="button" disabled={!isPlayerTurn || arena.playerDrewThisTurn} onClick={onDraw}>Comprar carta</Button>
            <Button type="button" variant="secondary" disabled={!isPlayerTurn || arena.playerLandPlayedThisTurn} onClick={onPlayLand}>Baixar terreno</Button>
            <Button type="button" variant="secondary" disabled={!isPlayerTurn} onClick={onCast}>Conjurar carta</Button>
            <Button type="button" variant="secondary" disabled={!isPlayerTurn} onClick={onAttack}>Atacar</Button>
            <Button type="button" disabled={!isPlayerTurn} onClick={onPass}>Passar turno</Button>
          </div>
          <div className="min-h-0 overflow-hidden rounded-[7px] border border-white/10 bg-black/25 p-3">
            <h4 className="text-sm font-black text-gold">Log da partida</h4>
            <div className="mt-2 max-h-72 space-y-2 overflow-y-auto pr-1 text-xs leading-5 text-mist">
              {arena.log.slice(0, 18).map((item, index) => (
                <p key={`${item}-${index}`} className={index === 0 ? "text-frost" : undefined}>{item}</p>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ArenaBadge({ label, value, tone }: { label: string; value: string; tone: "gold" | "purple" | "neutral" }) {
  return (
    <div
      className={cn(
        "rounded-[7px] border px-3 py-2",
        tone === "gold" && "border-gold/30 bg-gold/10",
        tone === "purple" && "border-purple-300/25 bg-purple-400/10",
        tone === "neutral" && "border-white/10 bg-black/25"
      )}
    >
      <span className="text-[10px] font-black uppercase tracking-[.18em] text-mist">{label}</span>
      <strong className="mt-1 block text-sm text-frost">{value}</strong>
    </div>
  );
}

function ArenaZone({
  title,
  life,
  mana,
  battlefield,
  handCount,
  opponent = false
}: {
  title: string;
  life: number;
  mana: number;
  battlefield: ArenaPermanent[];
  handCount: number;
  opponent?: boolean;
}) {
  return (
    <section className={cn("relative grid min-h-[185px] gap-2 p-4", opponent ? "content-start" : "content-end pb-[270px] sm:pb-[320px]")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[.22em] text-gold">{title}</h3>
          <p className="mt-1 text-xs text-mist">{life} vida - {mana} mana - {handCount} cartas na mao</p>
        </div>
        {opponent ? (
          <div className="flex -space-x-8">
            {Array.from({ length: Math.min(handCount, 7) }).map((_, index) => (
              <CardBack key={index} index={index} />
            ))}
          </div>
        ) : null}
      </div>
      <div className="grid min-h-[112px] grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
        {battlefield.length ? (
          battlefield.slice(0, 14).map((card) => <ArenaPermanentCard key={card.id} card={card} />)
        ) : (
          <div className="col-span-full grid min-h-[90px] place-items-center rounded-[7px] border border-dashed border-white/10 bg-black/20 text-xs font-bold text-mist">
            Campo vazio
          </div>
        )}
      </div>
    </section>
  );
}

function CardBack({ index }: { index: number }) {
  return (
    <div
      className="h-20 w-14 rounded-[6px] border-2 border-black bg-[radial-gradient(circle_at_50%_35%,rgba(215,180,106,.55),transparent_28%),linear-gradient(145deg,#171923,#05060a)] shadow-[0_8px_20px_rgba(0,0,0,.45)]"
      style={{ transform: `rotate(${(index - 3) * 4}deg)` }}
    >
      <div className="grid h-full place-items-center rounded-[4px] border border-gold/30 text-[9px] font-black uppercase tracking-[.16em] text-gold">
        MTG
      </div>
    </div>
  );
}

function ArenaPermanentCard({ card }: { card: ArenaPermanent }) {
  const [cardImage, setCardImage] = useState<string | null | undefined>(() => cardImageCache.get(card.name));
  const theme = getOpeningHandTheme(card.section);

  useEffect(() => {
    let cancelled = false;
    const cached = cardImageCache.get(card.name);
    if (cached !== undefined) {
      setCardImage(cached);
      return;
    }

    fetchScryfallCardImage(card.name)
      .then((imageUrl) => {
        cardImageCache.set(card.name, imageUrl);
        if (!cancelled) setCardImage(imageUrl);
      })
      .catch(() => {
        cardImageCache.set(card.name, null);
        if (!cancelled) setCardImage(null);
      });

    return () => {
      cancelled = true;
    };
  }, [card.name]);

  return (
    <div className="group relative min-h-[112px] rounded-[7px] border border-white/10 bg-black/25 p-1">
      {cardImage ? (
        <img src={cardImage} alt={card.name} className="mx-auto h-24 rounded-[5px] object-contain transition group-hover:scale-125 group-hover:shadow-[0_16px_30px_rgba(0,0,0,.75)]" />
      ) : (
        <div className="grid h-24 place-items-center rounded-[5px] px-2 text-center text-[10px] font-black text-frost" style={{ background: theme.art }}>
          {card.name}
        </div>
      )}
      <div className="mt-1 truncate text-[10px] font-bold text-mist">{card.name}</div>
      {card.section !== "Terrenos" ? (
        <span className="absolute right-1 top-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-black text-gold">
          {card.power}/{card.toughness}
        </span>
      ) : null}
    </div>
  );
}

function OpeningHandCardView({
  card,
  index,
  total,
  compact = false,
  draggable = false,
  isDragging = false,
  onDragStart,
  onDragEnd
}: {
  card: OpeningHandCard;
  index: number;
  total: number;
  compact?: boolean;
  draggable?: boolean;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [cardImage, setCardImage] = useState<string | null | undefined>(() => cardImageCache.get(card.name));
  const theme = getOpeningHandTheme(card.section);
  const center = (total - 1) / 2;
  const angle = isHovered ? 0 : (index - center) * (compact ? 6 : 7);
  const offset = (index - center) * (compact ? 82 : 112);
  const lift = isHovered ? (compact ? -32 : -64) : Math.abs(index - center) * (compact ? 7 : 12);
  const scale = isHovered ? (compact ? 1.22 : 1.34) : 1;

  useEffect(() => {
    let cancelled = false;
    const cached = cardImageCache.get(card.name);

    if (cached !== undefined) {
      setCardImage(cached);
      return;
    }

    setCardImage(undefined);

    fetchScryfallCardImage(card.name)
      .then((imageUrl) => {
        cardImageCache.set(card.name, imageUrl);
        if (!cancelled) setCardImage(imageUrl);
      })
      .catch(() => {
        cardImageCache.set(card.name, null);
        if (!cancelled) setCardImage(null);
      });

    return () => {
      cancelled = true;
    };
  }, [card.name]);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      draggable={draggable}
      onDragStart={(event) => {
        if (!draggable) return;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", String(index));
        onDragStart?.();
      }}
      onDragEnd={onDragEnd}
      tabIndex={0}
      className={cn(
        "absolute left-1/2 rounded-[16px] text-[#17130d] outline-none shadow-[0_28px_42px_rgba(0,0,0,.58)] transition-[filter,box-shadow] duration-200 hover:shadow-[0_34px_70px_rgba(0,0,0,.82)] focus:shadow-[0_34px_70px_rgba(0,0,0,.82)]",
        compact ? "bottom-0 h-[232px] w-[166px] sm:h-[270px] sm:w-[194px]" : "bottom-[8%] h-[360px] w-[258px] sm:h-[430px] sm:w-[308px]",
        draggable && "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-45"
      )}
      style={{
        zIndex: isHovered ? 80 : index + 1,
        transform: `translateX(calc(-50% + ${offset}px)) translateY(${lift}px) rotate(${angle}deg) scale(${scale})`,
        transformOrigin: "bottom center"
      }}
    >
      {cardImage ? (
        <img
          src={cardImage}
          alt={card.name}
          title={`${card.name} - ${card.section}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            cardImageCache.set(card.name, null);
            setCardImage(null);
          }}
          className="h-full w-full rounded-[12px] object-contain"
        />
      ) : (
        <div className="flex h-full flex-col rounded-[14px] border-[6px] border-black p-2" style={{ background: theme.frame }}>
          <div className="flex h-full flex-col rounded-[8px] border border-black/70 bg-[#efe6cf] p-2">
            <div className="flex min-h-9 items-center justify-between gap-2 rounded-[5px] border border-black/30 bg-[#d9ccb0] px-2 py-1">
              <strong className="truncate text-[13px] leading-tight">{card.name}</strong>
              <span className="grid size-5 shrink-0 place-items-center rounded-full border border-black/40 text-[10px] font-black" style={{ background: theme.badge }}>
                {index + 1}
              </span>
            </div>

            <div className="mt-2 grid flex-1 place-items-center overflow-hidden rounded-[6px] border-2 border-black/70" style={{ background: theme.art }}>
              <div className="px-3 text-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,.8)]">
                <span className="text-[10px] font-black uppercase tracking-[.18em] text-white/75">
                  {cardImage === undefined ? "Buscando carta real" : "Imagem nao encontrada"}
                </span>
                <strong className="mt-2 block text-lg font-black">{card.name}</strong>
              </div>
            </div>

            <div className="mt-2 rounded-[5px] border border-black/35 bg-[#d9ccb0] px-2 py-1 text-[11px] font-black">
              {card.section}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
