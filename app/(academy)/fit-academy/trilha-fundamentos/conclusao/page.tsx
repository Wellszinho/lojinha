import { Breadcrumb } from "@/components/academy/Breadcrumb";
import { CertificateCard } from "@/components/academy/CertificateCard";
import { CompletionSection } from "@/components/academy/CompletionSection";
import { SurveyCard } from "@/components/academy/SurveyCard";
import { academyPath, areFundamentalsCompleted, certificates, surveys } from "@/lib/academy-data";

const finalCertificate = certificates.find((certificate) => certificate.id === "cert-fundamentals");

export default function FundamentalsCompletionPage() {
  const unlocked = areFundamentalsCompleted();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Breadcrumb
        items={[
          { label: "Minhas Trilhas", href: academyPath("/minhas-trilhas") },
          { label: "Trilha Fundamentos", href: academyPath("/trilha-fundamentos") },
          { label: "Conclusão da Trilha" }
        ]}
      />
      <section>
        <p className="text-sm font-bold text-sky-700">Etapa final</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Conclusão da Trilha</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Esta seção não é um curso. Ela concentra as pesquisas finais e a emissão do certificado completo da Trilha Fundamentos.
        </p>
      </section>
      <CompletionSection unlocked={unlocked} />
      <section className="grid gap-4 md:grid-cols-3">
        {surveys.map((survey) => (
          <SurveyCard key={survey.id} survey={survey} />
        ))}
        {finalCertificate ? <CertificateCard certificate={finalCertificate} /> : null}
      </section>
    </div>
  );
}
