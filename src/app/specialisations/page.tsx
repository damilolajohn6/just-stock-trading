import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';
import SpecialisationsContent from './content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quality Wholesale Goods for Global Markets | Just Stock Trading',
  description: 'From premium cream grade clothing to liquidation stock and export-ready bales — we source and supply quality wholesale goods for international buyers.',
};

export default function SpecialisationsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <SpecialisationsContent />
      </main>
      <Footer />
      <MobileBottomNav />
      <SearchDrawer />
    </div>
  );
}
