// Generic API response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Error response
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// Search results
export interface SearchResult {
  products: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    price: number;
  }[];
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  total: number;
}

// Analytics data types
export interface AnalyticsData {
  revenue: {
    total: number;
    change: number;
    data: { date: string; value: number }[];
  };
  orders: {
    total: number;
    change: number;
    data: { date: string; value: number }[];
  };
  customers: {
    total: number;
    change: number;
  };
  conversion: {
    rate: number;
    change: number;
  };
}

export interface TopProduct {
  id: string;
  name: string;
  image: string | null;
  sales: number;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  order_number: string;
  customer: string;
  total: number;
  status: string;
  created_at: string;
}
