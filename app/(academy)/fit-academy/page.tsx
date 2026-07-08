import Link from "next/link";
import { ArrowRight, Bell, CheckCircle2 } from "lucide-react";

import { DashboardCard } from "@/components/academy/DashboardCard";
import { ImportantLinks } from "@/components/academy/ImportantLinks";
import { NextStepCard } from "@/components/academy/NextStepCard";
import { ProgressBar } from "@/components/academy/ProgressBar";
import { StatusBadge } from "@/components/academy/StatusBadge";
import { TrailCard } from "@/components/academy/TrailCard";
import { academyPath, academyUser, announcements, dashboardMetrics, getRecommendedCourse, importantLinks, quickAccess, trails } from "@/lib/academy-data";

export default function DashboardPage() {
  const recommendedCourse = getRecommendedCourse();
  const fundamentalsTrail = trails[0];
  const edgeTrail = trails[1];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-lg bg-gradient-to-br from-slate-950 via-sky-950 to-sky-800 p-6 text-white shadow-sm lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <p className="text-sm font-bold text-sky-100">Olá, {academyUser.name.split(" ")[0]}.</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-normal md:text-4xl">
              Bem-vindo à sua jornada de aprendizagem.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-sky-100">
              Acesse suas trilhas, continue cursos, acompanhe atividades síncronas e saiba exatamente o que fazer a seguir.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-5">
            <p className="text-sm font-bold text-sky-100">Trilha principal</p>
            <h2 className="mt-2 text-2xl font-black">{fundamentalsTrail.title}</h2>
            <div className="mt-5">
              <ProgressBar value={fundamentalsTrail.progress} label="Progresso" className="[&_*]:text-white [&>div:last-child]:bg-white/20" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <span className="rounded-lg bg-white/10 p-3">
                <strong className="block text-xl">{fundamentalsTrail.completedCourses}/{fundamentalsTrail.totalCourses}</strong>
                cursos concluídos
              </span>
              <span className="rounded-lg bg-white/10 p-3">
                <strong className="block text-xl">Curso 1</strong>
                próximo passo
              </span>
            </div>
            <Link
              href={academyPath(`/trilha-fundamentos/${recommendedCourse.slug}`)}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-black text-sky-800 transition hover:bg-sky-50"
            >
              Continuar de onde parei
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <DashboardCard key={metric.label} title={metric.label} value={metric.value} icon={metric.icon} />
        ))}
      </section>

      <NextStepCard course={recommendedCourse} />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <TrailCard trail={fundamentalsTrail} primary />
          <TrailCard trail={edgeTrail} />
        </div>
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-amber-50 p-3 text-amber-700">
              <Bell className="size-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-950">Avisos importantes</h2>
              <p className="text-sm text-slate-600">Comunicados, atividades síncronas e suporte em um só lugar.</p>
            </div>
          </div>
          <div className="mt-5 divide-y divide-slate-200">
            {announcements.map((announcement) => (
              <Link key={announcement.title} href={announcement.href} className="block py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-950">{announcement.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{announcement.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{announcement.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">Acesso rápido</h2>
            <p className="text-sm text-slate-600">Principais ações para seguir sem procurar em várias páginas.</p>
          </div>
          <StatusBadge status="in-progress" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {quickAccess.map((item) => {
            const Icon = item.icon;
            const external = item.href.startsWith("http");
            const className =
              "flex min-h-28 flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-sky-200 hover:shadow-md";
            const content = (
              <>
                <Icon className="size-5 text-sky-700" />
                <span className="mt-5 text-sm font-black text-slate-950">{item.title}</span>
              </>
            );

            return external ? (
              <a key={item.title} href={item.href} target="_blank" rel="noreferrer" className={className}>
                {content}
              </a>
            ) : (
              <Link key={item.title} href={item.href} className={className}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <ImportantLinks links={importantLinks} />
        <aside className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
          <CheckCircle2 className="size-6 text-emerald-700" />
          <h2 className="mt-4 text-lg font-black text-slate-950">Organização sem duplicidade</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Ambientação guarda links iniciais, cursos guardam aprendizagem, atividades guardam tarefas, certificados guardam emissão e avisos guardam comunicados.
          </p>
        </aside>
      </section>
    </div>
  );
}
