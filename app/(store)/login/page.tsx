import Link from "next/link";
import type { Metadata } from "next";

import { LoginForm } from "@/components/commerce/AuthForms";

export const metadata: Metadata = {
  title: "Login",
  description: "Acesse sua conta Magic The Galo."
};

export default function LoginPage() {
  return (
    <section className="section-band pt-32">
      <div className="container-shell grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <LoginForm />
        <div className="rounded-premium border border-white/10 bg-gradient-to-br from-gold/12 via-violet/12 to-white/[.04] p-6">
          <h2 className="text-2xl font-black text-frost">Conta Magic The Galo</h2>
          <p className="mt-4 text-sm leading-6 text-mist">
            A conta do cliente centraliza pedidos, favoritos, endereços, dados pessoais e alteração de senha.
          </p>
          <Link href="/cadastro" className="mt-6 inline-flex font-semibold text-gold hover:text-[#e4c77d]">
            Criar cadastro
          </Link>
        </div>
      </div>
    </section>
  );
}
