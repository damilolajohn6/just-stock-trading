import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';

import {
  // AnnouncementBar,
  // FunnelHero,
  ValueProps,
  ImageShowcase,
  PhotoGallery,
  ShopByWeight,
  NewsletterSection,
} from '@/components/features/home';
import Hero from '@/components/cream-grade/Hero';
import Composition from '@/components/cream-grade/Composition';
import Offers from '@/components/cream-grade/Offers';
import PackagingShowcase from '@/components/cream-grade/PackagingShowcase';
import PricingTable from '@/components/cream-grade/PricingTable';
import QualityStandards from '@/components/cream-grade/QualityStandards';
import About from '@/components/cream-grade/About';
import TrustSignals from '@/components/cream-grade/TrustSignals';
import FAQ from '@/components/cream-grade/FAQ';
import CTABanner from '@/components/cream-grade/CTABanner';
import Contact from '@/components/cream-grade/Contact';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <AnnouncementBar /> */}
      <Header />

      <main className="flex-1 pb-20 lg:pb-0">
        {/* Full-screen Hero */}
        {/* <FunnelHero /> */}

        <div className="bg-white/80 transition-colors duration-500">
          <Hero />
          <Composition />
          <Offers />
          <PackagingShowcase />
          <About />
          <TrustSignals />
          <QualityStandards />
          <FAQ />
          <Contact />
          <CTABanner />
        </div>

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
