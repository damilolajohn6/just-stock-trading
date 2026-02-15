import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Container } from '@/components/shared/container';
import type { HomeCategory } from '@/lib/supabase/queries';

interface CategoryGridProps {
  categories: HomeCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Shop by Category</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore our curated collections of pre-loved fashion. Each piece is hand-picked and
            quality-checked.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className={cn(
                'group relative overflow-hidden rounded-2xl',
                index === 2 && 'col-span-2 lg:col-span-1'
              )}
            >
              <div className="relative aspect-[3/4]">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted" />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white sm:p-6">
                  {category.featured && (
                    <span className="mb-2 inline-block w-fit rounded bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                      Featured
                    </span>
                  )}
                  <h3 className="mb-1 text-xl font-bold sm:text-2xl">{category.name}</h3>
                  <p className="mb-2 hidden text-sm text-white/80 sm:block">
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
