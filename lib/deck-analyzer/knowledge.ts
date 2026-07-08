import type { CardRole } from "@/lib/deck-analyzer/types";

export type CardKnowledge = {
  cmc: number;
  colors: string[];
  roles: CardRole[];
  price: number;
};

export const roleLabels: Record<CardRole, string> = {
  ramp: "Ramp",
  draw: "Draw",
  tutor: "Tutors",
  removal: "Removal",
  boardWipe: "Board Wipes",
  counterspell: "Counterspells",
  protection: "Protecao",
  finisher: "Finalizadores",
  recursion: "Recursao",
  stax: "Stax",
  comboPiece: "Combo Pieces",
  winCondition: "Win Conditions",
  land: "Terrenos",
  fix: "Fix"
};

export const roleOrder: CardRole[] = [
  "ramp",
  "draw",
  "tutor",
  "removal",
  "boardWipe",
  "counterspell",
  "protection",
  "finisher",
  "recursion",
  "stax",
  "comboPiece",
  "winCondition"
];

export const basicLands = ["plains", "island", "swamp", "mountain", "forest"];

export const knownCards: Record<string, CardKnowledge> = {
  "sol ring": { cmc: 1, colors: [], roles: ["ramp"], price: 8 },
  "arcane signet": { cmc: 2, colors: [], roles: ["ramp", "fix"], price: 5 },
  "fellwar stone": { cmc: 2, colors: [], roles: ["ramp", "fix"], price: 2 },
  "commander's sphere": { cmc: 3, colors: [], roles: ["ramp", "fix", "draw"], price: 1 },
  "chromatic lantern": { cmc: 3, colors: [], roles: ["ramp", "fix"], price: 15 },
  "cultivate": { cmc: 3, colors: ["G"], roles: ["ramp", "fix"], price: 2 },
  "kodama's reach": { cmc: 3, colors: ["G"], roles: ["ramp", "fix"], price: 2 },
  "farseek": { cmc: 2, colors: ["G"], roles: ["ramp", "fix"], price: 3 },
  "nature's lore": { cmc: 2, colors: ["G"], roles: ["ramp", "fix"], price: 6 },
  "three visits": { cmc: 2, colors: ["G"], roles: ["ramp", "fix"], price: 9 },
  "birds of paradise": { cmc: 1, colors: ["G"], roles: ["ramp", "fix"], price: 15 },
  "llanowar elves": { cmc: 1, colors: ["G"], roles: ["ramp"], price: 1 },
  "rhystic study": { cmc: 3, colors: ["U"], roles: ["draw"], price: 220 },
  "mystic remora": { cmc: 1, colors: ["U"], roles: ["draw"], price: 55 },
  "esper sentinel": { cmc: 1, colors: ["W"], roles: ["draw"], price: 130 },
  "skullclamp": { cmc: 1, colors: [], roles: ["draw"], price: 20 },
  "phyrexian arena": { cmc: 3, colors: ["B"], roles: ["draw"], price: 12 },
  "necropotence": { cmc: 3, colors: ["B"], roles: ["draw"], price: 70 },
  "the one ring": { cmc: 4, colors: [], roles: ["draw", "protection"], price: 390 },
  "demonic tutor": { cmc: 2, colors: ["B"], roles: ["tutor"], price: 180 },
  "vampiric tutor": { cmc: 1, colors: ["B"], roles: ["tutor"], price: 260 },
  "worldly tutor": { cmc: 1, colors: ["G"], roles: ["tutor"], price: 90 },
  "mystical tutor": { cmc: 1, colors: ["U"], roles: ["tutor"], price: 70 },
  "enlightened tutor": { cmc: 1, colors: ["W"], roles: ["tutor"], price: 110 },
  "swords to plowshares": { cmc: 1, colors: ["W"], roles: ["removal"], price: 8 },
  "path to exile": { cmc: 1, colors: ["W"], roles: ["removal"], price: 8 },
  "beast within": { cmc: 3, colors: ["G"], roles: ["removal"], price: 3 },
  "generous gift": { cmc: 3, colors: ["W"], roles: ["removal"], price: 2 },
  "assassin's trophy": { cmc: 2, colors: ["B", "G"], roles: ["removal"], price: 35 },
  "chaos warp": { cmc: 3, colors: ["R"], roles: ["removal"], price: 5 },
  "cyclonic rift": { cmc: 2, colors: ["U"], roles: ["removal", "boardWipe"], price: 190 },
  "toxic deluge": { cmc: 3, colors: ["B"], roles: ["boardWipe"], price: 120 },
  "farewell": { cmc: 6, colors: ["W"], roles: ["boardWipe"], price: 20 },
  "blasphemous act": { cmc: 9, colors: ["R"], roles: ["boardWipe"], price: 15 },
  "austere command": { cmc: 6, colors: ["W"], roles: ["boardWipe"], price: 10 },
  "counterspell": { cmc: 2, colors: ["U"], roles: ["counterspell"], price: 3 },
  "swan song": { cmc: 1, colors: ["U"], roles: ["counterspell"], price: 70 },
  "mana drain": { cmc: 2, colors: ["U"], roles: ["counterspell", "ramp"], price: 220 },
  "fierce guardianship": { cmc: 3, colors: ["U"], roles: ["counterspell", "protection"], price: 280 },
  "force of will": { cmc: 5, colors: ["U"], roles: ["counterspell", "protection"], price: 520 },
  "heroic intervention": { cmc: 2, colors: ["G"], roles: ["protection"], price: 80 },
  "teferi's protection": { cmc: 3, colors: ["W"], roles: ["protection"], price: 210 },
  "lightning greaves": { cmc: 2, colors: [], roles: ["protection"], price: 30 },
  "swiftfoot boots": { cmc: 2, colors: [], roles: ["protection"], price: 8 },
  "reanimate": { cmc: 1, colors: ["B"], roles: ["recursion"], price: 80 },
  "animate dead": { cmc: 2, colors: ["B"], roles: ["recursion"], price: 45 },
  "eternal witness": { cmc: 3, colors: ["G"], roles: ["recursion"], price: 8 },
  "living death": { cmc: 5, colors: ["B"], roles: ["recursion", "boardWipe", "winCondition"], price: 35 },
  "drannith magistrate": { cmc: 2, colors: ["W"], roles: ["stax"], price: 45 },
  "rule of law": { cmc: 3, colors: ["W"], roles: ["stax"], price: 8 },
  "winter orb": { cmc: 2, colors: [], roles: ["stax"], price: 120 },
  "collector ouphe": { cmc: 2, colors: ["G"], roles: ["stax"], price: 35 },
  "opposition agent": { cmc: 3, colors: ["B"], roles: ["stax"], price: 70 },
  "craterhoof behemoth": { cmc: 8, colors: ["G"], roles: ["finisher", "winCondition"], price: 180 },
  "torment of hailfire": { cmc: 2, colors: ["B"], roles: ["finisher", "winCondition"], price: 90 },
  "exsanguinate": { cmc: 2, colors: ["B"], roles: ["finisher", "winCondition"], price: 10 },
  "aetherflux reservoir": { cmc: 4, colors: [], roles: ["finisher", "winCondition"], price: 55 },
  "finale of devastation": { cmc: 2, colors: ["G"], roles: ["tutor", "finisher", "winCondition"], price: 170 },
  "thassa's oracle": { cmc: 2, colors: ["U"], roles: ["comboPiece", "winCondition"], price: 65 },
  "demonic consultation": { cmc: 1, colors: ["B"], roles: ["comboPiece", "tutor"], price: 200 },
  "tainted pact": { cmc: 2, colors: ["B"], roles: ["comboPiece", "tutor"], price: 130 },
  "isochron scepter": { cmc: 2, colors: [], roles: ["comboPiece"], price: 35 },
  "dramatic reversal": { cmc: 2, colors: ["U"], roles: ["comboPiece"], price: 8 },
  "dockside extortionist": { cmc: 2, colors: ["R"], roles: ["ramp", "comboPiece"], price: 360 },
  "temur sabertooth": { cmc: 4, colors: ["G"], roles: ["comboPiece", "protection"], price: 15 },
  "kiki-jiki, mirror breaker": { cmc: 5, colors: ["R"], roles: ["comboPiece", "winCondition"], price: 65 },
  "zealous conscripts": { cmc: 5, colors: ["R"], roles: ["comboPiece"], price: 6 },
  "underworld breach": { cmc: 2, colors: ["R"], roles: ["recursion", "comboPiece", "winCondition"], price: 75 },
  "brain freeze": { cmc: 2, colors: ["U"], roles: ["comboPiece", "winCondition"], price: 25 },
  "lion's eye diamond": { cmc: 0, colors: [], roles: ["ramp", "comboPiece"], price: 2600 },
  "exquisite blood": { cmc: 5, colors: ["B"], roles: ["comboPiece", "winCondition"], price: 130 },
  "sanguine bond": { cmc: 5, colors: ["B"], roles: ["comboPiece", "winCondition"], price: 20 },
  "heliod, sun-crowned": { cmc: 3, colors: ["W"], roles: ["comboPiece", "winCondition"], price: 35 },
  "walking ballista": { cmc: 0, colors: [], roles: ["comboPiece", "removal", "winCondition"], price: 70 },
  "food chain": { cmc: 3, colors: ["G"], roles: ["comboPiece", "winCondition"], price: 300 },
  "eternal scourge": { cmc: 3, colors: [], roles: ["comboPiece"], price: 10 },
  "squee, the immortal": { cmc: 3, colors: ["R"], roles: ["comboPiece", "recursion"], price: 12 },
  "niv-mizzet, parun": { cmc: 6, colors: ["U", "R"], roles: ["comboPiece", "draw", "winCondition"], price: 30 },
  "curiosity": { cmc: 1, colors: ["U"], roles: ["comboPiece", "draw"], price: 10 },
  "ophidian eye": { cmc: 3, colors: ["U"], roles: ["comboPiece", "draw"], price: 8 },
  "command tower": { cmc: 0, colors: [], roles: ["land", "fix"], price: 2 },
  "exotic orchard": { cmc: 0, colors: [], roles: ["land", "fix"], price: 4 },
  "reflecting pool": { cmc: 0, colors: [], roles: ["land", "fix"], price: 45 },
  "mana confluence": { cmc: 0, colors: [], roles: ["land", "fix"], price: 150 },
  "city of brass": { cmc: 0, colors: [], roles: ["land", "fix"], price: 80 },
  "ancient tomb": { cmc: 0, colors: [], roles: ["land", "ramp"], price: 320 },
  "cavern of souls": { cmc: 0, colors: [], roles: ["land", "fix"], price: 350 }
};

