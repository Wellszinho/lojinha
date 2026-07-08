import type { Metadata } from "next";

import "@/app/globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { defaultSeo } from "@/lib/seo";

export const metadata: Metadata = defaultSeo;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
