export type ManaColor = "W" | "U" | "B" | "R" | "G" | "C";

export type ColorIdentityGroup = "Monocolor" | "Duas cores" | "Tres cores" | "Quatro cores" | "Cinco cores";

export type ColorIdentity = {
  id: string;
  group: ColorIdentityGroup;
  name: string;
  code: string;
  colors: ManaColor[];
  description: string;
};

export type CommanderProfile = {
  name: string;
  identity: ManaColor[];
  colorCode: string;
  archetypes: string[];
  tags: Array<"popular" | "strong" | "budget" | "fun" | "competitive" | "easy" | "hard" | "recent" | "old">;
  priceTier: "barato" | "medio" | "caro";
  power: number;
  complexity: number;
  releaseYear: number;
  summary: string;
};

export type CommanderFilterId =
  | "popular"
  | "strong"
  | "budget"
  | "fun"
  | "competitive"
  | "easy"
  | "hard"
  | "recent"
  | "old";

export const manaColorLabels: Record<ManaColor, string> = {
  W: "Branco",
  U: "Azul",
  B: "Preto",
  R: "Vermelho",
  G: "Verde",
  C: "Incolor"
};

export const manaColorClasses: Record<ManaColor, string> = {
  W: "bg-stone-100 text-zinc-900 border-stone-300",
  U: "bg-sky-400 text-zinc-950 border-sky-200",
  B: "bg-zinc-900 text-white border-zinc-600",
  R: "bg-red-500 text-white border-red-300",
  G: "bg-green-400 text-zinc-950 border-green-100 shadow-[0_0_18px_rgba(74,222,128,.45)]",
  C: "bg-zinc-400 text-zinc-950 border-zinc-200"
};

export const manaColorImages: Record<ManaColor, string> = {
  W: "/images/mana/white.png",
  U: "/images/mana/blue.png",
  B: "/images/mana/black.png",
  R: "/images/mana/red.png",
  G: "/images/mana/green.png",
  C: "/images/mana/colorless.svg"
};

