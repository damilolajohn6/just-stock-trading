const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at: string;
    channel: string;
    metadata: any;
  };
}

export const paystack = {
  transaction: {
    initialize: async (params: {
      email: string;
      amount: number; // in kobo/cents
      reference?: string;
      callback_url?: string;
      metadata?: any;
      currency?: string;
    }): Promise<PaystackInitializeResponse> => {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      return response.json();
    },

    verify: async (reference: string): Promise<PaystackVerifyResponse> => {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          },
        }
      );
      return response.json();
    },
  },
};
