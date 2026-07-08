import { comboCatalog, counterCommanders, roleLabels, roleOrder } from "@/lib/deck-analyzer/knowledge";
import { getFormatLabel, getGameLabel } from "@/lib/deck-analyzer/formats";
import { hydrateCards, parseDeckText, resolveDeckInput } from "@/lib/deck-analyzer/importers";
import type {
  AnalyzeDeckInput,
  CardRole,
  CommanderCounter,
  ComboAnalysis,
  DeckAnalysis,
  DeckCard,
  Matchup,
  ScoreLine,
  UpgradeSuggestion
} from "@/lib/deck-analyzer/types";

function clamp(value: number, min = 0, max = 10) {
  return Math.max(min, Math.min(max, value));
}

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function cardsByRole(cards: DeckCard[], role: CardRole) {
  return cards.filter((card) => card.roles.includes(role));
}

function countByRole(cards: DeckCard[], role: CardRole) {
  return cardsByRole(cards, role).reduce((sum, card) => sum + card.quantity, 0);
}

function uniqueNames(cards: DeckCard[], limit = 8) {
  return cards.slice(0, limit).map((card) => card.name);
}

function chanceAtLeast(deckSize: number, hitCount: number, handSize: number, minimum = 1) {
  if (deckSize <= 0 || hitCount <= 0) return 0;
  const missCount = deckSize - hitCount;
  let chance = 0;
  for (let hits = minimum; hits <= Math.min(hitCount, handSize); hits += 1) {
    chance += combinations(hitCount, hits) * combinations(missCount, handSize - hits);
  }
  return clamp((chance / combinations(deckSize, handSize)) * 100, 0, 100);
}

function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  const useK = Math.min(k, n - k);
  let result = 1;
  for (let index = 1; index <= useK; index += 1) {
    result = (result * (n - useK + index)) / index;
  }
  return result;
}

function detectColors(cards: DeckCard[]) {
  const colorSet = new Set<string>();
  for (const card of cards) {
    for (const color of card.colors) colorSet.add(color);
  }
  return ["W", "U", "B", "R", "G"].filter((color) => colorSet.has(color));
}

function detectArchetype(cards: DeckCard[], combos: number) {
  const names = cards.map((card) => card.name.toLowerCase()).join(" ");
  const stax = countByRole(cards, "stax");
  const recursion = countByRole(cards, "recursion");
  const counters = countByRole(cards, "counterspell");
  const finishers = countByRole(cards, "finisher") + countByRole(cards, "winCondition");

  if (combos >= 2 || countByRole(cards, "comboPiece") >= 7) return "Combo";
  if (stax >= 5) return "Stax Control";
  if (/token|tokens|doubling season|anointed procession|parallel lives/i.test(names)) return "Tokens";
  if (/aristocrat|blood artist|zulaport|viscera seer|grave pact/i.test(names)) return "Aristocrats";
  if (/reanimate|animate dead|living death|graveyard|muldrotha/i.test(names) || recursion >= 7) return "Reanimator";
  if (/equipment|aura|voltron|greaves|boots|hammer/i.test(names)) return "Voltron";
  if (/artifact|urza|emry|breya|sai/i.test(names)) return "Artifacts";
  if (/landfall|crucible|azusa|exploration|oracle of mul daya/i.test(names)) return "Landfall";
  if (/blink|ephemerate|yorion|brago|teleportation/i.test(names)) return "Blink";
  if (counters >= 8) return "Control";
  if (finishers >= 8) return "Midrange Value";
  return "Midrange Commander";
}

function detectSubArchetypes(cards: DeckCard[]) {
  const names = cards.map((card) => card.name.toLowerCase()).join(" ");
  const subs = new Set<string>();
  if (countByRole(cards, "comboPiece") >= 4) subs.add("Combo compacto");
  if (countByRole(cards, "draw") >= 10) subs.add("Card advantage");
  if (countByRole(cards, "recursion") >= 5) subs.add("Recursao");
  if (countByRole(cards, "counterspell") >= 5) subs.add("Tempo/controle");
  if (countByRole(cards, "stax") >= 4) subs.add("Tax/Stax");
  if (/tribal|elf|goblin|dragon|zombie|sliver|vampire|wizard/i.test(names)) subs.add("Tribal");
  if (/equipment|aura|voltron/i.test(names)) subs.add("Voltron");
  if (!subs.size) subs.add("Valor incremental");
  return Array.from(subs).slice(0, 4);
}

