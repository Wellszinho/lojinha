"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { storeMetrics } from "@/lib/catalog";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/magic-the-galo-hero.png"
          alt="Fundo Magic The Galo com fantasia medieval e identidade Magic"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/92 via-obsidian/62 to-obsidian/18" />
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_28%_34%,rgba(215,180,106,.28),transparent_28%),linear-gradient(90deg,rgba(120,82,40,.22)_1px,transparent_1px),linear-gradient(rgba(120,82,40,.16)_1px,transparent_1px)] [background-size:auto,38px_38px,38px_38px]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-obsidian to-transparent" />
      </div>

      <div className="container-shell grid min-h-[640px] items-center gap-10 pb-20 lg:grid-cols-[1fr_.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-premium border border-gold/30 bg-gold/10 px-3 py-2 text-sm font-semibold text-gold">
            <Sparkles className="size-4" />
            Magic: The Gathering
          </div>
          <h1 className="text-4xl font-black leading-tight text-frost sm:text-5xl lg:text-6xl">
            Cartas, acessorios e reliquias para jogadores lendarios.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-mist">
            Singles raras, boosters, displays, sleeves, playmats, deck boxes, ficharios e itens personalizados para
            jogadores e colecionadores de Magic.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/produtos" size="lg">
              Explorar loja <ArrowRight className="size-5" />
            </ButtonLink>
            <ButtonLink href="/cartas-avulsas" variant="secondary" size="lg">
              Ver cartas raras
            </ButtonLink>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {storeMetrics.map((metric) => (
              <div key={metric.label} className="rounded-premium border border-white/10 bg-black/28 p-4 backdrop-blur">
                <strong className="block text-xl font-black text-frost">{metric.value}</strong>
                <span className="mt-1 block text-xs text-mist">{metric.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
