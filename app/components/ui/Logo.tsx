import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <Link href="/" className={cn("group inline-flex min-w-0 items-center gap-3", className)} aria-label="Magic The Galo">
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-premium border border-gold/35 bg-black/35 shadow-glow",
          compact ? "size-11" : "size-12"
        )}
      >
        <Image
          src="/images/magic-the-galo-logo.png"
          alt=""
          width={compact ? 44 : 48}
          height={compact ? 44 : 48}
          className="h-full w-full object-cover"
          priority
          unoptimized
        />
      </span>
      {!compact ? (
        <span className="min-w-0 leading-none">
          <span className="block truncate text-sm font-black uppercase text-frost">Magic The Galo</span>
          <span className="mt-1 block truncate text-[11px] font-medium text-mist">Cartas, acessorios e reliquias.</span>
        </span>
      ) : null}
    </Link>
  );
}
