import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';
import WeBuyContent from './content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell to Us | We Buy Quality Stock from UK Suppliers',
  description: "Got high-quality clothing or surplus stock? We buy in bulk. We're always sourcing premium second-hand clothing, cream grade stock, and liquidation goods for our international buyers.",
};

export default function WeBuyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <WeBuyContent />
      </main>
      <Footer />
      <MobileBottomNav />
      <SearchDrawer />
    </div>
  );
}
