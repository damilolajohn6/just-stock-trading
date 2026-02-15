import { cn } from '@/utils/cn';
import { ProductCard } from './product-card';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  brand?: string | null;
  image?: string | null;
  images?: { url: string; alt_text?: string | null }[];
  category?: string;
  isNew?: boolean;
  isTrending?: boolean;
}

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

const columnClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
};

export function ProductGrid({
  products,
  columns = 4,
  className,
}: ProductGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4 md:gap-6',
        columnClasses[columns],
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
