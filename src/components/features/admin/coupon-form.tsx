'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormField, SubmitButton } from '@/components/forms';
import { couponSchema, type CouponFormData } from '@/validators/coupon';
import { createCoupon } from '@/actions/coupons';

export function CouponForm() {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema) as any,
    defaultValues: {
      is_active: true,
      type: 'percentage',
    },
  });

  const onSubmit = async (data: CouponFormData) => {
    const result = await createCoupon(data);
    if (result.success) {
      toast.success('Coupon created');
      router.push('/admin/coupons');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg border max-w-2xl">
      <FormField label="Coupon Code" htmlFor="code" error={errors.code?.message} required>
        <Input 
          id="code" 
          {...register('code')} 
          placeholder="SUMMER20" 
          onChange={(e) => setValue('code', e.target.value.toUpperCase())}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Type" htmlFor="type">
          <Select 
            onValueChange={(val: any) => setValue('type', val)} 
            defaultValue="percentage"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount (£)</SelectItem>
              <SelectItem value="free_shipping">Free Shipping</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Value" htmlFor="value" error={errors.value?.message} required>
          <Input type="number" id="value" {...register('value')} disabled={watch('type') === 'free_shipping'} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Min. Purchase (£)" htmlFor="min_purchase">
          <Input type="number" id="min_purchase" {...register('min_purchase')} />
        </FormField>
        <FormField label="Usage Limit" htmlFor="max_uses">
          <Input type="number" id="max_uses" {...register('max_uses')} placeholder="Unlimited" />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start Date" htmlFor="starts_at">
          <Input type="datetime-local" id="starts_at" {...register('starts_at')} />
        </FormField>
        <FormField label="Expiration Date" htmlFor="expires_at">
          <Input type="datetime-local" id="expires_at" {...register('expires_at')} />
        </FormField>
      </div>

      <div className="flex items-center gap-2">
        <Switch 
          checked={watch('is_active')}
          onCheckedChange={(c) => setValue('is_active', c)}
        />
        <Label>Active</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
        <SubmitButton isLoading={isSubmitting}>Create Coupon</SubmitButton>
      </div>
    </form>
  );
}
