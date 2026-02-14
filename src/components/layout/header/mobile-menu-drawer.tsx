'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  User,
  Heart,
  Package,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';
import { useUIStore } from '@/store/ui-store';
import { useAuthContext } from '@/components/providers/auth-provider';
import { mainNavItems } from '@/constants/navigation';
import { cn } from '@/utils/cn';

export function MobileMenuDrawer() {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { user, profile, isAuthenticated, isAdmin, signOut } = useAuthContext();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleLinkClick = () => {
    closeMobileMenu();
  };

  const handleSignOut = async () => {
    await signOut();
    closeMobileMenu();
  };

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={closeMobileMenu}>
      <SheetContent side="left" className="flex flex-col p-0 w-[300px]">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left">
            <Logo size="sm" />
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <nav className="p-4">
            {/* Main navigation */}
            <ul className="space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium',
                          'hover:bg-accent hover:text-accent-foreground',
                          pathname.startsWith(item.href) && 'bg-accent'
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            expandedItems.includes(item.label) && 'rotate-180'
                          )}
                        />
                      </button>
                      {expandedItems.includes(item.label) && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={handleLinkClick}
                                className={cn(
                                  'block rounded-md px-3 py-2 text-sm',
                                  'hover:bg-accent hover:text-accent-foreground',
                                  pathname === child.href &&
                                    'bg-accent text-accent-foreground'
                                )}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        'flex items-center rounded-md px-3 py-2 text-sm font-medium',
                        'hover:bg-accent hover:text-accent-foreground',
                        pathname === item.href && 'bg-accent text-accent-foreground'
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <Separator className="my-4" />

            {/* Account section */}
            {isAuthenticated && user ? (
              <div className="space-y-1">
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </p>
                <Link
                  href="/account"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  <User className="h-4 w-4" />
                  My Account
                </Link>
                <Link
                  href="/account/orders"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  <Package className="h-4 w-4" />
                  Orders
                </Link>
                <Link
                  href="/wishlist"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  <Heart className="h-4 w-4" />
                  Wishlist
                </Link>
                <Link
                  href="/account/settings"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent text-primary"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}

                <Separator className="my-2" />

                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button className="w-full" asChild onClick={handleLinkClick}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                  onClick={handleLinkClick}
                >
                  <Link href="/register">Create Account</Link>
                </Button>
              </div>
            )}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
