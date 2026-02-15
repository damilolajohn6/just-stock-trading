import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Container } from '@/components/shared/container';

const categories = [
  {
    name: 'Women',
    slug: 'women',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
    description: 'Dresses, tops, bottoms & more',
    itemCount: 1250,
  },
  {
    name: 'Men',
    slug: 'men',
    image: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=600&q=80',
    description: 'Shirts, trousers, outerwear',
    itemCount: 890,
  },
  {
    name: 'Vintage',
    slug: 'vintage',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80',
    description: '70s, 80s, 90s & Y2K',
    itemCount: 560,
    featured: true,
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=600&q=80',
    description: 'Bags, jewelry, scarves',
    itemCount: 430,
  },
];

export function CategoryGrid() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated collections of pre-loved fashion. 
            Each piece is hand-picked and quality-checked.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className={cn(
                'group relative overflow-hidden rounded-2xl',
                index === 2 && 'col-span-2 lg:col-span-1' // Vintage featured on mobile
              )}
            >
              <div className="aspect-[3/4] relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end text-white">
                  {category.featured && (
                    <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded mb-2 w-fit">
                      Featured
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-white/80 mb-2 hidden sm:block">
                    {category.description}
                  </p>
                  <div className="flex items-center text-sm">
                    <span>{category.itemCount}+ items</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
