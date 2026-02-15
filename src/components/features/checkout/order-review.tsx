'use client';

import Image from 'next/image';
import { Pencil, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/format';
import type { CartItem } from '@/store/cart-store';
import type { AddressFormData } from '@/validators/checkout';
import type { ShippingMethod } from '@/store/checkout-store';

interface OrderReviewProps {
  items: CartItem[];
  email: string;
  shippingAddress: AddressFormData;
  billingAddress: AddressFormData | null;
  shippingMethod: ShippingMethod;
  paymentMethod: 'stripe' | 'paystack';
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  onEditStep: (step: 'information' | 'shipping' | 'payment') => void;
}

export function OrderReview({
  items,
  email,
  shippingAddress,
  billingAddress,
  shippingMethod,
  paymentMethod,
  subtotal,
  discount,
  shipping,
  total,
  couponCode,
  onEditStep,
}: OrderReviewProps) {
  const formatAddress = (addr: AddressFormData) => (
    <>
      <p className="font-medium">
        {addr.firstName} {addr.lastName}
      </p>
      {addr.company && <p>{addr.company}</p>}
      <p>{addr.addressLine1}</p>
      {addr.addressLine2 && <p>{addr.addressLine2}</p>}
      <p>
        {addr.city}, {addr.state} {addr.postalCode}
      </p>
      <p>{addr.country === 'GB' ? 'United Kingdom' : addr.country}</p>
      {addr.phone && <p>{addr.phone}</p>}
    </>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Your Order</h2>

      {/* Contact & Addresses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Contact</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep('information')}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        {/* Shipping Address */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Ship to</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep('information')}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatAddress(shippingAddress)}
          </div>
        </div>

        {/* Shipping Method */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Shipping Method</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep('shipping')}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {shippingMethod.name} — {shippingMethod.estimatedDays}
            <br />
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </p>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Payment</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep('payment')}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
          <p className="text-sm text-muted-foreground capitalize">
            {paymentMethod === 'stripe' ? 'Credit / Debit Card' : 'Paystack'}
          </p>
        </div>
      </div>

      <Separator />

      {/* Order Items */}
      <div>
        <h3 className="font-medium mb-4">Order Items ({items.length})</h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
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
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                {(item.size || item.color) && (
                  <p className="text-sm text-muted-foreground">
                    {[item.size, item.color].filter(Boolean).join(' / ')}
                  </p>
                )}
              </div>
              <p className="font-medium">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Order Summary */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount {couponCode && `(${couponCode})`}</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
