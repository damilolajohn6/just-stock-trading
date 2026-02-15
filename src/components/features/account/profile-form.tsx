'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { FormField, SubmitButton } from '@/components/forms';
import { updateProfile } from '@/actions/users';
import { profileUpdateSchema, type ProfileUpdateFormData } from '@/validators/auth';

interface ProfileFormProps {
  defaultValues: {
    fullName: string;
    email: string;
    phone?: string | null;
  };
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: defaultValues.fullName,
      phone: defaultValues.phone || '',
    },
  });

  const onSubmit = async (data: ProfileUpdateFormData) => {
    setIsLoading(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Full Name"
        htmlFor="fullName"
        error={errors.fullName?.message}
        required
      >
        <Input
          id="fullName"
          {...register('fullName')}
          disabled={isLoading}
        />
      </FormField>

      <FormField
        label="Email"
        htmlFor="email"
      >
        <Input
          id="email"
          value={defaultValues.email}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Email cannot be changed directly. Contact support for help.
        </p>
      </FormField>

      <FormField
        label="Phone Number"
        htmlFor="phone"
        error={errors.phone?.message}
      >
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="Optional"
          disabled={isLoading}
        />
      </FormField>

      <div className="flex justify-end pt-2">
        <SubmitButton isLoading={isLoading} loadingText="Saving...">
          Save Changes
        </SubmitButton>
      </div>
    </form>
  );
}