export const rolePatterns: Array<[CardRole, RegExp]> = [
  ["ramp", /\b(signet|talisman|sol ring|arcane signet|cultivate|kodama|farseek|lore|visits|lotus|ritual|mana crypt|mana vault|birds of paradise|llanowar|elves|treasure|dockside)\b/i],
  ["draw", /\b(study|remora|sentinel|arena|necropotence|skullclamp|draw|insight|library|wheel|ponder|preordain|brainstorm|harmonize|sign in blood)\b/i],
  ["tutor", /\b(tutor|demonic|vampiric|worldly|mystical|enlightened|gamble|chord of calling|finale of devastation|green sun)\b/i],
  ["removal", /\b(swords to plowshares|path to exile|beast within|generous gift|assassin|trophy|chaos warp|pongify|rapid hybridization|terminate|vindicate|destroy|exile target|claim)\b/i],
  ["boardWipe", /\b(wrath|damnation|deluge|cyclonic rift|farewell|blasphemous act|supreme verdict|austere command|wipe|evacuation)\b/i],
  ["counterspell", /\b(counterspell|mana drain|swan song|fierce guardianship|force of will|negate|flusterstorm|pact of negation|dispel|arcane denial)\b/i],
  ["protection", /\b(protection|heroic intervention|teferi|greaves|boots|veil of summer|flawless maneuver|deflecting swat|mother of runes|safekeeping)\b/i],
  ["recursion", /\b(reanimate|animate dead|living death|eternal witness|regrowth|recursion|sun titan|victimize|reclamation)\b/i],
  ["stax", /\b(rule of law|drannith|winter orb|static orb|collector ouphe|opposition agent|grave pact|smothering tithe|rest in peace|stony silence)\b/i],
  ["comboPiece", /\b(thassa|consultation|tainted pact|scepter|dramatic reversal|dockside|sabertooth|kiki|zealous|underworld breach|brain freeze|food chain|walking ballista|exquisite blood|sanguine bond|curiosity|ophidian eye)\b/i],
  ["winCondition", /\b(craterhoof|torment of hailfire|exsanguinate|aetherflux|oracle|approach of the second sun|finale of devastation|laboratory maniac|jace wielder|win)\b/i]
];

