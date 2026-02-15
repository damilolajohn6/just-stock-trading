'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-thrift-sage/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)] py-12 lg:py-0">
          {/* Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <Badge variant="secondary" className="mb-4 text-sm py-1 px-3">
             Sustainable Fashion Revolution
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
              Discover{' '}
              <span className="text-gradient">Pre-Loved</span>
              <br />
              Fashion Treasures
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Shop curated vintage and second-hand clothing. Each piece is unique, 
              quality-checked, and ready to become your new favourite.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-lg h-12 px-8">
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg h-12 px-8"
              >
                <Link href="/categories/vintage">
                  Explore Vintage
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Items Sold</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Sustainable</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none">
              {/* Main Image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                  alt="Sustainable fashion collection"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-4 sm:-left-8 top-1/4 bg-background rounded-xl shadow-xl p-3 sm:p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xl">🌱</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Eco-Friendly</div>
                    <div className="text-xs text-muted-foreground">100% Sustainable</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 sm:-right-8 bottom-1/4 bg-background rounded-xl shadow-xl p-3 sm:p-4 animate-float animation-delay-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Quality Checked</div>
                    <div className="text-xs text-muted-foreground">Verified items</div>
                  </div>
                </div>
              </div>

              {/* Price tag */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full px-6 py-2 shadow-lg">
                <span className="text-sm font-semibold">From £5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
