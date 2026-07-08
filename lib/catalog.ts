export type ProductType =
  | "carta-avulsa"
  | "deck-box"
  | "sleeve"
  | "booster"
  | "display"
  | "playmat"
  | "token"
  | "dado"
  | "fichario"
  | "produto-personalizado"
  | "outro";

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductAddOnOption = {
  id: string;
  label: string;
  description: string;
  price: number;
  sourceUrl?: string;
};

export type ProductAddOnGroup = {
  id: string;
  title: string;
  description: string;
  selection: "single" | "multiple";
  options: ProductAddOnOption[];
};

export type Category = {
  name: string;
  slug: string;
  description: string;
  tone: string;
  productCount: number;
};

export type Collection = {
  name: string;
  slug: string;
  description: string;
  tone: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  collection: string;
  productType: ProductType;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  material: string;
  compatibility: string[];
  tags: string[];
  images?: ProductImage[];
  addOnGroups?: ProductAddOnGroup[];
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isWeeklyDeal?: boolean;
  tone: string;
  dimensions: {
    width: string;
    height: string;
    depth: string;
    weight: string;
  };
  specs: string[];
  card?: {
    cardName: string;
    game: string;
    edition: string;
    language: string;
    rarity: string;
    condition: string;
    foil: boolean;
    frontImage: string;
    backImage?: string;
  };
  sealed?: {
    game: string;
    set: string;
    language: string;
    sealedType: "booster" | "display" | "bundle" | "starter" | "outro";
  };
  accessory?: {
    material: string;
    dimensions: string;
    capacity?: string;
    theme: string;
    color: string;
  };
};

export const productTypeLabels: Record<ProductType, string> = {
  "carta-avulsa": "Carta avulsa",
  "deck-box": "Deck box",
  sleeve: "Sleeve",
  booster: "Booster",
  display: "Display",
  playmat: "Playmat",
  token: "Token",
  dado: "Dado",
  fichario: "Fichario",
  "produto-personalizado": "Produto personalizado",
  outro: "Outro"
};

export const categories: Category[] = [
  {
    name: "Cartas Avulsas",
    slug: "cartas-avulsas",
    description: "Singles raras, staples competitivas, foils e cartas para completar colecoes.",
    tone: "from-gold/35 via-violet/20 to-sky-300/15",
    productCount: 420
  },
  {
    name: "Deck Boxes",
    slug: "deck-boxes",
    description: "Protecao premium para Commander, torneios, colecoes e transporte diario.",
    tone: "from-violet/40 via-royal/20 to-gold/20",
    productCount: 40
  },
  {
    name: "Boosters e Displays",
    slug: "boosters-displays",
    description: "Produtos selados para abrir, guardar, draftar e presentear.",
    tone: "from-amber-500/35 via-gold/20 to-red-500/20",
    productCount: 64
  },
  {
    name: "Sleeves",
    slug: "sleeves",
    description: "Sleeves matte, clear, art e premium para proteger cartas raras.",
    tone: "from-cyan-400/25 via-violet/25 to-white/10",
    productCount: 48
  },
  {
    name: "Playmats",
    slug: "playmats",
    description: "Bases de jogo com acabamento macio, arte tematica e borda costurada.",
    tone: "from-emerald/25 via-violet/25 to-gold/20",
    productCount: 28
  },
  {
    name: "Dados e Marcadores",
    slug: "dados-marcadores",
    description: "D20, contadores, marcadores de vida, fichas e tokens para mesa.",
    tone: "from-fuchsia-400/25 via-violet/30 to-gold/15",
    productCount: 52
  },
  {
    name: "Ficharios e Pastas",
    slug: "ficharios-pastas",
    description: "Organizacao premium para colecionadores, trades e cartas de alto valor.",
    tone: "from-zinc-300/10 via-gold/25 to-violet/20",
    productCount: 22
  },
  {
    name: "Personalizados",
    slug: "personalizados",
    description: "Produtos sob demanda com tema, cor, arte e acabamento exclusivos.",
    tone: "from-emerald/25 via-violet/25 to-gold/25",
    productCount: 24
  },
  {
    name: "Acessorios",
    slug: "acessorios",
    description: "Tudo para jogar, colecionar, proteger, organizar e exibir suas reliquias.",
    tone: "from-royal/30 via-violet/20 to-gold/20",
    productCount: 180
  }
];

