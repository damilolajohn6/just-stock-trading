import { z } from 'zod';

export const couponSchema = z.object({
  code: z.string().min(3).regex(/^[A-Z0-9]+$/, 'Code must be uppercase alphanumeric'),
  type: z.enum(['percentage', 'fixed', 'free_shipping']),
  value: z.coerce.number().min(0),
  min_purchase: z.coerce.number().min(0).optional(),
  max_uses: z.coerce.number().int().min(1).optional().nullable(),
  starts_at: z.string().optional(),
  expires_at: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type CouponFormData = z.infer<typeof couponSchema>;