function detectCombos(cards: DeckCard[]) {
  const names = new Set(cards.map((card) => card.name.toLowerCase()));
  return comboCatalog
    .map((combo) => {
      const hasMainPieces = combo.pieces.every((piece) => names.has(piece));
      const hasAlternateLine =
        combo.alternates.length > 0 &&
        combo.pieces.slice(0, -1).every((piece) => names.has(piece)) &&
        combo.alternates.some((piece) => names.has(piece));

      if (!hasMainPieces && !hasAlternateLine) return null;

      const pieces = combo.pieces.filter((piece) => names.has(piece));
      for (const alternate of combo.alternates) {
        if (names.has(alternate)) pieces.push(alternate);
      }

      return {
        name: combo.name,
        pieces: pieces.map((piece) => cards.find((card) => card.name.toLowerCase() === piece)?.name ?? piece),
        confidence: combo.confidence,
        howToExecute:
          "Monte as pecas na mesa ou na mao, force a janela quando os oponentes estiverem com pouca mana aberta e converta a linha em vantagem inevitavel ou vitoria imediata.",
        howToProtect:
          "Priorize protecao, counterspells e sequenciamento no fim do turno anterior. Se houver tutor, busque primeiro a peca que menos se expoe a remocao.",
        howToStop:
          "Interrompa a primeira peca que gera mana/loop ou responda ao gatilho final. Remocao instantanea e hate de cemiterio funcionam melhor antes da linha ficar redundante."
      };
    })
    .filter((combo): combo is ComboAnalysis => Boolean(combo));
}

function buildMana(cards: DeckCard[]) {
  const lands = countByRole(cards, "land");
  const nonLands = cards.filter((card) => !card.roles.includes("land"));
  const nonLandTotal = nonLands.reduce((sum, card) => sum + card.quantity, 0);
  const cmcTotal = nonLands.reduce((sum, card) => sum + card.cmc * card.quantity, 0);
  const averageCmc = nonLandTotal ? round(cmcTotal / nonLandTotal, 2) : 0;
  const curve = ["0", "1", "2", "3", "4", "5", "6", "7+"].map((label) => ({
    label,
    count: nonLands
      .filter((card) => (label === "7+" ? card.cmc >= 7 : card.cmc === Number(label)))
      .reduce((sum, card) => sum + card.quantity, 0)
  }));

  const ramp = countByRole(cards, "ramp");
  const fix = countByRole(cards, "fix");

  return {
    curve,
    averageCmc,
    lands,
    ramp,
    fix,
    distributionText:
      averageCmc <= 2.5
        ? "A curva e baixa e favorece manter maos com jogadas cedo, proteger o comandante e disputar a mesa antes dos turnos medios."
        : averageCmc <= 3.4
          ? "A curva esta equilibrada para Commander casual/otimizado, com boa transicao entre desenvolvimento, valor e finalizacao."
          : "A curva e pesada. O deck precisa de ramp e mulligans disciplinados para nao ficar atras em mesas rapidas."
  };
}

