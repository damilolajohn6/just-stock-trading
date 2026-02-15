import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  short_description: z.string().max(160).optional(),
  category_id: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  price: z.coerce.number().min(0),
  compare_at_price: z.coerce.number().min(0).optional(),
  cost_price: z.coerce.number().min(0).optional(),
  condition: z.enum(['new', 'like_new', 'good', 'fair']),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  images: z.array(z.object({
    id: z.string(),
    url: z.string(),
  })).min(1, 'At least one image is required'),
  variants: z.array(z.object({
    size: z.string().min(1, 'Size is required'),
    color: z.string().optional(),
    stock_quantity: z.coerce.number().int().min(0),
    sku: z.string().optional(),
  })).min(1, 'At least one variant is required'),
});

export type ProductFormData = z.infer<typeof productSchema>;