export const collections: Collection[] = [
  {
    name: "Reliquias Arcanas",
    slug: "reliquias-arcanas",
    description: "Cartas raras, detalhes dourados e visual de grimorio antigo.",
    tone: "from-gold/35 via-violet/25 to-black/20"
  },
  {
    name: "Dragoes",
    slug: "dragoes",
    description: "Escamas sutis, couro gravado, fogo contido e metais nobres.",
    tone: "from-emerald/25 via-violet/20 to-gold/25"
  },
  {
    name: "Planos e Lendas",
    slug: "planos-e-lendas",
    description: "Cores vivas com leitura premium para colecionadores de Magic.",
    tone: "from-pink-400/25 via-violet/30 to-cyan-300/15"
  },
  {
    name: "Final Fantasy",
    slug: "final-fantasy",
    description: "Minimalismo epico, cristais, prata fria e acabamento lendario.",
    tone: "from-sky-300/25 via-violet/30 to-white/10"
  },
  {
    name: "Elden Ring",
    slug: "elden-ring",
    description: "Dourado antigo, couro escuro e presenca de reliquia medieval.",
    tone: "from-gold/35 via-amber-800/25 to-black/20"
  },
  {
    name: "Cyberpunk",
    slug: "cyberpunk",
    description: "Ranhuras tecnicas, neon contido e textura industrial.",
    tone: "from-cyan-400/25 via-violet/35 to-gold/15"
  }
];

