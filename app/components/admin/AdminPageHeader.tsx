import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/Button";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  children?: ReactNode;
};

export function AdminPageHeader({ eyebrow, title, description, actionLabel, actionHref, children }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-bold uppercase text-gold">{eyebrow}</p> : null}
        <h1 className="text-3xl font-black text-frost">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-mist">{description}</p> : null}
      </div>
      {children ? children : actionHref && actionLabel ? <ButtonLink href={actionHref}>{actionLabel}</ButtonLink> : null}
    </div>
  );
}
