import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Trophy } from "lucide-react";

import { academyPath, certificates, surveys } from "@/lib/academy-data";
import { CertificateCard } from "@/components/academy/CertificateCard";
import { SurveyCard } from "@/components/academy/SurveyCard";

type CompletionSectionProps = {
  unlocked: boolean;
};

export function CompletionSection({ unlocked }: CompletionSectionProps) {
  const finalCertificate = certificates.find((certificate) => certificate.id === "cert-fundamentals");

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className={unlocked ? "inline-flex rounded-lg bg-emerald-50 p-3 text-emerald-700" : "inline-flex rounded-lg bg-slate-100 p-3 text-slate-500"}>
            {unlocked ? <Trophy className="size-6" /> : <LockKeyhole className="size-6" />}
          </span>
          <h2 className="mt-4 text-2xl font-black text-slate-950">Conclusão da Trilha</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {unlocked
              ? "Parabéns, você concluiu os cursos obrigatórios. Responda a pesquisa geral, escolha se deseja preencher o perfil opcional e emita seu certificado final."
              : "Conclua todos os cursos obrigatórios da Trilha Fundamentos para liberar a pesquisa geral, a pesquisa opcional de perfil e o certificado final."}
          </p>
          <div className="mt-5 grid gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              Pesquisa geral obrigatória
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              Pesquisa opcional de perfil do aluno
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              Emissão do certificado da Trilha Fundamentos
            </span>
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-500">Status atual</p>
          <strong className="mt-2 block text-3xl font-black text-slate-950">{unlocked ? "Liberado" : "Bloqueado"}</strong>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {unlocked ? "Você está quase lá: finalize as etapas abaixo." : "A conclusão será liberada automaticamente quando os requisitos forem atendidos."}
          </p>
          <Link
            href={academyPath("/trilha-fundamentos/conclusao")}
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 text-sm font-bold text-white transition hover:bg-sky-800"
          >
            Ver conclusão
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {surveys.map((survey) => (
          <SurveyCard key={survey.id} survey={survey} />
        ))}
        {finalCertificate ? <CertificateCard certificate={finalCertificate} /> : null}
      </div>
    </section>
  );
}
