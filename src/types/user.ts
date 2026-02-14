import type { Tables } from './database';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type Profile = Tables<'profiles'>;
export type Address = Tables<'addresses'>;

export interface User extends SupabaseUser {
  profile?: Profile;
}

export interface UserWithProfile {
  id: string;
  email: string;
  profile: Profile;
}

export type UserRole = Profile['role'];

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Profile update form
export interface ProfileUpdateData {
  full_name: string;
  phone: string;
  avatar_url?: string;
}

// Password change form
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
