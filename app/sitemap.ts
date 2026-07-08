import type { MetadataRoute } from "next";

import { academyPath, fundamentalsCourses } from "@/lib/academy-data";
import { categories, products } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const storeRoutes = [
    "",
    "/deck-analyzer",
    "/marketplace",
    "/produtos",
    "/cartas-avulsas",
    "/deck-boxes",
    "/acessorios",
    "/colecoes",
    "/personalizados",
    "/personalizadas",
    "/carrinho",
    "/checkout",
    "/login",
    "/cadastro",
    "/minha-conta",
    "/pedidos",
    "/favoritos",
    "/contato",
    "/sobre",
    "/politica"
  ];

  const academyRoutes = [
    "",
    "/minhas-trilhas",
    "/trilha-fundamentos",
    "/trilha-fundamentos/conclusao",
    "/trilha-edge-ai",
    "/atividades",
    "/certificados",
    "/pesquisas",
    "/suporte"
  ];

  return [
    ...storeRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7
    })),
    ...academyRoutes.map((route) => ({
      url: absoluteUrl(academyPath(route)),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 0.9 : 0.7
    })),
    ...fundamentalsCourses.map((course) => ({
      url: absoluteUrl(academyPath(`/trilha-fundamentos/${course.slug}`)),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/produto/${product.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(`/categoria/${category.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75
    }))
  ];
}
