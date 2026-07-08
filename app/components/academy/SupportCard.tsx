import Link from "next/link";
import { Mail, MessageSquareText } from "lucide-react";

import { academyPath, support } from "@/lib/academy-data";

export function SupportCard() {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <span className="inline-flex rounded-lg bg-emerald-50 p-3 text-emerald-700">
        <MessageSquareText className="size-6" />
      </span>
      <h2 className="mt-4 text-xl font-black text-slate-950">Precisa de ajuda?</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Para dúvidas técnicas, administrativas, acesso à plataforma ou certificados, fale com a equipe de suporte.
      </p>
      <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
        Tempo médio de resposta: <strong className="text-slate-950">{support.responseTime}</strong>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <a
          href={`mailto:${support.email}`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 text-sm font-bold text-white transition hover:bg-sky-800"
        >
          <Mail className="size-4" />
          Enviar e-mail
        </a>
        <Link
          href={academyPath("/suporte")}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
        >
          Ver central de suporte
        </Link>
      </div>
    </article>
  );
}