function scoreDeck(cards: DeckCard[], combos: number, averageCmc: number): ScoreLine[] {
  const lands = countByRole(cards, "land");
  const ramp = countByRole(cards, "ramp");
  const draw = countByRole(cards, "draw");
  const removal = countByRole(cards, "removal");
  const wipes = countByRole(cards, "boardWipe");
  const counters = countByRole(cards, "counterspell");
  const protection = countByRole(cards, "protection");
  const tutors = countByRole(cards, "tutor");
  const recursion = countByRole(cards, "recursion");
  const finishers = countByRole(cards, "finisher") + countByRole(cards, "winCondition");

  return [
    { label: "Ramp", value: clamp(ramp / 1.4), explanation: `${ramp} fontes de aceleracao/fixacao foram reconhecidas.` },
    { label: "Draw", value: clamp(draw / 1.2), explanation: `${draw} fontes de compra ou vantagem de cartas sustentam o folego do deck.` },
    { label: "Controle", value: clamp((removal + wipes + counters) / 1.7), explanation: `${removal + wipes + counters} interacoes foram classificadas entre remocoes, wipes e counters.` },
    { label: "Mana Base", value: clamp(lands >= 34 && lands <= 39 ? 8 + countByRole(cards, "fix") / 8 : lands < 32 ? 5 : 7), explanation: `${lands} terrenos e ${countByRole(cards, "fix")} pecas de fix foram encontrados.` },
    { label: "Protecao", value: clamp(protection / 0.9), explanation: `${protection} cartas ajudam a proteger comandante, combo ou mesa.` },
    { label: "Consistencia", value: clamp(5 + tutors * 0.55 + draw * 0.18 + ramp * 0.12 - Math.max(0, averageCmc - 3) * 1.2), explanation: "Nota combina tutors, draw, ramp e peso da curva." },
    { label: "Resiliencia", value: clamp(4.5 + recursion * 0.6 + protection * 0.35 + draw * 0.12), explanation: "Recursao, protecao e card advantage aumentam recuperacao apos wipes." },
    { label: "Velocidade", value: clamp(7.5 - averageCmc + ramp * 0.18 + combos * 0.7), explanation: "Curva menor, ramp e combos reduzem o turno de impacto." },
    { label: "Poder", value: clamp(4.5 + finishers * 0.35 + combos * 1.1 + tutors * 0.35 + counters * 0.18), explanation: "Poder considera ameacas, linhas compactas e capacidade de forcar resolucao." },
    { label: "Diversao", value: clamp(6 + Math.min(3, new Set(cards.flatMap((card) => card.roles)).size / 3) - Math.max(0, countByRole(cards, "stax") - 5) * 0.2), explanation: "Variedade de papeis aumenta decisoes interessantes; stax pesado reduz politicamente a mesa." }
  ].map((score) => ({ ...score, value: round(score.value, 1) }));
}

function buildRoleGroups(cards: DeckCard[]) {
  return roleOrder.map((role) => {
    const roleCards = cardsByRole(cards, role);
    const count = roleCards.reduce((sum, card) => sum + card.quantity, 0);
    const label = roleLabels[role];
    return {
      role,
      label,
      count,
      cards: uniqueNames(roleCards),
      commentary:
        count >= 10
          ? `${label} e um eixo forte do deck; ha redundancia suficiente para encontrar esse papel em muitas partidas.`
          : count >= 5
            ? `${label} esta presente em quantidade funcional, mas ainda depende de mulligan e draw para aparecer cedo.`
            : `${label} parece baixo. Se esse papel for importante para o plano, vale reforcar a densidade.`
    };
  });
}

function buildProbabilities(cards: DeckCard[]) {
  const deckSize = cards.reduce((sum, card) => sum + card.quantity, 0) || 99;
  const landCount = countByRole(cards, "land");
  const probability = (role: CardRole, minimum = 1) => chanceAtLeast(deckSize, countByRole(cards, role), 7, minimum);
  const landChance = chanceAtLeast(deckSize, landCount, 7, 2);

  return [
    {
      label: "Abrir ramp",
      chance: round(probability("ramp"), 1),
      count: countByRole(cards, "ramp"),
      explanation: "Chance de ver pelo menos uma aceleracao na mao inicial de 7 cartas."
    },
    {
      label: "Abrir draw",
      chance: round(probability("draw"), 1),
      count: countByRole(cards, "draw"),
      explanation: "Chance de abrir uma fonte de compra ou vantagem de cartas."
    },
    {
      label: "Abrir 2+ terrenos",
      chance: round(landChance, 1),
      count: landCount,
      explanation: "Chance de a mao inicial ter pelo menos dois terrenos."
    },
    {
      label: "Abrir tutor",
      chance: round(probability("tutor"), 1),
      count: countByRole(cards, "tutor"),
      explanation: "Chance de encontrar uma carta que busca peca de plano, resposta ou finalizador."
    },
    {
      label: "Abrir remocao",
      chance: round(Math.max(probability("removal"), probability("counterspell")), 1),
      count: countByRole(cards, "removal") + countByRole(cards, "counterspell"),
      explanation: "Chance aproximada de abrir alguma interacao relevante contra ameacas cedo."
    }
  ];
}

function buildStrengths(cards: DeckCard[], scores: ScoreLine[], combos: number) {
  const top = scores.filter((score) => score.value >= 7.2).map((score) => `${score.label}: ${score.explanation}`);
  if (combos > 0) top.push("Linhas de combo: o deck tem ameacas que podem encerrar a partida sem depender apenas de combate.");
  if (!top.length) top.push("Plano flexivel: o deck parece ganhar por acumulacao de valor e leitura correta da mesa.");
  return top.slice(0, 6);
}

