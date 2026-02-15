import { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { siteConfig } from '@/constants/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();
  const baseUrl = siteConfig.url;

  // Static routes
  const routes = [
    '',
    '/products',
    '/categories',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes: Products
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_published', true);

  const productRoutes = (products || []).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic routes: Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true);

  const categoryRoutes = (categories || []).map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(category.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...productRoutes, ...categoryRoutes];
}
