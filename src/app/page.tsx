import Link from 'next/link';
import { ArrowRight, Leaf, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/constants/config';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Temporary */}
      <section className="relative flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-primary/10 via-background to-thrift-sage/10 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-8 -right-8 h-96 w-96 rounded-full bg-thrift-sage/10 blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Sustainable Fashion
          </span>
          
          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Pre-Loved
            <span className="block text-gradient">Fashion Treasures</span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {siteConfig.description}
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link href="/categories">
                Browse Categories
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Badges - Temporary */}
      <section className="border-b border-t bg-muted/50 py-8">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: Leaf, title: 'Sustainable', desc: 'Eco-friendly fashion' },
              { icon: Truck, title: 'Fast Shipping', desc: 'UK-wide delivery' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '30-day returns' },
              { icon: ShieldCheck, title: 'Quality Check', desc: 'Verified items' },
            ].map((badge) => (
              <div key={badge.title} className="flex flex-col items-center text-center">
                <badge.icon className="mb-2 h-8 w-8 text-primary" />
                <h3 className="font-semibold">{badge.title}</h3>
                <p className="text-sm text-muted-foreground">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Notice */}
      <section className="py-16">
        <div className="container max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold">🚧 Under Construction</h2>
          <p className="mb-6 text-muted-foreground">
            This is the Phase 1 foundation of the Thrift Marketplace. 
            The homepage funnel, navigation, and all features will be built in subsequent phases.
          </p>
          <div className="rounded-lg border bg-card p-6 text-left">
            <h3 className="mb-3 font-semibold">Phase 1 Complete ✓</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Project structure and architecture</li>
              <li>✓ TypeScript configuration</li>
              <li>✓ Tailwind CSS with custom theme</li>
              <li>✓ Environment variable validation</li>
              <li>✓ Type definitions</li>
              <li>✓ Utility functions</li>
              <li>✓ Constants and configuration</li>
              <li>✓ Root layout with providers</li>
            </ul>
            <p className="mt-4 text-sm">
              <strong>Next:</strong> Phase 2 - Database Schema & Supabase Setup
            </p>
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
      </footer>
    </main>
  );
}
