export type DeckGame = "magic";

export type DeckGameOption = {
  value: DeckGame;
  label: string;
};

export type DeckFormatOption = {
  value: string;
  label: string;
};

export const deckGames: DeckGameOption[] = [
  { value: "magic", label: "Magic: The Gathering" }
];

export const deckFormats: Record<DeckGame, DeckFormatOption[]> = {
  magic: [
    { value: "commander", label: "Commander" },
    { value: "booster-draft", label: "Booster Draft" },
    { value: "sealed", label: "Selado" },
    { value: "standard", label: "Standard" },
    { value: "pioneer", label: "Pioneer" },
    { value: "modern", label: "Modern" },
    { value: "pauper", label: "Pauper" },
    { value: "casual", label: "Casual" }
  ]
};

export function getGameLabel(game?: string) {
  return deckGames.find((item) => item.value === game)?.label ?? "Magic: The Gathering";
}

export function getFormatLabel(game?: string, format?: string) {
  return deckFormats.magic.find((item) => item.value === format)?.label ?? deckFormats.magic[0].label;
}
