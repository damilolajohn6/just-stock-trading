'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/features/products/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from '@/components/ui/carousel';
import type { HomeProduct } from '@/lib/supabase/queries';

interface FeaturedProductsProps {
  products: HomeProduct[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold sm:text-4xl">Fresh Drops</h2>
            <p className="text-muted-foreground">New arrivals added daily. Don&apos;t miss out!</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products?sort=newest">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="-left-4 lg:-left-12" />
            <CarouselNext className="-right-4 lg:-right-12" />
          </div>
          <CarouselDots className="mt-6" />
        </Carousel>
      </Container>
    </section>
  );
}
