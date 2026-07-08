import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { ProductAdminForm } from "@/components/admin/ProductAdminForm";
import { productTypeLabels, products } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";

export default function AdminProductsPage() {
  return (
    <AdminCrudPage
      eyebrow="Catalogo"
      title="Gerenciamento de produtos"
      description="Cadastrar produtos de Magic: carta avulsa, deck box, sleeve, booster, display, playmat, token, dado, fichario, personalizado ou outro. Cartas, selados e acessorios possuem campos extras dedicados."
      columns={["Nome", "Tipo", "Categoria", "Jogo", "SKU", "Preco", "Estoque", "Status"]}
      rows={products.map((product) => ({
        Nome: product.name,
        Tipo: productTypeLabels[product.productType],
        Categoria: product.category,
        Jogo: product.card?.game ?? product.sealed?.game ?? product.compatibility[0] ?? "-",
        SKU: product.sku,
        Preco: formatMoney(product.price),
        Estoque: String(product.stock),
        Status: "Ativo"
      }))}
    >
      <ProductAdminForm />
    </AdminCrudPage>
  );
}