export const colorIdentities: ColorIdentity[] = [
  { id: "w", group: "Monocolor", name: "Branco", code: "W", colors: ["W"], description: "Protecao, lifegain, tokens e controle de mesa." },
  { id: "u", group: "Monocolor", name: "Azul", code: "U", colors: ["U"], description: "Compra, counters, tempo e magicas tecnicas." },
  { id: "b", group: "Monocolor", name: "Preto", code: "B", colors: ["B"], description: "Sacrificio, reanimator, tutores e recursos do cemiterio." },
  { id: "r", group: "Monocolor", name: "Vermelho", code: "R", colors: ["R"], description: "Explosao de dano, tesouros, impulsividade e agressao." },
  { id: "g", group: "Monocolor", name: "Verde", code: "G", colors: ["G"], description: "Ramp, criaturas grandes, terrenos e valor natural." },
  { id: "c", group: "Monocolor", name: "Incolor", code: "C", colors: ["C"], description: "Artefatos, Eldrazi e planos de jogo incomuns." },
  { id: "wu", group: "Duas cores", name: "Azorius", code: "WU", colors: ["W", "U"], description: "Controle, blink, flyers e ritmo defensivo." },
  { id: "ub", group: "Duas cores", name: "Dimir", code: "UB", colors: ["U", "B"], description: "Mill, ninjas, controle e cemiterio." },
  { id: "br", group: "Duas cores", name: "Rakdos", code: "BR", colors: ["B", "R"], description: "Sacrificio, tesouros, dano e recursos explosivos." },
  { id: "rg", group: "Duas cores", name: "Gruul", code: "RG", colors: ["R", "G"], description: "Ramp agressivo, criaturas enormes e dano direto." },
  { id: "gw", group: "Duas cores", name: "Selesnya", code: "GW", colors: ["G", "W"], description: "Tokens, enchantress, lifegain e mesa larga." },
  { id: "wb", group: "Duas cores", name: "Orzhov", code: "WB", colors: ["W", "B"], description: "Aristocrats, lifegain, recursao e controle." },
  { id: "ur", group: "Duas cores", name: "Izzet", code: "UR", colors: ["U", "R"], description: "Spellslinger, storm, artefatos e jogadas explosivas." },
  { id: "bg", group: "Duas cores", name: "Golgari", code: "BG", colors: ["B", "G"], description: "Reanimator, sacrifice, landfall e valor de cemiterio." },
  { id: "rw", group: "Duas cores", name: "Boros", code: "RW", colors: ["R", "W"], description: "Aggro, equipamentos, combate e tokens." },
  { id: "ug", group: "Duas cores", name: "Simic", code: "UG", colors: ["U", "G"], description: "Ramp, counters, card draw e engines eficientes." },
  { id: "wub", group: "Tres cores", name: "Esper", code: "WUB", colors: ["W", "U", "B"], description: "Controle, artefatos, stax e valor incremental." },
  { id: "ubr", group: "Tres cores", name: "Grixis", code: "UBR", colors: ["U", "B", "R"], description: "Combo, spellslinger, reanimator e jogo tecnico." },
  { id: "brg", group: "Tres cores", name: "Jund", code: "BRG", colors: ["B", "R", "G"], description: "Sacrifice, valor, permanentes fortes e grind." },
  { id: "rgw", group: "Tres cores", name: "Naya", code: "RGW", colors: ["R", "G", "W"], description: "Criaturas grandes, tokens e combate dominante." },
  { id: "gwu", group: "Tres cores", name: "Bant", code: "GWU", colors: ["G", "W", "U"], description: "Blink, counters, valor e protecao." },
  { id: "wbg", group: "Tres cores", name: "Abzan", code: "WBG", colors: ["W", "B", "G"], description: "Counters, aristocrats, recursao e board resiliente." },
  { id: "urw", group: "Tres cores", name: "Jeskai", code: "URW", colors: ["U", "R", "W"], description: "Spellslinger, controle, prowess e combos." },
  { id: "bgu", group: "Tres cores", name: "Sultai", code: "BGU", colors: ["B", "G", "U"], description: "Cemiterio, valor, ramp e controle." },
  { id: "rwb", group: "Tres cores", name: "Mardu", code: "RWB", colors: ["R", "W", "B"], description: "Aggro, aristocrats, equipamentos e pressao." },
  { id: "gur", group: "Tres cores", name: "Temur", code: "GUR", colors: ["G", "U", "R"], description: "Ramp, spells, criaturas grandes e jogadas explosivas." },
  { id: "ubrg", group: "Quatro cores", name: "Sem Branco", code: "UBRG", colors: ["U", "B", "R", "G"], description: "Valor, combo, graveyard e ramp sem ferramentas brancas." },
  { id: "wbrg", group: "Quatro cores", name: "Sem Azul", code: "WBRG", colors: ["W", "B", "R", "G"], description: "Permanentes fortes, combate, sacrificio e ramp." },
  { id: "wurg", group: "Quatro cores", name: "Sem Preto", code: "WURG", colors: ["W", "U", "R", "G"], description: "Valor, politica, ramp e interacao sem cemiterio preto." },
  { id: "wubg", group: "Quatro cores", name: "Sem Vermelho", code: "WUBG", colors: ["W", "U", "B", "G"], description: "Controle, counters, lifegain, proliferate e valor." },
  { id: "wubr", group: "Quatro cores", name: "Sem Verde", code: "WUBR", colors: ["W", "U", "B", "R"], description: "Artefatos, combo, controle e engines nao verdes." },
  { id: "wubrg", group: "Cinco cores", name: "WUBRG", code: "WUBRG", colors: ["W", "U", "B", "R", "G"], description: "Acesso total ao card pool, combos e planos flexiveis." }
];

