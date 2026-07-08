import { ChevronDown, ExternalLink, LifeBuoy, Mail } from "lucide-react";

import { Breadcrumb } from "@/components/academy/Breadcrumb";
import { ImportantLinks } from "@/components/academy/ImportantLinks";
import { SupportCard } from "@/components/academy/SupportCard";
import { importantLinks, support } from "@/lib/academy-data";

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Breadcrumb items={[{ label: "Suporte" }]} />
      <section>
        <p className="text-sm font-bold text-sky-700">Central de ajuda</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Suporte</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Página simples para tirar dúvidas, abrir contato e encontrar links úteis sem repetir informação nas telas de curso.
        </p>
      </section>
      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <SupportCard />
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <LifeBuoy className="size-6 text-sky-700" />
            <h2 className="text-xl font-black text-slate-950">FAQ</h2>
          </div>
          <div className="mt-5 divide-y divide-slate-200">
            {support.faq.map((item) => (
              <details key={item.question} className="group py-4 first:pt-0 last:pb-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-slate-950">
                  {item.question}
                  <ChevronDown className="size-4 text-slate-400 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </article>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Contato direto</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Informe seu nome, turma, curso e uma descrição objetiva do problema.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={`mailto:${support.email}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 text-sm font-bold text-white transition hover:bg-sky-800"
          >
            <Mail className="size-4" />
            {support.email}
          </a>
          <a
            href="https://fit-tecnologia.org.br/ava/user/contactsitesupport.php"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
          >
            Contate o suporte do site
            <ExternalLink className="size-4" />
          </a>
        </div>
      </section>
      <ImportantLinks links={importantLinks} />
    </div>
  );
}
