'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';
import type { MainNavItem } from '@/constants/navigation';

interface DesktopNavProps {
  className?: string;
  navItems?: MainNavItem[];
}

export function DesktopNav({ className, navItems = [] }: DesktopNavProps) {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout>(undefined);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenMenu(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  };

  return (
    <nav className={cn('flex items-center gap-1', className)}>
      {navItems.map((item) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => handleMouseEnter(item.label)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={item.href}
            className={cn(
              'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              openMenu === item.label && 'bg-accent text-accent-foreground'
            )}
          >
            {item.label}
            {item.children && (
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  openMenu === item.label && 'rotate-180'
                )}
              />
            )}
          </Link>

          {/* Mega menu dropdown */}
          {item.children && openMenu === item.label && (
            <div
              className="absolute left-0 top-full pt-2"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="min-w-[200px] rounded-lg border bg-background p-4 shadow-lg">
                <div className="space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'block rounded-md px-3 py-2 text-sm transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        child.description && 'pb-3'
                      )}
                    >
                      <span className="font-medium">{child.label}</span>
                      {child.description && (
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {child.description}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
