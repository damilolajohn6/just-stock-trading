'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart-store';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';

export function CartDropdown() {
  const {
    items,
    isOpen,
    openCart,
    closeCart,
    removeItem,
    updateQuantity,
    getItemCount,
    getSubtotal,
  } = useCartStore();

  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  return (
    <>
      {/* Cart trigger button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={openCart}
      >
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
            variant="default"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
        <span className="sr-only">Open cart</span>
      </Button>

      {/* Cart drawer */}
      <Sheet open={isOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
        <SheetContent className="flex flex-col w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart
              {itemCount > 0 && (
                <span className="text-muted-foreground font-normal">
                  ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <div className="rounded-full bg-muted p-6">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add some items to get started
                </p>
              </div>
              <Button onClick={closeCart} asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4 py-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Product image */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Product info */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-sm line-clamp-1">
                              {item.name}
                            </h4>
                            {(item.size || item.color) && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {[item.size, item.color].filter(Boolean).join(' / ')}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 -mr-2"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.maxQuantity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Price */}
                          <p className="font-semibold text-sm">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-4 pt-4 border-t">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Action buttons */}
                <div className="grid gap-2">
                  <Button asChild onClick={closeCart}>
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                  <Button variant="outline" asChild onClick={closeCart}>
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
