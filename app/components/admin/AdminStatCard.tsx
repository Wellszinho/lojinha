import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
};

export function AdminStatCard({ icon: Icon, label, value, trend }: AdminStatCardProps) {
  return (
    <article className="rounded-premium border border-white/10 bg-white/[.045] p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="grid size-11 place-items-center rounded-premium border border-gold/30 bg-gold/10 text-gold">
          <Icon className="size-5" />
        </span>
        {trend ? <span className="rounded-premium bg-emerald/10 px-2 py-1 text-xs font-bold text-emerald">{trend}</span> : null}
      </div>
      <p className="mt-5 text-sm text-mist">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-frost">{value}</strong>
    </article>
  );
}
