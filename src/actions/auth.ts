'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
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

// Response type for auth actions
export type AuthActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

// ============================================
// SIGN IN
// ============================================

export async function signIn(formData: LoginFormData): Promise<AuthActionResponse> {
  // Validate input
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
    
    // Map error messages to user-friendly ones
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

  // Check if user is blocked
  const { data: profile } = await supabase
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

// ============================================
// SIGN UP
// ============================================

export async function signUp(formData: RegisterFormData): Promise<AuthActionResponse> {
  // Validate input
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

  // Check if email already exists
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

  return {
    success: true,
    message: 'Please check your email to verify your account.',
  };
}

// ============================================
// SIGN OUT
// ============================================

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

// ============================================
// FORGOT PASSWORD
// ============================================

export async function forgotPassword(
  formData: ForgotPasswordFormData
): Promise<AuthActionResponse> {
  // Validate input
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

  // Always return success to prevent email enumeration
  return {
    success: true,
    message: 'If an account exists with this email, you will receive a password reset link.',
  };
}

// ============================================
// RESET PASSWORD
// ============================================

export async function resetPassword(
  formData: ResetPasswordFormData
): Promise<AuthActionResponse> {
  // Validate input
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

// ============================================
// UPDATE PASSWORD (when logged in)
// ============================================

export async function updatePassword(
  formData: UpdatePasswordFormData
): Promise<AuthActionResponse> {
  // Validate input
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

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      success: false,
      error: 'You must be logged in to update your password.',
    };
  }

  // Verify current password by attempting to sign in
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

  // Update password
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

  return {
    success: true,
    message: 'Password updated successfully.',
  };
}

// ============================================
// UPDATE PROFILE
// ============================================

export async function updateProfile(
  formData: ProfileUpdateFormData
): Promise<AuthActionResponse> {
  // Validate input
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

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to update your profile.',
    };
  }

  // Update profile in database
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

  // Also update auth metadata
  await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  revalidatePath('/account');
  return {
    success: true,
    message: 'Profile updated successfully.',
  };
}

// ============================================
// OAUTH SIGN IN
// ============================================

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

// ============================================
// RESEND VERIFICATION EMAIL
// ============================================

export async function resendVerificationEmail(
  email: string
): Promise<AuthActionResponse> {
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

// ============================================
// DELETE ACCOUNT
// ============================================

export async function deleteAccount(): Promise<AuthActionResponse> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to delete your account.',
    };
  }

  // Use admin client to delete user
  const adminClient = createAdminClient();

  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    console.error('Delete account error:', error.message);
    return {
      success: false,
      error: 'Failed to delete account. Please contact support.',
    };
  }

  // Sign out
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  return {
    success: true,
    message: 'Account deleted successfully.',
  };
}
