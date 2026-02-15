import { createAdminClient } from '@/lib/supabase/admin';
import { CategoryForm } from '@/components/features/admin/category-form';
import { PageHeader } from '@/components/shared/page-header';

export default async function NewCategoryPage() {
  const supabase = createAdminClient();
  const { data: parents } = await supabase
    .from('categories')
    .select('id, name')
    .is('parent_id', null) // Only top-level can be parents for now
    .order('name');

  return (
    <div className="space-y-6">
      <PageHeader title="New Category" description="Create a category" />
      <CategoryForm parents={parents || []} />
    </div>
  );
}
