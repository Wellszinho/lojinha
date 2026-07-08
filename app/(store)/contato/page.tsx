import { Mail, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Magic The Galo."
};

export default function ContactPage() {
  return (
    <section className="section-band pt-32">
      <div className="container-shell grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <SectionHeader
            eyebrow="Contato"
            title="Fale com a Magic The Galo."
            description="Atendimento para pedidos, personalização, coleções e parcerias."
          />
          <div className="grid gap-3 text-sm text-mist">
            <a href="https://wa.me/5511999999999" className="flex items-center gap-3 rounded-premium border border-white/10 bg-white/[.045] p-4 hover:text-gold">
              <MessageCircle className="size-5 text-gold" /> WhatsApp
            </a>
            <a href="mailto:contato@magicthegalo.com" className="flex items-center gap-3 rounded-premium border border-white/10 bg-white/[.045] p-4 hover:text-gold">
              <Mail className="size-5 text-gold" /> contato@magicthegalo.com
            </a>
            <div className="flex items-center gap-3 rounded-premium border border-white/10 bg-white/[.045] p-4">
              <MapPin className="size-5 text-gold" /> Envio para todo Brasil
            </div>
          </div>
        </div>
        <form className="rounded-premium border border-white/10 bg-white/[.045] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Nome" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
            <input required type="email" placeholder="Email" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
            <input placeholder="Telefone" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50 sm:col-span-2" />
            <textarea required placeholder="Mensagem" rows={7} className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50 sm:col-span-2" />
          </div>
          <Button className="mt-5">Enviar mensagem</Button>
        </form>
      </div>
    </section>
  );
}
