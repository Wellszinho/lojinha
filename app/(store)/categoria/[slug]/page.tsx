import { notFound } from "next/navigation";

import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductFilters } from "@/components/commerce/ProductFilters";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories, getCategoryBySlug, products } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryProducts = products.filter((product) => product.category === category.slug);

  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader eyebrow="Categoria" title={category.name} description={category.description} />
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <ProductFilters />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