function buildWeaknesses(cards: DeckCard[], manaAverage: number) {
  const weaknesses: string[] = [];
  if (countByRole(cards, "draw") < 8) weaknesses.push("Pouco draw: pode ficar sem gas apos gastar a mao inicial.");
  if (countByRole(cards, "ramp") < 9) weaknesses.push("Pouco ramp: mesas explosivas podem passar na frente antes do plano principal entrar.");
  if (countByRole(cards, "removal") + countByRole(cards, "counterspell") < 9) weaknesses.push("Pouca interacao: ameacas adversarias podem resolver com frequencia.");
  if (countByRole(cards, "boardWipe") < 2) weaknesses.push("Poucos wipes: decks de mesa larga podem exigir respostas que a lista talvez nao compre.");
  if (countByRole(cards, "protection") < 4) weaknesses.push("Protecao baixa: comandante e combo ficam vulneraveis a uma troca simples.");
  if (manaAverage > 3.4) weaknesses.push("Base de curva pesada: mulligans ruins atrasam muito o primeiro turno forte.");
  if (countByRole(cards, "land") < 34) weaknesses.push("Terrenos abaixo do ideal: ha risco de maos tecnicamente fortes mas sem mana.");
  if (!weaknesses.length) weaknesses.push("As fraquezas sao mais situacionais: hate especifico, politicas de mesa e sequenciamento ruim.");
  return weaknesses.slice(0, 7);
}

function matchupBase(archetype: string, scores: ScoreLine[], deckArchetype: string): Matchup {
  const byLabel = (label: string) => scores.find((score) => score.label === label)?.value ?? 5;
  let chance = 50;
  if (archetype === "Aggro") chance += byLabel("Controle") * 2 + byLabel("Velocidade") - 18;
  if (archetype === "Midrange") chance += byLabel("Consistencia") + byLabel("Draw") - 13;
  if (archetype === "Control") chance += byLabel("Resiliencia") + byLabel("Protecao") - 14;
  if (archetype === "Combo") chance += byLabel("Controle") + byLabel("Velocidade") - 13;
  if (archetype === "Stax") chance += byLabel("Mana Base") + byLabel("Resiliencia") - 14;
  if (archetype === "Tokens") chance += byLabel("Controle") + (deckArchetype.includes("Combo") ? 4 : 0) - 11;
  if (archetype === "Aristocrats") chance += byLabel("Controle") + byLabel("Velocidade") - 15;
  if (archetype === "Reanimator") chance += byLabel("Controle") + byLabel("Velocidade") - 14;
  if (archetype === "Spellslinger") chance += byLabel("Controle") + byLabel("Protecao") - 14;
  if (archetype === "Voltron") chance += byLabel("Removal") - 8;
  if (archetype === "Tribal") chance += byLabel("Controle") + byLabel("Velocidade") - 13;
  if (archetype === "Enchantress") chance += byLabel("Controle") + byLabel("Poder") - 14;
  if (archetype === "Artifacts") chance += byLabel("Controle") + byLabel("Velocidade") - 14;
  if (archetype === "Landfall") chance += byLabel("Velocidade") + byLabel("Poder") - 15;
  if (archetype === "Blink") chance += byLabel("Controle") + byLabel("Poder") - 15;

  chance = Math.round(clamp(chance, 20, 82));
  return {
    archetype,
    winChance: chance,
    difficulty: Math.round(clamp(10 - (chance - 35) / 7, 1, 10)),
    strategy:
      chance >= 60
        ? "Voce pode assumir postura proativa, trocar recursos seletivamente e forcar o plano quando o oponente gastar a primeira interacao."
        : chance >= 45
          ? "Partida equilibrada. Guarde respostas para pecas centrais e use mulligan para encontrar mana mais interacao."
          : "Matchup dificil. Evite gastar remocao em ameacas secundarias e priorize cartas que atrasem o plano principal adversario.",
    importantCards: []
  };
}

