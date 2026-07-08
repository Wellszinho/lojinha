import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-3 text-xs font-bold uppercase text-gold">{eyebrow}</p>
        ) : null}
        <h2 className="text-2xl font-bold text-frost sm:text-3xl">{title}</h2>
        {description ? <p className="mt-3 text-sm leading-6 text-mist sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
