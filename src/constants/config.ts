import { z } from "zod";

// Environment variables schema
const envSchema = z.object({
  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),

  // Paystack
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().startsWith("pk_"),
  PAYSTACK_SECRET_KEY: z.string().startsWith("sk_").optional(),

  // Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().min(1),
});

// Validate environment variables
const parseEnv = () => {
  // On the client, only NEXT_PUBLIC_* variables are available
  const isServer = typeof window === "undefined";

  const env = {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: isServer
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : undefined,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: isServer ? process.env.STRIPE_SECRET_KEY : undefined,
    STRIPE_WEBHOOK_SECRET: isServer
      ? process.env.STRIPE_WEBHOOK_SECRET
      : undefined,
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    PAYSTACK_SECRET_KEY: isServer ? process.env.PAYSTACK_SECRET_KEY : undefined,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: isServer ? process.env.CLOUDINARY_API_KEY : undefined,
    CLOUDINARY_API_SECRET: isServer
      ? process.env.CLOUDINARY_API_SECRET
      : undefined,
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET:
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  };

  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((e) => e.path.join("."));
      console.error(
        "❌ Missing or invalid environment variables:",
        missingVars,
      );
    }
    throw error;
  }
};

// Export validated environment variables
export const env = parseEnv();

// App configuration
export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME || "Just Stock Trading",
  description:
    "Discover sustainable fashion at unbeatable prices. Shop our curated collection of pre-loved clothing and vintage finds.",
  url: env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
  links: {
    twitter: "https://twitter.com/juststocktrading",
    instagram: "https://instagram.com/juststocktrading",
    facebook: "https://facebook.com/juststocktrading",
  },
  creator: "Just Stock Trading",
  keywords: [
    "thrift",
    "vintage clothing",
    "sustainable fashion",
    "second-hand",
    "pre-loved",
    "eco-friendly",
    "affordable fashion",
  ],
} as const;

// Pagination defaults
export const paginationConfig = {
  defaultLimit: 12,
  maxLimit: 48,
  defaultPage: 1,
} as const;

// Currency configuration
export const currencyConfig = {
  default: "GBP",
  supported: ["GBP", "USD", "EUR", "NGN"] as const,
  symbols: {
    GBP: "£",
    USD: "$",
    EUR: "€",
    NGN: "₦",
  },
} as const;

// Shipping configuration
export const shippingConfig = {
  freeShippingThreshold: 50,
  standardRate: 4.99,
  expressRate: 9.99,
  methods: [
    {
      id: "standard",
      name: "Standard Delivery",
      price: 4.99,
      days: "5-7 business days",
    },
    {
      id: "express",
      name: "Express Delivery",
      price: 9.99,
      days: "2-3 business days",
    },
    {
      id: "next_day",
      name: "Next Day Delivery",
      price: 14.99,
      days: "Next business day",
    },
  ],
} as const;

// Image configuration
export const imageConfig = {
  maxUploadSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  maxImagesPerProduct: 8,
  placeholder: "/images/placeholder-product.png",
  avatarPlaceholder: "/images/placeholder-avatar.png",
} as const;

// Product configuration
export const productConfig = {
  lowStockThreshold: 5,
  maxQuantityPerOrder: 10,
  featuredLimit: 8,
  trendingLimit: 8,
  recentlyViewedLimit: 10,
} as const;
