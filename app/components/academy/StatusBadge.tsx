import type { Status } from "@/lib/academy-data";
import { getStatusLabel } from "@/lib/academy-data";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: Status;
  className?: string;
};

const variants: Record<Status, string> = {
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "in-progress": "border-sky-200 bg-sky-50 text-sky-700",
  locked: "border-slate-200 bg-slate-100 text-slate-500",
  "not-started": "border-slate-200 bg-white text-slate-600"
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold", variants[status], className)}>
      {getStatusLabel(status)}
    </span>
  );
}
