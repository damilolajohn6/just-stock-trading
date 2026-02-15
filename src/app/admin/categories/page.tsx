import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import Image from 'next/image';

export default async function AdminCategoriesPage() {
  const supabase = createAdminClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*, parent:categories!parent_id(name)')
    .order('sort_order', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Categories" description="Manage product hierarchy" />
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((cat: any) => (
              <TableRow key={cat.id}>
                <TableCell>
                  {cat.image_url && (
                    <div className="relative h-10 w-10 rounded overflow-hidden">
                      <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                <TableCell>
                  {cat.parent?.name ? (
                    <Badge variant="outline">{cat.parent.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={cat.is_active ? 'default' : 'secondary'}>
                    {cat.is_active ? 'Active' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell>{cat.sort_order}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/categories/${cat.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
