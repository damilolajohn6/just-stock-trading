import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';
import Link from 'next/link';
import { ArrowRight, Leaf, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pb-20 lg:pb-0">
        {/* Hero Section */}
        <section className="relative flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-primary/10 via-background to-thrift-sage/10 px-4">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-8 -right-8 h-96 w-96 rounded-full bg-thrift-sage/10 blur-3xl" />
          </div>
          
          <div className="relative z-10 max-w-4xl text-center">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              Sustainable Fashion
            </span>
            
            <h1 className="mb-6 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Discover Pre-Loved
              <span className="block text-gradient">Fashion Treasures</span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Shop curated vintage and second-hand clothing. Good for your wallet, 
              better for the planet.
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

        {/* Trust Badges */}
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

        {/* Placeholder sections - will be replaced in Phase 5 */}
        <section className="py-16">
          <div className="container max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold">🚧 Homepage Sections Coming Soon</h2>
            <p className="text-muted-foreground">
              Phase 5 will add: Category Grid, Featured Products, Shop by Weight, 
              Trending Items, Newsletter signup, and more!
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
      <SearchDrawer />
    </div>
  );
}
