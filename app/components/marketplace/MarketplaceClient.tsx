"use client";

import {
  Bell,
  Handshake,
  Mail,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  UserRound,
  WandSparkles
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  conditionLabels,
  contactTypeLabels,
  formatMarketplacePrice,
  getGameLabel,
  marketplaceGames,
  marketplaceSamples,
  normalizeCardSearch,
  postTypeLabels,
  type MarketplaceCondition,
  type MarketplaceContactType,
  type MarketplaceGame,
  type MarketplacePost,
  type MarketplacePostType
} from "@/lib/marketplace";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "magic-the-galo-marketplace-posts";

const inputClass =
  "w-full rounded-premium border border-white/10 bg-black/25 px-3 py-2 text-sm text-frost outline-none transition placeholder:text-mist/55 focus:border-gold/50 focus:ring-2 focus:ring-gold/20";
const labelClass = "grid gap-2 text-sm font-semibold text-frost";

const initialForm = {
  type: "sell" as MarketplacePostType,
  game: "magic" as MarketplaceGame,
  cardName: "",
  edition: "",
  language: "Portugues",
  rarity: "",
  condition: "near-mint" as MarketplaceCondition,
  foil: false,
  quantity: "1",
  price: "",
  acceptsTrade: true,
  ownerName: "",
  location: "",
  contactType: "whatsapp" as MarketplaceContactType,
  contact: "",
  notes: "",
  imageUrl: ""
};

function getStoredPosts() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as MarketplacePost[];
    return parsed.filter((post) => post.game === "magic");
  } catch {
    return [];
  }
}

function toCents(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return Math.round(parsed * 100);
}

function getContactHref(post: MarketplacePost) {
  if (post.contactType === "whatsapp") {
    const phone = post.contact.replace(/\D/g, "");
    const text = encodeURIComponent(`Oi, vi seu anuncio no Magic The Galo sobre ${post.cardName}. Ainda esta disponivel?`);
    return phone ? `https://wa.me/${phone}?text=${text}` : undefined;
  }
  if (post.contactType === "email") {
    return `mailto:${post.contact}?subject=${encodeURIComponent(`Anuncio Magic The Galo - ${post.cardName}`)}`;
  }
  if (post.contactType === "instagram") {
    const handle = post.contact.replace("@", "");
    return handle ? `https://instagram.com/${handle}` : undefined;
  }
  return undefined;
}

function MarketplacePostCard({ post, onConnect }: { post: MarketplacePost; onConnect: (post: MarketplacePost) => void }) {
  return (
    <article className="group overflow-hidden rounded-premium border border-white/10 bg-white/[.045] shadow-[0_18px_60px_rgba(0,0,0,.24)] transition hover:border-gold/30">
      <div className="relative min-h-36 bg-gradient-to-br from-gold/20 via-violet/16 to-emerald/10 p-4">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,rgba(215,180,106,.18)_1px,transparent_1px),linear-gradient(rgba(215,180,106,.12)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative flex items-start justify-between gap-3">
          <span className="rounded-full border border-gold/30 bg-black/35 px-3 py-1 text-xs font-black uppercase tracking-[.14em] text-gold">
            {postTypeLabels[post.type]}
          </span>
          <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-frost">
            {getGameLabel(post.game)}
          </span>
        </div>
        <div className="relative mt-8">
          <h3 className="text-2xl font-black leading-tight text-frost">{post.cardName}</h3>
          <p className="mt-2 text-sm text-mist">
            {post.edition || "Edicao nao informada"} - {post.language}
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="grid gap-2 text-sm text-mist sm:grid-cols-2">
          <span className="rounded-premium bg-black/18 px-3 py-2">Condicao: {conditionLabels[post.condition]}</span>
          <span className="rounded-premium bg-black/18 px-3 py-2">{post.foil ? "Foil" : "Nao foil"}</span>
          <span className="rounded-premium bg-black/18 px-3 py-2">Qtd: {post.quantity}</span>
          <span className="rounded-premium bg-black/18 px-3 py-2">Raridade: {post.rarity || "-"}</span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[.16em] text-mist">Valor</span>
            <strong className="block text-xl font-black text-frost">{formatMarketplacePrice(post.price)}</strong>
          </div>
          {post.acceptsTrade ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-violet/15 px-3 py-1 text-xs font-bold text-frost">
              <Handshake className="size-3" />
              Aceita troca
            </span>
          ) : null}
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-mist">{post.notes || "Sem observacoes adicionais."}</p>

        <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-mist">
          <UserRound className="size-4 text-gold" />
          <span>{post.ownerName || "Usuario Magic The Galo"}</span>
          <span className="text-white/20">/</span>
          <span>{post.location || "Local nao informado"}</span>
        </div>

        <Button type="button" className="mt-4 w-full" onClick={() => onConnect(post)}>
          <MessageCircle className="size-4" />
          {post.type === "want" ? "Tenho essa carta" : "Tenho interesse"}
        </Button>
      </div>
    </article>
  );
}

