'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { processPayment } from '@/actions/payments';
import { formatCurrency } from '@/utils/format';
import { toast } from 'sonner';

export function PaymentButton({ order }: { order: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    setIsLoading(true);
    try {
      const result = await processPayment(
        order.id, 
        order.payment_method as 'stripe' | 'paystack'
      );
      
      if (!result.success) {
        toast.error(result.error || 'Payment initialization failed');
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  if (order.payment_status === 'paid') {
    return (
      <Button asChild className="w-full bg-green-600 hover:bg-green-700">
        <Link href={`/checkout/success?order_id=${order.id}`}>
          Order Paid - View Receipt
        </Link>
      </Button>
    );
  }

  return (
    <Button 
      className="w-full" 
      size="lg" 
      onClick={handlePay}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay Now ({formatCurrency(order.total)})
        </>
      )}
    </Button>
  );
}
