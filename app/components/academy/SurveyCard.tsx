import { ClipboardCheck, LockKeyhole } from "lucide-react";

import type { Survey } from "@/lib/academy-data";
import { StatusBadge } from "@/components/academy/StatusBadge";

type SurveyCardProps = {
  survey: Survey;
};

export function SurveyCard({ survey }: SurveyCardProps) {
  const Icon = survey.status === "locked" ? LockKeyhole : ClipboardCheck;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-lg bg-sky-50 p-3 text-sky-700">
          <Icon className="size-5" />
        </span>
        <StatusBadge status={survey.status} />
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-950">{survey.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{survey.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {survey.required ? "Obrigatória" : "Opcional"}
        </span>
        {survey.canSkip ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Pode pular</span> : null}
      </div>
    </article>
  );
}
