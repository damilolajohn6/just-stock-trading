'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuantitySelector } from '@/components/shared/quantity-selector';
import { PriceDisplay } from '@/components/shared/price-display';
import { Badge } from '@/components/ui/badge';
import type { CartItem } from '@/store/cart-store';
import { cn } from '@/utils/cn';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isCompact?: boolean;
}

export function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
  isCompact = false,
}: CartItemCardProps) {
  const isLowStock = item.maxQuantity <= 3;
  const isOutOfStock = item.maxQuantity === 0;

  return (
    <div
      className={cn(
        'flex gap-4 p-4 rounded-lg border bg-card',
        isOutOfStock && 'opacity-60'
      )}
    >
      {/* Product Image */}
      <Link
        href={`/products/${item.slug}`}
        className={cn(
          'relative flex-shrink-0 overflow-hidden rounded-md bg-muted',
          isCompact ? 'h-20 w-20' : 'h-24 w-24 sm:h-32 sm:w-32'
        )}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes={isCompact ? '80px' : '128px'}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug}`}
              className="font-medium hover:text-primary transition-colors line-clamp-2"
            >
              {item.name}
            </Link>
            
            {/* Variant info */}
            {(item.size || item.color) && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {[item.size, item.color].filter(Boolean).join(' / ')}
              </p>
            )}

            {/* Stock warnings */}
            {isOutOfStock && (
              <Badge variant="destructive" className="mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Out of stock
              </Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge variant="warning" className="mt-1">
                Only {item.maxQuantity} left
              </Badge>
            )}
          </div>

          {/* Remove button - Desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-2">
          {/* Quantity */}
          <QuantitySelector
            value={item.quantity}
            onChange={(qty) => onUpdateQuantity(item.id, qty)}
            max={item.maxQuantity}
            disabled={isOutOfStock}
            className="scale-90 origin-left"
          />

          {/* Price */}
          <div className="text-right">
            <PriceDisplay
              price={item.price * item.quantity}
              compareAtPrice={
                item.originalPrice
                  ? item.originalPrice * item.quantity
                  : undefined
              }
              size="sm"
            />
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                £{item.price.toFixed(2)} each
              </p>
            )}
          </div>
        </div>

        {/* Remove button - Mobile */}
        <Button
          variant="ghost"
          size="sm"
          className="sm:hidden mt-2 self-start text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
}
