import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import type { Course } from "@/lib/academy-data";
import { academyPath } from "@/lib/academy-data";
import { ProgressBar } from "@/components/academy/ProgressBar";
import { StatusBadge } from "@/components/academy/StatusBadge";

type CourseCardProps = {
  course: Course;
};

function getActionLabel(course: Course) {
  if (course.status === "completed") return "Revisar curso";
  if (course.status === "in-progress") return "Continuar curso";
  return "Iniciar curso";
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">Curso {course.sequence}</span>
          <h3 className="mt-3 text-lg font-black text-slate-950">{course.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{course.shortDescription}</p>
        </div>
        <StatusBadge status={course.status} />
      </div>
      <div className="mt-5 space-y-4">
        <ProgressBar value={course.progress} label="Progresso" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Clock3 className="size-4" />
            {course.estimatedTime}
          </span>
          <Link
            href={academyPath(`/trilha-fundamentos/${course.slug}`)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 text-sm font-bold text-white transition hover:bg-sky-800"
          >
            {getActionLabel(course)}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
