import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/features/products/product-grid';
import type { HomeProduct } from '@/lib/supabase/queries';

interface TrendingSectionProps {
  products: HomeProduct[];
}

export function TrendingSection({ products }: TrendingSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="secondary" className="mb-3">
              <Flame className="mr-2 h-3 w-3 text-orange-500" />
              Hot Right Now
            </Badge>
            <h2 className="mb-2 text-3xl font-bold sm:text-4xl">Trending This Week</h2>
            <p className="text-muted-foreground">The pieces everyone&apos;s loving right now</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products?sort=popular">
              View All Trending
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ProductGrid products={products} columns={4} />
      </Container>
    </section>
  );
}
