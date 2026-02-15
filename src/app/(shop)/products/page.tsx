import { Suspense } from 'react';
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

// Mock products data - replace with actual data fetching
const products = [
  {
    id: '1',
    name: 'Vintage Levi\'s 501 Jeans',
    slug: 'vintage-levis-501-jeans',
    price: 45,
    compareAtPrice: 65,
    condition: 'like_new' as const,
    brand: 'Levi\'s',
    image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&q=80',
    isNew: true,
  },
  {
    id: '2',
    name: 'Floral Midi Dress',
    slug: 'floral-midi-dress',
    price: 28,
    condition: 'good' as const,
    brand: 'Zara',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
    isTrending: true,
  },
  {
    id: '3',
    name: 'Wool Overcoat',
    slug: 'wool-overcoat-charcoal',
    price: 75,
    compareAtPrice: 120,
    condition: 'like_new' as const,
    brand: 'Uniqlo',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
  },
  {
    id: '4',
    name: 'Leather Crossbody Bag',
    slug: 'leather-crossbody-bag-tan',
    price: 55,
    compareAtPrice: 150,
    condition: 'good' as const,
    brand: 'Coach',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
  },
  {
    id: '5',
    name: 'Cashmere Sweater',
    slug: 'cashmere-sweater-burgundy',
    price: 65,
    compareAtPrice: 180,
    condition: 'like_new' as const,
    brand: 'J.Crew',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    isNew: true,
  },
  {
    id: '6',
    name: '90s Champion Hoodie',
    slug: '90s-champion-hoodie-navy',
    price: 48,
    condition: 'good' as const,
    brand: 'Champion',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    isTrending: true,
  },
  {
    id: '7',
    name: 'Silk Blouse',
    slug: 'silk-blouse-cream',
    price: 42,
    compareAtPrice: 200,
    condition: 'like_new' as const,
    brand: 'Equipment',
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80',
  },
  {
    id: '8',
    name: 'Nike Air Max 90',
    slug: 'nike-air-max-90-white',
    price: 40,
    compareAtPrice: 90,
    condition: 'good' as const,
    brand: 'Nike',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51d675571?w=600&q=80',
  },
  {
    id: '9',
    name: 'Vintage Denim Jacket',
    slug: 'vintage-denim-jacket',
    price: 55,
    condition: 'good' as const,
    brand: 'Levi\'s',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80',
  },
  {
    id: '10',
    name: 'Corduroy Trousers',
    slug: 'corduroy-trousers-tan',
    price: 35,
    condition: 'like_new' as const,
    brand: 'Uniqlo',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
  },
  {
    id: '11',
    name: 'Knit Cardigan',
    slug: 'knit-cardigan-cream',
    price: 38,
    condition: 'good' as const,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
  },
  {
    id: '12',
    name: 'Canvas Tote Bag',
    slug: 'canvas-tote-bag',
    price: 18,
    condition: 'like_new' as const,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
  },
];

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[3/4] rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-5 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const totalProducts = products.length;

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
            <ProductFilters />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">All Products</h1>
              <p className="text-muted-foreground">
                {totalProducts} products found
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
            <ProductGrid products={products} columns={4} />
          </Suspense>

          {/* Pagination placeholder */}
          <div className="mt-12 flex justify-center">
            <p className="text-sm text-muted-foreground">
              Showing {totalProducts} of {totalProducts} products
            </p>
          </div>
        </main>
      </div>
    </Container>
  );
}