function buildMatchups(cards: DeckCard[], scores: ScoreLine[], deckArchetype: string) {
  const important = uniqueNames(
    cards.filter((card) => card.roles.some((role) => ["removal", "counterspell", "protection", "winCondition", "boardWipe"].includes(role))),
    4
  );
  return [
    "Aggro",
    "Midrange",
    "Control",
    "Combo",
    "Stax",
    "Tokens",
    "Aristocrats",
    "Reanimator",
    "Spellslinger",
    "Voltron",
    "Tribal",
    "Enchantress",
    "Artifacts",
    "Landfall",
    "Blink"
  ].map((archetype) => ({ ...matchupBase(archetype, scores, deckArchetype), importantCards: important }));
}

function buildCommanderCounters(scores: ScoreLine[], weaknesses: string[]) {
  const weakToStax = weaknesses.some((item) => /ramp|curva|terrenos/i.test(item));
  const weakToControl = weaknesses.some((item) => /protecao|interacao/i.test(item));

  const ranked = counterCommanders.map((item, index) => {
    const base = 55 + index * 2 + (weakToStax && item.archetype.includes("Stax") ? 9 : 0) + (weakToControl && item.archetype.includes("Midrange") ? 7 : 0);
    const power = Math.round(clamp(7 + index / 4, 1, 10));
    return {
      commander: item.commander,
      colors: item.colors,
      archetype: item.archetype,
      power,
      reason: item.strategy,
      winChance: Math.round(clamp(base, 42, 78)),
      difficulty: Math.round(clamp(10 - (base - 40) / 8, 2, 9)),
      strategy: item.strategy
    } satisfies CommanderCounter;
  });

  return {
    bestAgainst: ranked.slice(0, 4),
    worstToFace: [...ranked].sort((a, b) => b.winChance - a.winChance).slice(0, 4),
    bestDecksToFace: [...ranked].sort((a, b) => a.winChance - b.winChance).slice(0, 4),
    worstDecksToFace: [...ranked].sort((a, b) => b.power - a.power).slice(0, 4),
    bestCounterCommander: ranked.sort((a, b) => b.winChance + b.power - (a.winChance + a.power))[0]
  };
}

function buildUpgrades(cards: DeckCard[], weaknesses: string[]): UpgradeSuggestion[] {
  const names = new Set(cards.map((card) => card.name.toLowerCase()));
  const suggestions: UpgradeSuggestion[] = [];
  const lowImpact = cards.filter((card) => card.cmc >= 5 && !card.roles.includes("winCondition") && !card.roles.includes("boardWipe")).slice(0, 4);

  for (const card of lowImpact) {
    suggestions.push({ mode: "remove", card: card.name, reason: "Custo alto sem papel critico reconhecido; pode virar uma peca mais eficiente." });
  }

  if (weaknesses.some((item) => /draw/i.test(item)) && !names.has("skullclamp")) {
    suggestions.push({ mode: "budget", card: "Skullclamp", reason: "Upgrade barato/medio que transforma criaturas pequenas em card advantage real." });
  }
  if (weaknesses.some((item) => /ramp/i.test(item)) && !names.has("arcane signet")) {
    suggestions.push({ mode: "budget", card: "Arcane Signet", reason: "Ramp e fix universais para Commander, especialmente em decks de muitas cores." });
  }
  if (weaknesses.some((item) => /interacao|remocao/i.test(item)) && !names.has("beast within")) {
    suggestions.push({ mode: "budget", card: "Beast Within", reason: "Resposta flexivel contra quase qualquer permanente problematica." });
  }
  if (!names.has("rhystic study")) {
    suggestions.push({ mode: "premium", card: "Rhystic Study", reason: "Uma das melhores fontes de card advantage azul para mesas Commander." });
  }
  if (!names.has("fierce guardianship")) {
    suggestions.push({ mode: "premium", card: "Fierce Guardianship", reason: "Protege turno de combo ou comandante sem gastar mana quando a mesa espera a janela." });
  }
  if (!names.has("the one ring")) {
    suggestions.push({ mode: "premium", card: "The One Ring", reason: "Compra explosiva e protecao de turno em uma carta generica e muito poderosa." });
  }

  return suggestions.slice(0, 10);
}

