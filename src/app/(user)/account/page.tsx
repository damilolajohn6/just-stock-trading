import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { getUserWithProfile } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/utils/helpers';

const quickLinks = [
  {
    title: 'Orders',
    description: 'Track and manage your orders',
    href: '/account/orders',
    icon: Package,
  },
  {
    title: 'Wishlist',
    description: 'Items you saved for later',
    href: '/account/wishlist',
    icon: Heart,
  },
  {
    title: 'Addresses',
    description: 'Manage shipping addresses',
    href: '/account/addresses',
    icon: MapPin,
  },
  {
    title: 'Settings',
    description: 'Account preferences and security',
    href: '/account/settings',
    icon: Settings,
  },
];

export default async function AccountPage() {
  const result = await getUserWithProfile();

  if (!result) {
    redirect('/login?redirectTo=/account');
  }

  const { user, profile } = result;
  const displayName = profile?.full_name || user.email || 'User';
  const initials = getInitials(displayName);

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/account/settings">Edit Profile</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((link) => (
          <Card key={link.href} className="hover:shadow-md transition-shadow">
            <Link href={link.href}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <link.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Recent orders placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/account/orders">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No orders yet</p>
            <Button className="mt-4" asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
