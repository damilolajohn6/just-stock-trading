'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { updateStoreSettings, type SettingsFormData } from '@/actions/settings';
import { z } from 'zod';

// Re-define schema for client form to match action
const schema = z.object({
  store_name: z.string().min(1, 'Store name is required'),
  support_email: z.string().email(),
  free_shipping_threshold: z.coerce.number().min(0),
  tax_rate: z.coerce.number().min(0).max(100),
  maintenance_mode: z.boolean(),
  announcement_bar_text: z.string().optional(),
  announcement_bar_active: z.boolean(),
});

interface SettingsFormProps {
  initialData: SettingsFormData;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SettingsFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      const result = await updateStoreSettings(data);
      if (result.success) {
        toast.success('Settings updated successfully');
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic store configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="store_name">Store Name</Label>
            <Input id="store_name" {...register('store_name')} />
            {errors.store_name && <p className="text-sm text-destructive">{errors.store_name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="support_email">Support Email</Label>
            <Input id="support_email" {...register('support_email')} />
            {errors.support_email && <p className="text-sm text-destructive">{errors.support_email.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commerce</CardTitle>
          <CardDescription>Pricing and shipping configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="free_shipping_threshold">Free Shipping Threshold (£)</Label>
              <Input type="number" id="free_shipping_threshold" {...register('free_shipping_threshold')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tax_rate">Tax Rate (%)</Label>
              <Input type="number" id="tax_rate" {...register('tax_rate')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance & Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Disable checkout and show maintenance message</p>
            </div>
            <Switch 
              checked={watch('maintenance_mode')}
              onCheckedChange={(c) => setValue('maintenance_mode', c)}
            />
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label>Announcement Bar</Label>
              <Switch 
                checked={watch('announcement_bar_active')}
                onCheckedChange={(c) => setValue('announcement_bar_active', c)}
              />
            </div>
            {watch('announcement_bar_active') && (
              <Input 
                placeholder="Enter announcement text..." 
                {...register('announcement_bar_text')}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </div>
    </form>
  );
}
