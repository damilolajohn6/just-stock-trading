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

// Mock category data
const categories: Record<string, { name: string; description: string }> = {
  women: { name: 'Women', description: 'Pre-loved fashion for women' },
  men: { name: 'Men', description: 'Quality second-hand menswear' },
  vintage: { name: 'Vintage', description: 'Curated vintage pieces from all eras' },
  accessories: { name: 'Accessories', description: 'Bags, jewelry, hats and more' },
  footwear: { name: 'Footwear', description: 'Pre-loved shoes and boots' },
  kids: { name: 'Kids', description: 'Quality second-hand children clothing' },
};

// Mock products
const mockProducts = [
  {
    id: '1',
    name: 'Vintage Levi\'s 501 Jeans',
    slug: 'vintage-levis-501-jeans',
    price: 45,
    compareAtPrice: 65,
    condition: 'like_new' as const,
    brand: 'Levi\'s',
    image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&q=80',
  },
  {
    id: '2',
    name: '90s Champion Hoodie',
    slug: '90s-champion-hoodie-navy',
    price: 48,
    condition: 'good' as const,
    brand: 'Champion',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
  },
  {
    id: '3',
    name: 'Vintage Denim Jacket',
    slug: 'vintage-denim-jacket',
    price: 55,
    condition: 'good' as const,
    brand: 'Levi\'s',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80',
  },
  {
    id: '4',
    name: 'Vintage Band Tee',
    slug: 'vintage-band-tee',
    price: 35,
    condition: 'good' as const,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',
  },
];

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = categories[params.slug];

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} | Thrift Factory`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = categories[params.slug];

  if (!category) {
    notFound();
  }

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
            <ProductFilters />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <MobileFilterDrawer />
              <ProductSort />
            </div>
          </div>

          <ActiveFilters />

          <ProductGrid products={mockProducts} columns={4} />
        </main>
      </div>
    </Container>
  );
}
