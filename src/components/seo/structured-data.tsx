import { Product, WithContext, Organization, BreadcrumbList } from 'schema-dts';
import { siteConfig } from '@/constants/config';

export function ProductStructuredData({ product }: { product: any }) {
  const jsonLd: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.[0]?.url,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand || siteConfig.name,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'GBP',
      availability: product.variants.some((v: any) => v.stock_quantity > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: mapCondition(product.condition),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function mapCondition(condition: string) {
  switch (condition) {
    case 'new': return 'https://schema.org/NewCondition';
    case 'like_new': return 'https://schema.org/UsedCondition'; // Close enough
    default: return 'https://schema.org/UsedCondition';
  }
}

export function OrganizationStructuredData() {
  const jsonLd: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.instagram,
      siteConfig.links.facebook,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
