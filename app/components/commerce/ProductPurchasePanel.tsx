"use client";

import { CreditCard, Heart, Minus, PackageCheck, Plus, Ruler, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductVisual } from "@/components/commerce/ProductVisual";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/catalog";
import { cn, formatMoney, getDiscountPercent } from "@/lib/utils";

function getInitialSelectedAddOns(product: Product) {
  return (
    product.addOnGroups?.reduce<Record<string, string[]>>((initial, group) => {
      if (group.defaultSelectedOptionId) {
        initial[group.id] = [group.defaultSelectedOptionId];
      }

      return initial;
    }, {}) ?? {}
  );
}

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem, toggleFavorite, isFavorite } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>(() => getInitialSelectedAddOns(product));
  const favorite = isFavorite(product.id);
  const discount = getDiscountPercent(product.price, product.compareAtPrice);

  const selectedOptions = useMemo(
    () =>
      product.addOnGroups?.flatMap((group) =>
        group.options.filter((option) => selectedAddOns[group.id]?.includes(option.id))
      ) ?? [],
    [product.addOnGroups, selectedAddOns]
  );

  const addOnTotal = selectedOptions.reduce((sum, option) => sum + option.price, 0);
  const configuredPrice = product.price + addOnTotal;

  function toggleAddOn(groupId: string, optionId: string, selection: "single" | "multiple") {
    setSelectedAddOns((current) => {
      if (selection === "single") {
        return { ...current, [groupId]: current[groupId]?.[0] === optionId ? [] : [optionId] };
      }

      const currentGroup = current[groupId] ?? [];
      const nextGroup = currentGroup.includes(optionId)
        ? currentGroup.filter((id) => id !== optionId)
        : [...currentGroup, optionId];
      return { ...current, [groupId]: nextGroup };
    });
  }

  function addConfiguredProduct() {
    const optionSuffix = selectedOptions.map((option) => option.label).join(" + ");
    const cartId = selectedOptions.length
      ? `${product.id}:${selectedOptions.map((option) => option.id).join(":")}`
      : product.id;

    addItem(
      {
        id: cartId,
        productId: product.id,
        slug: product.slug,
        name: optionSuffix ? `${product.name} + ${optionSuffix}` : product.name,
        price: configuredPrice,
        compareAtPrice: product.compareAtPrice,
        tone: product.tone,
        stock: product.stock
      },
      quantity
    );
  }

  return (
    <div className="space-y-5 lg:sticky lg:top-28">
      <div className="rounded-premium border border-white/10 bg-white/[.045] p-5">
        <div className="flex flex-wrap gap-2">
          {product.isNew ? <span className="rounded-premium bg-violet/20 px-3 py-1 text-xs font-bold text-violet-100">Lancamento</span> : null}
          {product.isBestSeller ? <span className="rounded-premium bg-gold/15 px-3 py-1 text-xs font-bold text-gold">Mais vendido</span> : null}
          {discount ? <span className="rounded-premium bg-emerald/15 px-3 py-1 text-xs font-bold text-emerald">-{discount}%</span> : null}
        </div>
        <h1 className="mt-4 text-3xl font-black text-frost sm:text-4xl">{product.name}</h1>
        <p className="mt-3 text-sm leading-6 text-mist">{product.description}</p>

        <div className="mt-6">
          {product.compareAtPrice ? <p className="text-sm text-mist line-through">{formatMoney(product.compareAtPrice)}</p> : null}
          <p className="text-3xl font-black text-frost">{formatMoney(configuredPrice)}</p>
          {addOnTotal > 0 ? (
            <p className="mt-1 text-sm text-mist">
              Produto base {formatMoney(product.price)} + adicionais {formatMoney(addOnTotal)}
            </p>
          ) : null}
          <p className="mt-1 text-sm text-gold">Ate 6x sem juros ou Pix com processamento imediato.</p>
        </div>

        {product.addOnGroups?.length ? (
          <div className="mt-6 grid gap-4">
            {product.addOnGroups.map((group) => (
              <div key={group.id} className="rounded-premium border border-gold/20 bg-gold/10 p-4">
                <h2 className="font-black text-frost">{group.title}</h2>
                <p className="mt-2 text-sm leading-6 text-mist">{group.description}</p>
                <div className="mt-4 grid gap-2">
                  {group.selection === "single" && group.allowNone !== false ? (
                    <label className="flex cursor-pointer items-start gap-3 rounded-premium border border-white/10 bg-black/20 p-3 text-sm text-mist">
                      <input
                        type="radio"
                        name={group.id}
                        checked={!selectedAddOns[group.id]?.length}
                        onChange={() => setSelectedAddOns((current) => ({ ...current, [group.id]: [] }))}
                        className="mt-1 size-4 accent-[#D7B46A]"
                      />
                      <span>
                        <strong className="block text-frost">Somente deck box</strong>
                        <span>Nao adicionar carta nessa compra.</span>
                      </span>
                    </label>
                  ) : null}

                  {group.options.map((option) => {
                    const checked = selectedAddOns[group.id]?.includes(option.id) ?? false;
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-premium border p-3 text-sm transition",
                          checked ? "border-gold/45 bg-black/35 text-frost" : "border-white/10 bg-black/20 text-mist hover:text-frost"
                        )}
                      >
                        <input
                          type={group.selection === "single" ? "radio" : "checkbox"}
                          name={group.id}
                          checked={checked}
                          onChange={() => toggleAddOn(group.id, option.id, group.selection)}
                          className="mt-1 size-4 accent-[#D7B46A]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <strong className="text-frost">{option.label}</strong>
                            <strong className="text-gold">{option.price > 0 ? `+ ${formatMoney(option.price)}` : "Incluso"}</strong>
                          </span>
                          <span className="mt-1 block leading-5">{option.description}</span>
                          {option.sourceUrl ? (
                            <a
                              href={option.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex text-xs font-bold text-gold hover:text-frost"
                            >
                              Ver referencia na Liga Magic
                            </a>
                          ) : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-premium border border-white/10 bg-black/20 p-3">
            <Truck className="size-5 text-gold" />
            <p className="mt-2 text-sm font-semibold text-frost">Frete calculado no checkout</p>
            <p className="mt-1 text-xs text-mist">Correios, Melhor Envio e regra personalizada.</p>
          </div>
          <div className="rounded-premium border border-white/10 bg-black/20 p-3">
            <ShieldCheck className="size-5 text-gold" />
            <p className="mt-2 text-sm font-semibold text-frost">Compra segura</p>
            <p className="mt-1 text-xs text-mist">Pedido preparado para Pix, cartao e boleto.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex h-12 w-full items-center justify-between rounded-premium border border-white/10 sm:w-36">
            <button
              type="button"
              className="grid size-12 place-items-center text-mist hover:text-frost"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              aria-label="Diminuir quantidade"
              title="Diminuir"
            >
              <Minus className="size-4" />
            </button>
            <span className="font-bold text-frost">{quantity}</span>
            <button
              type="button"
              className="grid size-12 place-items-center text-mist hover:text-frost"
              onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
              aria-label="Aumentar quantidade"
              title="Aumentar"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <Button className="flex-1" data-testid="product-add-to-cart" onClick={addConfiguredProduct}>
            <ShoppingCart className="size-4" />
            Adicionar ao carrinho
          </Button>
          <Button
            type="button"
            variant="secondary"
            className={cn("sm:w-12 sm:px-0", favorite && "border-gold/40 text-gold")}
            onClick={() => toggleFavorite(product.id)}
            aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            title={favorite ? "Remover dos favoritos" : "Favoritar"}
          >
            <Heart className="size-4" fill={favorite ? "currentColor" : "none"} />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 rounded-premium border border-white/10 bg-white/[.045] p-5 text-sm text-mist">
        <div className="flex items-center gap-3">
          <PackageCheck className="size-5 text-gold" />
          Estoque atual: <strong className="text-frost">{product.stock} unidades</strong>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard className="size-5 text-gold" />
          Pix, cartao e boleto com arquitetura preparada.
        </div>
        <div className="flex items-center gap-3">
          <Ruler className="size-5 text-gold" />
          {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth}
        </div>
      </div>
    </div>
  );
}

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images ?? [];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const thumbnailLabels = images.length ? images : ["Hero", "Detalhe", "Interior", "Video"].map((label) => ({ src: "", alt: label }));

  return (
    <div className="grid items-start gap-3 lg:grid-cols-[76px_1fr] lg:gap-4">
      <div className="order-2 grid grid-cols-4 content-start gap-2 self-start sm:grid-cols-5 lg:order-1 lg:grid-cols-1">
        {thumbnailLabels.map((item, index) => (
          <button
            key={`${item.alt}-${index}`}
            type="button"
            className={cn(
              "aspect-square rounded-premium border bg-white/[.045] p-1 transition hover:border-gold/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold/70",
              selectedImage?.src === item.src ? "border-gold/50" : "border-white/10"
            )}
            onClick={() => item.src && setSelectedImage(item)}
            aria-label={item.alt}
            title={item.alt}
          >
            <ProductVisual
              productType={product.productType}
              tone={product.tone}
              imageSrc={item.src || undefined}
              imageAlt={item.alt}
              className="h-full min-h-0 rounded-[6px]"
            />
            <span className="sr-only">{index}</span>
          </button>
        ))}
      </div>
      <div className="order-1 overflow-hidden rounded-premium border border-white/10 bg-white/[.045] lg:order-2">
        <ProductVisual
          productType={product.productType}
          tone={product.tone}
          name={product.name}
          imageSrc={selectedImage?.src}
          imageAlt={selectedImage?.alt}
          className="min-h-[460px] rounded-none"
        />
      </div>
    </div>
  );
}
