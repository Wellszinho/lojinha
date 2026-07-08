import { Breadcrumb } from "@/components/academy/Breadcrumb";
import { TrailCard } from "@/components/academy/TrailCard";
import { trails } from "@/lib/academy-data";

const organization = [
  ["Ambientação", "Links de grupo, cronograma, suporte e orientações iniciais."],
  ["Cursos", "Conteúdos de aprendizagem e aulas organizadas por sequência."],
  ["Atividades", "Tarefas, questionários, entregas e encontros síncronos."],
  ["Certificados", "Certificados de cursos e trilhas, com requisitos claros."],
  ["Avisos", "Comunicados importantes sem repetir os mesmos links em várias telas."]
];

export default function MyTrailsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Breadcrumb items={[{ label: "Minhas Trilhas" }]} />
      <section>
        <p className="text-sm font-bold text-sky-700">Sua jornada</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Minhas Trilhas</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          A Trilha Fundamentos é o ponto de partida. A Trilha Edge AI fica separada para conteúdos avançados e complementares.
        </p>
      </section>
      <section className="grid gap-5">
        {trails.map((trail, index) => (
          <TrailCard key={trail.id} trail={trail} primary={index === 0} />
        ))}
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Como a informação está organizada</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {organization.map(([title, description]) => (
            <article key={title} className="rounded-lg bg-slate-50 p-4">
              <h3 className="font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
