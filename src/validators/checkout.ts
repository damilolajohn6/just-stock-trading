import { z } from 'zod';

// Phone number validation (UK and international)
const phoneSchema = z
  .string()
  .min(10, 'Phone number is too short')
  .max(20, 'Phone number is too long')
  .regex(/^[\d\s+()-]+$/, 'Please enter a valid phone number');

// UK Postcode validation
const postcodeSchema = z
  .string()
  .min(5, 'Postcode is required')
  .max(10, 'Invalid postcode')
  .regex(/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i, 'Please enter a valid UK postcode');

// Address schema
export const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  company: z.string().max(100, 'Company name is too long').optional(),
  addressLine1: z.string().min(1, 'Address is required').max(200, 'Address is too long'),
  addressLine2: z.string().max(200, 'Address is too long').optional(),
  city: z.string().min(1, 'City is required').max(100, 'City name is too long'),
  state: z.string().min(1, 'County/State is required').max(100, 'County/State is too long'),
  postalCode: postcodeSchema,
  country: z.string().min(1, 'Country is required').default('GB'),
  phone: phoneSchema.optional().or(z.literal('')),
});

export type AddressFormData = z.infer<typeof addressSchema>;

// Contact information schema
export const contactInfoSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  phone: phoneSchema.optional().or(z.literal('')),
  marketingConsent: z.boolean().default(false),
});

export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;

// Shipping method schema
export const shippingMethodSchema = z.object({
  methodId: z.string().min(1, 'Please select a shipping method'),
});

export type ShippingMethodFormData = z.infer<typeof shippingMethodSchema>;

// Payment method schema
export const paymentMethodSchema = z.object({
  method: z.enum(['stripe', 'paystack'], {
    message: 'Please select a payment method',
  }),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

// Complete checkout schema
export const checkoutSchema = z.object({
  // Contact
  email: z.string().email(),
  phone: z.string().optional(),

  // Shipping address
  shippingAddress: addressSchema,

  // Billing address
  billingAddress: addressSchema.optional(),
  useSameAddress: z.boolean().default(true),

  // Shipping
  shippingMethodId: z.string(),

  // Payment
  paymentMethod: z.enum(['stripe', 'paystack']),

  // Order
  notes: z.string().max(500).optional(),
  couponCode: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Saved address schema (for database)
export const savedAddressSchema = addressSchema.extend({
  label: z.string().max(50).optional(),
  isDefault: z.boolean().default(false),
  isBilling: z.boolean().default(false),
});

export type SavedAddressFormData = z.infer<typeof savedAddressSchema>;
