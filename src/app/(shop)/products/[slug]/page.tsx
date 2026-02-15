import { notFound } from 'next/navigation';
import { Container } from '@/components/shared/container';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import {
  ProductGallery,
  ProductInfo,
  ProductTabs,
  ProductGrid,
} from '@/components/features/products';
import { Separator } from '@/components/ui/separator';

// Mock product data - replace with actual data fetching
const mockProduct = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  name: 'Vintage Levi\'s 501 Jeans',
  slug: 'vintage-levis-501-jeans',
  description: 'Classic Levi\'s 501 jeans in excellent vintage condition. High-waisted fit with original button fly. Perfect broken-in look with minimal wear. These jeans have been professionally cleaned and are ready to wear. The perfect addition to any wardrobe for those seeking authentic vintage denim.',
  short_description: 'Classic high-waisted vintage Levi\'s in excellent condition',
  brand: 'Levi\'s',
  price: 45,
  compare_at_price: 65,
  condition: 'like_new' as const,
  material: 'Cotton Denim',
  color: 'Blue',
  average_rating: 4.5,
  review_count: 12,
  variants: [
    { id: 'v1', size: 'S', color: 'Blue', stock_quantity: 2, is_available: true, price_adjustment: 0 },
    { id: 'v2', size: 'M', color: 'Blue', stock_quantity: 3, is_available: true, price_adjustment: 0 },
    { id: 'v3', size: 'L', color: 'Blue', stock_quantity: 1, is_available: true, price_adjustment: 0 },
    { id: 'v4', size: 'XL', color: 'Blue', stock_quantity: 0, is_available: false, price_adjustment: 0 },
  ],
  images: [
    { url: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800&q=80', alt_text: 'Front view' },
    { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80', alt_text: 'Back view' },
    { url: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80', alt_text: 'Detail view' },
    { url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80', alt_text: 'Lifestyle' },
  ],
  category: {
    name: 'Vintage',
    slug: 'vintage',
  },
};

const relatedProducts = [
  {
    id: '2',
    name: 'Vintage Denim Jacket',
    slug: 'vintage-denim-jacket',
    price: 55,
    condition: 'good' as const,
    brand: 'Levi\'s',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80',
  },
  {
    id: '3',
    name: '90s Champion Hoodie',
    slug: '90s-champion-hoodie-navy',
    price: 48,
    condition: 'good' as const,
    brand: 'Champion',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
  },
  {
    id: '4',
    name: 'Vintage Band Tee',
    slug: 'vintage-band-tee',
    price: 35,
    condition: 'good' as const,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',
  },
  {
    id: '5',
    name: 'Corduroy Trousers',
    slug: 'corduroy-trousers-tan',
    price: 42,
    condition: 'like_new' as const,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
  },
];

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps) {
  // In production, fetch product data here
  const product = mockProduct;

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.short_description || product.description,
    openGraph: {
      title: product.name,
      description: product.short_description || product.description,
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // In production, fetch product by slug
  const product = mockProduct;

  if (!product || params.slug !== product.slug) {
    notFound();
  }

  const primaryImage = product.images[0]?.url || null;

  return (
    <Container className="py-6">
      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          { label: product.category.name, href: `/categories/${product.category.slug}` },
          { label: product.name },
        ]}
        className="mb-6"
      />

      {/* Product Main Section */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Info */}
        <ProductInfo product={product} primaryImage={primaryImage} />
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Separator className="mb-8" />
        <ProductTabs
          description={product.description}
          material={product.material}
          condition={product.condition}
          reviews={[]}
        />
      </div>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <ProductGrid products={relatedProducts} columns={4} />
      </section>
    </Container>
  );
}
