import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';
import LiveOffersContent from './content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Stock Availability & Exclusive Offers | Just Stock Trading',
  description: 'Stay updated with our latest stock arrivals, exclusive wholesale offers, and real-time availability. Follow us on social media for live warehouse updates.',
};

export default function LiveOffersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <LiveOffersContent />
      </main>
      <Footer />
      <MobileBottomNav />
      <SearchDrawer />
    </div>
  );
}
