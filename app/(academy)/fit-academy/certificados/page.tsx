import { Award, LockKeyhole } from "lucide-react";

import { Breadcrumb } from "@/components/academy/Breadcrumb";
import { CertificateCard } from "@/components/academy/CertificateCard";
import { certificates } from "@/lib/academy-data";

export default function CertificatesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Breadcrumb items={[{ label: "Certificados" }]} />
      <section>
        <p className="text-sm font-bold text-sky-700">Emissão e requisitos</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Certificados</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Certificados ficam centralizados aqui. O certificado final da Trilha Fundamentos só aparece após todos os cursos obrigatórios e a etapa de conclusão.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {certificates.map((certificate) => (
          <CertificateCard key={certificate.id} certificate={certificate} />
        ))}
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <Award className="size-6 text-sky-700" />
          <h2 className="mt-4 text-lg font-black text-slate-950">Certificado individual</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Aparece ao concluir todas as aulas e a avaliação final do curso correspondente.</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <LockKeyhole className="size-6 text-slate-600" />
          <h2 className="mt-4 text-lg font-black text-slate-950">Certificado da trilha completa</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Fica bloqueado até a conclusão dos cursos obrigatórios e da pesquisa geral da trilha.</p>
        </article>
      </section>
    </div>
  );
}
