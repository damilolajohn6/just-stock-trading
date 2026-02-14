'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

import { resetPasswordSchema, type ResetPasswordFormData } from '@/validators/auth';
import { resetPassword } from '@/actions/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormField, SubmitButton, PasswordInput } from '@/components/forms';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Check if the user has a valid session from the reset link
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsValidLink(true);
      } else {
        setIsValidLink(false);
      }
    };

    checkSession();
  }, []);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPassword(data);

      if (result.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking session
  if (isValidLink === null) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Verifying reset link...</p>
      </div>
    );
  }

  // Invalid or expired link
  if (isValidLink === false) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Invalid or expired link</h1>
        <p className="text-muted-foreground mt-2 mb-6">
          This password reset link is invalid or has expired. 
          Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center text-primary hover:underline font-medium"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Password updated!</h1>
        <p className="text-muted-foreground mt-2 mb-6">
          Your password has been successfully updated. 
          Redirecting you to sign in...
        </p>
        <Link
          href="/login"
          className="inline-flex items-center text-primary hover:underline font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your new password below
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="New Password"
          htmlFor="password"
          error={errors.password?.message}
          required
        >
          <PasswordInput
            id="password"
            placeholder="Enter new password"
            autoComplete="new-password"
            disabled={isLoading}
            error={!!errors.password}
            {...register('password')}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </FormField>

        <FormField
          label="Confirm New Password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
          required
        >
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm new password"
            autoComplete="new-password"
            disabled={isLoading}
            error={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
        </FormField>

        <SubmitButton
          className="w-full"
          isLoading={isLoading}
          loadingText="Updating password..."
        >
          Update password
        </SubmitButton>
      </form>

      <p className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>
      </p>
    </>
  );
}
