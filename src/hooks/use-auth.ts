'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getClient } from '@/lib/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { Profile, UseAuthReturn } from '@/types/user';

type User = SupabaseUser;

interface AuthState {
  user: SupabaseUser | null;
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

const INITIAL_STATE: AuthState = {
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  emailVerified: false,
  hasMfa: false,
  isBlocked: false,
  lastSignIn: null,
  sessionExpiresAt: null,
};

const BLOCK_CHECK_INTERVAL = 120_000;
const SESSION_HEALTH_INTERVAL = 300_000;

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(INITIAL_STATE);
  const supabase = getClient();
  const userRef = useRef(state.user);
  const blockIntervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const sessionIntervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  userRef.current = state.user;

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
  }, []);

  const buildAuthState = useCallback(async (
    session: Session | null,
    profile: Profile | null,
    loading = false,
  ): Promise<AuthState> => {
    const user = session?.user ?? null;
    const emailVerified = user?.email_confirmed_at ? true : profile?.email_verified ?? false;

    let hasMfa = false;
    if (user) {
      try {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        hasMfa = (factors?.all ?? []).some((f: any) => f.status === 'verified' || f.verified === true);
      } catch {
        hasMfa = false;
      }
    }

    const expiresAt = session?.expires_at
      ? new Date(session.expires_at * 1000).toISOString()
      : null;

    const lastSignIn = user?.last_sign_in_at ?? null;

    return {
      user,
      profile,
      session,
      isLoading: loading,
      isAuthenticated: !!user,
      isAdmin: profile?.role === 'admin',
      emailVerified,
      hasMfa,
      isBlocked: profile?.is_blocked ?? false,
      lastSignIn,
      sessionExpiresAt: expiresAt,
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    const currentUser = userRef.current;
    if (!currentUser) return;

    const profile = await fetchProfile(currentUser.id);
    setState((prev) => ({
      ...prev,
      profile,
      isAdmin: profile?.role === 'admin',
      emailVerified: profile?.email_verified ?? prev.emailVerified,
      isBlocked: profile?.is_blocked ?? false,
    }));
  }, [fetchProfile]);

  const checkBlockStatus = useCallback(async () => {
    const currentUser = userRef.current;
    if (!currentUser) return false;

    const profile = await fetchProfile(currentUser.id);
    if (profile?.is_blocked) {
      await supabase.auth.signOut();
      setState({ ...INITIAL_STATE, isLoading: false });
      router.push('/login?error=account_suspended');
      return true;
    }

    setState((prev) => ({ ...prev, isBlocked: false }));
    return false;
  }, [fetchProfile, supabase, router]);

  const checkSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      const newState = await buildAuthState(session, profile);
      setState(newState);
      return true;
    }

    setState({ ...INITIAL_STATE, isLoading: false });
    return false;
  }, [fetchProfile, buildAuthState]);

  const refreshSession = useCallback(async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession();

    if (error || !session?.user) {
      setState({ ...INITIAL_STATE, isLoading: false });
      return;
    }

    const profile = await fetchProfile(session.user.id);
    const newState = await buildAuthState(session, profile);
    setState(newState);
  }, [supabase, fetchProfile, buildAuthState]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();

    setState({ ...INITIAL_STATE, isLoading: false });

    router.push('/');
    router.refresh();
  }, [supabase, router]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          const newState = await buildAuthState(session, profile);
          setState(newState);
        } else {
          setState({ ...INITIAL_STATE, isLoading: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchProfile(session.user.id);
          const newState = await buildAuthState(session, profile);
          setState(newState);
          router.refresh();
        } else if (event === 'SIGNED_OUT') {
          setState({ ...INITIAL_STATE, isLoading: false });
          router.refresh();
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setState((prev) => ({
            ...prev,
            session,
            user: session.user ?? prev.user,
          }));
        } else if (event === 'USER_UPDATED' && session?.user) {
          const profile = await fetchProfile(session.user.id);
          const newState = await buildAuthState(session, profile);
          setState(newState);
        }
      }
    );

    blockIntervalRef.current = setInterval(async () => {
      if (userRef.current) {
        await checkBlockStatus();
      }
    }, BLOCK_CHECK_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    sessionIntervalRef.current = setInterval(async () => {
      if (userRef.current) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.expires_at) {
          const expiresAt = session.expires_at * 1000;
          const timeUntilExpiry = expiresAt - Date.now();

          if (timeUntilExpiry < 300_000 && timeUntilExpiry > 0) {
            await refreshSession();
          }

          setState((prev) => ({
            ...prev,
            sessionExpiresAt: new Date(expiresAt).toISOString(),
          }));
        }
      }
    }, SESSION_HEALTH_INTERVAL);

    return () => {
      subscription.unsubscribe();
      if (blockIntervalRef.current) clearInterval(blockIntervalRef.current);
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [supabase, fetchProfile, buildAuthState, router, checkBlockStatus, refreshSession, checkSession]);

  return {
    ...state,
    signOut,
    refreshSession,
    refreshProfile,
    checkBlockStatus,
    checkSession,
  };
}
