import type { ImportantLink } from "@/lib/academy-data";
import { LinkImportanteCard } from "@/components/academy/LinkImportanteCard";

type ImportantLinksProps = {
  links: ImportantLink[];
};

export function ImportantLinks({ links }: ImportantLinksProps) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-xl font-black text-slate-950">Links importantes</h2>
        <p className="text-sm text-slate-600">Centralizados aqui para evitar repetição entre páginas e facilitar o acesso.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <LinkImportanteCard key={link.title} link={link} />
        ))}
      </div>
    </section>
  );
}
