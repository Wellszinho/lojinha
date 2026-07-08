import type { Metadata } from "next";

import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Política e Termos",
  description: "Política de privacidade, trocas, frete e termos de uso."
};

const sections = [
  ["Privacidade", "Dados de conta, pedidos e pagamentos são tratados para operação da loja e comunicação transacional."],
  ["Trocas", "Produtos com defeito podem ser avaliados conforme prazos legais e política comercial da loja."],
  ["Frete", "Prazos e valores são calculados por provedor integrado ou regra personalizada configurada no painel."],
  ["Termos", "O uso da plataforma pressupõe concordância com cadastro correto, pagamento válido e respeito às regras da loja."]
];

export default function PolicyPage() {
  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader eyebrow="Política" title="Política, termos e operação da loja." />
        <div className="grid gap-4">
          {sections.map(([title, text]) => (
            <article key={title} id={title === "Termos" ? "termos" : undefined} className="rounded-premium border border-white/10 bg-white/[.045] p-5">
              <h2 className="font-bold text-frost">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-mist">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
