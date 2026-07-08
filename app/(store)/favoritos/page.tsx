import type { Metadata } from "next";

import { FavoritesClient } from "@/components/commerce/FavoritesClient";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Produtos salvos pelo cliente."
};

export default function FavoritesPage() {
  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader eyebrow="Favoritos" title="Sua lista de produtos salvos." />
        <FavoritesClient />
      </div>
    </section>
  );
}
