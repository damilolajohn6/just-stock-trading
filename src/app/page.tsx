import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';

import {
  AnnouncementBar,
  FunnelHero,
  ValueProps,
  ImageShowcase,
  PhotoGallery,
  ShopByWeight,
  NewsletterSection,
} from '@/components/features/home';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 pb-20 lg:pb-0">
        {/* Full-screen Hero */}
        <FunnelHero />

        {/* Value Proposition Strip */}
        <ValueProps />

        {/* Alternating Image/Text Sections */}
        <ImageShowcase />

        {/* Photo Gallery */}
        <PhotoGallery />

        {/* Shop by Weight/Bundles */}
        <ShopByWeight />

        {/* Newsletter */}
        <NewsletterSection />
      </main>

      <Footer />
      <MobileBottomNav />
      <SearchDrawer />
    </div>
  );
}
