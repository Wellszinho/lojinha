import type { ProductType } from "@/lib/catalog";
import { productTypeLabels } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ProductVisualProps = {
  tone: string;
  name?: string;
  productType?: ProductType;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

function CardRelic() {
  return (
    <div className="absolute inset-[18%_30%_18%_30%] rounded-[7px] border border-gold/45 bg-gradient-to-br from-black/70 via-violet/25 to-gold/20 shadow-[0_22px_60px_rgba(0,0,0,.45)]">
      <div className="m-2 h-16 rounded-[6px] border border-white/10 bg-gradient-to-br from-gold/25 via-sky-300/15 to-violet/20" />
      <div className="mx-3 mt-4 h-2 rounded-full bg-white/25" />
      <div className="mx-3 mt-2 h-2 w-2/3 rounded-full bg-white/15" />
      <div className="absolute -right-5 top-8 h-28 w-2 rounded-full bg-gold/70 blur-[1px]" />
    </div>
  );
}

function DeckBoxRelic() {
  return (
    <>
      <div className="absolute inset-[22%_24%_18%_26%] rounded-premium border border-gold/35 bg-gradient-to-br from-white/12 via-zinc-900 to-black shadow-[0_24px_60px_rgba(0,0,0,.48)] [transform:perspective(520px)_rotateY(-18deg)_rotateX(6deg)]" />
      <div className="absolute bottom-[18%] right-[11%] h-[34%] w-[44%] rounded-premium border border-white/12 opacity-80 [background:repeating-linear-gradient(90deg,rgba(248,250,252,.30)_0_2px,rgba(248,250,252,.06)_2px_10px)] [transform:perspective(520px)_rotateY(-22deg)_rotateX(12deg)]" />
    </>
  );
}

function SealedRelic() {
  return (
    <div className="absolute inset-[15%_27%_16%_27%] rounded-[9px] border border-gold/35 bg-gradient-to-br from-gold/25 via-violet/35 to-black shadow-[0_24px_70px_rgba(0,0,0,.45)] [transform:perspective(520px)_rotateZ(-5deg)]">
      <div className="absolute inset-x-3 top-4 h-10 rounded-[6px] border border-white/10 bg-black/35" />
      <div className="absolute inset-x-5 bottom-5 grid gap-2">
        <span className="h-2 rounded-full bg-white/25" />
        <span className="h-2 w-2/3 rounded-full bg-gold/45" />
      </div>
    </div>
  );
}

function AccessoryRelic() {
  return (
    <>
      <div className="absolute inset-x-[18%] bottom-[18%] h-[38%] rounded-[8px] border border-gold/30 bg-gradient-to-br from-black/55 via-violet/20 to-gold/10 shadow-[0_20px_60px_rgba(0,0,0,.45)] [transform:perspective(600px)_rotateX(55deg)]" />
      <div className="absolute left-[22%] top-[24%] grid size-16 place-items-center rounded-premium border border-gold/40 bg-black/45 text-lg font-black text-gold shadow-glow">
        D20
      </div>
      <div className="absolute right-[23%] top-[31%] h-20 w-14 rounded-[6px] border border-white/15 bg-gradient-to-br from-white/10 to-violet/30" />
    </>
  );
}

export function ProductVisual({ tone, name, productType = "deck-box", imageSrc, imageAlt, className }: ProductVisualProps) {
  const isCard = productType === "carta-avulsa";
  const isSealed = productType === "booster" || productType === "display";
  const isDeckBox = productType === "deck-box" || productType === "produto-personalizado";

  return (
    <div className={cn("relative isolate min-h-[220px] overflow-hidden rounded-premium bg-obsidian", className)}>
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt ?? name ?? productTypeLabels[productType]}
          fill
          unoptimized
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-cover"
        />
      ) : null}
      <div className={cn("absolute inset-0 bg-gradient-to-br", tone, imageSrc ? "opacity-30" : "opacity-100")} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_28%,rgba(215,180,106,.22),transparent_28%),linear-gradient(135deg,rgba(94,64,32,.20),transparent_35%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,rgba(215,180,106,.10)_1px,transparent_1px),linear-gradient(rgba(215,180,106,.08)_1px,transparent_1px)] [background-size:22px_22px]" />

      {imageSrc ? null : isCard ? <CardRelic /> : isSealed ? <SealedRelic /> : isDeckBox ? <DeckBoxRelic /> : <AccessoryRelic />}

      <div className="absolute left-5 top-5 rounded-premium border border-white/10 bg-black/35 px-3 py-1 text-xs font-semibold text-frost backdrop-blur">
        {productTypeLabels[productType]}
      </div>
      {name ? (
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
          <span className="max-w-[12rem] text-sm font-bold text-frost">{name}</span>
          <span className="h-2 w-12 rounded-full bg-gold/80 shadow-[0_0_16px_rgba(215,180,106,.55)]" />
        </div>
      ) : null}
    </div>
  );
}