export const comboCatalog = [
  {
    name: "Thassa's Oracle + Demonic Consultation/Tainted Pact",
    pieces: ["thassa's oracle", "demonic consultation"],
    alternates: ["tainted pact"],
    confidence: 96
  },
  {
    name: "Isochron Scepter + Dramatic Reversal",
    pieces: ["isochron scepter", "dramatic reversal"],
    alternates: ["sol ring", "mana crypt", "arcane signet"],
    confidence: 88
  },
  {
    name: "Dockside Extortionist + Temur Sabertooth",
    pieces: ["dockside extortionist", "temur sabertooth"],
    alternates: [],
    confidence: 82
  },
  {
    name: "Kiki-Jiki + Zealous Conscripts",
    pieces: ["kiki-jiki, mirror breaker", "zealous conscripts"],
    alternates: [],
    confidence: 90
  },
  {
    name: "Underworld Breach + Brain Freeze + Lion's Eye Diamond",
    pieces: ["underworld breach", "brain freeze", "lion's eye diamond"],
    alternates: [],
    confidence: 94
  },
  {
    name: "Exquisite Blood + Sanguine Bond",
    pieces: ["exquisite blood", "sanguine bond"],
    alternates: [],
    confidence: 86
  },
  {
    name: "Heliod + Walking Ballista",
    pieces: ["heliod, sun-crowned", "walking ballista"],
    alternates: [],
    confidence: 90
  },
  {
    name: "Food Chain + Eternal Scourge/Squee",
    pieces: ["food chain", "eternal scourge"],
    alternates: ["squee, the immortal", "misthollow griffin"],
    confidence: 84
  },
  {
    name: "Niv-Mizzet + Curiosity/Ophidian Eye",
    pieces: ["niv-mizzet, parun", "curiosity"],
    alternates: ["ophidian eye"],
    confidence: 82
  }
];

