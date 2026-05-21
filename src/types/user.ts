import type { Tables } from './database';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  emailVerified: boolean;
  hasMfa: boolean;
  isBlocked: boolean;
  lastSignIn: string | null;
  sessionExpiresAt: string | null;
}

export interface UseAuthReturn extends AuthState {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  checkBlockStatus: () => Promise<boolean>;
  checkSession: () => Promise<boolean>;
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