function ConnectionPanel({ post, onClose }: { post: MarketplacePost | null; onClose: () => void }) {
  if (!post) return null;
  const href = getContactHref(post);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur">
      <div className="w-full max-w-lg rounded-premium border border-gold/25 bg-obsidian p-5 shadow-premium">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-gold">Conectar jogadores</p>
            <h2 className="mt-2 text-2xl font-black text-frost">{post.cardName}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-premium border border-white/10 px-3 py-2 text-sm text-mist">
            Fechar
          </button>
        </div>

        <div className="mt-5 grid gap-3 rounded-premium border border-white/10 bg-white/[.045] p-4 text-sm text-mist">
          <p>
            Fale com <strong className="text-frost">{post.ownerName}</strong> por {contactTypeLabels[post.contactType]}.
          </p>
          <p className="rounded-premium bg-black/25 p-3 font-mono text-frost">{post.contact}</p>
          <p>
            Sugestao de mensagem: &quot;Oi, vi seu anuncio no Magic The Galo sobre {post.cardName}. Ainda esta disponivel?&quot;
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-premium border border-gold/40 bg-gold px-4 text-sm font-bold text-obsidian transition hover:bg-[#e4c77d]"
            >
              <MessageCircle className="size-4" />
              Abrir contato
            </a>
          ) : (
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-premium border border-white/10 bg-white/[.07] px-4 text-sm font-bold text-frost"
              onClick={() => navigator.clipboard?.writeText(post.contact)}
            >
              <Mail className="size-4" />
              Copiar contato
            </button>
          )}
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-premium border border-white/10 bg-white/[.07] px-4 text-sm font-bold text-frost"
            onClick={() => navigator.clipboard?.writeText(post.contact)}
          >
            <ShieldCheck className="size-4" />
            Copiar contato
          </button>
        </div>
      </div>
    </div>
  );
}

