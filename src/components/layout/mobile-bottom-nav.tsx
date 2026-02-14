'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Categories', href: '/categories', icon: Grid },
  { label: 'Search', href: '/search', icon: Search, isSearch: true },
  { label: 'Cart', href: '/cart', icon: ShoppingBag, showBadge: true },
  { label: 'Account', href: '/account', icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { openSearch } = useUIStore();

  // Don't show on certain pages
  const hiddenPaths = ['/checkout', '/admin'];
  if (hiddenPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-md lg:hidden safe-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          if (item.isSearch) {
            return (
              <button
                key={item.label}
                onClick={openSearch}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full gap-1',
                  'text-muted-foreground hover:text-foreground transition-colors',
                  'active:scale-95'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 relative',
                'transition-colors active:scale-95',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.showBadge && cartItemCount > 0 && (
                  <Badge
                    className="absolute -right-2 -top-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px]"
                    variant="default"
                  >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
