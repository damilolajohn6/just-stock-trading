import { createClient } from './server';
import type { MainNavItem } from '@/constants/navigation';

// ──────────────────────────────────────────────────
// Home page: Categories
// ──────────────────────────────────────────────────

export interface HomeCategory {
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  itemCount: number;
  featured?: boolean;
}

export async function getHomeCategories(): Promise<HomeCategory[]> {
  const supabase = await createClient();

  // Fetch top-level active categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('sort_order');

  if (error || !categories) {
    console.error('Failed to fetch home categories:', error);
    return [];
  }

  // Get product counts per category
  const categoryIds = categories.map((c) => c.id);

  const counts: Record<string, number> = {};
  for (const catId of categoryIds) {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', catId)
      .eq('is_published', true);

    counts[catId] = count ?? 0;
  }

  return categories.map((cat, index) => ({
    name: cat.name,
    slug: cat.slug,
    image: cat.image_url,
    description: cat.description,
    itemCount: counts[cat.id] ?? 0,
    featured: index === 0, // Mark the first category as featured
  }));
}

// ──────────────────────────────────────────────────
// Home page: Featured Products
// ──────────────────────────────────────────────────

export interface HomeProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  brand?: string | null;
  image?: string | null;
  images?: { url: string; alt_text?: string | null }[];
  isNew?: boolean;
  isTrending?: boolean;
}

export async function getFeaturedProducts(limit = 6): Promise<HomeProduct[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id, name, slug, price, compare_at_price, condition, brand,
      is_featured, is_trending, created_at,
      images:product_images(url, alt_text, is_primary)
    `
    )
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }

  return mapProducts(data);
}

// ──────────────────────────────────────────────────
// Home page: Trending Products
// ──────────────────────────────────────────────────

export async function getTrendingProducts(limit = 8): Promise<HomeProduct[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id, name, slug, price, compare_at_price, condition, brand,
      is_featured, is_trending, created_at,
      images:product_images(url, alt_text, is_primary)
    `
    )
    .eq('is_published', true)
    .eq('is_trending', true)
    .order('view_count', { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error('Failed to fetch trending products:', error);
    return [];
  }

  return mapProducts(data);
}

// ──────────────────────────────────────────────────
// Navigation: Categories with subcategories
// ──────────────────────────────────────────────────

export async function getNavCategories(): Promise<MainNavItem[]> {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, parent_id')
    .eq('is_active', true)
    .order('sort_order');

  if (error || !categories) {
    console.error('Failed to fetch nav categories:', error);
    return [];
  }

  // Build parent → children hierarchy
  const topLevel = categories.filter((c) => !c.parent_id);
  const childrenMap = new Map<string, typeof categories>();

  for (const cat of categories) {
    if (cat.parent_id) {
      const existing = childrenMap.get(cat.parent_id) ?? [];
      existing.push(cat);
      childrenMap.set(cat.parent_id, existing);
    }
  }

  const navItems: MainNavItem[] = topLevel.map((parent) => {
    const children = childrenMap.get(parent.id);
    const item: MainNavItem = {
      label: parent.name,
      href: `/categories/${parent.slug}`,
    };

    if (children && children.length > 0) {
      item.children = [
        {
          label: `All ${parent.name}`,
          href: `/categories/${parent.slug}`,
          description: `Browse all ${parent.name.toLowerCase()}`,
        },
        ...children.map((child) => ({
          label: child.name,
          href: `/categories/${parent.slug}/${child.slug}`,
        })),
      ];
    }

    return item;
  });

  // Append static nav items
  navItems.push(
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Sale', href: '/products?sale=true' }
  );

  return navItems;
}

// ──────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────

function mapProducts(data: any[]): HomeProduct[] {
  // A product is "new" if created within the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return data.map((product) => {
    const sortedImages = (product.images ?? []).sort(
      (a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
    );

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compare_at_price,
      condition: product.condition,
      brand: product.brand,
      image: sortedImages[0]?.url ?? null,
      images: sortedImages.map((img: any) => ({
        url: img.url,
        alt_text: img.alt_text,
      })),
      isNew: new Date(product.created_at) > sevenDaysAgo,
      isTrending: product.is_trending,
    };
  });
}
