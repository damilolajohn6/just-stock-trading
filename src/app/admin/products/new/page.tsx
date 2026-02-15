import { createAdminClient } from '@/lib/supabase/admin';
import { ProductForm } from '@/components/features/admin/product-form';
import { PageHeader } from '@/components/shared/page-header';

export default async function NewProductPage() {
  const supabase = createAdminClient();
  const { data: categories } = await supabase.from('categories').select('id, name');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader title="New Product" description="Add a new item to your store" />
      <ProductForm categories={categories || []} />
    </div>
  );
}
