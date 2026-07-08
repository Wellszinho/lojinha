import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Award, BookOpen, CheckCircle2, Clock3 } from "lucide-react";

import { Breadcrumb } from "@/components/academy/Breadcrumb";
import { ProgressBar } from "@/components/academy/ProgressBar";
import { StatusBadge } from "@/components/academy/StatusBadge";
import { academyPath, fundamentalsCourses, getCourseBySlug, getNextCourse } from "@/lib/academy-data";

export function generateStaticParams() {
  return fundamentalsCourses.map((course) => ({ courseSlug: course.slug }));
}

export default async function CoursePage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  if (!course) notFound();

  const nextCourse = getNextCourse(course);
  const courseCompleted = course.lessons.every((lesson) => lesson.status === "completed");

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Breadcrumb
        items={[
          { label: "Minhas Trilhas", href: academyPath("/minhas-trilhas") },
          { label: "Trilha Fundamentos", href: academyPath("/trilha-fundamentos") },
          { label: `Curso ${course.sequence}` }
        ]}
      />

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">Curso {course.sequence}</span>
            <h1 className="mt-3 text-3xl font-black text-slate-950">{course.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{course.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <StatusBadge status={course.status} />
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
                <Clock3 className="size-3.5" />
                {course.estimatedTime}
              </span>
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-5">
            <ProgressBar value={course.progress} label="Progresso do curso" />
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Curso só será marcado como concluído quando todas as aulas e a avaliação final estiverem concluídas.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-black text-slate-950">Aulas e módulos</h2>
            <p className="mt-1 text-sm text-slate-600">Siga a sequência abaixo para avançar com clareza.</p>
          </div>
          <div className="divide-y divide-slate-200">
            {course.lessons.map((lesson) => (
              <article key={lesson.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                <div className="flex gap-4">
                  <span className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-700">
                    {lesson.status === "completed" ? <CheckCircle2 className="size-5 text-emerald-600" /> : <BookOpen className="size-5" />}
                  </span>
                  <div>
                    <h3 className="font-black text-slate-950">{lesson.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{lesson.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1">{lesson.type}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">{lesson.duration}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={lesson.status} />
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Materiais complementares</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {course.materials.map((material) => (
                <li key={material} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-500" />
                  {material}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Atividades relacionadas</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {course.activities.map((activity) => (
                <li key={activity} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-sky-600" />
                  {activity}
                </li>
              ))}
            </ul>
          </article>
          <Link
            href={academyPath("/trilha-fundamentos")}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
          >
            <ArrowLeft className="size-4" />
            Voltar para Trilha Fundamentos
          </Link>
        </aside>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              {courseCompleted ? "Parabéns, você concluiu este curso" : "Finalize esta etapa para liberar o próximo conteúdo"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {courseCompleted
                ? "Agora você pode emitir o certificado do curso e seguir para a próxima etapa da trilha."
                : "O certificado individual fica disponível após todas as aulas, atividades e avaliação final do curso."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={!courseCompleted}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Award className="size-4" />
              Emitir certificado do curso
            </button>
            <Link
              href={nextCourse ? academyPath(`/trilha-fundamentos/${nextCourse.slug}`) : academyPath("/trilha-fundamentos/conclusao")}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-sky-700 px-5 text-sm font-black text-white transition hover:bg-sky-800"
            >
              {nextCourse ? "Ir para o próximo curso" : "Finalizar Trilha Fundamentos"}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
