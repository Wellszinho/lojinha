import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { categories } from "@/lib/catalog";

export default function AdminCategoriesPage() {
  return (
    <AdminCrudPage
      eyebrow="Taxonomia"
      title="Gerenciamento de categorias"
      description="Criar, editar, excluir, ordenar, adicionar imagem e descrição para cada categoria."
      actionLabel="Criar categoria"
      columns={["Nome", "Slug", "Produtos", "Ordenação", "Imagem"]}
      rows={categories.map((category, index) => ({
        Nome: category.name,
        Slug: category.slug,
        Produtos: String(category.productCount),
        Ordenação: String(index + 1),
        Imagem: "Configurável"
      }))}
    />
  );
}
