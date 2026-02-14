import type { Tables } from './database';

export type Product = Tables<'products'>;
export type ProductImage = Tables<'product_images'>;
export type ProductVariant = Tables<'product_variants'>;
export type Category = Tables<'categories'>;

// Extended product with relations
export interface ProductWithDetails extends Product {
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews_count?: number;
  average_rating?: number;
}

// Product card display type
export interface ProductCard {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  condition: Product['condition'];
  brand: string | null;
  primary_image: string | null;
  category_name: string;
  is_featured: boolean;
  is_trending: boolean;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

// Product filter options
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  brands?: string[];
  conditions?: Product['condition'][];
  colors?: string[];
  materials?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'name';
  search?: string;
  page?: number;
  limit?: number;
}

// Available filter values (for filter sidebar)
export interface AvailableFilters {
  categories: { slug: string; name: string; count: number }[];
  sizes: { value: string; count: number }[];
  brands: { value: string; count: number }[];
  conditions: { value: Product['condition']; count: number }[];
  colors: { value: string; count: number }[];
  priceRange: { min: number; max: number };
}

// Product form data for admin
export interface ProductFormData {
  name: string;
  description: string;
  short_description: string;
  brand: string;
  category_id: string;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  sku: string;
  condition: Product['condition'];
  material: string;
  weight: number | null;
  weight_unit: Product['weight_unit'];
  tags: string[];
  is_featured: boolean;
  is_trending: boolean;
  is_published: boolean;
  meta_title: string;
  meta_description: string;
  images: ProductImageUpload[];
  variants: ProductVariantInput[];
}

export interface ProductImageUpload {
  id?: string;
  file?: File;
  url: string;
  public_id: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariantInput {
  id?: string;
  size: string;
  color: string;
  sku: string;
  price_adjustment: number;
  stock_quantity: number;
  is_available: boolean;
}

// Sizes constant
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size'] as const;
export type Size = typeof SIZES[number];

// Conditions constant
export const CONDITIONS = ['new', 'like_new', 'good', 'fair'] as const;
export const CONDITION_LABELS: Record<Product['condition'], string> = {
  new: 'New with tags',
  like_new: 'Like new',
  good: 'Good condition',
  fair: 'Fair condition',
};
