// Size options
export const SIZE_OPTIONS = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
  { value: 'XXXL', label: 'XXXL' },
  { value: 'One Size', label: 'One Size' },
] as const;

// Condition options
export const CONDITION_OPTIONS = [
  { value: 'new', label: 'New with tags' },
  { value: 'like_new', label: 'Like new' },
  { value: 'good', label: 'Good condition' },
  { value: 'fair', label: 'Fair condition' },
] as const;

// Sort options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
] as const;

// Color options
export const COLOR_OPTIONS = [
  { value: 'black', label: 'Black', hex: '#000000' },
  { value: 'white', label: 'White', hex: '#FFFFFF' },
  { value: 'gray', label: 'Gray', hex: '#6B7280' },
  { value: 'red', label: 'Red', hex: '#EF4444' },
  { value: 'orange', label: 'Orange', hex: '#F97316' },
  { value: 'yellow', label: 'Yellow', hex: '#EAB308' },
  { value: 'green', label: 'Green', hex: '#22C55E' },
  { value: 'blue', label: 'Blue', hex: '#3B82F6' },
  { value: 'purple', label: 'Purple', hex: '#A855F7' },
  { value: 'pink', label: 'Pink', hex: '#EC4899' },
  { value: 'brown', label: 'Brown', hex: '#92400E' },
  { value: 'beige', label: 'Beige', hex: '#D4A574' },
  { value: 'navy', label: 'Navy', hex: '#1E3A5F' },
  { value: 'multicolor', label: 'Multicolor', hex: 'linear-gradient(135deg, #EF4444, #F97316, #EAB308, #22C55E, #3B82F6, #A855F7)' },
] as const;

// Material options
export const MATERIAL_OPTIONS = [
  { value: 'cotton', label: 'Cotton' },
  { value: 'polyester', label: 'Polyester' },
  { value: 'wool', label: 'Wool' },
  { value: 'silk', label: 'Silk' },
  { value: 'linen', label: 'Linen' },
  { value: 'denim', label: 'Denim' },
  { value: 'leather', label: 'Leather' },
  { value: 'cashmere', label: 'Cashmere' },
  { value: 'nylon', label: 'Nylon' },
  { value: 'velvet', label: 'Velvet' },
  { value: 'other', label: 'Other' },
] as const;

// Price range presets
export const PRICE_RANGES = [
  { value: '0-10', label: 'Under £10', min: 0, max: 10 },
  { value: '10-25', label: '£10 - £25', min: 10, max: 25 },
  { value: '25-50', label: '£25 - £50', min: 25, max: 50 },
  { value: '50-100', label: '£50 - £100', min: 50, max: 100 },
  { value: '100+', label: '£100+', min: 100, max: null },
] as const;

// Weight unit options
export const WEIGHT_UNIT_OPTIONS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'oz', label: 'Ounces (oz)' },
] as const;
