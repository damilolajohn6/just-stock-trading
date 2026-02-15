import { notFound } from 'next/navigation';
import { Container } from '@/components/shared/container';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import {
  ProductGrid,
  ProductFilters,
  MobileFilterDrawer,
  ActiveFilters,
  ProductSort,
} from '@/components/features/products';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/page-header';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', slug)
    .single();

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} | Just Stock Trading`,
    description: category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch Category Info
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) notFound();

  // 2. Fetch Products for this Category
  // Note: We're fetching server-side here for SEO, but client-side filtering will hydrate the state
  let query = supabase
    .from('products')
    .select(
      `
      *,
      category:categories!inner(id, name, slug),
      images:product_images(url, alt_text, is_primary)
    `
    )
    .eq('category.slug', slug)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(12); // Initial limit

  const { data: products } = await query;

  // Format products for display
  const formattedProducts =
    products?.map((p: any) => ({
      ...p,
      image: p.images.find((img: any) => img.is_primary)?.url || p.images[0]?.url,
    })) || [];

  return (
    <Container className="py-6">
      <Breadcrumb
        items={[{ label: 'Categories', href: '/categories' }, { label: category.name }]}
        className="mb-4"
      />

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="sticky top-24">
            {/* Initialize filters with category constraint */}
            <ProductFilters />
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              {category.description && (
                <p className="mt-1 text-muted-foreground">{category.description}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <MobileFilterDrawer />
              <ProductSort />
            </div>
          </div>

          <ActiveFilters />

          {formattedProducts.length > 0 ? (
            <ProductGrid products={formattedProducts} columns={4} />
          ) : (
            <div className="rounded-lg bg-muted/30 py-16 text-center">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </main>
      </div>
    </Container>
  );
}