export const commanderFilters: Array<{ id: CommanderFilterId; label: string; description: string }> = [
  { id: "popular", label: "Mais populares", description: "Comandantes com alta procura e muitas listas conhecidas." },
  { id: "strong", label: "Mais fortes", description: "Maiores notas de power level e consistencia." },
  { id: "budget", label: "Mais baratos", description: "Bases mais faceis de montar com baixo investimento." },
  { id: "fun", label: "Mais divertidos", description: "Planos de jogo memoraveis e interativos." },
  { id: "competitive", label: "Mais competitivos", description: "Melhores para mesas fortes e cEDH." },
  { id: "easy", label: "Mais faceis de jogar", description: "Linhas claras e poucas decisoes punitivas." },
  { id: "hard", label: "Mais dificeis de dominar", description: "Exigem sequenciamento, leitura de mesa e tecnica." },
  { id: "recent", label: "Mais recentes", description: "Cartas modernas e commanders novos." },
  { id: "old", label: "Mais antigos", description: "Classicos e comandantes historicos." }
];

export const archetypeOptions = [
  "Aggro",
  "Control",
  "Combo",
  "Midrange",
  "Stax",
  "Voltron",
  "Tribal",
  "Tokens",
  "Lifegain",
  "Aristocrats",
  "Sacrifice",
  "Reanimator",
  "Blink",
  "Enchantress",
  "Artifacts",
  "Storm",
  "Spellslinger",
  "Landfall",
  "Poison",
  "Infect",
  "Mill",
  "Big Mana",
  "Ramp",
  "Superfriends",
  "Chaos",
  "Group Hug",
  "Prison",
  "Value"
];

export const styleOptions = [
  "Quero ganhar rapido",
  "Quero partidas longas",
  "Quero muitos combos",
  "Nao quero combos infinitos",
  "Quero deck divertido",
  "Quero deck competitivo",
  "Quero controlar a mesa",
  "Quero explodir de dano",
  "Quero muita interacao",
  "Quero muitas magicas",
  "Quero criaturas enormes",
  "Quero jogar politicamente",
  "Quero atrapalhar meus oponentes",
  "Quero surpreender a mesa",
  "Quero um deck facil de pilotar",
  "Quero um deck extremamente tecnico",
  "Quero um deck diferente do meta",
  "Quero um deck meta"
];

export const preferenceQuestions = [
  { id: "infiniteCombos", label: "Voce aceita combos infinitos?", options: ["Sim", "Nao", "Apenas um combo"] },
  { id: "expensiveCards", label: "Voce aceita cartas muito caras?", options: ["Sim", "Nao", "Apenas se forem essenciais"] },
  { id: "proxies", label: "Voce quer utilizar proxies?", options: ["Sim", "Nao"] },
  { id: "banlist", label: "Seu grupo utiliza banlist oficial?", options: ["Sim", "Nao", "Banlist personalizada"] },
  { id: "tablePower", label: "Nivel medio da sua mesa:", options: ["Casual", "Casual Forte", "Power Level 7", "Power Level 8", "Power Level 9", "cEDH"] }
] as const;

