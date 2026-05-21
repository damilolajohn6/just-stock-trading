import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';
import ExportsContent from './content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Export Coordination & Logistics | Just Stock Trading',
  description:
    'From our UK sourcing network to your doorstep, anywhere in the world. We coordinate seamless international distribution of quality wholesale clothing and liquidation stock.',
};

export default function ExportsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <ExportsContent />
      </main>
      <Footer />
      <MobileBottomNav />
      <SearchDrawer />
    </div>
  );
}
