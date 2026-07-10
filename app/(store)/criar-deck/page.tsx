import type { Metadata } from "next";

import { DeckBuilderClient } from "@/components/deck-builder/DeckBuilderClient";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Criar Deck",
  description:
    "Deck Builder inteligente da Magic The Galo para escolher identidade de cores, comandante, arquetipo, estilo e preferencias de Commander."
};

export default function DeckBuilderPage() {
  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader
          eyebrow="IA para Commander"
          title="Criar Deck"
          description="Configure identidade de cores, comandante, arquetipos, estilo de jogo e preferencias para montar a base do seu deck ideal."
        />
        <DeckBuilderClient />
      </div>
    </section>
  );
}