export const commanderPool: CommanderProfile[] = [
  {
    name: "Giada, Font of Hope",
    identity: ["W"],
    colorCode: "W",
    archetypes: ["Tribal", "Aggro", "Midrange"],
    tags: ["budget", "fun", "easy", "recent"],
    priceTier: "barato",
    power: 6,
    complexity: 3,
    releaseYear: 2022,
    summary: "Anjos agressivos, curva simples e crescimento natural da mesa."
  },
  {
    name: "Talrand, Sky Summoner",
    identity: ["U"],
    colorCode: "U",
    archetypes: ["Spellslinger", "Control", "Tokens"],
    tags: ["budget", "fun", "easy", "old"],
    priceTier: "barato",
    power: 6,
    complexity: 4,
    releaseYear: 2012,
    summary: "Transforma counters e cantrips em uma frota de drakes."
  },
  {
    name: "Tinybones, Trinket Thief",
    identity: ["B"],
    colorCode: "B",
    archetypes: ["Control", "Stax", "Discard"],
    tags: ["popular", "fun", "hard"],
    priceTier: "medio",
    power: 7,
    complexity: 7,
    releaseYear: 2020,
    summary: "Descarte politico, controle de recursos e finalizacao sombria."
  },
  {
    name: "Magda, Brazen Outlaw",
    identity: ["R"],
    colorCode: "R",
    archetypes: ["Combo", "Artifacts", "Aggro"],
    tags: ["strong", "competitive", "hard", "recent"],
    priceTier: "medio",
    power: 8,
    complexity: 8,
    releaseYear: 2021,
    summary: "Tesouros viram tutores, explosao de mana e linhas compactas de combo."
  },
  {
    name: "Selvala, Heart of the Wilds",
    identity: ["G"],
    colorCode: "G",
    archetypes: ["Ramp", "Big Mana", "Combo"],
    tags: ["strong", "competitive", "hard"],
    priceTier: "caro",
    power: 8,
    complexity: 7,
    releaseYear: 2016,
    summary: "Mana absurda, criaturas grandes e potencial de combo rapido."
  },
  {
    name: "Kozilek, the Great Distortion",
    identity: ["C"],
    colorCode: "C",
    archetypes: ["Big Mana", "Artifacts", "Control"],
    tags: ["fun", "hard", "old"],
    priceTier: "caro",
    power: 7,
    complexity: 8,
    releaseYear: 2016,
    summary: "Deck incolor tecnico com ramp pesado e controle por descarte."
  },
  {
    name: "Brago, King Eternal",
    identity: ["W", "U"],
    colorCode: "WU",
    archetypes: ["Blink", "Control", "Value"],
    tags: ["popular", "strong", "competitive", "old"],
    priceTier: "medio",
    power: 8,
    complexity: 7,
    releaseYear: 2014,
    summary: "Blink constante, valor incremental e lock pieces bem posicionadas."
  },
  {
    name: "Oloro, Ageless Ascetic",
    identity: ["W", "U", "B"],
    colorCode: "WUB",
    archetypes: ["Lifegain", "Control", "Value"],
    tags: ["popular", "fun", "easy", "old"],
    priceTier: "medio",
    power: 7,
    complexity: 5,
    releaseYear: 2013,
    summary: "Esper lifegain/control que ganha vida mesmo fora do campo e transforma vantagem defensiva em valor."
  },
  {
    name: "Yuriko, the Tiger's Shadow",
    identity: ["U", "B"],
    colorCode: "UB",
    archetypes: ["Aggro", "Control", "Tribal"],
    tags: ["popular", "strong", "competitive", "hard"],
    priceTier: "medio",
    power: 9,
    complexity: 8,
    releaseYear: 2018,
    summary: "Ninjas, evasao, manipulo de topo e dano inevitavel na mesa."
  },
  {
    name: "Prosper, Tome-Bound",
    identity: ["B", "R"],
    colorCode: "BR",
    archetypes: ["Artifacts", "Combo", "Value"],
    tags: ["popular", "fun", "strong", "recent"],
    priceTier: "medio",
    power: 8,
    complexity: 6,
    releaseYear: 2021,
    summary: "Impulso, tesouros e engines que transformam exilio em vantagem."
  },
  {
    name: "Xenagos, God of Revels",
    identity: ["R", "G"],
    colorCode: "RG",
    archetypes: ["Voltron", "Big Mana", "Aggro"],
    tags: ["fun", "easy", "old"],
    priceTier: "medio",
    power: 7,
    complexity: 4,
    releaseYear: 2014,
    summary: "Acelera criaturas gigantes e encerra partidas com golpes enormes."
  },
  {
    name: "Sythis, Harvest's Hand",
    identity: ["G", "W"],
    colorCode: "GW",
    archetypes: ["Enchantress", "Lifegain", "Value"],
    tags: ["popular", "strong", "easy", "recent"],
    priceTier: "medio",
    power: 8,
    complexity: 5,
    releaseYear: 2021,
    summary: "Enchantress eficiente, draw constante e protecoes baratas."
  },
  {
    name: "Teysa Karlov",
    identity: ["W", "B"],
    colorCode: "WB",
    archetypes: ["Aristocrats", "Sacrifice", "Tokens"],
    tags: ["popular", "fun", "easy"],
    priceTier: "medio",
    power: 7,
    complexity: 5,
    releaseYear: 2019,
    summary: "Dobra triggers de morte e transforma tokens em inevitabilidade."
  },
  {
    name: "Veyran, Voice of Duality",
    identity: ["U", "R"],
    colorCode: "UR",
    archetypes: ["Spellslinger", "Storm", "Combo"],
    tags: ["popular", "strong", "fun", "recent"],
    priceTier: "medio",
    power: 8,
    complexity: 7,
    releaseYear: 2021,
    summary: "Duplica triggers de magicas e cria turnos explosivos."
  },
  {
    name: "Meren of Clan Nel Toth",
    identity: ["B", "G"],
    colorCode: "BG",
    archetypes: ["Reanimator", "Sacrifice", "Value"],
    tags: ["popular", "strong", "easy", "old"],
    priceTier: "medio",
    power: 8,
    complexity: 5,
    releaseYear: 2015,
    summary: "Recursao consistente, sacrifice e valor que cresce a cada turno."
  },
  {
    name: "Winota, Joiner of Forces",
    identity: ["R", "W"],
    colorCode: "RW",
    archetypes: ["Aggro", "Tokens", "Stax"],
    tags: ["strong", "competitive", "hard", "recent"],
    priceTier: "medio",
    power: 9,
    complexity: 7,
    releaseYear: 2020,
    summary: "Ataques pequenos viram humanos decisivos e pressao imediata."
  },
  {
    name: "Kinnan, Bonder Prodigy",
    identity: ["U", "G"],
    colorCode: "UG",
    archetypes: ["Ramp", "Combo", "Big Mana"],
    tags: ["popular", "strong", "competitive", "hard", "recent"],
    priceTier: "caro",
    power: 10,
    complexity: 8,
    releaseYear: 2020,
    summary: "Duplica mana nao terrestre e converte ramp em combos de alto nivel."
  },
  {
    name: "Alela, Artful Provocateur",
    identity: ["W", "U", "B"],
    colorCode: "WUB",
    archetypes: ["Artifacts", "Enchantress", "Tokens"],
    tags: ["popular", "fun", "easy"],
    priceTier: "medio",
    power: 7,
    complexity: 5,
    releaseYear: 2019,
    summary: "Artefatos e encantamentos geram fadas, pressao evasiva e valor."
  },
  {
    name: "Kess, Dissident Mage",
    identity: ["U", "B", "R"],
    colorCode: "UBR",
    archetypes: ["Spellslinger", "Combo", "Control"],
    tags: ["strong", "competitive", "hard", "old"],
    priceTier: "medio",
    power: 8,
    complexity: 8,
    releaseYear: 2017,
    summary: "Recicla magicas do cemiterio e sustenta planos de combo/control."
  },
  {
    name: "Korvold, Fae-Cursed King",
    identity: ["B", "R", "G"],
    colorCode: "BRG",
    archetypes: ["Sacrifice", "Treasure", "Value"],
    tags: ["popular", "strong", "competitive"],
    priceTier: "caro",
    power: 9,
    complexity: 6,
    releaseYear: 2019,
    summary: "Compra muitas cartas sacrificando permanentes e cresce rapido."
  },
  {
    name: "Jetmir, Nexus of Revels",
    identity: ["R", "G", "W"],
    colorCode: "RGW",
    archetypes: ["Tokens", "Aggro", "Tribal"],
    tags: ["fun", "easy", "recent"],
    priceTier: "medio",
    power: 7,
    complexity: 4,
    releaseYear: 2022,
    summary: "Transforma mesa larga em dano letal com poucos ataques."
  },
  {
    name: "Chulane, Teller of Tales",
    identity: ["G", "W", "U"],
    colorCode: "GWU",
    archetypes: ["Value", "Blink", "Combo"],
    tags: ["popular", "strong", "hard"],
    priceTier: "medio",
    power: 9,
    complexity: 7,
    releaseYear: 2019,
    summary: "Criaturas viram compra, ramp e cadeia de valor muito eficiente."
  },
  {
    name: "Ghave, Guru of Spores",
    identity: ["W", "B", "G"],
    colorCode: "WBG",
    archetypes: ["Tokens", "Aristocrats", "Combo"],
    tags: ["strong", "old", "hard"],
    priceTier: "medio",
    power: 8,
    complexity: 8,
    releaseYear: 2011,
    summary: "Contadores, tokens e sacrificios com muitas linhas de combo."
  },
  {
    name: "Elsha of the Infinite",
    identity: ["U", "R", "W"],
    colorCode: "URW",
    archetypes: ["Spellslinger", "Artifacts", "Combo"],
    tags: ["strong", "hard", "fun"],
    priceTier: "medio",
    power: 8,
    complexity: 8,
    releaseYear: 2019,
    summary: "Joga do topo e transforma artefatos/magicas em sequencias longas."
  },
  {
    name: "Muldrotha, the Gravetide",
    identity: ["B", "G", "U"],
    colorCode: "BGU",
    archetypes: ["Reanimator", "Value", "Control"],
    tags: ["popular", "strong", "easy"],
    priceTier: "medio",
    power: 8,
    complexity: 6,
    releaseYear: 2018,
    summary: "Recicla permanentes do cemiterio e vence em valor acumulado."
  },
  {
    name: "Edgar Markov",
    identity: ["R", "W", "B"],
    colorCode: "RWB",
    archetypes: ["Tribal", "Aggro", "Tokens"],
    tags: ["popular", "strong", "old"],
    priceTier: "caro",
    power: 8,
    complexity: 4,
    releaseYear: 2017,
    summary: "Vampiros agressivos com eminencia e pressao desde o turno inicial."
  },
  {
    name: "Animar, Soul of Elements",
    identity: ["G", "U", "R"],
    colorCode: "GUR",
    archetypes: ["Combo", "Big Mana", "Value"],
    tags: ["strong", "hard", "old"],
    priceTier: "medio",
    power: 8,
    complexity: 8,
    releaseYear: 2011,
    summary: "Reduz custos, protege contra cores chave e cria turnos enormes."
  },
  {
    name: "Yidris, Maelstrom Wielder",
    identity: ["U", "B", "R", "G"],
    colorCode: "UBRG",
    archetypes: ["Storm", "Chaos", "Value"],
    tags: ["fun", "hard", "old"],
    priceTier: "medio",
    power: 7,
    complexity: 8,
    releaseYear: 2016,
    summary: "Cascade em cadeia para mesas imprevisiveis e jogadas espetaculares."
  },
  {
    name: "Saskia the Unyielding",
    identity: ["W", "B", "R", "G"],
    colorCode: "WBRG",
    archetypes: ["Aggro", "Voltron", "Midrange"],
    tags: ["fun", "easy", "old"],
    priceTier: "medio",
    power: 7,
    complexity: 4,
    releaseYear: 2016,
    summary: "Pressiona dois jogadores ao mesmo tempo e pune mesas lentas."
  },
  {
    name: "Kynaios and Tiro of Meletis",
    identity: ["W", "U", "R", "G"],
    colorCode: "WURG",
    archetypes: ["Group Hug", "Politics", "Control"],
    tags: ["fun", "easy", "old"],
    priceTier: "medio",
    power: 6,
    complexity: 5,
    releaseYear: 2016,
    summary: "Politica, cartas extras e ramp compartilhado para mesas longas."
  },
  {
    name: "Atraxa, Praetors' Voice",
    identity: ["W", "U", "B", "G"],
    colorCode: "WUBG",
    archetypes: ["Superfriends", "Poison", "Value"],
    tags: ["popular", "strong", "easy", "old"],
    priceTier: "medio",
    power: 9,
    complexity: 6,
    releaseYear: 2016,
    summary: "Proliferate, planeswalkers, counters e varias rotas de vitoria."
  },
  {
    name: "Breya, Etherium Shaper",
    identity: ["W", "U", "B", "R"],
    colorCode: "WUBR",
    archetypes: ["Artifacts", "Combo", "Control"],
    tags: ["strong", "competitive", "hard", "old"],
    priceTier: "caro",
    power: 9,
    complexity: 8,
    releaseYear: 2016,
    summary: "Artefatos, combos compactos, remocao e flexibilidade de controle."
  },
  {
    name: "Kenrith, the Returned King",
    identity: ["W", "U", "B", "R", "G"],
    colorCode: "WUBRG",
    archetypes: ["Combo", "Politics", "Value"],
    tags: ["popular", "strong", "competitive", "hard"],
    priceTier: "caro",
    power: 10,
    complexity: 8,
    releaseYear: 2019,
    summary: "Cinco cores, politica, combo e acesso total ao card pool."
  },
  {
    name: "Jodah, the Unifier",
    identity: ["W", "U", "B", "R", "G"],
    colorCode: "WUBRG",
    archetypes: ["Tribal", "Value", "Aggro"],
    tags: ["popular", "fun", "easy", "recent"],
    priceTier: "medio",
    power: 8,
    complexity: 5,
    releaseYear: 2022,
    summary: "Lendarias em cascata, board impactante e tema facil de entender."
  },
  {
    name: "Sisay, Weatherlight Captain",
    identity: ["W", "U", "B", "R", "G"],
    colorCode: "WUBRG",
    archetypes: ["Combo", "Superfriends", "Toolbox"],
    tags: ["strong", "competitive", "hard"],
    priceTier: "caro",
    power: 9,
    complexity: 9,
    releaseYear: 2019,
    summary: "Toolbox lendaria com linhas precisas e alto teto competitivo."
  }
];

