import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    icon: 'h-6 w-6',
    iconWrapper: 'h-8 w-8',
    text: 'text-lg',
  },
  md: {
    icon: 'h-6 w-6',
    iconWrapper: 'h-10 w-10',
    text: 'text-xl',
  },
  lg: {
    icon: 'h-8 w-8',
    iconWrapper: 'h-12 w-12',
    text: 'text-2xl',
  },
};

export function Logo({ className, iconOnly = false, size = 'md' }: LogoProps) {
  const sizes = sizeClasses[size];

  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2 font-bold', className)}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-primary',
          sizes.iconWrapper
        )}
      >
        <Leaf className={cn('text-primary-foreground', sizes.icon)} />
      </div>
      {!iconOnly && (
        <span className={cn('hidden sm:inline-block', sizes.text)}>
          Just Stock Trading
        </span>
      )}
    </Link>
  );
}
