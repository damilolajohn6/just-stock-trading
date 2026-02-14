'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '@/types/user';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface UseAuthReturn extends AuthState {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
  });

  const supabase = createClient();

  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as Profile;
  }, [supabase]);

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (!state.user) return;

    const profile = await fetchProfile(state.user.id);
    
    setState((prev) => ({
      ...prev,
      profile,
      isAdmin: profile?.role === 'admin',
    }));
  }, [state.user, fetchProfile]);

  // Refresh session
  const refreshSession = useCallback(async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Error refreshing session:', error);
      return;
    }

    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      
      setState({
        user: session.user,
        profile,
        session,
        isLoading: false,
        isAuthenticated: true,
        isAdmin: profile?.role === 'admin',
      });
    }
  }, [supabase, fetchProfile]);

  // Sign out
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    
    setState({
      user: null,
      profile: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      isAdmin: false,
    });

    router.push('/');
    router.refresh();
  }, [supabase, router]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);

          setState({
            user: session.user,
            profile,
            session,
            isLoading: false,
            isAuthenticated: true,
            isAdmin: profile?.role === 'admin',
          });
        } else {
          setState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchProfile(session.user.id);

          setState({
            user: session.user,
            profile,
            session,
            isLoading: false,
            isAuthenticated: true,
            isAdmin: profile?.role === 'admin',
          });

          router.refresh();
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false,
          });

          router.refresh();
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setState((prev) => ({
            ...prev,
            session,
            user: session.user,
          }));
        } else if (event === 'USER_UPDATED' && session?.user) {
          const profile = await fetchProfile(session.user.id);

          setState((prev) => ({
            ...prev,
            user: session.user,
            profile,
            isAdmin: profile?.role === 'admin',
          }));
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile, router]);

  return {
    ...state,
    signOut,
    refreshSession,
    refreshProfile,
  };
}
