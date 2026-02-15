import {
  Leaf,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  HeartHandshake,
} from 'lucide-react';
import { Container } from '@/components/shared/container';

const badges = [
  {
    icon: Leaf,
    title: 'Sustainable Fashion',
    description: 'Every purchase saves clothing from landfills',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Guaranteed',
    description: 'All items inspected and verified',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'Free UK delivery over £50',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day hassle-free returns',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Stripe & Paystack protected',
  },
  {
    icon: HeartHandshake,
    title: 'Customer Support',
    description: 'Friendly team ready to help',
  },
];

export function TrustBadges() {
  return (
    <section className="py-12 lg:py-16 border-y bg-background">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
          {badges.map((badge) => (
            <div key={badge.title} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{badge.title}</h3>
              <p className="text-xs text-muted-foreground">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
