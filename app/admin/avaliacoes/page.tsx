import { AdminCrudPage } from "@/components/admin/AdminCrudPage";

const reviews = [
  ["Rafael M.", "Arcane Vault Pro", "5", "Aprovar", "Destacada"],
  ["Bianca S.", "Summoner Duo Box", "5", "Aprovada", "Normal"],
  ["Leonardo A.", "Neon Sideboard Case", "4", "Responder", "Normal"]
];

export default function AdminReviewsPage() {
  return (
    <AdminCrudPage
      eyebrow="Avaliações"
      title="Moderação de avaliações"
      description="Aprovar, excluir, responder e destacar avaliações com fotos, estrelas e comentários."
      actionLabel="Criar resposta"
      columns={["Cliente", "Produto", "Estrelas", "Status", "Destaque"]}
      rows={reviews.map(([customer, product, rating, status, highlight]) => ({
        Cliente: customer,
        Produto: product,
        Estrelas: rating,
        Status: status,
        Destaque: highlight
      }))}
    />
  );
}
