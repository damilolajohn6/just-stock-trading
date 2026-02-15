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
import { createClient } from '@/lib/supabase/server';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Fetch single product by slug
async function getProduct(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:categories!inner(id, name, slug),
      images:product_images(url, alt_text, is_primary, sort_order),
      variants:product_variants(id, size, color, stock_quantity, is_available, price_adjustment)
    `
    )
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    return null;
  }

  // Sort images: primary first, then by sort_order
  const sortedImages = (data.images ?? []).sort((a: any, b: any) => {
    if (b.is_primary !== a.is_primary) return b.is_primary ? 1 : -1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  return {
    ...data,
    images: sortedImages,
    category: data.category,
    variants: data.variants ?? [],
  };
}

// Fetch related products from the same category
async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id, name, slug, price, compare_at_price, condition, brand,
      images:product_images(url, alt_text, is_primary)
    `
    )
    .eq('is_published', true)
    .eq('category_id', categoryId)
    .neq('id', currentProductId)
    .order('created_at', { ascending: false })
    .limit(4);

  if (error || !data) return [];

  return data.map((product: any) => {
    const primaryImage = product.images?.find((img: any) => img.is_primary);
    return {
      ...product,
      image: primaryImage?.url ?? product.images?.[0]?.url ?? null,
    };
  });
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | Just Stock Trading`,
    description: product.short_description || product.description,
    openGraph: {
      title: product.name,
      description: product.short_description || product.description,
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category.id, product.id);
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
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
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
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}
    </Container>
  );
}
