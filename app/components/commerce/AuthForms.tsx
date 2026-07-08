"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false
    });

    setLoading(false);
    if (response?.error) {
      setError("Email ou senha inválidos.");
      return;
    }
    router.push("/minha-conta");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-premium border border-white/10 bg-white/[.045] p-6">
      <h1 className="text-2xl font-black text-frost">Entrar</h1>
      <div className="mt-6 grid gap-4">
        <input name="email" type="email" required placeholder="Email" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
        <input name="password" type="password" required placeholder="Senha" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
      </div>
      {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
      <Button className="mt-6 w-full" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
      <Link href="/api/auth/signin" className="mt-4 block text-center text-sm text-mist hover:text-gold">
        Recuperar senha
      </Link>
    </form>
  );
}

export function RegisterForm() {
  return (
    <form className="rounded-premium border border-white/10 bg-white/[.045] p-6">
      <h1 className="text-2xl font-black text-frost">Cadastro</h1>
      <div className="mt-6 grid gap-4">
        <input name="name" required placeholder="Nome completo" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
        <input name="email" type="email" required placeholder="Email" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
        <input name="phone" required placeholder="Telefone" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
        <input name="password" type="password" required placeholder="Senha" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
      </div>
      <Button className="mt-6 w-full">Criar conta</Button>
    </form>
  );
}
