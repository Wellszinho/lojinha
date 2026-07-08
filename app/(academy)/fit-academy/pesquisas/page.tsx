import { ClipboardCheck, Info } from "lucide-react";

import { Breadcrumb } from "@/components/academy/Breadcrumb";
import { SurveyCard } from "@/components/academy/SurveyCard";
import { surveys } from "@/lib/academy-data";

export default function SurveysPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Breadcrumb items={[{ label: "Pesquisas" }]} />
      <section>
        <p className="text-sm font-bold text-sky-700">Feedback da jornada</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Pesquisas</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          As pesquisas da Trilha Fundamentos ficam na conclusão da trilha, não na área de boas-vindas. Assim o início da jornada permanece orientativo e sem distrações.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {surveys.map((survey) => (
          <SurveyCard key={survey.id} survey={survey} />
        ))}
      </section>
      <section className="rounded-lg border border-sky-200 bg-sky-50 p-5">
        <div className="flex gap-3">
          <Info className="mt-1 size-5 shrink-0 text-sky-700" />
          <div>
            <h2 className="font-black text-slate-950">Fluxo simulado</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              O aluno conclui os cursos obrigatórios, responde à pesquisa geral, decide se responde ou pula a pesquisa opcional de perfil e então emite o certificado final.
            </p>
          </div>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <ClipboardCheck className="size-6 text-emerald-700" />
        <h2 className="mt-4 text-lg font-black text-slate-950">Sem duplicidade com cursos</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Pesquisas aparecem como requisito de conclusão, não como curso comum. Isso evita que o aluno confunda avaliação da experiência com conteúdo de aprendizagem.
        </p>
      </section>
    </div>
  );
}
