'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';
import { calculateDiscountPercentage } from '@/utils/helpers';
import { CONDITION_LABELS } from '@/types/product';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    condition: 'new' | 'like_new' | 'good' | 'fair';
    brand?: string | null;
    image?: string | null;
    images?: { url: string; alt_text?: string | null }[];
    category?: string;
    isNew?: boolean;
    isTrending?: boolean;
  };
  className?: string;
  showQuickActions?: boolean;
  aspectRatio?: 'square' | 'portrait';
}

export function ProductCard({
  product,
  className,
  showQuickActions = true,
  aspectRatio = 'portrait',
}: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  
  const { isInWishlist, toggleItem } = useWishlist();
  const { addItem } = useCart();

  const isWishlisted = isInWishlist(product.id);
  const images = product.images || (product.image ? [{ url: product.image }] : []);
  const hasMultipleImages = images.length > 1;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? calculateDiscountPercentage(product.compareAtPrice!, product.price)
    : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasMultipleImages) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const index = Math.floor((x / width) * images.length);
    setCurrentImageIndex(Math.min(index, images.length - 1));
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.compareAtPrice || undefined,
      image: images[0]?.url || null,
      brand: product.brand || undefined,
      condition: product.condition,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      productId: product.id,
      variantId: null,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.compareAtPrice || undefined,
      quantity: 1,
      image: images[0]?.url || null,
      maxQuantity: 10,
    });
  };

  return (
    <article
      className={cn('group relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div
          className={cn(
            'relative overflow-hidden rounded-lg bg-muted',
            aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
          )}
          onMouseMove={handleMouseMove}
        >
          {/* Product Image */}
          {images.length > 0 ? (
            <Image
              src={images[currentImageIndex]?.url || '/images/placeholder-product.png'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}

          {/* Image indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1 rounded-full transition-all',
                    index === currentImageIndex
                      ? 'w-4 bg-white'
                      : 'w-1 bg-white/50'
                  )}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercentage}%
              </Badge>
            )}
            {product.isNew && (
              <Badge variant="default" className="text-xs bg-blue-500">
                New
              </Badge>
            )}
            {product.isTrending && (
              <Badge variant="secondary" className="text-xs">
                Trending
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <div
              className={cn(
                'absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-200',
                isHovered ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full shadow-md"
                onClick={handleWishlistClick}
              >
                <Heart
                  className={cn(
                    'h-4 w-4',
                    isWishlisted && 'fill-red-500 text-red-500'
                  )}
                />
                <span className="sr-only">
                  {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                </span>
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full shadow-md"
                asChild
              >
                <Link href={`/products/${product.slug}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">Quick view</span>
                </Link>
              </Button>
            </div>
          )}

          {/* Add to Cart Button */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-3 transition-all duration-300',
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            )}
          >
            <Button 
              className="w-full shadow-lg" 
              size="sm"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-3 space-y-1">
          {product.brand && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.brand}
            </p>
          )}
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {CONDITION_LABELS[product.condition]}
          </p>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base">
              {formatCurrency(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
