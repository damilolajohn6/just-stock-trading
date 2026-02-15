'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, SubmitButton } from '@/components/forms';
import { ImageUploader } from './image-uploader';
import { categorySchema, type CategoryFormData } from '@/validators/category';
import { createCategory, updateCategory } from '@/actions/categories';

interface CategoryFormProps {
  initialData?: any;
  parents: { id: string; name: string }[];
  isEdit?: boolean;
}

export function CategoryForm({ initialData, parents, isEdit = false }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: initialData || {
      is_active: true,
      sort_order: 0,
    },
  });

  const imageUrl = watch('image_url');

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      const result = isEdit 
        ? await updateCategory(initialData.id, data)
        : await createCategory(data);

      if (result.success) {
        toast.success(isEdit ? 'Category updated' : 'Category created');
        router.push('/admin/categories');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      <div className="space-y-4 border p-6 rounded-lg bg-card">
        <FormField label="Name" htmlFor="name" error={errors.name?.message} required>
          <Input id="name" {...register('name')} />
        </FormField>

        <FormField label="Slug" htmlFor="slug" error={errors.slug?.message} required>
          <Input id="slug" {...register('slug')} />
        </FormField>

        <FormField label="Parent Category" htmlFor="parent_id">
          <Select 
            onValueChange={(val) => setValue('parent_id', val === 'none' ? null : val)}
            defaultValue={initialData?.parent_id || 'none'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select parent (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (Top Level)</SelectItem>
              {parents
                .filter(p => p.id !== initialData?.id) // Prevent self-parenting
                .map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormField>

        <div className="space-y-2">
          <Label>Category Image</Label>
          <ImageUploader 
            value={imageUrl ? [{ id: 'current', url: imageUrl }] : []} 
            onChange={(imgs) => setValue('image_url', imgs[0]?.url || '')} 
          />
        </div>

        <FormField label="Description" htmlFor="description">
          <Textarea id="description" {...register('description')} />
        </FormField>

        <div className="flex gap-4">
          <FormField label="Sort Order" htmlFor="sort_order" className="w-32">
            <Input type="number" id="sort_order" {...register('sort_order')} />
          </FormField>

          <div className="flex items-center gap-2 pt-8">
            <Switch 
              id="is_active" 
              checked={watch('is_active')}
              onCheckedChange={(c) => setValue('is_active', c)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
        <SubmitButton isLoading={isLoading}>
          {isEdit ? 'Update Category' : 'Create Category'}
        </SubmitButton>
      </div>
    </form>
  );
}
