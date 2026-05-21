'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit, getRateLimitKey } from './rate-limiter';

export type SessionInfo = {
  id: string;
  createdAt: string;
  lastActive: string;
  userAgent: string | null;
  ip: string | null;
  isCurrent: boolean;
};

export async function getActiveSessions(): Promise<SessionInfo[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: { session: currentSession } } = await supabase.auth.getSession();

  const sessions: SessionInfo[] = [];

  const currentSessionId = currentSession?.user?.id ?? '';

  if (currentSession) {
    sessions.push({
      id: currentSession.user?.id ?? 'current',
      createdAt: currentSession.user?.created_at ?? new Date().toISOString(),
      lastActive: new Date().toISOString(),
      userAgent: null,
      ip: null,
      isCurrent: true,
    });
  }

  return sessions;
}

export async function revokeAllOtherSessions(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const adminClient = createAdminClient();
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: { session_version: Date.now().toString() },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Failed to revoke sessions' };
  }
}

export async function logAuthActivity(action: string): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? null;
    const userAgent = headersList.get('user-agent') ?? null;

    await supabase.from('page_views').insert({
      user_id: user.id,
      page_path: `/auth/${action}`,
      user_agent: userAgent,
      ip_address: ipAddress,
    });
  } catch {
    // Silent fail for activity logging
  }
}

export async function checkAccountBlocked(userId: string): Promise<{ blocked: boolean; reason?: string }> {
  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from('profiles')
    .select('is_blocked')
    .eq('id', userId)
    .single();

  if (profile?.is_blocked) {
    return { blocked: true, reason: 'Your account has been suspended. Please contact support.' };
  }

  return { blocked: false };
}

export async function getMFAStatus(): Promise<{ enabled: boolean; factors: { id: string; type: string; verified: boolean; createdAt: string }[] }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { enabled: false, factors: [] };
  }

  const { data: factors, error } = await supabase.auth.mfa.listFactors();

  if (error || !factors) {
    return { enabled: false, factors: [] };
  }

  const verifiedFactors = (factors.all ?? []).map((f: any) => ({
    id: f.id,
    type: f.factor_type ?? f.type ?? 'totp',
    verified: f.status === 'verified' || f.verified === true,
    createdAt: f.created_at ?? '',
  }));

  return {
    enabled: verifiedFactors.some((f) => f.verified),
    factors: verifiedFactors,
  };
}

export async function checkSessionHealth(): Promise<{ valid: boolean; expiresAt: string | null }> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { valid: false, expiresAt: null };
  }

  const expiresAt = session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null;

  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : true;
  if (isExpired) {
    try {
      const { data } = await supabase.auth.refreshSession();
      if (data.session) {
        return {
          valid: true,
          expiresAt: data.session.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : null,
        };
      }
    } catch {
      return { valid: false, expiresAt: null };
    }
  }

  return { valid: true, expiresAt };
}

export async function getPasswordStrength(password: string): Promise<{ score: number; label: string; color: string }> {
  let score = 0;

  if (password.length >= 8) score += 15;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 5;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[a-z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  if (/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password)) score += 15;

  if (score < 30) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score < 50) return { score, label: 'Fair', color: 'bg-orange-500' };
  if (score < 70) return { score, label: 'Good', color: 'bg-yellow-500' };
  if (score < 85) return { score, label: 'Strong', color: 'bg-lime-500' };
  return { score: 100, label: 'Very Strong', color: 'bg-green-500' };
}
