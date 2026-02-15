import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { CategoryForm } from '@/components/features/admin/category-form';
import { PageHeader } from '@/components/shared/page-header';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  
  const [catRes, parentsRes] = await Promise.all([
    supabase.from('categories').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('id, name').is('parent_id', null).order('name')
  ]);

  if (!catRes.data) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Category" description={`Editing ${catRes.data.name}`} />
      <CategoryForm 
        initialData={catRes.data} 
        parents={parentsRes.data || []} 
        isEdit 
      />
    </div>
  );
}