function buildStyle(overview: { archetype: string; commander: string; format: string; game: string }, scores: ScoreLine[], combos: number) {
  const speed = scores.find((score) => score.label === "Velocidade")?.value ?? 5;
  const control = scores.find((score) => score.label === "Controle")?.value ?? 5;
  const resilience = scores.find((score) => score.label === "Resiliencia")?.value ?? 5;
  const comboText = combos > 0 ? " e manter uma linha de combo como ameaca latente" : "";
  const corePiece =
    overview.format === "Commander"
      ? `em torno de ${overview.commander}`
      : `para ${overview.format} em ${overview.game}`;

  return {
    mainPlan: `O deck joga como ${overview.archetype} ${corePiece}: desenvolve recursos, estabelece uma peca central e tenta converter vantagem incremental${comboText} em vitoria.`,
    secondaryPlan:
      control >= 7
        ? "O plano secundario e segurar a mesa com interacao ate que os oponentes gastem recursos demais para impedir sua finalizacao."
        : "O plano secundario e ganhar por valor: comprar mais cartas, reaproveitar pecas e transformar pequenas vantagens em inevitabilidade.",
    winPattern:
      combos > 0
        ? "Normalmente vence quando obriga a mesa a responder ameacas medias e, na janela seguinte, encaixa uma linha compacta de combo ou finalizador."
        : "Normalmente vence quando acumula mesa e recursos suficientes para que um finalizador ou sequencia de ataques seja dificil de responder.",
    turnWindows:
      speed >= 7
        ? "Os turnos 2 a 5 sao os mais importantes: o deck quer acelerar, proteger a peca central e ameacar vitoria antes que a mesa estabilize."
        : "Os turnos 4 a 7 concentram o pico: antes disso o deck prepara mana e mao; depois disso precisa converter vantagem antes dos combos adversarios.",
    attackTiming:
      "Ataque quando o dano pressiona planeswalkers, reduz jogadores de combo ou obriga blocos ruins. Evite expor criaturas-chave sem protecao.",
    controlTiming:
      "Controle a mesa quando uma peca adversaria gera mana, cartas ou combo. Remocoes em ameacas puramente politicas podem custar a partida.",
    resourceTiming:
      resilience >= 7
        ? "Pode gastar recursos com mais liberdade, porque o deck tem mecanismos para reconstruir. Mesmo assim, preserve cartas de protecao para turnos de virada."
        : "Guarde recursos quando ja estiver na frente. O deck nao quer trocar duas cartas por uma se ainda nao encontrou draw ou recursao."
  };
}

