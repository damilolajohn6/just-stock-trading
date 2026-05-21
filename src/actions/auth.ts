'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendWelcomeEmail } from '@/lib/email';
import { checkRateLimit, getRateLimitKey } from '@/lib/auth/rate-limiter';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  profileUpdateSchema,
  type LoginFormData,
  type RegisterFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
  type UpdatePasswordFormData,
  type ProfileUpdateFormData,
} from '@/validators/auth';

export type AuthActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown';
}

export async function signIn(formData: LoginFormData): Promise<AuthActionResponse> {
  const ip = await getClientIp();
  const rateCheck = checkRateLimit(getRateLimitKey(ip, 'signin'), 5, 60_000);

  if (!rateCheck.allowed) {
    const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
    return {
      success: false,
      error: `Too many attempts. Please try again in ${retryAfter} seconds.`,
    };
  }

  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error.message);

    if (error.message.includes('Invalid login credentials')) {
      return {
        success: false,
        error: 'Invalid email or password. Please try again.',
      };
    }

    if (error.message.includes('Email not confirmed')) {
      return {
        success: false,
        error: 'Please verify your email before signing in.',
      };
    }

    return {
      success: false,
      error: error.message,
    };
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from('profiles')
    .select('is_blocked')
    .eq('email', email)
    .single();

  if (profile?.is_blocked) {
    await supabase.auth.signOut();
    return {
      success: false,
      error: 'Your account has been suspended. Please contact support.',
    };
  }

  revalidatePath('/', 'layout');
  return { success: true, message: 'Signed in successfully' };
}

export async function signUp(formData: RegisterFormData): Promise<AuthActionResponse> {
  const ip = await getClientIp();
  const rateCheck = checkRateLimit(getRateLimitKey(ip, 'signup'), 3, 60_000);

  if (!rateCheck.allowed) {
    const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
    return {
      success: false,
      error: `Too many registration attempts. Please try again in ${retryAfter} seconds.`,
    };
  }

  const validatedFields = registerSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, fullName } = validatedFields.data;

  const supabase = await createClient();

  const adminClient = createAdminClient();
  const { data: existingUser } = await adminClient
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return {
      success: false,
      error: 'An account with this email already exists.',
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    console.error('Sign up error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }

  try {
    await sendWelcomeEmail(email, fullName);
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
  }

  return {
    success: true,
    message: 'Please check your email to verify your account.',
  };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function forgotPassword(
  formData: ForgotPasswordFormData
): Promise<AuthActionResponse> {
  const ip = await getClientIp();
  const rateCheck = checkRateLimit(getRateLimitKey(ip, 'forgot-password'), 3, 120_000);

  if (!rateCheck.allowed) {
    const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
    return {
      success: false,
      error: `Too many requests. Please try again in ${retryAfter} seconds.`,
    };
  }

  const validatedFields = forgotPasswordSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) {
    console.error('Forgot password error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    message: 'If an account exists with this email, you will receive a password reset link.',
  };
}

export async function resetPassword(
  formData: ResetPasswordFormData
): Promise<AuthActionResponse> {
  const validatedFields = resetPasswordSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { password } = validatedFields.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error('Reset password error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    message: 'Password updated successfully. You can now sign in with your new password.',
  };
}

export async function updatePassword(
  formData: UpdatePasswordFormData
): Promise<AuthActionResponse> {
  const validatedFields = updatePasswordSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      success: false,
      error: 'You must be logged in to update your password.',
    };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return {
      success: false,
      error: 'Current password is incorrect.',
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Update password error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath('/account/settings');
  return {
    success: true,
    message: 'Password updated successfully.',
  };
}

export async function updateProfile(
  formData: ProfileUpdateFormData
): Promise<AuthActionResponse> {
  const validatedFields = profileUpdateSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { fullName, phone } = validatedFields.data;

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to update your profile.',
    };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone: phone || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    console.error('Update profile error:', error.message);
    return {
      success: false,
      error: 'Failed to update profile. Please try again.',
    };
  }

  await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  revalidatePath('/account');
  return {
    success: true,
    message: 'Profile updated successfully.',
  };
}

export async function signInWithGoogle(): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Google sign in error:', error.message);
    throw error;
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function resendVerificationEmail(
  email: string
): Promise<AuthActionResponse> {
  const ip = await getClientIp();
  const rateCheck = checkRateLimit(getRateLimitKey(ip, 'resend-verification'), 3, 120_000);

  if (!rateCheck.allowed) {
    const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
    return {
      success: false,
      error: `Too many requests. Please try again in ${retryAfter} seconds.`,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  });

  if (error) {
    console.error('Resend verification error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    message: 'Verification email sent. Please check your inbox.',
  };
}

export async function deleteAccount(): Promise<AuthActionResponse> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to delete your account.',
    };
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    console.error('Delete account error:', error.message);
    return {
      success: false,
      error: 'Failed to delete account. Please contact support.',
    };
  }

  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  return {
    success: true,
    message: 'Account deleted successfully.',
  };
}