export const counterCommanders = [
  {
    commander: "Grand Arbiter Augustin IV",
    colors: ["W", "U"],
    archetype: "Stax Control",
    strategy: "Taxa as jogadas-chave, atrasa ramp explosivo e compra tempo para travar a mesa."
  },
  {
    commander: "Kinnan, Bonder Prodigy",
    colors: ["G", "U"],
    archetype: "Ramp Combo",
    strategy: "Passa por cima de mesas midrange com mana superior e ameaca combo cedo."
  },
  {
    commander: "Yuriko, the Tiger's Shadow",
    colors: ["U", "B"],
    archetype: "Tempo Aggro",
    strategy: "Pressiona pontos de vida enquanto mantem anulacoes baratas para proteger o ritmo."
  },
  {
    commander: "Najeela, the Blade-Blossom",
    colors: ["W", "U", "B", "R", "G"],
    archetype: "Aggro Combo",
    strategy: "Obriga respostas imediatas e pune decks que demoram a montar defesa."
  },
  {
    commander: "Winota, Joiner of Forces",
    colors: ["W", "R"],
    archetype: "Explosivo Aggro",
    strategy: "Cria janelas de dano antes de decks lentos estabilizarem."
  },
  {
    commander: "Muldrotha, the Gravetide",
    colors: ["U", "B", "G"],
    archetype: "Recursao Value",
    strategy: "Recupera recursos melhor que decks que dependem de troca um por um."
  },
  {
    commander: "Urza, Lord High Artificer",
    colors: ["U"],
    archetype: "Artifacts Combo",
    strategy: "Transforma artefatos em mana e pressiona linhas de combo resilientes."
  },
  {
    commander: "Tymna the Weaver + Kraum, Ludevic's Opus",
    colors: ["W", "U", "B", "R"],
    archetype: "Midrange cEDH",
    strategy: "Combina card advantage constante, interacao barata e ameacas compactas."
  }
];
