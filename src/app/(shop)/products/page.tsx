import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/shared/container';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import {
  ProductGrid,
  ProductFilters,
  MobileFilterDrawer,
  ActiveFilters,
  ProductSort,
} from '@/components/features/products';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination'; 

// Force dynamic rendering because this page depends on searchParams
export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    sizes?: string | string[];
    brands?: string | string[];
    conditions?: string | string[];
    colors?: string | string[];
    page?: string;
    search?: string;
  };
}

// Data fetching function
async function getProducts(params: ProductsPageProps['searchParams']) {
  const supabase = await createClient();
  
  const page = parseInt(params.page || '1');
  const limit = 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Start building the query
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories!inner(id, name, slug),
      images:product_images(url, alt_text, is_primary),
      variants:product_variants(size, color, stock_quantity, is_available)
    `, { count: 'exact' })
    .eq('is_published', true);

  // Apply filters
  if (params.category) {
    query = query.eq('category.slug', params.category);
  }

  if (params.minPrice) {
    query = query.gte('price', parseFloat(params.minPrice));
  }

  if (params.maxPrice) {
    query = query.lte('price', parseFloat(params.maxPrice));
  }

  if (params.brands) {
    const brands = Array.isArray(params.brands) ? params.brands : [params.brands];
    if (brands.length > 0) query = query.in('brand', brands);
  }

  if (params.conditions) {
    const conditions = Array.isArray(params.conditions) ? params.conditions : [params.conditions];
    if (conditions.length > 0) query = query.in('condition', conditions as any);
  }
  
  if (params.colors) {
    const colors = Array.isArray(params.colors) ? params.colors : [params.colors];
    if (colors.length > 0) query = query.in('color', colors);
  }

  if (params.search) {
    const searchTerm = params.search;
    query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`);
  }

  // Sorting
  switch (params.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'popular':
      query = query.order('view_count', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  // Pagination
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0, totalPages: 0 };
  }

  // Format products for the grid component
  const formattedProducts = data.map((product: any) => ({
    ...product,
    // Ensure images are sorted by primary first
    images: product.images?.sort((a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)) || [],
    image: product.images?.find((img: any) => img.is_primary)?.url || product.images?.[0]?.url || null,
    // Add computed fields if needed
    isNew: new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Created within last 7 days
  }));

  return {
    products: formattedProducts,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

// Skeleton loader
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[3/4] rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-5 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Fetch data
  const { products, total, totalPages } = await getProducts(searchParams);
  
  // Fetch available brands for filter (could be cached/optimized)
  const supabase = await createClient();
  const { data: brandData } = await supabase
    .from('products')
    .select('brand')
    .not('brand', 'is', null)
    .eq('is_published', true);
    
  // Get unique brands
  const uniqueBrands = Array.from(new Set(brandData?.map((p) => p.brand).filter(Boolean) as string[])).sort();

  return (
    <Container className="py-6">
      <Breadcrumb
        items={[{ label: 'Products' }]}
        className="mb-4"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <ProductFilters availableBrands={uniqueBrands} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">All Products</h1>
              <p className="text-muted-foreground">
                {total} {total === 1 ? 'product' : 'products'} found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <MobileFilterDrawer />
              <ProductSort />
            </div>
          </div>

          {/* Active Filters */}
          <ActiveFilters />

          {/* Products Grid */}
          <Suspense fallback={<ProductGridSkeleton />}>
            {products.length > 0 ? (
              <>
                <ProductGrid products={products} columns={4} />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination 
                      currentPage={parseInt(searchParams.page || '1')} 
                      totalPages={totalPages} 
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState 
                title="No products found"
                description="Try adjusting your filters or search criteria."
                actionLabel="Clear Filters"
                actionHref="/products"
              />
            )}
          </Suspense>
        </main>
      </div>
    </Container>
  );
}
