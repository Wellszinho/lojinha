import type { Metadata } from "next";

import { RegisterForm } from "@/components/commerce/AuthForms";

export const metadata: Metadata = {
  title: "Cadastro",
  description: "Crie sua conta Magic The Galo."
};

export default function RegisterPage() {
  return (
    <section className="section-band pt-32">
      <div className="container-shell max-w-xl">
        <RegisterForm />
      </div>
    </section>
  );
}
