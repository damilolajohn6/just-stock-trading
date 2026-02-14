
export interface StaticCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured?: boolean;
}

export const staticCategories: StaticCategory[] = [
  {
    id: '1',
    name: 'Women',
    slug: 'women',
    description: 'Pre-loved fashion for women',
    image: '/images/categories/women.jpg',
    featured: true,
  },
  {
    id: '2',
    name: 'Men',
    slug: 'men',
    description: 'Quality second-hand menswear',
    image: '/images/categories/men.jpg',
    featured: true,
  },
  {
    id: '3',
    name: 'Vintage',
    slug: 'vintage',
    description: 'Curated vintage pieces',
    image: '/images/categories/vintage.jpg',
    featured: true,
  },
  {
    id: '4',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Bags, jewelry, and more',
    image: '/images/categories/accessories.jpg',
    featured: true,
  },
  {
    id: '5',
    name: 'Footwear',
    slug: 'footwear',
    description: 'Shoes and boots',
    image: '/images/categories/footwear.jpg',
    featured: false,
  },
  {
    id: '6',
    name: 'Kids',
    slug: 'kids',
    description: "Children's clothing",
    image: '/images/categories/kids.jpg',
    featured: false,
  },
];

// Bundle/Kilo sale options
export interface BundleOption {
  id: string;
  name: string;
  weight: string;
  price: number;
  description: string;
  image: string;
  popular?: boolean;
}

export const bundleOptions: BundleOption[] = [
  {
    id: 'starter',
    name: 'Starter Bundle',
    weight: '2kg',
    price: 15,
    description: 'Perfect for trying our selection',
    image: '/images/bundles/2kg.jpg',
  },
  {
    id: 'popular',
    name: 'Popular Bundle',
    weight: '5kg',
    price: 35,
    description: 'Our most popular choice',
    image: '/images/bundles/5kg.jpg',
    popular: true,
  },
  {
    id: 'value',
    name: 'Value Bundle',
    weight: '10kg',
    price: 65,
    description: 'Best value for resellers',
    image: '/images/bundles/10kg.jpg',
  },
  {
    id: 'wholesale',
    name: 'Wholesale Bundle',
    weight: '25kg',
    price: 150,
    description: 'For serious vintage lovers',
    image: '/images/bundles/25kg.jpg',
  },
];
