import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Trail } from "@/lib/academy-data";
import { ProgressBar } from "@/components/academy/ProgressBar";
import { StatusBadge } from "@/components/academy/StatusBadge";

type TrailCardProps = {
  trail: Trail;
  primary?: boolean;
};

export function TrailCard({ trail, primary = false }: TrailCardProps) {
  const Icon = trail.icon;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <span className={primary ? "rounded-lg bg-sky-700 p-3 text-white" : "rounded-lg bg-emerald-50 p-3 text-emerald-700"}>
            <Icon className="size-6" />
          </span>
          <div>
            <p className="text-sm font-bold text-sky-700">{trail.subtitle}</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">{trail.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{trail.description}</p>
          </div>
        </div>
        <StatusBadge status={trail.status} />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <ProgressBar value={trail.progress} label={`${trail.completedCourses}/${trail.totalCourses} cursos concluídos`} />
        </div>
        <Link
          href={trail.href}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-sky-700"
        >
          Acessar trilha
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
