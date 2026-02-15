import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import { CountdownTimer } from './countdown-timer';

export function FlashSaleBanner() {
  // Set end date to 3 days from now
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 3);

  return (
    <section className="py-8 bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <Container>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center lg:text-left">
            <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <Zap className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-1">
                Flash Sale — Up to 50% Off!
              </h3>
              <p className="text-white/80">
                Limited time only. Don&apos;t miss these incredible deals.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <CountdownTimer targetDate={endDate} />
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="whitespace-nowrap"
            >
              <Link href="/products?sale=true">
                Shop Sale
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
