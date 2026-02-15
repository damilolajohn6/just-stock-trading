'use client';

import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { Container } from '@/components/shared/container';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from '@/components/ui/carousel';
import { cn } from '@/utils/cn';

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    location: 'London',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    rating: 5,
    text: "I'm obsessed with Thrift Factory! The quality of the vintage pieces is amazing, and the prices are unbeatable. My wardrobe has never looked better!",
    product: 'Vintage Levi\'s Jacket',
  },
  {
    id: 2,
    name: 'James T.',
    location: 'Manchester',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    rating: 5,
    text: "Best thrift store online! Fast shipping, great customer service, and the 5kg bundle was incredible value. Got so many unique pieces.",
    product: '5kg Mystery Bundle',
  },
  {
    id: 3,
    name: 'Emma L.',
    location: 'Bristol',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    rating: 5,
    text: "Love that I can shop sustainably without compromising on style. The vintage section is a treasure trove. Already planning my next haul!",
    product: '90s Collection',
  },
  {
    id: 4,
    name: 'David K.',
    location: 'Edinburgh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    rating: 5,
    text: "As a reseller, the wholesale bundles are perfect. Great variety, excellent condition, and the team is super helpful. Highly recommend!",
    product: '25kg Wholesale Bundle',
  },
];

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Loved by Thrift Lovers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of happy customers who&apos;ve discovered their new 
            favourite pieces with us.
          </p>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
                <div className="h-full p-6 bg-muted/50 rounded-2xl">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        )}
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-foreground mb-6 leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.location} • Purchased: {testimonial.product}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </div>
          <CarouselDots className="mt-6" />
        </Carousel>
      </Container>
    </section>
  );
}
