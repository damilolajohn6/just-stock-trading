import { create } from 'zustand';
//import { parseAsArrayOf, parseAsString, parseAsInteger, createParser } from 'nuqs';

export interface FilterState {
  category: string | null;
  subcategory: string | null;
  sizes: string[];
  brands: string[];
  conditions: string[];
  colors: string[];
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
  page: number;
  search: string | null;
}

interface FilterStore extends FilterState {
  // Actions
  setCategory: (category: string | null) => void;
  setSubcategory: (subcategory: string | null) => void;
  setSizes: (sizes: string[]) => void;
  toggleSize: (size: string) => void;
  setBrands: (brands: string[]) => void;
  toggleBrand: (brand: string) => void;
  setConditions: (conditions: string[]) => void;
  toggleCondition: (condition: string) => void;
  setColors: (colors: string[]) => void;
  toggleColor: (color: string) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setSortBy: (sortBy: string) => void;
  setPage: (page: number) => void;
  setSearch: (search: string | null) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
  getActiveFilterCount: () => number;
}

const initialState: FilterState = {
  category: null,
  subcategory: null,
  sizes: [],
  brands: [],
  conditions: [],
  colors: [],
  minPrice: null,
  maxPrice: null,
  sortBy: 'newest',
  page: 1,
  search: null,
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  ...initialState,

  setCategory: (category) => set({ category, subcategory: null, page: 1 }),
  setSubcategory: (subcategory) => set({ subcategory, page: 1 }),
  
  setSizes: (sizes) => set({ sizes, page: 1 }),
  toggleSize: (size) => {
    const { sizes } = get();
    const newSizes = sizes.includes(size)
      ? sizes.filter((s) => s !== size)
      : [...sizes, size];
    set({ sizes: newSizes, page: 1 });
  },

  setBrands: (brands) => set({ brands, page: 1 }),
  toggleBrand: (brand) => {
    const { brands } = get();
    const newBrands = brands.includes(brand)
      ? brands.filter((b) => b !== brand)
      : [...brands, brand];
    set({ brands: newBrands, page: 1 });
  },

  setConditions: (conditions) => set({ conditions, page: 1 }),
  toggleCondition: (condition) => {
    const { conditions } = get();
    const newConditions = conditions.includes(condition)
      ? conditions.filter((c) => c !== condition)
      : [...conditions, condition];
    set({ conditions: newConditions, page: 1 });
  },

  setColors: (colors) => set({ colors, page: 1 }),
  toggleColor: (color) => {
    const { colors } = get();
    const newColors = colors.includes(color)
      ? colors.filter((c) => c !== color)
      : [...colors, color];
    set({ colors: newColors, page: 1 });
  },

  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setPage: (page) => set({ page }),
  setSearch: (search) => set({ search, page: 1 }),

  clearFilters: () => set({ ...initialState }),

  hasActiveFilters: () => {
    const state = get();
    return (
      state.sizes.length > 0 ||
      state.brands.length > 0 ||
      state.conditions.length > 0 ||
      state.colors.length > 0 ||
      state.minPrice !== null ||
      state.maxPrice !== null ||
      state.search !== null
    );
  },

  getActiveFilterCount: () => {
    const state = get();
    let count = 0;
    count += state.sizes.length;
    count += state.brands.length;
    count += state.conditions.length;
    count += state.colors.length;
    if (state.minPrice !== null || state.maxPrice !== null) count += 1;
    if (state.search) count += 1;
    return count;
  },
}));

