import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AcademyShell } from "@/components/academy/AcademyShell";

export const metadata: Metadata = {
  title: {
    absolute: "FIT Academy / AVA 2.0"
  },
  description: "Plataforma de aprendizagem corporativa para trilhas, cursos, atividades, certificados e suporte.",
  openGraph: {
    title: "FIT Academy / AVA 2.0",
    description: "Plataforma de aprendizagem corporativa para trilhas, cursos, atividades, certificados e suporte.",
    siteName: "FIT Academy",
    locale: "pt_BR",
    type: "website"
  }
};

export default function AcademyLayout({ children }: { children: ReactNode }) {
  return <AcademyShell>{children}</AcademyShell>;
}
