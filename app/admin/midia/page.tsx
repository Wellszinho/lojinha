import { AdminCrudPage } from "@/components/admin/AdminCrudPage";

const media = [
  ["magic-the-galo-hero.png", "PNG", "2.4 MB", "Hero", "03/07/2026"],
  ["arcane-vault.webm", "Video", "8.4 MB", "Produto", "01/07/2026"],
  ["magic-the-galo-logo.png", "PNG", "1.7 MB", "Marca", "02/07/2026"]
];

export default function AdminMediaPage() {
  return (
    <AdminCrudPage
      eyebrow="Midia"
      title="Biblioteca de arquivos"
      description="Upload e reutilizacao de PNG, JPG, WEBP, SVG e videos. A API valida tipo, tamanho e grava em public/uploads."
      actionLabel="Enviar arquivo"
      columns={["Arquivo", "Tipo", "Tamanho", "Uso", "Data"]}
      rows={media.map(([file, type, size, usage, date]) => ({
        Arquivo: file,
        Tipo: type,
        Tamanho: size,
        Uso: usage,
        Data: date
      }))}
    />
  );
}
