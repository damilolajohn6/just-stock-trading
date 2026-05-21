import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';
import ShippingContent from './content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reliable Export Logistics & Freight Coordination | Just Stock Trading',
  description: 'We coordinate the complexity of international logistics. From bale orders to full containers, we ensure your wholesale stock arrives safely and on time.',
};

export default function ShippingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <ShippingContent />
      </main>
      <Footer />
      <MobileBottomNav />
      <SearchDrawer />
    </div>
  );
}
