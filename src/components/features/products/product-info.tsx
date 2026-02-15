'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Heart,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QuantitySelector } from '@/components/shared/quantity-selector';
import { PriceDisplay } from '@/components/shared/price-display';
import { Rating } from '@/components/shared/rating';
import { useCartStore } from '@/store/cart-store';
import { formatCondition } from '@/utils/format';
import { cn } from '@/utils/cn';

interface ProductVariant {
  id: string;
  size: string;
  color: string | null;
  stock_quantity: number;
  is_available: boolean;
  price_adjustment: number;
}

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    brand: string | null;
    price: number;
    compare_at_price: number | null;
    condition: 'new' | 'like_new' | 'good' | 'fair';
    material: string | null;
    color: string | null;
    variants: ProductVariant[];
    average_rating?: number;
    review_count?: number;
  };
  primaryImage: string | null;
}

export function ProductInfo({ product, primaryImage }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | null>(
    product.variants.find((v) => v.is_available) || product.variants[0] || null
  );
  const [quantity, setQuantity] = React.useState(1);
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const addItem = useCartStore((state) => state.addItem);

  // Get unique sizes and colors
  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.filter((v) => v.color).map((v) => v.color!))];

  const currentPrice = product.price + (selectedVariant?.price_adjustment || 0);
  const isInStock = selectedVariant?.is_available && (selectedVariant?.stock_quantity || 0) > 0;
  const stockQuantity = selectedVariant?.stock_quantity || 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      name: product.name,
      price: currentPrice,
      quantity,
      image: primaryImage,
      size: selectedVariant?.size,
      color: selectedVariant?.color || undefined,
      maxQuantity: stockQuantity,
    });
    toast.success('Added to cart!');
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.short_description || product.name,
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand & Condition */}
      <div className="flex items-center gap-2">
        {product.brand && (
          <Link
            href={`/products?brand=${product.brand}`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {product.brand}
          </Link>
        )}
        <span className="text-muted-foreground">•</span>
        <Badge variant="secondary">{formatCondition(product.condition)}</Badge>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>

      {/* Rating */}
      {product.average_rating !== undefined && (
        <Rating
          value={product.average_rating}
          reviewCount={product.review_count}
          showValue
        />
      )}

      {/* Price */}
      <PriceDisplay
        price={currentPrice}
        compareAtPrice={product.compare_at_price}
        size="lg"
      />

      {/* Short description */}
      {product.short_description && (
        <p className="text-muted-foreground">{product.short_description}</p>
      )}

      <Separator />

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Size</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-auto p-0">
                  <Ruler className="h-4 w-4 mr-1" />
                  Size Guide
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Size Guide</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left">Size</th>
                        <th className="py-2 text-left">Chest (in)</th>
                        <th className="py-2 text-left">Waist (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b"><td className="py-2">XS</td><td>32-34</td><td>26-28</td></tr>
                      <tr className="border-b"><td className="py-2">S</td><td>34-36</td><td>28-30</td></tr>
                      <tr className="border-b"><td className="py-2">M</td><td>38-40</td><td>32-34</td></tr>
                      <tr className="border-b"><td className="py-2">L</td><td>42-44</td><td>36-38</td></tr>
                      <tr className="border-b"><td className="py-2">XL</td><td>46-48</td><td>40-42</td></tr>
                      <tr><td className="py-2">XXL</td><td>50-52</td><td>44-46</td></tr>
                    </tbody>
                  </table>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variant = product.variants.find(
                (v) => v.size === size && (colors.length === 0 || v.color === selectedVariant?.color)
              );
              const available = variant?.is_available && (variant?.stock_quantity || 0) > 0;

              return (
                <button
                  key={size}
                  onClick={() => variant && setSelectedVariant(variant)}
                  disabled={!available}
                  className={cn(
                    'min-w-[3rem] px-4 py-2 text-sm border rounded-md transition-colors',
                    selectedVariant?.size === size
                      ? 'border-primary bg-primary text-primary-foreground'
                      : available
                      ? 'hover:border-primary'
                      : 'opacity-50 cursor-not-allowed line-through'
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Color: <span className="font-normal">{selectedVariant?.color}</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const variant = product.variants.find(
                (v) => v.color === color && v.size === selectedVariant?.size
              );
              const available = variant?.is_available;

              return (
                <button
                  key={color}
                  onClick={() => variant && setSelectedVariant(variant)}
                  disabled={!available}
                  className={cn(
                    'px-4 py-2 text-sm border rounded-md transition-colors',
                    selectedVariant?.color === color
                      ? 'border-primary bg-primary/10'
                      : available
                      ? 'hover:border-primary'
                      : 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {isInStock ? (
          <>
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">
              In Stock
              {stockQuantity <= 5 && ` — Only ${stockQuantity} left!`}
            </span>
          </>
        ) : (
          <span className="text-sm text-destructive">Out of Stock</span>
        )}
      </div>

      {/* Quantity & Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-4">
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          max={stockQuantity}
          disabled={!isInStock}
        />
        <Button
          className="flex-1"
          size="lg"
          onClick={handleAddToCart}
          disabled={!isInStock}
        >
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11"
          onClick={handleWishlist}
        >
          <Heart
            className={cn('h-5 w-5', isWishlisted && 'fill-red-500 text-red-500')}
          />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="flex items-center gap-2 text-sm">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <span>Free shipping over £500</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <RotateCcw className="h-5 w-5 text-muted-foreground" />
          <span>30-day returns</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          <span>Quality guaranteed</span>
        </div>
      </div>
    </div>
  );
}
