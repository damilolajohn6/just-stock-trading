export type PaymentProvider = 'stripe' | 'paystack';

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

// Stripe specific
export interface StripeCheckoutSession {
  id: string;
  url: string;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

// Paystack specific
export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    currency: string;
    customer: {
      email: string;
    };
    metadata: Record<string, unknown>;
  };
}

export interface PaystackWebhookEvent {
  event: string;
  data: {
    id: number;
    reference: string;
    status: string;
    amount: number;
    metadata: Record<string, unknown>;
  };
}

// Generic payment result
export interface PaymentResult {
  success: boolean;
  orderId: string;
  paymentId: string;
  message?: string;
}
