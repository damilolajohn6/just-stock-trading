import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { PageHeader } from '@/components/shared/page-header';

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
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=600&q=80',
    description: 'Bags, jewelry, scarves',
    itemCount: 430,
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80',
    description: 'Shoes, boots, sneakers',
    itemCount: 320,
  },
  {
    name: 'Kids',
    slug: 'kids',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80',
    description: 'Children\'s clothing',
    itemCount: 210,
  },
];

export default function CategoriesPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Shop by Category"
        description="Explore our curated collections"
      />
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
              <p className="text-white/80 mb-2">{category.description}</p>
              <div className="flex items-center text-sm">
                <span>{category.itemCount}+ items</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
