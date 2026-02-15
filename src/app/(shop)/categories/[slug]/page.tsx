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
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', params.slug)
    .single();

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} | Thrift Factory`,
    description: category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const supabase = await createClient();

  // 1. Fetch Category Info
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!category) notFound();

  // 2. Fetch Products for this Category
  // Note: We're fetching server-side here for SEO, but client-side filtering will hydrate the state
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories!inner(id, name, slug),
      images:product_images(url, alt_text, is_primary)
    `)
    .eq('category.slug', params.slug)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(12); // Initial limit

  const { data: products } = await query;

  // Format products for display
  const formattedProducts = products?.map((p: any) => ({
    ...p,
    image: p.images.find((img: any) => img.is_primary)?.url || p.images[0]?.url,
  })) || [];

  return (
    <Container className="py-6">
      <Breadcrumb
        items={[
          { label: 'Categories', href: '/categories' },
          { label: category.name },
        ]}
        className="mb-4"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            {/* Initialize filters with category constraint */}
            <ProductFilters />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              {category.description && (
                <p className="text-muted-foreground mt-1">{category.description}</p>
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
            <div className="text-center py-16 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </main>
      </div>
    </Container>
  );
}
