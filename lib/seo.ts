import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/utils";

export const defaultSeo: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "Magic The Galo | Loja Magic",
    template: "%s | Magic The Galo"
  },
  description:
    "Cartas avulsas, boosters, displays, deck boxes, sleeves, playmats, dados, tokens, ficharios e personalizados para Magic.",
  icons: {
    icon: "/images/magic-the-galo-logo.png",
    apple: "/images/magic-the-galo-logo.png"
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Magic The Galo",
    title: "Magic The Galo | Loja Magic",
    description: "Cartas, acessorios e reliquias para jogadores lendarios.",
    images: [{ url: "/images/magic-the-galo-hero.png", width: 1536, height: 1024 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Magic The Galo | Loja Magic",
    description: "Cartas, acessorios e reliquias para jogadores lendarios."
  },
  robots: {
    index: true,
    follow: true
  }
};

export function productJsonLd(product: {
  name: string;
  description: string;
  slug: string;
  price: number;
  rating: number;
  reviewCount: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: absoluteUrl("/images/magic-the-galo-hero.png"),
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "Magic The Galo",
      logo: absoluteUrl("/images/magic-the-galo-logo.png")
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: (product.price / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/produto/${product.slug}`)
    }
  };
}
