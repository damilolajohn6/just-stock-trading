import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/shared/container';
import { cn } from '@/utils/cn';

interface ShowcaseBlock {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  cta: string;
  reversed?: boolean;
  accent?: string;
}

const blocks: ShowcaseBlock[] = [
  {
    title: 'Clothing',
    subtitle: '100,000+ Unique Pieces',
    description:
      "From premium vintage and streetwear to Y2K gems and everyday fashion steals — we've got it all. Every piece is hand-picked, quality-checked, and ready for a new home.",
    image: '/images/a.jpeg',
    imageAlt: 'Bale of branded thrift clothing with tags from Nike, Next, and more',
    href: '/products',
    cta: 'Shop Clothing',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Top Brands',
    subtitle: 'High Street Brands Mix',
    description:
      'Zara, H&M, Primark, Next, River Island, M&S, New Look, Topshop, ASOS and many more — up to 85% summer stock. Cream grade & new with tags.',
    image: '/images/bbb.jpeg',
    imageAlt: 'High street brand logos including Zara, Primark, H&M, Next, and more',
    href: '/products?brands=true',
    cta: 'Shop Brands',
    reversed: true,
    accent: 'from-rose-500 to-pink-500',
  },
  {
    title: 'Bulk & Export',
    subtitle: 'Wholesale Available',
    description:
      'Bulk stock available for serious buyers. Perfect for kilo stores, market traders, and international export to Europe, Middle East and Africa.',
    image: '/images/cccc.jpeg',
    imageAlt: 'Two large bales of clothing ready for export and wholesale',
    href: '/products?category=wholesale',
    cta: 'View Bulk Orders',
    accent: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Kids Collection',
    subtitle: 'Little Ones, Big Style',
    description:
      'Adorable branded kids clothing at unbeatable prices. From colourful prints to designer pieces — dress your little ones for less.',
    image: '/images/aaaa.jpeg',
    imageAlt: 'Flat-lay of kids clothing including colourful tops and sweaters',
    href: '/products?category=kids',
    cta: 'Shop Kids',
    reversed: true,
    accent: 'from-violet-500 to-purple-500',
  },
];

export function ImageShowcase() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">What We Offer</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Premium pre-loved fashion for everyone — clothing, accessories, and more.
          </p>
        </div>
      </Container>

      <div className="space-y-20 lg:space-y-32">
        {blocks.map((block, index) => (
          <ShowcaseItem key={block.title} block={block} index={index} />
        ))}
      </div>
    </section>
  );
}

function ShowcaseItem({ block, index }: { block: ShowcaseBlock; index: number }) {
  return (
    <Container>
      <div
        className={cn(
          'grid items-center gap-8 lg:grid-cols-2 lg:gap-16',
          block.reversed && 'lg:[direction:rtl]'
        )}
      >
        {/* Image */}
        <div className="lg:[direction:ltr]">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src={block.image}
              alt={block.imageAlt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Index badge */}
            <div
              className={cn(
                'absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-lg',
                block.accent
              )}
            >
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:[direction:ltr]">
          <div
            className={cn(
              'mb-4 inline-block rounded-full bg-gradient-to-r px-3 py-1 text-sm font-semibold text-white',
              block.accent
            )}
          >
            {block.title}
          </div>

          <h3 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl">{block.subtitle}</h3>

          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{block.description}</p>

          <Button asChild size="lg" className="h-12 rounded-full px-8">
            <Link href={block.href}>
              {block.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
