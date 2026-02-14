import type { Tables } from './database';

export type Category = Tables<'categories'>;

// Category with subcategories
export interface CategoryWithChildren extends Category {
  children: Category[];
}

// Flat category for breadcrumbs
export interface CategoryBreadcrumb {
  id: string;
  name: string;
  slug: string;
}

// Category tree structure
export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  children: CategoryTree[];
}

// Navigation menu category
export interface NavCategory {
  name: string;
  slug: string;
  image_url: string | null;
  featured?: boolean;
  subcategories: {
    name: string;
    slug: string;
  }[];
}