export function sameIdentity(left: ManaColor[], right: ManaColor[]) {
  return left.length === right.length && left.every((color) => right.includes(color));
}

export function getColorIdentityById(id: string) {
  return colorIdentities.find((identity) => identity.id === id) ?? colorIdentities[0];
}

export function suggestColorIdentity(archetypes: string[], styles: string[]) {
  const haystack = [...archetypes, ...styles].join(" ").toLowerCase();

  if (haystack.includes("storm") || haystack.includes("spellslinger") || haystack.includes("muitas magicas")) {
    return getColorIdentityById("ur");
  }

  if (haystack.includes("aristocrats") || haystack.includes("sacrifice")) {
    return getColorIdentityById("wb");
  }

  if (haystack.includes("reanimator") || haystack.includes("cemiterio")) {
    return getColorIdentityById("bgu");
  }

  if (haystack.includes("tokens") || haystack.includes("lifegain")) {
    return getColorIdentityById("gw");
  }

  if (haystack.includes("competitivo") || haystack.includes("meta") || haystack.includes("combo")) {
    return getColorIdentityById("wubrg");
  }

  if (haystack.includes("criaturas enormes") || haystack.includes("ramp") || haystack.includes("big mana")) {
    return getColorIdentityById("rg");
  }

  return getColorIdentityById("ug");
}
