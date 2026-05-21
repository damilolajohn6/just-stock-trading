import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';
import AboutUsContent from './content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Just Stock Trading',
  description: 'Just Stock Trading Limited was established to bridge the gap between UK suppliers and international buyers seeking reliable wholesale goods.',
};

export default function AboutUsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <AboutUsContent />
      </main>
      <Footer />
      <MobileBottomNav />
      <SearchDrawer />
    </div>
  );
}
