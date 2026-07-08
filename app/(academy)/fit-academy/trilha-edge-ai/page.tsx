import { Award, Bell, BookOpen, FileText } from "lucide-react";

import { Breadcrumb } from "@/components/academy/Breadcrumb";
import { ProgressBar } from "@/components/academy/ProgressBar";
import { StatusBadge } from "@/components/academy/StatusBadge";
import { academyPath, edgeAiContents, trails } from "@/lib/academy-data";

export default function EdgeAiTrailPage() {
  const trail = trails[1];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Breadcrumb items={[{ label: "Minhas Trilhas", href: academyPath("/minhas-trilhas") }, { label: "Trilha Edge AI" }]} />
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="text-sm font-bold text-emerald-700">Hub separado de conteúdos avançados</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">Trilha Edge AI</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
              Esta trilha funciona como espaço próprio para conteúdos que não fazem parte da Trilha Fundamentos. Ela reúne cursos avançados, materiais extras, atividades específicas, certificados e avisos próprios.
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-5">
            <ProgressBar value={trail.progress} label="Progresso da trilha" />
            <p className="mt-4 text-sm text-slate-600">{trail.completedCourses}/{trail.totalCourses} conteúdos concluídos.</p>
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {edgeAiContents.map((content) => (
          <article key={content.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
                <BookOpen className="size-5" />
              </span>
              <StatusBadge status={content.status} />
            </div>
            <h2 className="mt-4 text-lg font-black text-slate-950">{content.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{content.description}</p>
            <div className="mt-5">
              <ProgressBar value={content.progress} label={content.estimatedTime} />
            </div>
          </article>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <FileText className="size-6 text-sky-700" />
          <h2 className="mt-4 text-lg font-black text-slate-950">Materiais extras</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Guias de otimização, datasets de sensores, notebooks de visão computacional e referências de SLMs.</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <Bell className="size-6 text-amber-600" />
          <h2 className="mt-4 text-lg font-black text-slate-950">Avisos próprios</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Comunicados desta trilha aparecem aqui, sem misturar com Fundamentos.</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <Award className="size-6 text-emerald-700" />
          <h2 className="mt-4 text-lg font-black text-slate-950">Certificados</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Certificados da Edge AI seguem regras próprias e independentes da conclusão da Trilha Fundamentos.</p>
        </article>
      </section>
    </div>
  );
}
