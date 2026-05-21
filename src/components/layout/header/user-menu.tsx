'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Shield,
  BadgeCheck,
  BadgeAlert,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react';

import { useAuthContext } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/utils/helpers';

export function UserMenu() {
  const router = useRouter();
  const {
    user,
    profile,
    isLoading,
    isAuthenticated,
    isAdmin,
    emailVerified,
    hasMfa,
    lastSignIn,
    sessionExpiresAt,
    signOut,
    checkBlockStatus,
  } = useAuthContext();

  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/register">Sign up</Link>
        </Button>
      </div>
    );
  }

  const displayName = profile?.full_name || user.email || 'User';
  const initials = getInitials(displayName);
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;

  const sessionExpiresAtDate = sessionExpiresAt ? new Date(sessionExpiresAt) : null;
  const sessionExpiringSoon = sessionExpiresAtDate && (sessionExpiresAtDate.getTime() - Date.now()) < 600_000;

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleSignOutAll = async () => {
    await signOut();
    router.push('/');
  };

  const formatLastSignIn = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!emailVerified && (
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive" />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none truncate">{displayName}</p>
              {emailVerified ? (
                <BadgeCheck className="h-4 w-4 flex-shrink-0 text-primary" />
              ) : (
                <BadgeAlert className="h-4 w-4 flex-shrink-0 text-destructive" />
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Security badges */}
        <div className="px-3 py-2">
          <div className="flex flex-wrap gap-1.5">
            {emailVerified ? (
              <Badge variant="success" className="gap-1 text-[10px] px-1.5 py-0">
                <BadgeCheck className="h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge variant="warning" className="gap-1 text-[10px] px-1.5 py-0">
                <BadgeAlert className="h-3 w-3" />
                Unverified
              </Badge>
            )}
            {hasMfa && (
              <Badge variant="default" className="gap-1 text-[10px] px-1.5 py-0">
                <ShieldCheck className="h-3 w-3" />
                2FA
              </Badge>
            )}
            {isAdmin && (
              <Badge variant="default" className="gap-1 text-[10px] px-1.5 py-0">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>
        </div>

        {/* Session expiry warning */}
        {sessionExpiringSoon && (
          <div className="px-3 pb-2">
            <div className="flex items-center gap-1.5 rounded-md bg-warning/10 px-2 py-1.5 text-xs text-warning">
              <AlertTriangle className="h-3 w-3 flex-shrink-0" />
              <span>Session expiring soon</span>
            </div>
          </div>
        )}

        {lastSignIn && (
          <div className="px-3 pb-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Last login: {formatLastSignIn(lastSignIn)}</span>
            </div>
          </div>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>My Account</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/orders" className="cursor-pointer">
              <Package className="mr-2 h-4 w-4" />
              <span>Orders</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/wishlist" className="cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              <span>Wishlist</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/addresses" className="cursor-pointer">
              <MapPin className="mr-2 h-4 w-4" />
              <span>Addresses</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {!hasMfa && isAuthenticated && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account/settings#security" className="cursor-pointer">
                <Fingerprint className="mr-2 h-4 w-4" />
                <span>Enable Two-Factor Auth</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-destructive/80 focus:text-destructive/80 text-xs"
          onClick={handleSignOutAll}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out of all devices</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
