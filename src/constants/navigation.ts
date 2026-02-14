import {
  Home,
  Search,
  ShoppingBag,
  User,
  Grid,
  Heart,
  Package,
  Settings,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  Ticket,
  type LucideIcon,
} from 'lucide-react';

// Mobile bottom navigation
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export const mobileNavItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Categories', href: '/categories', icon: Grid },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Cart', href: '/cart', icon: ShoppingBag },
  { label: 'Profile', href: '/account', icon: User },
];

// Desktop main navigation
export interface MainNavItem {
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
    description?: string;
  }[];
}

export const mainNavItems: MainNavItem[] = [
  {
    label: 'Women',
    href: '/categories/women',
    children: [
      { label: 'All Women', href: '/categories/women', description: 'Browse all women\'s clothing' },
      { label: 'Dresses', href: '/categories/women/dresses' },
      { label: 'Tops', href: '/categories/women/tops' },
      { label: 'Bottoms', href: '/categories/women/bottoms' },
      { label: 'Outerwear', href: '/categories/women/outerwear' },
      { label: 'Activewear', href: '/categories/women/activewear' },
    ],
  },
  {
    label: 'Men',
    href: '/categories/men',
    children: [
      { label: 'All Men', href: '/categories/men', description: 'Browse all men\'s clothing' },
      { label: 'Shirts', href: '/categories/men/shirts' },
      { label: 'T-Shirts', href: '/categories/men/t-shirts' },
      { label: 'Trousers', href: '/categories/men/trousers' },
      { label: 'Outerwear', href: '/categories/men/outerwear' },
      { label: 'Sportswear', href: '/categories/men/sportswear' },
    ],
  },
  {
    label: 'Vintage',
    href: '/categories/vintage',
    children: [
      { label: 'All Vintage', href: '/categories/vintage', description: 'Browse vintage collection' },
      { label: '70s & 80s', href: '/categories/vintage/70s-80s' },
      { label: '90s', href: '/categories/vintage/90s' },
      { label: 'Y2K', href: '/categories/vintage/y2k' },
      { label: 'Designer', href: '/categories/vintage/designer' },
    ],
  },
  {
    label: 'Accessories',
    href: '/categories/accessories',
    children: [
      { label: 'All Accessories', href: '/categories/accessories' },
      { label: 'Bags', href: '/categories/accessories/bags' },
      { label: 'Jewelry', href: '/categories/accessories/jewelry' },
      { label: 'Hats', href: '/categories/accessories/hats' },
      { label: 'Belts', href: '/categories/accessories/belts' },
    ],
  },
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'Sale', href: '/products?sale=true' },
];

// User account navigation
export const accountNavItems: NavItem[] = [
  { label: 'Overview', href: '/account', icon: LayoutDashboard },
  { label: 'Orders', href: '/account/orders', icon: Package },
  { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { label: 'Addresses', href: '/account/addresses', icon: Home },
  { label: 'Settings', href: '/account/settings', icon: Settings },
];

// Admin sidebar navigation
export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Products', href: '/admin/products', icon: ShoppingBag },
      { label: 'Categories', href: '/admin/categories', icon: Grid },
    ],
  },
  {
    label: 'Sales',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
    ],
  },
  {
    label: 'Customers',
    items: [
      { label: 'Users', href: '/admin/users', icon: Users },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

// Footer navigation
export const footerNavGroups = [
  {
    label: 'Shop',
    items: [
      { label: 'Women', href: '/categories/women' },
      { label: 'Men', href: '/categories/men' },
      { label: 'Vintage', href: '/categories/vintage' },
      { label: 'Accessories', href: '/categories/accessories' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Sale', href: '/products?sale=true' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'About Us', href: '/about' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
  },
  {
    label: 'Legal',
    items: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
];
