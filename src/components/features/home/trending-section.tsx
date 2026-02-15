import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/features/products/product-grid';

// Sample trending products
const trendingProducts = [
  {
    id: '1',
    name: '90s Champion Hoodie',
    slug: '90s-champion-hoodie-navy',
    price: 48,
    condition: 'good' as const,
    brand: 'Champion',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    isTrending: true,
  },
  {
    id: '2',
    name: 'Vintage Band Tee',
    slug: 'vintage-band-tee',
    price: 35,
    condition: 'good' as const,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',
    isTrending: true,
  },
  {
    id: '3',
    name: 'Denim Jacket',
    slug: 'vintage-denim-jacket',
    price: 55,
    compareAtPrice: 80,
    condition: 'like_new' as const,
    brand: 'Levi\'s',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80',
    isTrending: true,
  },
  {
    id: '4',
    name: 'Silk Scarf',
    slug: 'vintage-silk-scarf',
    price: 25,
    condition: 'like_new' as const,
    brand: 'Hermès',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    isTrending: true,
  },
  {
    id: '5',
    name: 'Leather Belt',
    slug: 'vintage-leather-belt',
    price: 20,
    condition: 'good' as const,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80',
    isTrending: true,
  },
  {
    id: '6',
    name: 'Knit Cardigan',
    slug: 'vintage-knit-cardigan',
    price: 38,
    condition: 'like_new' as const,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    isTrending: true,
  },
  {
    id: '7',
    name: 'Corduroy Trousers',
    slug: 'vintage-corduroy-trousers',
    price: 42,
    condition: 'good' as const,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
    isTrending: true,
  },
  {
    id: '8',
    name: 'Canvas Tote Bag',
    slug: 'vintage-canvas-tote',
    price: 18,
    condition: 'like_new' as const,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
    isTrending: true,
  },
];

export function TrendingSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <Badge variant="secondary" className="mb-3">
              <Flame className="mr-2 h-3 w-3 text-orange-500" />
              Hot Right Now
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Trending This Week
            </h2>
            <p className="text-muted-foreground">
              The pieces everyone&apos;s loving right now
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products?sort=popular">
              View All Trending
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ProductGrid products={trendingProducts} columns={4} />
      </Container>
    </section>
  );
}