export async function analyzeDeck(input: AnalyzeDeckInput): Promise<DeckAnalysis> {
  const resolved = await resolveDeckInput(input);
  const parsed = parseDeckText(resolved.text);
  const commander = input.commander?.trim() || parsed.commander;
  const deckName = input.deckName?.trim() || parsed.deckName;
  const game = getGameLabel(input.game);
  const format = getFormatLabel(input.game, input.format);
  const cards = hydrateCards(parsed.cards);
  const warnings = [...resolved.warnings, ...parsed.warnings];
  if (input.game === "magic" && input.format && input.format !== "commander") {
    warnings.push("Formato registrado antes da importacao. Algumas secoes ainda usam vocabulario de Commander ate o motor por formato ficar mais especializado.");
  }
  const combos = detectCombos(cards);
  const mana = buildMana(cards);
  const archetype = detectArchetype(cards, combos.length);
  const subArchetypes = detectSubArchetypes(cards);
  const scores = scoreDeck(cards, combos.length, mana.averageCmc);
  const scoreValue = (label: string) => scores.find((score) => score.label === label)?.value ?? 5;
  const powerLevel = round(clamp((scoreValue("Poder") + scoreValue("Consistencia") + scoreValue("Velocidade") + combos.length) / 3), 1);
  const colors = detectColors(cards);
  const estimatedPrice = Math.round(cards.reduce((sum, card) => sum + card.price * card.quantity, 0));
  const overview = {
    deckName,
    commander,
    game,
    colors,
    archetype,
    subArchetypes,
    format,
    estimatedPrice,
    powerLevel,
    complexity: round(clamp(4 + combos.length * 0.8 + countByRole(cards, "tutor") * 0.25 + colors.length * 0.35), 1),
    speed: scoreValue("Velocidade"),
    consistency: scoreValue("Consistencia"),
    aggression: round(clamp(scoreValue("Poder") * 0.55 + scoreValue("Velocidade") * 0.45), 1),
    resilience: scoreValue("Resiliencia")
  };
  const weaknesses = buildWeaknesses(cards, mana.averageCmc);
  const counters = buildCommanderCounters(scores, weaknesses);
  const roleGroups = buildRoleGroups(cards);
  const keyCards = uniqueNames(
    cards
      .filter((card) => card.roles.some((role) => ["tutor", "draw", "winCondition", "comboPiece", "protection"].includes(role)))
      .sort((a, b) => b.price + b.roles.length * 8 - (a.price + a.roles.length * 8)),
    8
  );
  const highImpactCards = uniqueNames(
    cards.filter((card) => card.roles.some((role) => ["winCondition", "boardWipe", "stax", "counterspell"].includes(role))),
    8
  );

  return {
    source: {
      type: input.sourceType,
      importedCards: cards.reduce((sum, card) => sum + card.quantity, 0),
      warnings
    },
    cards,
    overview,
    style: buildStyle(overview, scores, combos.length),
    mana,
    roleGroups,
    synergies: [
      `O nucleo de ${overview.archetype} depende de sequenciar mana, compra e ameacas sem abrir janelas desnecessarias.`,
      countByRole(cards, "tutor") > 0
        ? "Tutors aumentam a densidade virtual das pecas mais importantes; use-os de acordo com a mesa, nao automaticamente para combo."
        : "Sem muitos tutors, a lista precisa valorizar redundancia e mulligan para encontrar o papel certo.",
      countByRole(cards, "protection") > 0
        ? "Protecoes devem ser guardadas para comandante, combo ou permanentes que multiplicam recursos."
        : "A lista quase nao tem protecao reconhecida; jogar ao redor de mana aberta adversaria e essencial."
    ],
    keyCards,
    highImpactCards,
    combos,
    mulligan: {
      keep:
        "Mantenha maos com 2 a 3 terrenos, uma fonte de ramp ou draw e pelo menos uma jogada relevante ate o turno 3. Se houver interacao barata, a mao sobe muito de qualidade.",
      ship:
        "Devolva maos com uma so fonte de mana, maos cheias de cartas de custo alto ou maos que dependem de comprar uma cor especifica sem fix.",
      lookFor: ["2+ terrenos", "Ramp inicial", "Draw ou tutor", "Interacao barata", "Peca que conecta com o comandante"]
    },
    strengths: buildStrengths(cards, scores, combos.length),
    weaknesses,
    probabilities: buildProbabilities(cards),
    matchups: buildMatchups(cards, scores, archetype),
    bestCommandersAgainst: counters.bestAgainst,
    worstCommandersToFace: counters.worstToFace,
    bestDecksToFace: counters.bestDecksToFace,
    worstDecksToFace: counters.worstDecksToFace,
    howToPlayAgainst: [
      "Remova o comandante quando ele gera mana, compra cartas ou habilita combo. Se for apenas uma ameaca de dano, espere o oponente investir protecao primeiro.",
      "Anule tutors, engines de compra e pecas que reduzem custo. Responder ao payoff final costuma ser mais arriscado se o deck tiver protecao.",
      "Destrua permanentes que multiplicam recursos antes de gastar resposta em criaturas de valor medio.",
      "Ataque o jogador quando ele estiver tapado ou sem blockers, mas preserve dano politico para impedir que outro combo fique livre.",
      "Evite gastar duas respostas na mesma janela sem necessidade; faca o deck provar que tem protecao."
    ],
    howToBeat: [
      "Pressione a mana e force o deck a escolher entre desenvolver e se defender.",
      "Use hate especifico contra o eixo dominante: cemiterio contra recursao, tax contra combo, wipes contra mesa larga.",
      "Guarde interacao para cartas de alto impacto, nao para iscas.",
      "A melhor janela costuma ser antes do primeiro grande turno de draw ou depois que uma tentativa de finalizacao falha."
    ],
    bestCounterCommander: counters.bestCounterCommander,
    upgrades: buildUpgrades(cards, weaknesses),
    scores,
    executiveSummary: `${deckName} foi classificado como ${archetype} em ${game} (${format}), power ${powerLevel}/10, com ${mana.lands} terrenos/recursos, ${mana.ramp} ramp/aceleradores e ${combos.length} combo(s) detectado(s). A leitura principal e jogar em torno das pecas centrais, proteger a janela de finalizacao e respeitar o ritmo do formato escolhido.`
  };
}
