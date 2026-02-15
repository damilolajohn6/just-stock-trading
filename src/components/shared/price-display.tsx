import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: {
    price: 'text-base',
    compare: 'text-sm',
  },
  md: {
    price: 'text-lg',
    compare: 'text-base',
  },
  lg: {
    price: 'text-2xl',
    compare: 'text-lg',
  },
};

export function PriceDisplay({
  price,
  compareAtPrice,
  size = 'md',
  className,
}: PriceDisplayProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('font-bold', sizeClasses[size].price)}>
        {formatCurrency(price)}
      </span>
      {hasDiscount && (
        <span
          className={cn(
            'text-muted-foreground line-through',
            sizeClasses[size].compare
          )}
        >
          {formatCurrency(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
