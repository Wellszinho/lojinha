import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";

import { AccordionDropdown } from "@/components/academy/AccordionDropdown";
import { Breadcrumb } from "@/components/academy/Breadcrumb";
import { CompletionSection } from "@/components/academy/CompletionSection";
import { CourseList } from "@/components/academy/CourseList";
import { ImportantLinks } from "@/components/academy/ImportantLinks";
import { ProgressBar } from "@/components/academy/ProgressBar";
import { academyPath, areFundamentalsCompleted, fundamentalsCourses, importantLinks, onboardingItems, trails } from "@/lib/academy-data";

export default function FundamentalsTrailPage() {
  const trail = trails[0];
  const firstCourse = fundamentalsCourses[0];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Breadcrumb items={[{ label: "Minhas Trilhas", href: academyPath("/minhas-trilhas") }, { label: "Trilha Fundamentos" }]} />
      <section className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-center">
          <div>
            <p className="text-sm font-bold text-sky-700">Comece sua jornada por aqui</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{trail.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
              Comece por aqui. Esta trilha reúne os conteúdos essenciais para sua ambientação, primeiros passos, cursos obrigatórios, suporte e conclusão da jornada.
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-5">
            <ProgressBar value={trail.progress} label="Progresso da trilha" />
            <p className="mt-4 text-sm text-slate-600">
              {trail.completedCourses}/{trail.totalCourses} cursos concluídos. Seu próximo passo é finalizar o Curso 1.
            </p>
          </div>
        </div>
      </section>

      <AccordionDropdown
        title="Ambientação"
        description="Orientações iniciais, links importantes, cronograma, grupo da turma, atividades síncronas e suporte. Esta área é introdutória e não contém pesquisa de satisfação."
        items={onboardingItems}
      />

      <Link
        href={academyPath(`/trilha-fundamentos/${firstCourse.slug}`)}
        className="flex flex-col gap-4 rounded-lg bg-sky-700 p-6 text-white shadow-sm transition hover:bg-sky-800 sm:flex-row sm:items-center sm:justify-between"
      >
        <span>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-sky-100">
            <PlayCircle className="size-4" />
            Próxima ação recomendada
          </span>
          <strong className="mt-2 block text-2xl font-black">Começar primeiro curso</strong>
        </span>
        <span className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-black text-sky-800">
          Ir para Curso 1
          <ArrowRight className="size-4" />
        </span>
      </Link>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-black text-slate-950">Cursos obrigatórios</h2>
          <p className="mt-1 text-sm text-slate-600">Os cursos foram numerados para deixar a sequência de aprendizagem explícita.</p>
        </div>
        <CourseList courses={fundamentalsCourses} />
      </section>

      <CompletionSection unlocked={areFundamentalsCompleted()} />
      <ImportantLinks links={importantLinks} />
    </div>
  );
}
