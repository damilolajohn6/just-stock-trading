import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { ProductForm } from '@/components/features/admin/product-form';
import { PageHeader } from '@/components/shared/page-header';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  
  const [productRes, categoriesRes] = await Promise.all([
    supabase
      .from('products')
      .select('*, images:product_images(*), variants:product_variants(*)')
      .eq('id', params.id)
      .single(),
    supabase.from('categories').select('id, name')
  ]);

  if (!productRes.data) notFound();

  // Format images for the uploader
  const formattedProduct = {
    ...productRes.data,
    images: productRes.data.images.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => ({
      id: img.public_id,
      url: img.url,
    })),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader title="Edit Product" description={`Editing ${formattedProduct.name}`} />
      <ProductForm 
        categories={categoriesRes.data || []} 
        initialData={formattedProduct}
        isEdit 
      />
    </div>
  );
}