export function MarketplaceClient() {
  const [storedPosts, setStoredPosts] = useState<MarketplacePost[]>(getStoredPosts);
  const [form, setForm] = useState(initialForm);
  const [query, setQuery] = useState("");
  const [gameFilter, setGameFilter] = useState<MarketplaceGame | "all">("all");
  const [typeFilter, setTypeFilter] = useState<MarketplacePostType | "all">("all");
  const [conditionFilter, setConditionFilter] = useState<MarketplaceCondition | "all">("all");
  const [selectedPost, setSelectedPost] = useState<MarketplacePost | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedPosts));
  }, [storedPosts]);

  const posts = useMemo(() => [...storedPosts, ...marketplaceSamples], [storedPosts]);
  const normalizedQuery = normalizeCardSearch(query);

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesQuery =
          !normalizedQuery ||
          normalizeCardSearch(`${post.cardName} ${post.edition} ${post.ownerName} ${post.notes}`).includes(normalizedQuery);
        const matchesGame = gameFilter === "all" || post.game === gameFilter;
        const matchesType = typeFilter === "all" || post.type === typeFilter;
        const matchesCondition = conditionFilter === "all" || post.condition === conditionFilter;
        return matchesQuery && matchesGame && matchesType && matchesCondition;
      }),
    [conditionFilter, gameFilter, normalizedQuery, posts, typeFilter]
  );

  const possibleConnections = useMemo(() => {
    const sellers = posts.filter((post) => post.type === "sell" || post.type === "trade");
    const wanted = posts.filter((post) => post.type === "want");
    return wanted
      .flatMap((want) =>
        sellers
          .filter((seller) => seller.game === want.game && normalizeCardSearch(seller.cardName) === normalizeCardSearch(want.cardName))
          .map((seller) => ({ want, seller }))
      )
      .slice(0, 4);
  }, [posts]);

  function updateField<T extends keyof typeof initialForm>(field: T, value: (typeof initialForm)[T]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const post: MarketplacePost = {
      id: `local-${Date.now()}`,
      type: form.type,
      game: form.game,
      cardName: form.cardName.trim(),
      edition: form.edition.trim(),
      language: form.language.trim(),
      rarity: form.rarity.trim(),
      condition: form.condition,
      foil: form.foil,
      quantity: Math.max(1, Number(form.quantity) || 1),
      price: toCents(form.price),
      acceptsTrade: form.acceptsTrade,
      ownerName: form.ownerName.trim() || "Usuario Magic The Galo",
      location: form.location.trim(),
      contactType: form.contactType,
      contact: form.contact.trim(),
      notes: form.notes.trim(),
      imageUrl: form.imageUrl.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    if (!post.cardName || !post.contact) return;
    setStoredPosts((current) => [post, ...current]);
    setForm(initialForm);
  }

  return (
    <div className="grid gap-8">
      <ConnectionPanel post={selectedPost} onClose={() => setSelectedPost(null)} />

      <section className="grid gap-6 rounded-premium border border-gold/20 bg-white/[.045] p-5 shadow-premium lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-bold text-gold">
            <Sparkles className="size-4" />
            Comunidade Magic The Galo
          </p>
          <h2 className="mt-3 text-2xl font-black text-frost md:text-3xl">Venda, troque ou encontre cartas com outros jogadores.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-mist">
            Publique cartas que voce tem para vender/trocar ou anuncie cartas que esta procurando. A plataforma cruza
            procuras e ofertas para aproximar colecionadores, jogadores e lojistas.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Anuncios ativos", posts.length],
              ["Procuras abertas", posts.filter((post) => post.type === "want").length],
              ["Conexoes possiveis", possibleConnections.length]
            ].map(([label, value]) => (
              <div key={label} className="rounded-premium border border-white/10 bg-black/18 p-4">
                <strong className="block text-2xl text-frost">{value}</strong>
                <span className="text-xs text-mist">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-premium border border-white/10 bg-black/18 p-4">
          <h3 className="flex items-center gap-2 font-black text-frost">
            <ShieldCheck className="size-5 text-gold" />
            Conexao segura entre pessoas
          </h3>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-mist">
            <p>O Magic The Galo aproxima compradores e vendedores, mas a negociacao final ainda acontece entre as pessoas.</p>
            <p>Recomendacao: peca foto frente/verso, combine pagamento seguro e registre envio ou retirada.</p>
            <p>Futuro: chat interno, reputacao, intermediacao e checkout protegido.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={handleSubmit} className="h-fit rounded-premium border border-white/10 bg-white/[.045] p-5 lg:sticky lg:top-28">
          <div className="mb-5 flex items-center gap-2">
            <Plus className="size-5 text-gold" />
            <h2 className="text-xl font-black text-frost">Publicar anuncio</h2>
          </div>

          <div className="grid gap-4">
            <label className={labelClass}>
              Tipo
              <select className={inputClass} value={form.type} onChange={(event) => updateField("type", event.target.value as MarketplacePostType)}>
                <option value="sell">Quero vender</option>
                <option value="trade">Quero trocar</option>
                <option value="want">Estou procurando</option>
              </select>
            </label>

            <label className={labelClass}>
              Jogo
              <select className={inputClass} value={form.game} onChange={(event) => updateField("game", event.target.value as MarketplaceGame)}>
                {marketplaceGames.map((game) => (
                  <option key={game.value} value={game.value}>
                    {game.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Nome da carta
              <input required className={inputClass} value={form.cardName} onChange={(event) => updateField("cardName", event.target.value)} placeholder="Sol Ring" />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Edicao/Colecao
                <input className={inputClass} value={form.edition} onChange={(event) => updateField("edition", event.target.value)} placeholder="Commander Masters" />
              </label>
              <label className={labelClass}>
                Idioma
                <input className={inputClass} value={form.language} onChange={(event) => updateField("language", event.target.value)} />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Raridade
                <input className={inputClass} value={form.rarity} onChange={(event) => updateField("rarity", event.target.value)} placeholder="Rare, Secret, SR..." />
              </label>
              <label className={labelClass}>
                Estado
                <select className={inputClass} value={form.condition} onChange={(event) => updateField("condition", event.target.value as MarketplaceCondition)}>
                  {Object.entries(conditionLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Quantidade
                <input type="number" min={1} className={inputClass} value={form.quantity} onChange={(event) => updateField("quantity", event.target.value)} />
              </label>
              <label className={labelClass}>
                Preco
                <input className={inputClass} value={form.price} onChange={(event) => updateField("price", event.target.value)} placeholder="49,90" />
              </label>
            </div>

            <div className="grid gap-2">
              <label className="flex items-center gap-3 text-sm font-semibold text-frost">
                <input type="checkbox" className="size-4 accent-[#D7B46A]" checked={form.foil} onChange={(event) => updateField("foil", event.target.checked)} />
                Carta foil
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold text-frost">
                <input
                  type="checkbox"
                  className="size-4 accent-[#D7B46A]"
                  checked={form.acceptsTrade}
                  onChange={(event) => updateField("acceptsTrade", event.target.checked)}
                />
                Aceito troca
              </label>
            </div>

            <label className={labelClass}>
              Seu nome
              <input className={inputClass} value={form.ownerName} onChange={(event) => updateField("ownerName", event.target.value)} placeholder="Nome ou apelido" />
            </label>

            <label className={labelClass}>
              Cidade/Estado
              <input className={inputClass} value={form.location} onChange={(event) => updateField("location", event.target.value)} placeholder="Sao Paulo, SP" />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Contato
                <select
                  className={inputClass}
                  value={form.contactType}
                  onChange={(event) => updateField("contactType", event.target.value as MarketplaceContactType)}
                >
                  {Object.entries(contactTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Usuario/link
                <input required className={inputClass} value={form.contact} onChange={(event) => updateField("contact", event.target.value)} placeholder="WhatsApp, email, @..." />
              </label>
            </div>

            <label className={labelClass}>
              Observacoes
              <textarea className={cn(inputClass, "min-h-24 resize-y")} value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
            </label>

            <Button type="submit" className="w-full">
              <WandSparkles className="size-4" />
              Publicar no marketplace
            </Button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="rounded-premium border border-white/10 bg-white/[.045] p-4">
            <div className="grid gap-3 xl:grid-cols-[1fr_170px_150px_170px]">
              <label className="flex items-center gap-2 rounded-premium border border-white/10 bg-black/20 px-3 py-2">
                <Search className="size-4 text-mist" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full bg-transparent text-sm text-frost outline-none placeholder:text-mist"
                  placeholder="Buscar carta, edicao ou jogador..."
                />
              </label>
              <select className={inputClass} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as MarketplacePostType | "all")}>
                <option value="all">Todos os tipos</option>
                <option value="sell">Vendas</option>
                <option value="trade">Trocas</option>
                <option value="want">Procuras</option>
              </select>
              <select className={inputClass} value={gameFilter} onChange={(event) => setGameFilter(event.target.value as MarketplaceGame | "all")}>
                <option value="all">Magic</option>
                {marketplaceGames.map((game) => (
                  <option key={game.value} value={game.value}>
                    {game.label}
                  </option>
                ))}
              </select>
              <select
                className={inputClass}
                value={conditionFilter}
                onChange={(event) => setConditionFilter(event.target.value as MarketplaceCondition | "all")}
              >
                <option value="all">Qualquer estado</option>
                {Object.entries(conditionLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {possibleConnections.length ? (
            <section className="rounded-premium border border-gold/20 bg-gold/10 p-4">
              <h2 className="flex items-center gap-2 font-black text-frost">
                <Bell className="size-5 text-gold" />
                Conexoes possiveis
              </h2>
              <div className="mt-4 grid gap-3">
                {possibleConnections.map(({ want, seller }) => (
                  <div key={`${want.id}-${seller.id}`} className="rounded-premium border border-white/10 bg-black/20 p-3 text-sm text-mist">
                    <strong className="text-frost">{want.ownerName}</strong> procura <strong className="text-gold">{want.cardName}</strong> e{" "}
                    <strong className="text-frost">{seller.ownerName}</strong> anunciou essa carta.
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-2">
            {filteredPosts.map((post) => (
              <MarketplacePostCard key={post.id} post={post} onConnect={setSelectedPost} />
            ))}
          </div>

          {!filteredPosts.length ? (
            <div className="rounded-premium border border-white/10 bg-white/[.045] p-8 text-center">
              <Tag className="mx-auto size-8 text-gold" />
              <h2 className="mt-3 text-xl font-black text-frost">Nenhum anuncio encontrado</h2>
              <p className="mt-2 text-sm text-mist">Tente mudar os filtros ou publique a carta que voce procura.</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
