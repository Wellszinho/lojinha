export type MarketplaceGame = "magic";

export type MarketplacePostType = "sell" | "want" | "trade";

export type MarketplaceCondition =
  | "mint"
  | "near-mint"
  | "excellent"
  | "good"
  | "light-played"
  | "played"
  | "poor";

export type MarketplaceContactType = "whatsapp" | "email" | "discord" | "instagram";

export type MarketplacePost = {
  id: string;
  type: MarketplacePostType;
  game: MarketplaceGame;
  cardName: string;
  edition: string;
  language: string;
  rarity: string;
  condition: MarketplaceCondition;
  foil: boolean;
  quantity: number;
  price?: number;
  acceptsTrade: boolean;
  ownerName: string;
  location: string;
  contactType: MarketplaceContactType;
  contact: string;
  notes: string;
  imageUrl?: string;
  createdAt: string;
};

export const marketplaceGames: Array<{ value: MarketplaceGame; label: string }> = [
  { value: "magic", label: "Magic: The Gathering" }
];

export const postTypeLabels: Record<MarketplacePostType, string> = {
  sell: "Vendo",
  want: "Procuro",
  trade: "Troco"
};

export const conditionLabels: Record<MarketplaceCondition, string> = {
  mint: "Mint",
  "near-mint": "Near Mint",
  excellent: "Excellent",
  good: "Good",
  "light-played": "Light Played",
  played: "Played",
  poor: "Poor"
};

export const contactTypeLabels: Record<MarketplaceContactType, string> = {
  whatsapp: "WhatsApp",
  email: "E-mail",
  discord: "Discord",
  instagram: "Instagram"
};

export const marketplaceSamples: MarketplacePost[] = [
  {
    id: "sample-sol-ring",
    type: "sell",
    game: "magic",
    cardName: "Sol Ring",
    edition: "Commander Masters",
    language: "Ingles",
    rarity: "Uncommon",
    condition: "near-mint",
    foil: false,
    quantity: 2,
    price: 4990,
    acceptsTrade: true,
    ownerName: "Rafael Commander",
    location: "Sao Paulo, SP",
    contactType: "whatsapp",
    contact: "5511999999999",
    notes: "Carta revisada, sleeveada e pronta para commander. Aceito troca por staples verdes.",
    imageUrl: "/images/magic-the-galo-logo.png",
    createdAt: "2026-07-01T12:00:00.000Z"
  },
  {
    id: "sample-rhystic-seller",
    type: "sell",
    game: "magic",
    cardName: "Rhystic Study",
    edition: "Wilds of Eldraine Enchanting Tales",
    language: "Ingles",
    rarity: "Rare",
    condition: "near-mint",
    foil: false,
    quantity: 1,
    price: 18990,
    acceptsTrade: true,
    ownerName: "Lia Azul",
    location: "Campinas, SP",
    contactType: "instagram",
    contact: "@lia.mtg",
    notes: "Aceito troca por staples de Commander em Simic ou Esper. Envio foto frente e verso antes de fechar.",
    imageUrl: "/images/magic-the-galo-logo.png",
    createdAt: "2026-07-02T15:30:00.000Z"
  },
  {
    id: "sample-rhystic-want",
    type: "want",
    game: "magic",
    cardName: "Rhystic Study",
    edition: "Qualquer edicao",
    language: "Ingles",
    rarity: "Rare",
    condition: "near-mint",
    foil: false,
    quantity: 1,
    acceptsTrade: true,
    ownerName: "Kaio Commander",
    location: "Rio de Janeiro, RJ",
    contactType: "discord",
    contact: "kaio_commander",
    notes: "Procuro copia bem conservada. Posso comprar ou trocar por staples de Commander.",
    createdAt: "2026-07-03T10:15:00.000Z"
  },
  {
    id: "sample-dockside",
    type: "want",
    game: "magic",
    cardName: "Dockside Extortionist",
    edition: "Double Masters 2022",
    language: "Ingles",
    rarity: "Rare",
    condition: "excellent",
    foil: false,
    quantity: 1,
    acceptsTrade: true,
    ownerName: "Mara Commander",
    location: "Curitiba, PR",
    contactType: "email",
    contact: "mara@example.com",
    notes: "Busco para fechar lista de Commander. Aceito proposta com foto e referencia.",
    createdAt: "2026-07-03T18:40:00.000Z"
  }
];

export function getGameLabel(game: MarketplaceGame) {
  return marketplaceGames.find((item) => item.value === game)?.label ?? "Magic: The Gathering";
}

export function normalizeCardSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function formatMarketplacePrice(value?: number) {
  if (!value) return "A combinar";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value / 100);
}
