import Link from 'next/link';
import Image from 'next/image';
import { Scale, ArrowRight, Check } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

const bundles = [
  {
    id: 'starter',
    name: 'Starter Bundle',
    weight: '2kg',
    price: 15,
    description: 'Perfect for trying our selection',
    items: '4-6 items',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
    features: ['Mixed styles', 'Quality checked'],
  },
  {
    id: 'popular',
    name: 'Popular Bundle',
    weight: '5kg',
    price: 35,
    description: 'Our most popular choice',
    items: '10-15 items',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80',
    popular: true,
    features: ['Best value', 'Premium selection', 'Free shipping'],
  },
  {
    id: 'value',
    name: 'Value Bundle',
    weight: '10kg',
    price: 65,
    description: 'Best value for resellers',
    items: '20-30 items',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80',
    features: ['Bulk savings', 'Reseller friendly', 'Free shipping'],
  },
  {
    id: 'wholesale',
    name: 'Wholesale Bundle',
    weight: '25kg',
    price: 150,
    description: 'For serious vintage lovers',
    items: '50+ items',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
    features: ['Maximum savings', 'Priority selection', 'Free express shipping'],
  },
];

export function ShopByWeight() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Scale className="mr-2 h-3 w-3" />
            Kilo Sale
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Shop by Weight
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get more for less with our kilo bundles. Mystery boxes packed with 
            quality pre-loved fashion at unbeatable prices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className={cn(
                'relative group rounded-2xl border bg-card overflow-hidden transition-all hover:shadow-lg',
                bundle.popular && 'border-primary ring-2 ring-primary'
              )}
            >
              {bundle.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-1 text-sm font-semibold z-10">
                  Most Popular
                </div>
              )}

              {/* Image */}
              <div className={cn('relative aspect-[4/3]', bundle.popular && 'mt-7')}>
                <Image
                  src={bundle.image}
                  alt={bundle.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
                    {bundle.weight}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{bundle.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {bundle.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold">
                    {formatCurrency(bundle.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ~{bundle.items}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-5">
                  {bundle.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="w-full"
                  variant={bundle.popular ? 'default' : 'outline'}
                >
                  <Link href={`/bundles/${bundle.id}`}>
                    Select Bundle
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Can&apos;t decide? Create your own custom bundle!
          </p>
          <Button asChild variant="outline" size="lg">
            <Link href="/bundles/custom">
              Create Custom Bundle
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