export const products: Product[] = [
  {
    id: "prod_sol_ring_cm",
    name: "Sol Ring - Commander Masters",
    slug: "sol-ring-commander-masters",
    description: "Carta avulsa essencial para Commander, revisada e embalada para colecionadores.",
    price: 4990,
    compareAtPrice: 5990,
    category: "cartas-avulsas",
    collection: "reliquias-arcanas",
    productType: "carta-avulsa",
    rating: 4.9,
    reviewCount: 212,
    stock: 7,
    sku: "MTG-SOL-CMM-001",
    material: "Card stock original",
    compatibility: ["Magic", "Commander"],
    tags: ["single", "commander", "rara", "oferta"],
    isFeatured: true,
    isWeeklyDeal: true,
    tone: "from-gold/35 via-violet/25 to-sky-300/10",
    dimensions: { width: "6,3 cm", height: "8,8 cm", depth: "0,1 cm", weight: "2 g" },
    specs: ["Sleeve individual incluso", "Conferencia de condicao", "Envio em top loader", "Ideal para Commander"],
    card: {
      cardName: "Sol Ring",
      game: "Magic: The Gathering",
      edition: "Commander Masters",
      language: "Ingles",
      rarity: "Uncommon",
      condition: "Near Mint",
      foil: false,
      frontImage: "/images/magic-the-galo-logo.png"
    }
  },
  {
    id: "prod_cloud_buster_sword_deckbox",
    name: "Deck Box Buster Sword Cloud Commander",
    slug: "deck-box-buster-sword-cloud-commander",
    description:
      "Deck box em formato de Buster Sword inspirada em Final Fantasy VII, feita para Commander e colecionadores de Magic. Produto premium para guardar, transportar e exibir o deck do Cloud com presença de peça de coleção.",
    price: 35000,
    category: "deck-boxes",
    collection: "final-fantasy",
    productType: "deck-box",
    rating: 5,
    reviewCount: 6,
    stock: 3,
    sku: "MTG-FF7-BSW-001",
    material: "Estrutura rigida personalizada, acabamento preto fosco, detalhes metalizados e suporte de exposicao",
    compatibility: ["Magic", "Commander"],
    tags: ["deck box", "cloud", "final fantasy", "commander", "buster sword", "premium"],
    images: [
      {
        src: "/images/products/cloud-deckbox/cover.png",
        alt: "Deck box Buster Sword Cloud Commander aberta em vista principal"
      },
      {
        src: "/images/products/cloud-deckbox/interior.png",
        alt: "Interior da deck box Buster Sword com cartas Magic"
      },
      {
        src: "/images/products/cloud-deckbox/side-a.png",
        alt: "Vista lateral da deck box Buster Sword com base Final Fantasy VII"
      },
      {
        src: "/images/products/cloud-deckbox/side-b.png",
        alt: "Outra vista lateral da deck box Buster Sword"
      },
      {
        src: "/images/products/cloud-deckbox/vertical.png",
        alt: "Deck box Buster Sword em posicao vertical"
      }
    ],
    addOnGroups: [
      {
        id: "cloud-commander",
        title: "Adicionar carta commander Cloud",
        description:
          "Escolha uma das cinco versoes de Cloud, Ex-SOLDIER para montar o kit da deck box. O valor exibido e o preco final do adicional.",
        selection: "single",
        options: [
          {
            id: "cloud-ex-soldier-regular",
            label: "Cloud, Ex-SOLDIER - regular",
            description: "Versao regular para jogar como commander do deck.",
            price: 8990,
            sourceUrl: "https://www.ligamagic.com.br/?view=cards%2Fcard&card=Cloud%2C+Ex-SOLDIER&tipo=1"
          },
          {
            id: "cloud-ex-soldier-foil",
            label: "Cloud, Ex-SOLDIER - foil",
            description: "Versao foil para quem quer brilho e presenca de colecao.",
            price: 11990,
            sourceUrl: "https://www.ligamagic.com.br/?view=cards%2Fcard&card=Cloud%2C+Ex-SOLDIER&tipo=1"
          },
          {
            id: "cloud-ex-soldier-extended",
            label: "Cloud, Ex-SOLDIER - extended art",
            description: "Versao com arte estendida para deixar o kit mais premium.",
            price: 14990,
            sourceUrl: "https://www.ligamagic.com.br/?view=cards%2Fcard&card=Cloud%2C+Ex-SOLDIER&tipo=1"
          },
          {
            id: "cloud-ex-soldier-showcase",
            label: "Cloud, Ex-SOLDIER - showcase",
            description: "Tratamento especial para colecionadores de Final Fantasy.",
            price: 17990,
            sourceUrl: "https://www.ligamagic.com.br/?view=cards%2Fcard&card=Cloud%2C+Ex-SOLDIER&tipo=1"
          },
          {
            id: "cloud-ex-soldier-premium",
            label: "Cloud, Ex-SOLDIER - premium foil",
            description: "Opcao de maior valor para montar o kit mais raro.",
            price: 22990,
            sourceUrl: "https://www.ligamagic.com.br/?view=cards%2Fcard&card=Cloud%2C+Ex-SOLDIER&tipo=1"
          }
        ]
      },
      {
        id: "final-fantasy-bundle",
        title: "Adicionar Bundle Final Fantasy",
        description:
          "Inclua um Bundle Final Fantasy lacrado junto com a espada para transformar a compra em kit completo de presente ou colecao.",
        selection: "multiple",
        options: [
          {
            id: "bundle-final-fantasy",
            label: "Bundle - Final Fantasy",
            description:
              "Produto selado da colecao Magic Final Fantasy, ideal para abrir boosters, guardar cartas e complementar o kit Cloud.",
            price: 64990,
            sourceUrl: "https://www.ligamagic.com.br/?view=prod/view&pcode=132997&prod=Bundle+-+Final+Fantasy"
          }
        ]
      }
    ],
    isFeatured: true,
    isNew: true,
    tone: "from-red-900/45 via-zinc-900 to-gold/20",
    dimensions: { width: "34 cm", height: "11 cm", depth: "9 cm", weight: "520 g" },
    specs: [
      "Deck box em formato de espada para Commander",
      "Capacidade estimada para 100+ cartas double sleeved",
      "Acompanha base de exposicao com tema Final Fantasy VII",
      "Opcao de adicionar Cloud, Ex-SOLDIER em cinco versoes",
      "Opcao de adicionar Bundle Final Fantasy lacrado"
    ],
    accessory: {
      material: "Estrutura rigida personalizada",
      dimensions: "34 x 11 x 9 cm",
      capacity: "100+ cartas double sleeved",
      theme: "Final Fantasy VII - Buster Sword",
      color: "Preto, prata e detalhes vermelho/verde"
    }
  },
  {
    id: "prod_vivi_ornitier_deckbox_commander",
    name: "Deck Box Vivi Ornitier Final Fantasy + Commander Vivi Ornitier",
    slug: "deck-box-vivi-ornitier-final-fantasy-commander",
    description:
      "Deck box tematica do Vivi Ornitier inspirada em Final Fantasy, com visual de tronco magico e espaco para exibir o commander. Kit premium para jogadores de Commander e colecionadores de Magic Final Fantasy, ja acompanhado da carta Vivi Ornitier.",
    price: 45000,
    compareAtPrice: 60000,
    category: "deck-boxes",
    collection: "final-fantasy",
    productType: "deck-box",
    rating: 5,
    reviewCount: 4,
    stock: 1,
    sku: "MTG-FF-VIVI-DBX-001",
    material: "Estrutura rigida personalizada com pintura tematica e acabamento premium",
    compatibility: ["Magic", "Commander"],
    tags: ["deck box", "vivi ornitier", "final fantasy", "commander", "magic", "premium", "oferta"],
    images: [
      {
        src: "/images/products/vivi-ornitier-deckbox/cover.webp",
        alt: "Deck box Vivi Ornitier Final Fantasy com carta commander em destaque"
      },
      {
        src: "/images/products/vivi-ornitier-deckbox/front.webp",
        alt: "Deck box Vivi Ornitier vista frontal"
      },
      {
        src: "/images/products/vivi-ornitier-deckbox/side.webp",
        alt: "Deck box Vivi Ornitier vista lateral"
      },
      {
        src: "/images/products/vivi-ornitier-deckbox/commander-card.png",
        alt: "Carta Commander Vivi Ornitier incluida no kit"
      }
    ],
    isFeatured: true,
    isNew: true,
    isWeeklyDeal: true,
    tone: "from-amber-900/40 via-violet/30 to-gold/20",
    dimensions: { width: "Personalizado", height: "Personalizado", depth: "Personalizado", weight: "Sob consulta" },
    specs: [
      "Deck box tematica do Vivi Ornitier",
      "Acompanha carta commander Vivi Ornitier",
      "Visual de tronco magico com acabamento premium",
      "Ideal para Commander e colecionadores de Magic Final Fantasy",
      "Oferta especial de R$ 600,00 por R$ 450,00"
    ],
    card: {
      cardName: "Vivi Ornitier",
      game: "Magic: The Gathering",
      edition: "Final Fantasy",
      language: "Ingles",
      rarity: "Mythic Rare",
      condition: "Near Mint",
      foil: false,
      frontImage: "/images/products/vivi-ornitier-deckbox/commander-card.png"
    },
    accessory: {
      material: "Estrutura rigida personalizada",
      dimensions: "Personalizado",
      capacity: "Deck Commander",
      theme: "Final Fantasy - Vivi Ornitier",
      color: "Marrom, amarelo, roxo e detalhes vermelhos"
    }
  },
  {
    id: "prod_minecraft_chest_counter_deckbox",
    name: "Mtg Deckbox Baú do Minecraft com Contador",
    slug: "mtg-deckbox-bau-minecraft-com-contador",
    description:
      "Deck box em formato de baú inspirado em Minecraft, com contador integrado e espaco para deck, dados e marcadores. Uma opcao divertida e funcional para levar o Commander com estilo geek.",
    price: 7000,
    category: "deck-boxes",
    collection: "planos-e-lendas",
    productType: "deck-box",
    rating: 4.9,
    reviewCount: 3,
    stock: 2,
    sku: "MTG-MC-BAU-001",
    material: "Estrutura rigida personalizada com acabamento preto e amarelo",
    compatibility: ["Magic", "Commander"],
    tags: ["deck box", "minecraft", "bau", "contador", "commander", "magic", "geek"],
    images: [
      {
        src: "/images/products/minecraft-chest-counter-deckbox/deck-loaded.webp",
        alt: "Mtg Deckbox Baú do Minecraft com deck e contador"
      },
      {
        src: "/images/products/minecraft-chest-counter-deckbox/interior.webp",
        alt: "Interior da deckbox baú do Minecraft com contador"
      },
      {
        src: "/images/products/minecraft-chest-counter-deckbox/counter.webp",
        alt: "Deckbox baú do Minecraft com contador removido e dados"
      },
      {
        src: "/images/products/minecraft-chest-counter-deckbox/closed.webp",
        alt: "Deckbox baú do Minecraft fechada"
      }
    ],
    isFeatured: true,
    isNew: true,
    tone: "from-yellow-500/35 via-zinc-950 to-gold/20",
    dimensions: { width: "Personalizado", height: "Personalizado", depth: "Personalizado", weight: "Sob consulta" },
    specs: [
      "Deck box em formato de baú inspirado em Minecraft",
      "Contador integrado na lateral",
      "Espaco para deck, dados e marcadores",
      "Ideal para Commander e mesas casuais",
      "Preco unico de R$ 70,00"
    ],
    accessory: {
      material: "Estrutura rigida personalizada",
      dimensions: "Personalizado",
      capacity: "Deck Commander + dados e marcadores",
      theme: "Minecraft - baú com contador",
      color: "Preto, amarelo e detalhe branco"
    }
  },
  {
    id: "prod_tiny_bones_deckbox",
    name: "Deck Box Tiny Bones",
    slug: "deck-box-tiny-bones",
    description:
      "Deck box tematica Tiny Bones com visual de caveira, chapeu e acabamento de colecionador. Uma peca de mesa com presenca forte para Commander, perfeita para proteger o deck e chamar atencao na partida.",
    price: 20000,
    category: "deck-boxes",
    collection: "planos-e-lendas",
    productType: "deck-box",
    rating: 5,
    reviewCount: 2,
    stock: 1,
    sku: "MTG-TB-DBX-001",
    material: "Estrutura rigida personalizada com pintura tematica e acabamento premium",
    compatibility: ["Magic", "Commander"],
    tags: ["deck box", "tiny bones", "tinybones", "commander", "magic", "caveira", "premium"],
    images: [
      {
        src: "/images/products/tiny-bones-deckbox/cover.webp",
        alt: "Deck Box Tiny Bones com chapeu e caveira em vista lateral"
      },
      {
        src: "/images/products/tiny-bones-deckbox/front.webp",
        alt: "Deck Box Tiny Bones em vista frontal"
      },
      {
        src: "/images/products/tiny-bones-deckbox/real-photo.webp",
        alt: "Foto real da Deck Box Tiny Bones"
      }
    ],
    isFeatured: true,
    isNew: true,
    tone: "from-zinc-900 via-violet/35 to-gold/20",
    dimensions: { width: "Personalizado", height: "Personalizado", depth: "Personalizado", weight: "Sob consulta" },
    specs: [
      "Deck box tematica Tiny Bones",
      "Visual de caveira com chapeu",
      "Acabamento premium para colecionador",
      "Ideal para decks Commander",
      "Preco unico de R$ 200,00"
    ],
    accessory: {
      material: "Estrutura rigida personalizada",
      dimensions: "Personalizado",
      capacity: "Deck Commander",
      theme: "Tiny Bones",
      color: "Osso, preto, roxo e detalhes dourados"
    }
  },
  {
    id: "prod_rx_gundam_deckbox",
    name: "Deck Box RX Gundam",
    slug: "deck-box-rx-gundam",
    description:
      "Deck box inspirada no RX Gundam, com formato de capacete e compartimento interno para proteger o deck. Uma peca geek de impacto para jogadores de Commander que gostam de acessorios com visual de colecao.",
    price: 15000,
    category: "deck-boxes",
    collection: "cyberpunk",
    productType: "deck-box",
    rating: 5,
    reviewCount: 2,
    stock: 1,
    sku: "MTG-RX-GDM-001",
    material: "Estrutura rigida personalizada com pintura branca, vermelha e amarela",
    compatibility: ["Magic", "Commander"],
    tags: ["deck box", "rx gundam", "gundam", "commander", "magic", "mecha", "geek"],
    images: [
      {
        src: "/images/products/rx-gundam-deckbox/cover.webp",
        alt: "Deck Box RX Gundam fechada em formato de capacete"
      },
      {
        src: "/images/products/rx-gundam-deckbox/open.webp",
        alt: "Deck Box RX Gundam aberta com deck no compartimento"
      }
    ],
    isFeatured: true,
    isNew: true,
    tone: "from-sky-300/25 via-zinc-950 to-red-500/20",
    dimensions: { width: "Personalizado", height: "Personalizado", depth: "Personalizado", weight: "Sob consulta" },
    specs: [
      "Deck box em formato de capacete RX Gundam",
      "Compartimento interno para deck",
      "Visual mecha para colecionadores",
      "Ideal para decks Commander",
      "Preco unico de R$ 150,00"
    ],
    accessory: {
      material: "Estrutura rigida personalizada",
      dimensions: "Personalizado",
      capacity: "Deck Commander",
      theme: "RX Gundam",
      color: "Branco, vermelho, amarelo e preto"
    }
  },
  {
    id: "prod_rhystic_study_wot",
    name: "Rhystic Study - Enchanting Tales",
    slug: "rhystic-study-enchanting-tales",
    description: "Carta avulsa classica de Commander, protegida e pronta para binder ou deck premium.",
    price: 18990,
    compareAtPrice: 21990,
    category: "cartas-avulsas",
    collection: "reliquias-arcanas",
    productType: "carta-avulsa",
    rating: 5,
    reviewCount: 64,
    stock: 2,
    sku: "MTG-RHY-WOT-002",
    material: "Card stock original",
    compatibility: ["Magic", "Commander"],
    tags: ["single", "commander", "draw", "colecionador"],
    isFeatured: true,
    isBestSeller: true,
    tone: "from-sky-400/30 via-gold/25 to-violet/20",
    dimensions: { width: "6,3 cm", height: "8,8 cm", depth: "0,1 cm", weight: "2 g" },
    specs: ["Sleeve premium incluso", "Embalagem anti-impacto", "Conferencia visual", "Ideal para Commander"],
    card: {
      cardName: "Rhystic Study",
      game: "Magic: The Gathering",
      edition: "Wilds of Eldraine Enchanting Tales",
      language: "Ingles",
      rarity: "Rare",
      condition: "Near Mint",
      foil: false,
      frontImage: "/images/magic-the-galo-logo.png"
    }
  },
  {
    id: "prod_arcane_vault",
    name: "Arcane Vault Pro",
    slug: "arcane-vault-pro",
    description: "Deck box rigida com fechamento magnetico, interior aveludado e divisoria removivel.",
    price: 18990,
    compareAtPrice: 23990,
    category: "deck-boxes",
    collection: "elden-ring",
    productType: "deck-box",
    rating: 4.9,
    reviewCount: 128,
    stock: 34,
    sku: "ACC-AVP-003",
    material: "Couro sintetico premium, imas N52 e liner soft-touch",
    compatibility: ["Magic", "Commander"],
    tags: ["premium", "magnetico", "commander", "protecao"],
    isFeatured: true,
    isBestSeller: true,
    tone: "from-violet/45 via-royal/25 to-gold/20",
    dimensions: { width: "11,2 cm", height: "9,6 cm", depth: "8,1 cm", weight: "310 g" },
    specs: ["Capacidade para 100+ cards double sleeved", "Fechamento magnetico duplo", "Divisoria interna removivel", "Base antiderrapante"],
    accessory: {
      material: "Couro sintetico premium",
      dimensions: "11,2 x 9,6 x 8,1 cm",
      capacity: "100+ cards double sleeved",
      theme: "Medieval arcano",
      color: "Preto, roxo e dourado"
    }
  },
  {
    id: "prod_booster_aetherdrift",
    name: "Booster Magic Aetherdrift",
    slug: "booster-magic-aetherdrift",
    description: "Booster selado para abrir novas possibilidades, buscar raridades e reforcar decks.",
    price: 3290,
    category: "boosters-displays",
    collection: "reliquias-arcanas",
    productType: "booster",
    rating: 4.7,
    reviewCount: 91,
    stock: 120,
    sku: "MTG-AET-BST-004",
    material: "Produto selado original",
    compatibility: ["Magic"],
    tags: ["booster", "selado", "novidade"],
    isNew: true,
    tone: "from-gold/30 via-violet/30 to-red-500/15",
    dimensions: { width: "7 cm", height: "12 cm", depth: "0,8 cm", weight: "28 g" },
    specs: ["Produto lacrado", "Idioma portugues", "Ideal para abrir ou presentear", "Estoque pronto envio"],
    sealed: {
      game: "Magic: The Gathering",
      set: "Aetherdrift",
      language: "Portugues",
      sealedType: "booster"
    }
  },
  {
    id: "prod_display_magic_final_fantasy",
    name: "Display Magic Final Fantasy",
    slug: "display-magic-final-fantasy",
    description: "Display selado de Magic para colecionadores e jogadores que buscam cartas especiais em volume.",
    price: 119990,
    compareAtPrice: 129990,
    category: "boosters-displays",
    collection: "final-fantasy",
    productType: "display",
    rating: 4.8,
    reviewCount: 37,
    stock: 9,
    sku: "MTG-FIN-DSP-005",
    material: "Display lacrado original",
    compatibility: ["Magic"],
    tags: ["display", "selado", "magic", "oferta"],
    isWeeklyDeal: true,
    tone: "from-yellow-300/30 via-cyan-300/20 to-violet/25",
    dimensions: { width: "13 cm", height: "12 cm", depth: "7 cm", weight: "760 g" },
    specs: ["Display lacrado", "Produto original", "Colecao atual", "Envio com reforco externo"],
    sealed: {
      game: "Magic: The Gathering",
      set: "Final Fantasy",
      language: "Ingles",
      sealedType: "display"
    }
  },
  {
    id: "prod_sleeves_dragon_guard",
    name: "Sleeves Dragon Guard Matte",
    slug: "sleeves-dragon-guard-matte",
    description: "Sleeves premium matte para proteger cartas raras e melhorar o embaralhamento.",
    price: 6990,
    category: "sleeves",
    collection: "dragoes",
    productType: "sleeve",
    rating: 4.8,
    reviewCount: 156,
    stock: 86,
    sku: "ACC-SLV-DRG-006",
    material: "Polipropileno matte sem acido",
    compatibility: ["Magic", "Commander"],
    tags: ["sleeves", "protecao", "matte", "acessorio"],
    isFeatured: true,
    isBestSeller: true,
    tone: "from-emerald/25 via-violet/25 to-gold/20",
    dimensions: { width: "6,6 cm", height: "9,1 cm", depth: "2,2 cm", weight: "95 g" },
    specs: ["Pacote com 100 sleeves", "Acabamento matte", "Sem PVC e sem acido", "Formato standard"],
    accessory: {
      material: "Polipropileno matte",
      dimensions: "66 x 91 mm",
      capacity: "100 sleeves",
      theme: "Dragao arcano",
      color: "Preto e dourado"
    }
  },
  {
    id: "prod_playmat_mana_relic",
    name: "Playmat Mana Relic",
    slug: "playmat-mana-relic",
    description: "Playmat de mesa com textura macia, base emborrachada e arte inspirada em grimorios.",
    price: 14990,
    category: "playmats",
    collection: "reliquias-arcanas",
    productType: "playmat",
    rating: 4.9,
    reviewCount: 72,
    stock: 24,
    sku: "ACC-PLY-MAN-007",
    material: "Neoprene com base natural emborrachada",
    compatibility: ["Magic", "Commander", "Modern", "Pioneer"],
    tags: ["playmat", "mesa", "fantasia", "novidade"],
    isNew: true,
    tone: "from-violet/30 via-gold/20 to-emerald/20",
    dimensions: { width: "61 cm", height: "35 cm", depth: "0,3 cm", weight: "340 g" },
    specs: ["Borda costurada", "Base antiderrapante", "Impressao de alta definicao", "Tamanho competitivo"],
    accessory: {
      material: "Neoprene",
      dimensions: "61 x 35 cm",
      theme: "Grimorio medieval",
      color: "Preto, roxo e dourado"
    }
  },
  {
    id: "prod_dados_metalicos",
    name: "Dados Metalicos D20 Galo",
    slug: "dados-metalicos-d20-galo",
    description: "Conjunto de dados metalicos com leitura premium para marcadores, contadores e RPG.",
    price: 8990,
    category: "dados-marcadores",
    collection: "elden-ring",
    productType: "dado",
    rating: 4.7,
    reviewCount: 51,
    stock: 40,
    sku: "ACC-D20-GLD-008",
    material: "Liga metalica zincada",
    compatibility: ["Magic", "Commander"],
    tags: ["dados", "contador", "metalico"],
    tone: "from-gold/35 via-zinc-500/20 to-violet/20",
    dimensions: { width: "2 cm", height: "2 cm", depth: "2 cm", weight: "120 g" },
    specs: ["Kit com 5 dados", "Numeracao em alto contraste", "Bolsa de veludo inclusa", "Acabamento metalico"],
    accessory: {
      material: "Liga metalica",
      dimensions: "20 mm",
      capacity: "5 dados",
      theme: "Reliquia dourada",
      color: "Dourado envelhecido"
    }
  },
  {
    id: "prod_tokens_commander",
    name: "Tokens e Marcadores Commander",
    slug: "tokens-marcadores-commander",
    description: "Kit de tokens e marcadores reutilizaveis para partidas longas e mesas organizadas.",
    price: 5490,
    category: "dados-marcadores",
    collection: "reliquias-arcanas",
    productType: "token",
    rating: 4.6,
    reviewCount: 44,
    stock: 63,
    sku: "ACC-TKN-CMD-009",
    material: "PVC premium com acabamento fosco",
    compatibility: ["Magic", "Commander"],
    tags: ["tokens", "marcadores", "commander", "acessorio"],
    tone: "from-cyan-400/20 via-violet/25 to-gold/20",
    dimensions: { width: "6,3 cm", height: "8,8 cm", depth: "1,5 cm", weight: "110 g" },
    specs: ["Kit com 30 marcadores", "Superficie escrevivel", "Apagavel a seco", "Caixa de transporte inclusa"],
    accessory: {
      material: "PVC premium",
      dimensions: "63 x 88 mm",
      capacity: "30 marcadores",
      theme: "Mesa Commander",
      color: "Preto e azul arcano"
    }
  },
  {
    id: "prod_fichario_vault",
    name: "Fichario Vault 12 Bolsos",
    slug: "fichario-vault-12-bolsos",
    description: "Fichario premium para organizar cartas raras, trades e colecoes por set.",
    price: 17990,
    category: "ficharios-pastas",
    collection: "reliquias-arcanas",
    productType: "fichario",
    rating: 4.8,
    reviewCount: 68,
    stock: 19,
    sku: "ACC-BND-VLT-010",
    material: "Capa rigida, paginas side-loading e elastico reforcado",
    compatibility: ["Magic", "Commander"],
    tags: ["fichario", "binder", "colecao", "premium"],
    isFeatured: true,
    tone: "from-zinc-300/10 via-gold/25 to-violet/20",
    dimensions: { width: "31 cm", height: "34 cm", depth: "4 cm", weight: "860 g" },
    specs: ["12 bolsos por pagina", "Side-loading", "Capacidade para 480 cards", "Capa rigida premium"],
    accessory: {
      material: "PU texturizado e paginas PP",
      dimensions: "31 x 34 x 4 cm",
      capacity: "480 cards",
      theme: "Arquivo de reliquias",
      color: "Preto e dourado"
    }
  },
  {
    id: "prod_relic_custom",
    name: "Relic Box Personalizada",
    slug: "relic-box-personalizada",
    description: "Produto personalizado para quem quer uma reliquia unica com cor, tema, nome e acabamento sob demanda.",
    price: 27990,
    compareAtPrice: 32990,
    category: "personalizados",
    collection: "dragoes",
    productType: "produto-personalizado",
    rating: 4.9,
    reviewCount: 87,
    stock: 18,
    sku: "CUS-RBX-011",
    material: "Estrutura rigida, pintura UV e acabamento premium",
    compatibility: ["Magic", "Commander"],
    tags: ["personalizado", "sob demanda", "presente", "premium"],
    isFeatured: true,
    tone: "from-emerald/35 via-violet/25 to-gold/25",
    dimensions: { width: "14,8 cm", height: "10,2 cm", depth: "8,7 cm", weight: "390 g" },
    specs: ["Arte e tema personalizados", "Preco extra por opcao", "Aprovacao antes da producao", "Prazo informado no checkout"],
    accessory: {
      material: "Polimero reforcado",
      dimensions: "Sob demanda",
      capacity: "Configuravel",
      theme: "Escolhido pelo cliente",
      color: "Configuravel"
    }
  }
];

