import Link from "next/link";
import { Award, LockKeyhole } from "lucide-react";

import type { Certificate } from "@/lib/academy-data";
import { StatusBadge } from "@/components/academy/StatusBadge";

type CertificateCardProps = {
  certificate: Certificate;
};

export function CertificateCard({ certificate }: CertificateCardProps) {
  const Icon = certificate.status === "locked" ? LockKeyhole : Award;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-lg bg-slate-100 p-3 text-slate-700">
          <Icon className="size-5" />
        </span>
        <StatusBadge status={certificate.status} />
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-950">{certificate.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{certificate.description}</p>
      <Link
        href={certificate.href}
        className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
      >
        Ver requisitos
      </Link>
    </article>
  );
}
