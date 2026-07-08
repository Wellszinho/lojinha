import { CalendarDays, CheckCircle2, ClipboardList, Video } from "lucide-react";

import { Breadcrumb } from "@/components/academy/Breadcrumb";
import { StatusBadge } from "@/components/academy/StatusBadge";
import { fundamentalsCourses, synchronousActivities } from "@/lib/academy-data";

export default function ActivitiesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Breadcrumb items={[{ label: "Atividades" }]} />
      <section>
        <p className="text-sm font-bold text-sky-700">Tarefas e encontros</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Atividades</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Área exclusiva para tarefas, questionários, entregas e atividades síncronas. Os links importantes ficam na ambientação e os certificados ficam em Certificados.
        </p>
      </section>

      <section id="sincronas" className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-sky-50 p-3 text-sky-700">
            <Video className="size-6" />
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-950">Atividades síncronas</h2>
            <p className="text-sm text-slate-600">Participe de pelo menos uma atividade síncrona para avançar na conclusão da Trilha Fundamentos.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {synchronousActivities.map((activity) => (
            <article key={activity.title} className="rounded-lg bg-slate-50 p-4">
              <CalendarDays className="size-5 text-sky-700" />
              <h3 className="mt-3 font-black text-slate-950">{activity.title}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {activity.date} às {activity.time}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">{activity.type}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{activity.status}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-black text-slate-950">Atividades dos cursos</h2>
          <p className="mt-1 text-sm text-slate-600">Questionários e entregas aparecem vinculados ao curso correto.</p>
        </div>
        <div className="divide-y divide-slate-200">
          {fundamentalsCourses.map((course) => (
            <article key={course.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="font-black text-slate-950">{course.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {course.activities.map((activity) => (
                    <span key={activity} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      <ClipboardList className="size-3.5" />
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
              <StatusBadge status={course.status} />
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex gap-3">
          <CheckCircle2 className="mt-1 size-5 shrink-0 text-emerald-700" />
          <p className="text-sm leading-6 text-slate-700">
            Regras simuladas: atividades síncronas contam para conclusão da trilha; avaliações finais contam para conclusão de curso; certificados não aparecem como cursos.
          </p>
        </div>
      </section>
    </div>
  );
}
