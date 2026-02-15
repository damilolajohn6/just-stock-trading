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

// Sample featured products (replace with actual data)
const featuredProducts = [
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
];

export function FeaturedProducts() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Fresh Drops
            </h2>
            <p className="text-muted-foreground">
              New arrivals added daily. Don&apos;t miss out!
            </p>
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
            {featuredProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
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
