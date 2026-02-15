'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FormField, SubmitButton, PasswordInput } from '@/components/forms';
import { updatePassword } from '@/actions/auth';
import { updatePasswordSchema, type UpdatePasswordFormData } from '@/validators/auth';

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setIsLoading(true);
    try {
      const result = await updatePassword(data);
      if (result.success) {
        toast.success('Password updated successfully');
        reset();
      } else {
        toast.error(result.error || 'Failed to update password');
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
        label="Current Password"
        htmlFor="currentPassword"
        error={errors.currentPassword?.message}
        required
      >
        <PasswordInput
          id="currentPassword"
          {...register('currentPassword')}
          disabled={isLoading}
        />
      </FormField>

      <FormField
        label="New Password"
        htmlFor="newPassword"
        error={errors.newPassword?.message}
        required
      >
        <PasswordInput
          id="newPassword"
          {...register('newPassword')}
          disabled={isLoading}
        />
      </FormField>

      <FormField
        label="Confirm New Password"
        htmlFor="confirmNewPassword"
        error={errors.confirmNewPassword?.message}
        required
      >
        <PasswordInput
          id="confirmNewPassword"
          {...register('confirmNewPassword')}
          disabled={isLoading}
        />
      </FormField>

      <div className="flex justify-end pt-2">
        <SubmitButton isLoading={isLoading} loadingText="Updating...">
          Update Password
        </SubmitButton>
      </div>
    </form>
  );
}
