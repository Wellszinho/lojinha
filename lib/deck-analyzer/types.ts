export type DeckSourceType = "text" | "url" | "file";
export type { DeckGame } from "@/lib/deck-analyzer/formats";

export type CardRole =
  | "ramp"
  | "draw"
  | "tutor"
  | "removal"
  | "boardWipe"
  | "counterspell"
  | "protection"
  | "finisher"
  | "recursion"
  | "stax"
  | "comboPiece"
  | "winCondition"
  | "land"
  | "fix";

export type DeckCard = {
  name: string;
  quantity: number;
  section?: string;
  roles: CardRole[];
  cmc: number;
  colors: string[];
  price: number;
  notes?: string;
};

export type DeckOverview = {
  deckName: string;
  commander: string;
  game: string;
  colors: string[];
  archetype: string;
  subArchetypes: string[];
  format: string;
  estimatedPrice: number;
  powerLevel: number;
  complexity: number;
  speed: number;
  consistency: number;
  aggression: number;
  resilience: number;
};

export type ManaCurveBucket = {
  label: string;
  count: number;
};

export type ManaAnalysis = {
  curve: ManaCurveBucket[];
  averageCmc: number;
  lands: number;
  ramp: number;
  fix: number;
  distributionText: string;
};

export type RoleGroup = {
  role: CardRole;
  label: string;
  count: number;
  cards: string[];
  commentary: string;
};

export type ComboAnalysis = {
  name: string;
  pieces: string[];
  howToExecute: string;
  howToProtect: string;
  howToStop: string;
  confidence: number;
};

export type ProbabilityLine = {
  label: string;
  chance: number;
  count: number;
  explanation: string;
};

export type Matchup = {
  archetype: string;
  winChance: number;
  difficulty: number;
  strategy: string;
  importantCards: string[];
};

export type CommanderCounter = {
  commander: string;
  colors: string[];
  archetype: string;
  power: number;
  reason: string;
  winChance: number;
  difficulty: number;
  strategy: string;
};

export type UpgradeSuggestion = {
  mode: "remove" | "budget" | "premium";
  card: string;
  reason: string;
};

export type ScoreLine = {
  label: string;
  value: number;
  explanation: string;
};

export type DeckAnalysis = {
  source: {
    type: DeckSourceType;
    importedCards: number;
    warnings: string[];
  };
  cards: DeckCard[];
  overview: DeckOverview;
  style: {
    mainPlan: string;
    secondaryPlan: string;
    winPattern: string;
    turnWindows: string;
    attackTiming: string;
    controlTiming: string;
    resourceTiming: string;
  };
  mana: ManaAnalysis;
  roleGroups: RoleGroup[];
  synergies: string[];
  keyCards: string[];
  highImpactCards: string[];
  combos: ComboAnalysis[];
  mulligan: {
    keep: string;
    ship: string;
    lookFor: string[];
  };
  strengths: string[];
  weaknesses: string[];
  probabilities: ProbabilityLine[];
  matchups: Matchup[];
  bestCommandersAgainst: CommanderCounter[];
  worstCommandersToFace: CommanderCounter[];
  bestDecksToFace: CommanderCounter[];
  worstDecksToFace: CommanderCounter[];
  howToPlayAgainst: string[];
  howToBeat: string[];
  bestCounterCommander: CommanderCounter;
  upgrades: UpgradeSuggestion[];
  scores: ScoreLine[];
  executiveSummary: string;
};

export type AnalyzeDeckInput = {
  sourceType: DeckSourceType;
  input: string;
  game?: string;
  format?: string;
  commander?: string;
  deckName?: string;
};
