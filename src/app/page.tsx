import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';

import {
  HeroSection,
  AnnouncementBar,
  CategoryGrid,
  FeaturedProducts,
  ShopByWeight,
  TrendingSection,
  TrustBadges,
  Testimonials,
  InstagramFeed,
  NewsletterSection,
  FlashSaleBanner,
} from '@/components/features/home';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      
      <main className="flex-1 pb-20 lg:pb-0">
        {/* Hero Section */}
        <HeroSection />

        {/* Trust Badges */}
        <TrustBadges />

        {/* Categories */}
        <CategoryGrid />

        {/* Flash Sale Banner */}
        <FlashSaleBanner />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Shop by Weight/Bundles */}
        <ShopByWeight />

        {/* Trending Items */}
        <TrendingSection />

        {/* Testimonials */}
        <Testimonials />

        {/* Instagram Feed */}
        <InstagramFeed />

        {/* Newsletter */}
        <NewsletterSection />
      </main>

      <Footer />
      <MobileBottomNav />
      <SearchDrawer />
    </div>
  );
}
