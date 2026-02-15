'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { FormField } from '@/components/forms';

import {
  CheckoutSteps,
  AddressForm,
  SavedAddresses,
  ShippingMethods,
  PaymentMethods,
  OrderReview,
  CheckoutSummary,
} from '@/components/features/checkout';

import { useCart } from '@/hooks/use-cart';
import { useAuthContext } from '@/components/providers/auth-provider';
import {
  useCheckoutStore,
  SHIPPING_METHODS,
} from '@/store/checkout-store';
import { getAddresses } from '@/actions/addresses';
import { createOrder, type CreateOrderData } from '@/actions/orders';
import type { AddressFormData } from '@/validators/checkout';
import { EmptyCart } from '@/components/features/cart';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user, profile } = useAuthContext();
  const {
    items,
    subtotal,
    discount,
    shipping: cartShipping,
    total: cartTotal,
    coupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const checkout = useCheckoutStore();

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  // Calculate shipping based on checkout store
  const selectedShipping = checkout.shippingMethod?.price || 0;
  const finalShipping = subtotal >= 50 && checkout.shippingMethod?.id === 'standard'
    ? 0
    : selectedShipping;
  const finalTotal = subtotal - discount + finalShipping;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirectTo=/checkout');
    }
  }, [isAuthenticated, router]);

  // Load saved addresses
  useEffect(() => {
    if (isAuthenticated) {
      getAddresses().then((addresses) => {
        setSavedAddresses(addresses);
        setIsLoadingAddresses(false);

        // Auto-select default address
        const defaultAddr = addresses.find((a: any) => a.is_default);
        if (defaultAddr && !checkout.shippingAddress) {
          handleSelectSavedAddress(defaultAddr);
        }
      });
    }
  }, [isAuthenticated]);

  // Set email from user
  useEffect(() => {
    if (user?.email && !checkout.email) {
      checkout.setEmail(user.email);
    }
  }, [user]);

  const handleSelectSavedAddress = (address: any) => {
    checkout.setShippingAddress({
      firstName: address.first_name,
      lastName: address.last_name,
      company: address.company || '',
      addressLine1: address.address_line1,
      addressLine2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postal_code,
      country: address.country,
      phone: address.phone || '',
    });
    checkout.setSelectedAddressId(address.id);
    setShowNewAddressForm(false);
  };

  const handleNewAddress = (data: AddressFormData) => {
    checkout.setShippingAddress(data);
    checkout.setSelectedAddressId(null);
    setShowNewAddressForm(false);
  };

  const handlePlaceOrder = async () => {
    if (!checkout.shippingAddress || !checkout.shippingMethod || !checkout.paymentMethod) {
      toast.error('Please complete all checkout steps');
      return;
    }

    checkout.setProcessing(true);
    checkout.setError(null);

    try {
      const orderData: CreateOrderData = {
        email: checkout.email,
        phone: checkout.phone,
        shippingAddress: checkout.shippingAddress,
        billingAddress: checkout.useSameAddress ? undefined : checkout.billingAddress || undefined,
        shippingMethodId: checkout.shippingMethod.id,
        shippingCost: finalShipping,
        paymentMethod: checkout.paymentMethod,
        items,
        subtotal,
        discount,
        couponCode: coupon?.code,
        notes: orderNotes,
      };

      const result = await createOrder(orderData);

      if (result.success && result.orderNumber) {
        // Clear cart and checkout state
        clearCart();
        checkout.reset();

        // Redirect to confirmation or payment
        if (checkout.paymentMethod === 'stripe') {
          // TODO: Redirect to Stripe checkout
          router.push(`/checkout/confirmation?order=${result.orderNumber}`);
        } else {
          // TODO: Redirect to Paystack
          router.push(`/checkout/confirmation?order=${result.orderNumber}`);
        }
      } else {
        checkout.setError(result.error || 'Failed to create order');
        toast.error(result.error || 'Failed to create order');
      }
    } catch (error) {
      checkout.setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      checkout.setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-8">
        <EmptyCart />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <Button variant="ghost" asChild>
          <Link href="/cart">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </Button>
      </div>

      <CheckoutSteps />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Information */}
          {checkout.currentStep === 'information' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <FormField label="Email" htmlFor="email" required>
                    <Input
                      id="email"
                      type="email"
                      value={checkout.email}
                      onChange={(e) => checkout.setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </FormField>
                  <FormField label="Phone (optional)" htmlFor="phone">
                    <Input
                      id="phone"
                      type="tel"
                      value={checkout.phone}
                      onChange={(e) => checkout.setPhone(e.target.value)}
                      placeholder="For delivery updates"
                    />
                  </FormField>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>

                {isLoadingAddresses ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : savedAddresses.length > 0 && !showNewAddressForm ? (
                  <SavedAddresses
                    addresses={savedAddresses}
                    selectedId={checkout.selectedAddressId}
                    onSelect={handleSelectSavedAddress}
                    onAddNew={() => setShowNewAddressForm(true)}
                  />
                ) : (
                  <AddressForm
                    defaultValues={checkout.shippingAddress || undefined}
                    onSubmit={handleNewAddress}
                    onCancel={
                      savedAddresses.length > 0
                        ? () => setShowNewAddressForm(false)
                        : undefined
                    }
                    submitLabel="Use This Address"
                  />
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => checkout.nextStep()}
                  disabled={!checkout.email || !checkout.shippingAddress}
                >
                  Continue to Shipping
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Shipping */}
          {checkout.currentStep === 'shipping' && (
            <div className="space-y-6">
              <ShippingMethods
                selectedId={checkout.shippingMethod?.id || null}
                onSelect={checkout.setShippingMethod}
                subtotal={subtotal}
              />

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => checkout.prevStep()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => checkout.nextStep()}
                  disabled={!checkout.shippingMethod}
                >
                  Continue to Payment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {checkout.currentStep === 'payment' && (
            <div className="space-y-6">
              <PaymentMethods
                selected={checkout.paymentMethod}
                onSelect={checkout.setPaymentMethod}
              />

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => checkout.prevStep()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => checkout.nextStep()}
                  disabled={!checkout.paymentMethod}
                >
                  Review Order
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {checkout.currentStep === 'review' && checkout.shippingAddress && checkout.shippingMethod && checkout.paymentMethod && (
            <div className="space-y-6">
              <OrderReview
                items={items}
                email={checkout.email}
                shippingAddress={checkout.shippingAddress}
                billingAddress={checkout.billingAddress}
                shippingMethod={checkout.shippingMethod}
                paymentMethod={checkout.paymentMethod}
                subtotal={subtotal}
                discount={discount}
                shipping={finalShipping}
                total={finalTotal}
                couponCode={coupon?.code}
                onEditStep={checkout.setStep}
              />

              {/* Order Notes */}
              <div>
                <Label htmlFor="notes">Order Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Special instructions for your order..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              {checkout.error && (
                <div className="bg-destructive/10 text-destructive rounded-lg p-4">
                  {checkout.error}
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => checkout.prevStep()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={checkout.isProcessing}
                >
                  {checkout.isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Place Order — {formatCurrency(finalTotal)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              discount={discount}
              shipping={checkout.shippingMethod ? finalShipping : 0}
              total={checkout.shippingMethod ? finalTotal : subtotal - discount}
              coupon={coupon}
              onRemoveCoupon={removeCoupon}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

// Helper
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}
