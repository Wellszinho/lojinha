import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { collections } from "@/lib/catalog";

export default function AdminCollectionsPage() {
  return (
    <AdminCrudPage
      eyebrow="Coleções"
      title="Gerenciamento de coleções"
      description="Criar, editar, excluir, destacar, trocar imagem e editar descrição para campanhas e linhas especiais."
      actionLabel="Criar coleção"
      columns={["Nome", "Slug", "Descrição", "Destaque", "Imagem"]}
      rows={collections.map((collection, index) => ({
        Nome: collection.name,
        Slug: collection.slug,
        Descrição: collection.description,
        Destaque: index < 3 ? "Sim" : "Não",
        Imagem: "Configurável"
      }))}
    />
  );
}
