import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";

import type { Course } from "@/lib/academy-data";
import { academyPath } from "@/lib/academy-data";
import { ProgressBar } from "@/components/academy/ProgressBar";

type NextStepCardProps = {
  course: Course;
};

export function NextStepCard({ course }: NextStepCardProps) {
  return (
    <article className="rounded-lg border border-sky-100 bg-gradient-to-br from-sky-700 to-slate-950 p-6 text-white shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-sky-100">
            <PlayCircle className="size-4" />
            Seu próximo passo
          </p>
          <h2 className="mt-3 text-2xl font-black">{course.title}</h2>
          <p className="mt-2 text-sm leading-6 text-sky-100">
            Continue de onde parou. Finalize esta etapa para liberar o próximo conteúdo da Trilha Fundamentos.
          </p>
          <div className="mt-5 max-w-md">
            <ProgressBar value={course.progress} label="Progresso atual" className="[&_*]:text-white [&>div:last-child]:bg-white/20" />
          </div>
        </div>
        <Link
          href={academyPath(`/trilha-fundamentos/${course.slug}`)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-black text-sky-800 transition hover:bg-sky-50"
        >
          Continuar de onde parei
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
