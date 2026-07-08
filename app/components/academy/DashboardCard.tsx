import type { LucideIcon } from "lucide-react";

type DashboardCardProps = {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
};

export function DashboardCard({ title, value, description, icon: Icon }: DashboardCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <strong className="mt-2 block text-3xl font-black text-slate-950">{value}</strong>
        </div>
        <span className="rounded-lg bg-sky-50 p-3 text-sky-700">
          <Icon className="size-5" />
        </span>
      </div>
      {description ? <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p> : null}
    </article>
  );
}
