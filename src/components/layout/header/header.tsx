'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, Heart } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';
import { DesktopNav } from './desktop-nav';
import { UserMenu } from './user-menu';
import { CartDropdown } from './cart-dropdown';
import { SearchBar } from './search-bar';
import { MobileMenuDrawer } from './mobile-menu-drawer';
import { useUIStore } from '@/store/ui-store';
import { useCartStore } from '@/store/cart-store';
import type { MainNavItem } from '@/constants/navigation';

interface HeaderClientProps {
  navItems?: MainNavItem[];
}

export function HeaderClient({ navItems = [] }: HeaderClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { openMobileMenu, openSearch } = useUIStore();
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-200',
          isScrolled ? 'border-b bg-background/95 shadow-sm backdrop-blur-md' : 'bg-background'
        )}
      >
        {/* Main header */}
        <div className="container">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={openMobileMenu}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>

            {/* Logo */}
            <Logo className="flex-shrink-0" />

            {/* Desktop Navigation */}
            <DesktopNav className="hidden lg:flex" navItems={navItems} />

            {/* Search bar - Desktop */}
            <div className="mx-4 hidden max-w-md flex-1 lg:flex">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search button - Mobile */}
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={openSearch}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

              {/* Wishlist - Desktop */}
              <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Wishlist</span>
                </Link>
              </Button>

              {/* Cart */}
              <CartDropdown />

              {/* User menu */}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <MobileMenuDrawer navItems={navItems} />
    </>
  );
}
