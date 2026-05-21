import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';
import WholesaleContent from './content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Wholesale Clothing Supply | Just Stock Trading',
  description: 'Reliable, quality-assured wholesale clothing sourced from trusted UK suppliers. Cream grade clothing, liquidation stock, and export-ready bales for international buyers.',
};

export default function WholesalePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <WholesaleContent />
      </main>
      <Footer />
      <MobileBottomNav />
      <SearchDrawer />
    </div>
  );
}
