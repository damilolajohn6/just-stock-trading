import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';
import ServicesContent from './content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Sourcing & Export Services | Just Stock Trading',
  description: 'International buyers rely on us to source, inspect, consolidate, and coordinate export of quality wholesale goods from the United Kingdom.',
};

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <ServicesContent />
      </main>
      <Footer />
      <MobileBottomNav />
      <SearchDrawer />
    </div>
  );
}
