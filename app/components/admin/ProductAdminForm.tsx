"use client";

import { Save, Sparkles } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { categories, collections, productTypeLabels, type ProductType } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-premium border border-white/10 bg-black/20 px-3 py-2 text-sm text-frost outline-none transition placeholder:text-mist/55 focus:border-gold/50 focus:ring-2 focus:ring-gold/20";
const labelClass = "grid gap-2 text-sm font-semibold text-frost";

const accessoryTypes: ProductType[] = [
  "deck-box",
  "sleeve",
  "playmat",
  "token",
  "dado",
  "fichario",
  "produto-personalizado",
  "outro"
];

const initialForm = {
  name: "",
  slug: "",
  productType: "carta-avulsa" as ProductType,
  description: "",
  price: "",
  compareAtPrice: "",
  categoryId: categories[0]?.slug ?? "cartas-avulsas",
  collectionId: "",
  sku: "",
  stock: "1",
  material: "Card stock original",
  compatibility: "Magic, Commander",
  tags: "magic, commander, colecao",
  cardName: "",
  game: "Magic: The Gathering",
  edition: "",
  language: "Portugues",
  rarity: "",
  condition: "Near Mint",
  foil: false,
  frontImage: "",
  backImage: "",
  sealedGame: "Magic: The Gathering",
  sealedSet: "",
  sealedLanguage: "Portugues",
  sealedType: "booster",
  accessoryMaterial: "",
  accessoryDimensions: "",
  accessoryCapacity: "",
  accessoryTheme: "",
  accessoryColor: ""
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toCents(value: string) {
  return Math.round(Number(value.replace(",", ".")) * 100);
}

export function ProductAdminForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isCard = form.productType === "carta-avulsa";
  const isSealed = form.productType === "booster" || form.productType === "display";
  const isAccessory = accessoryTypes.includes(form.productType);

  const selectedTypeLabel = useMemo(() => productTypeLabels[form.productType], [form.productType]);

  function updateField<T extends keyof typeof initialForm>(field: T, value: (typeof initialForm)[T]) {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "name" && !current.slug ? { slug: slugify(String(value)) } : {})
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const payload: Record<string, unknown> = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      productType: form.productType,
      price: toCents(form.price),
      categoryId: form.categoryId,
      collectionId: form.collectionId || undefined,
      sku: form.sku,
      stock: Number(form.stock),
      material: form.material,
      compatibility: splitList(form.compatibility),
      tags: splitList(form.tags)
    };

    if (form.compareAtPrice) payload.compareAtPrice = toCents(form.compareAtPrice);

    if (isCard) {
      payload.card = {
        cardName: form.cardName,
        game: form.game,
        edition: form.edition,
        language: form.language,
        rarity: form.rarity,
        condition: form.condition,
        foil: form.foil,
        frontImage: form.frontImage,
        backImage: form.backImage || undefined
      };
    }

    if (isSealed) {
      payload.sealed = {
        game: form.sealedGame,
        set: form.sealedSet,
        language: form.sealedLanguage,
        sealedType: form.sealedType
      };
    }

    if (isAccessory) {
      payload.accessory = {
        material: form.accessoryMaterial || form.material,
        dimensions: form.accessoryDimensions,
        capacity: form.accessoryCapacity || undefined,
        theme: form.accessoryTheme,
        color: form.accessoryColor
      };
    }

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(result.error ?? "Nao foi possivel cadastrar o produto.");
      return;
    }

    setStatus("success");
    setMessage(result.message ?? "Produto cadastrado.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-premium border border-gold/20 bg-white/[.045] p-5 shadow-[0_18px_60px_rgba(0,0,0,.22)]"
    >
      <div className="flex flex-col gap-3 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-gold">
            <Sparkles className="size-4" />
            Cadastro universal
          </p>
          <h2 className="mt-2 text-xl font-black text-frost">Novo produto Magic</h2>
          <p className="mt-1 text-sm text-mist">
            Selecione o tipo e preencha os campos dedicados para cartas, selados, acessorios e personalizados.
          </p>
        </div>
        <Button type="submit" disabled={status === "saving"} className="w-full lg:w-auto">
          <Save className="size-4" />
          {status === "saving" ? "Salvando..." : "Cadastrar produto"}
        </Button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-4">
        <label className={cn(labelClass, "lg:col-span-2")}>
          Nome do produto
          <input
            required
            className={fieldClass}
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Sol Ring - Commander Masters"
          />
        </label>
        <label className={labelClass}>
          Slug
          <input
            required
            className={fieldClass}
            value={form.slug}
            onChange={(event) => updateField("slug", slugify(event.target.value))}
            placeholder="sol-ring-commander-masters"
          />
        </label>
        <label className={labelClass}>
          Tipo
          <select
            className={fieldClass}
            value={form.productType}
            onChange={(event) => updateField("productType", event.target.value as ProductType)}
          >
            {Object.entries(productTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className={cn(labelClass, "lg:col-span-2")}>
          Categoria
          <select
            className={fieldClass}
            value={form.categoryId}
            onChange={(event) => updateField("categoryId", event.target.value)}
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className={cn(labelClass, "lg:col-span-2")}>
          Colecao
          <select
            className={fieldClass}
            value={form.collectionId}
            onChange={(event) => updateField("collectionId", event.target.value)}
          >
            <option value="">Sem colecao</option>
            {collections.map((collection) => (
              <option key={collection.slug} value={collection.slug}>
                {collection.name}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Preco
          <input
            required
            inputMode="decimal"
            className={fieldClass}
            value={form.price}
            onChange={(event) => updateField("price", event.target.value)}
            placeholder="49,90"
          />
        </label>
        <label className={labelClass}>
          Preco anterior
          <input
            inputMode="decimal"
            className={fieldClass}
            value={form.compareAtPrice}
            onChange={(event) => updateField("compareAtPrice", event.target.value)}
            placeholder="59,90"
          />
        </label>
        <label className={labelClass}>
          SKU
          <input
            required
            className={fieldClass}
            value={form.sku}
            onChange={(event) => updateField("sku", event.target.value)}
            placeholder="MTG-SOL-CMM-001"
          />
        </label>
        <label className={labelClass}>
          Estoque
          <input
            required
            min={0}
            type="number"
            className={fieldClass}
            value={form.stock}
            onChange={(event) => updateField("stock", event.target.value)}
          />
        </label>
        <label className={cn(labelClass, "lg:col-span-2")}>
          Material base
          <input
            required
            className={fieldClass}
            value={form.material}
            onChange={(event) => updateField("material", event.target.value)}
            placeholder="Card stock original, couro sintetico, EVA..."
          />
        </label>
        <label className={cn(labelClass, "lg:col-span-2")}>
          Compatibilidade
          <input
            className={fieldClass}
            value={form.compatibility}
            onChange={(event) => updateField("compatibility", event.target.value)}
            placeholder="Magic, Commander, Modern"
          />
        </label>
        <label className={cn(labelClass, "lg:col-span-4")}>
          Tags
          <input
            className={fieldClass}
            value={form.tags}
            onChange={(event) => updateField("tags", event.target.value)}
            placeholder="rara, commander, oferta"
          />
        </label>
        <label className={cn(labelClass, "lg:col-span-4")}>
          Descricao
          <textarea
            required
            minLength={20}
            className={cn(fieldClass, "min-h-28 resize-y")}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Descricao comercial com raridade, protecao, colecionismo e desejo de compra."
          />
        </label>
      </div>

      <div className="mt-6 rounded-premium border border-white/10 bg-black/15 p-4">
        <h3 className="font-bold text-frost">Campos para {selectedTypeLabel}</h3>

        {isCard && (
          <div className="mt-4 grid gap-4 lg:grid-cols-4">
            <label className={labelClass}>
              Nome da carta
              <input required className={fieldClass} value={form.cardName} onChange={(event) => updateField("cardName", event.target.value)} />
            </label>
            <label className={labelClass}>
              Jogo
              <input required className={fieldClass} value={form.game} onChange={(event) => updateField("game", event.target.value)} />
            </label>
            <label className={labelClass}>
              Edicao
              <input required className={fieldClass} value={form.edition} onChange={(event) => updateField("edition", event.target.value)} />
            </label>
            <label className={labelClass}>
              Idioma
              <input required className={fieldClass} value={form.language} onChange={(event) => updateField("language", event.target.value)} />
            </label>
            <label className={labelClass}>
              Raridade
              <input required className={fieldClass} value={form.rarity} onChange={(event) => updateField("rarity", event.target.value)} />
            </label>
            <label className={labelClass}>
              Condicao
              <input required className={fieldClass} value={form.condition} onChange={(event) => updateField("condition", event.target.value)} />
            </label>
            <label className="flex items-center gap-3 self-end text-sm font-semibold text-frost">
              <input
                type="checkbox"
                className="size-4 accent-[#D7B46A]"
                checked={form.foil}
                onChange={(event) => updateField("foil", event.target.checked)}
              />
              Foil
            </label>
            <label className={cn(labelClass, "lg:col-span-2")}>
              Imagem frente
              <input required className={fieldClass} value={form.frontImage} onChange={(event) => updateField("frontImage", event.target.value)} />
            </label>
            <label className={cn(labelClass, "lg:col-span-2")}>
              Imagem verso opcional
              <input className={fieldClass} value={form.backImage} onChange={(event) => updateField("backImage", event.target.value)} />
            </label>
          </div>
        )}

        {isSealed && (
          <div className="mt-4 grid gap-4 lg:grid-cols-4">
            <label className={labelClass}>
              Jogo
              <input required className={fieldClass} value={form.sealedGame} onChange={(event) => updateField("sealedGame", event.target.value)} />
            </label>
            <label className={labelClass}>
              Colecao
              <input required className={fieldClass} value={form.sealedSet} onChange={(event) => updateField("sealedSet", event.target.value)} />
            </label>
            <label className={labelClass}>
              Idioma
              <input
                required
                className={fieldClass}
                value={form.sealedLanguage}
                onChange={(event) => updateField("sealedLanguage", event.target.value)}
              />
            </label>
            <label className={labelClass}>
              Tipo de produto
              <input
                required
                className={fieldClass}
                value={form.sealedType}
                onChange={(event) => updateField("sealedType", event.target.value)}
                placeholder="booster, display, bundle..."
              />
            </label>
          </div>
        )}

        {isAccessory && (
          <div className="mt-4 grid gap-4 lg:grid-cols-4">
            <label className={labelClass}>
              Material
              <input
                required
                className={fieldClass}
                value={form.accessoryMaterial}
                onChange={(event) => updateField("accessoryMaterial", event.target.value)}
              />
            </label>
            <label className={labelClass}>
              Dimensoes
              <input
                required
                className={fieldClass}
                value={form.accessoryDimensions}
                onChange={(event) => updateField("accessoryDimensions", event.target.value)}
              />
            </label>
            <label className={labelClass}>
              Capacidade
              <input
                className={fieldClass}
                value={form.accessoryCapacity}
                onChange={(event) => updateField("accessoryCapacity", event.target.value)}
              />
            </label>
            <label className={labelClass}>
              Tema
              <input required className={fieldClass} value={form.accessoryTheme} onChange={(event) => updateField("accessoryTheme", event.target.value)} />
            </label>
            <label className={labelClass}>
              Cor
              <input required className={fieldClass} value={form.accessoryColor} onChange={(event) => updateField("accessoryColor", event.target.value)} />
            </label>
          </div>
        )}
      </div>

      {message ? (
        <p
          className={cn(
            "mt-4 rounded-premium border px-4 py-3 text-sm",
            status === "success"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
              : "border-red-400/30 bg-red-400/10 text-red-100"
          )}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
