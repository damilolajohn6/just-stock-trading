import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { PageHeader } from '@/components/shared/page-header';
import { createClient } from '@/lib/supabase/server';

// Server Component
export default async function CategoriesPage() {
  const supabase = await createClient();
  
  // Fetch real categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .is('parent_id', null) // Only main categories
    .order('sort_order');

  return (
    <Container className="py-8">
      <PageHeader
        title="Shop by Category"
        description="Explore our curated collections"
      />
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-muted"
          >
            {category.image_url ? (
              <Image
                src={category.image_url}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <span className="text-4xl font-bold opacity-20">{category.name[0]}</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
              {category.description && (
                <p className="text-white/80 mb-2 line-clamp-2">{category.description}</p>
              )}
              <div className="flex items-center text-sm font-medium">
                <span>Browse Collection</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
