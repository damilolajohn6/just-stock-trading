'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/shared/price-display';
import { formatCondition, formatRelativeTime } from '@/utils/format';
import type { WishlistItem } from '@/store/wishlist-store';

interface WishlistItemCardProps {
  item: WishlistItem;
  onRemove: (productId: string) => void;
  onMoveToCart: (item: WishlistItem) => void;
}

export function WishlistItemCard({
  item,
  onRemove,
  onMoveToCart,
}: WishlistItemCardProps) {
  return (
    <div className="group relative border rounded-lg overflow-hidden bg-card">
      {/* Product Image */}
      <Link
        href={`/products/${item.slug}`}
        className="relative aspect-[3/4] block bg-muted"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {/* Remove button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            onRemove(item.productId);
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove from wishlist</span>
        </Button>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {item.brand && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {item.brand}
          </p>
        )}
        <Link
          href={`/products/${item.slug}`}
          className="font-medium hover:text-primary transition-colors line-clamp-2 mt-1"
        >
          {item.name}
        </Link>
        <Badge variant="secondary" className="mt-2">
          {formatCondition(item.condition)}
        </Badge>

        <PriceDisplay
          price={item.price}
          compareAtPrice={item.originalPrice}
          size="md"
          className="mt-2"
        />

        <p className="text-xs text-muted-foreground mt-2">
          Added {formatRelativeTime(item.addedAt)}
        </p>

        {/* Add to Cart button */}
        <Button
          className="w-full mt-4"
          size="sm"
          onClick={() => onMoveToCart(item)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
