import { create } from 'zustand';
import type { AddressFormData } from '@/validators/checkout';

export type CheckoutStep = 'information' | 'shipping' | 'payment' | 'review';

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

interface CheckoutState {
  // Current step
  currentStep: CheckoutStep;
  completedSteps: CheckoutStep[];
  
  // Customer info
  email: string;
  phone: string;
  
  // Addresses
  shippingAddress: AddressFormData | null;
  billingAddress: AddressFormData | null;
  useSameAddress: boolean;
  selectedAddressId: string | null;
  
  // Shipping
  shippingMethod: ShippingMethod | null;
  
  // Payment
  paymentMethod: 'stripe' | 'paystack' | null;
  
  // Order
  notes: string;
  
  // Status
  isProcessing: boolean;
  error: string | null;
}

interface CheckoutActions {
  // Navigation
  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  canProceed: () => boolean;
  markStepComplete: (step: CheckoutStep) => void;
  
  // Customer info
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  
  // Addresses
  setShippingAddress: (address: AddressFormData | null) => void;
  setBillingAddress: (address: AddressFormData | null) => void;
  setUseSameAddress: (same: boolean) => void;
  setSelectedAddressId: (id: string | null) => void;
  
  // Shipping
  setShippingMethod: (method: ShippingMethod | null) => void;
  
  // Payment
  setPaymentMethod: (method: 'stripe' | 'paystack' | null) => void;
  
  // Order
  setNotes: (notes: string) => void;
  
  // Status
  setProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
  
  // Reset
  reset: () => void;
}

type CheckoutStore = CheckoutState & CheckoutActions;

const STEP_ORDER: CheckoutStep[] = ['information', 'shipping', 'payment', 'review'];

const initialState: CheckoutState = {
  currentStep: 'information',
  completedSteps: [],
  email: '',
  phone: '',
  shippingAddress: null,
  billingAddress: null,
  useSameAddress: true,
  selectedAddressId: null,
  shippingMethod: null,
  paymentMethod: null,
  notes: '',
  isProcessing: false,
  error: null,
};

export const useCheckoutStore = create<CheckoutStore>((set, get) => ({
  ...initialState,

  // Navigation
  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => {
    const { currentStep, completedSteps } = get();
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    
    if (currentIndex < STEP_ORDER.length - 1) {
      // Mark current step as complete
      if (!completedSteps.includes(currentStep)) {
        set({ completedSteps: [...completedSteps, currentStep] });
      }
      set({ currentStep: STEP_ORDER[currentIndex + 1] });
    }
  },
  
  prevStep: () => {
    const { currentStep } = get();
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    
    if (currentIndex > 0) {
      set({ currentStep: STEP_ORDER[currentIndex - 1] });
    }
  },
  
  canProceed: () => {
    const state = get();
    
    switch (state.currentStep) {
      case 'information':
        return !!state.email && !!state.shippingAddress;
      case 'shipping':
        return !!state.shippingMethod;
      case 'payment':
        return !!state.paymentMethod;
      case 'review':
        return true;
      default:
        return false;
    }
  },
  
  markStepComplete: (step) => {
    const { completedSteps } = get();
    if (!completedSteps.includes(step)) {
      set({ completedSteps: [...completedSteps, step] });
    }
  },

  // Customer info
  setEmail: (email) => set({ email }),
  setPhone: (phone) => set({ phone }),

  // Addresses
  setShippingAddress: (address) => set({ shippingAddress: address }),
  setBillingAddress: (address) => set({ billingAddress: address }),
  setUseSameAddress: (same) => set({ useSameAddress: same }),
  setSelectedAddressId: (id) => set({ selectedAddressId: id }),

  // Shipping
  setShippingMethod: (method) => set({ shippingMethod: method }),

  // Payment
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  // Order
  setNotes: (notes) => set({ notes }),

  // Status
  setProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),

  // Reset
  reset: () => set(initialState),
}));

// Shipping methods data
export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Delivered by Royal Mail',
    price: 4.99,
    estimatedDays: '5-7 business days',
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Delivered by DPD',
    price: 9.99,
    estimatedDays: '2-3 business days',
  },
  {
    id: 'next_day',
    name: 'Next Day Delivery',
    description: 'Order before 2pm',
    price: 14.99,
    estimatedDays: 'Next business day',
  },
];
