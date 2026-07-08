import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "border-gold/40 bg-gold text-obsidian shadow-[0_0_28px_rgba(215,180,106,.22)] hover:bg-[#e4c77d]",
  secondary:
    "border-white/10 bg-white/[.07] text-frost hover:border-violet/60 hover:bg-violet/15",
  ghost: "border-transparent bg-transparent text-mist hover:bg-white/[.06] hover:text-frost",
  danger: "border-red-400/30 bg-red-500/12 text-red-100 hover:bg-red-500/20"
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base"
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-premium border font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-gold/60 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
};

export function ButtonLink({ href, children, className, onClick, variant = "primary", size = "md" }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-premium border font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-gold/60",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </Link>
  );
}
