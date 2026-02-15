'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AnnouncementBarProps {
  className?: string;
}

export function AnnouncementBar({ className }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'relative bg-primary text-primary-foreground py-2 text-center text-sm',
        className
      )}
    >
      <div className="container flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 hidden sm:inline" />
        <span>
          <strong>Flash Sale:</strong> Extra 20% off with code{' '}
          <Link href="/products?sale=true" className="underline font-semibold">
            THRIFT20
          </Link>
          {' '}— Ends in 24 hours!
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
        aria-label="Close announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