export const reviews = [
  {
    name: "Rafael M.",
    role: "Jogador Commander",
    rating: 5,
    quote: "Encontrei staples, sleeves e deck box no mesmo pedido. Tudo chegou protegido e com cara de loja premium."
  },
  {
    name: "Bianca S.",
    role: "Colecionadora Magic",
    rating: 5,
    quote: "A carta veio em sleeve e top loader, perfeita para o fichario. A experiencia lembra abrir uma reliquia."
  },
  {
    name: "Leonardo A.",
    role: "Jogador Modern",
    rating: 4.8,
    quote: "Comprei acessorios para torneio e boosters de Magic. Navegacao facil, estoque claro e visual muito bonito."
  }
];

export const storeMetrics = [
  { label: "Itens no catalogo", value: "850+" },
  { label: "Avaliacao media", value: "4.9/5" },
  { label: "Estados atendidos", value: "27" },
  { label: "Formatos Magic", value: "6+" }
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getCollectionBySlug(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.category === slug);
}

export function getProductsByType(type: ProductType) {
  return products.filter((product) => product.productType === type);
}

export function searchCatalog(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return products;

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.description,
      product.category,
      product.collection,
      productTypeLabels[product.productType],
      product.card?.cardName,
      product.card?.game,
      product.card?.edition,
      product.card?.language,
      product.card?.rarity,
      product.card?.condition,
      product.sealed?.game,
      product.sealed?.set,
      product.sealed?.language,
      product.accessory?.theme,
      product.accessory?.color,
      ...product.tags,
      ...product.compatibility
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });
}
