import type { Metadata } from "next";

import { DeckAnalyzerClient } from "@/components/deck-analyzer/DeckAnalyzerClient";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Analisador de Deck",
  description:
    "Analisador de decks de Magic com importacao por texto, arquivo ou link do Liga Magic e relatorio estrategico com graficos, matchups, combos e upgrades."
};

export default function DeckAnalyzerPage() {
  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Premium"
          title="Analisador de Deck"
          description="Escolha o jogo e o formato, importe uma lista e receba leitura de power level, curva, papeis, combos, matchups, counters e melhorias."
        />
        <DeckAnalyzerClient />
      </div>
    </section>
  );
}
