import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FunnelHero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/bb.jpeg"
        alt="Warehouse filled with premium thrift clothing bales"
        fill
        className="object-cover"
        priority
        quality={85}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white sm:px-6">
        {/* Tagline */}
        {/* <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-sm">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-sm font-medium tracking-wide sm:text-base">
            London&apos;s Home of Kilo Thrifting
          </span>
        </div> */}

        {/* Headline */}
        <h1 className="mb-6 text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Welcome to
          <br />
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
            Just Stock Trading
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-white/85 sm:text-xl md:text-2xl">
          100,000+ unique pieces of clothing — from bold summer fits to cosy winter layers — all
          waiting for a new home.
        </p>

        {/* CTAs */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-14 rounded-full bg-white px-10 text-lg font-semibold text-black shadow-2xl shadow-white/20 hover:bg-white/90"
          >
            <Link href="/products">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 rounded-full border-white/30 px-10 text-lg text-white backdrop-blur-sm hover:bg-white/10"
          >
            <Link href="/products?sort=newest">New Arrivals</Link>
          </Button>
        </div>

        {/* Stats strip */}
        <div className="mt-16 flex items-center justify-center gap-8 border-t border-white/15 pt-8 sm:gap-12">
          <div>
            <div className="text-3xl font-bold sm:text-4xl">100K+</div>
            <div className="mt-1 text-sm text-white/60">Unique Pieces</div>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div>
            <div className="text-3xl font-bold sm:text-4xl">£15</div>
            <div className="mt-1 text-sm text-white/60">Per Kilo</div>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div>
            <div className="text-3xl font-bold sm:text-4xl">50+</div>
            <div className="mt-1 text-sm text-white/60">Top Brands</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30 pt-2">
          <div className="h-3 w-1.5 animate-bounce rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}
