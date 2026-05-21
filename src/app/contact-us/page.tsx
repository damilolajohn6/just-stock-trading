import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';
import ContactUsContent from './content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Just Stock Trading',
  description: 'Have a question about our products, procurement services, or wholesale exports? Our dedicated team is ready to assist international buyers.',
};

export default function ContactUsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <ContactUsContent />
      </main>
      <Footer />
      <MobileBottomNav />
      <SearchDrawer />
    </div>
  );
}
