'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFilterStore } from '@/store/filter-store';
import { formatCurrency } from '@/utils/format';
import { CONDITION_OPTIONS, COLOR_OPTIONS } from '@/constants/filters';

export function ActiveFilters() {
  const {
    sizes,
    brands,
    conditions,
    colors,
    minPrice,
    maxPrice,
    search,
    toggleSize,
    toggleBrand,
    toggleCondition,
    toggleColor,
    setPriceRange,
    setSearch,
    clearFilters,
    hasActiveFilters,
  } = useFilterStore();

  if (!hasActiveFilters()) return null;

  const getConditionLabel = (value: string) =>
    CONDITION_OPTIONS.find((c) => c.value === value)?.label || value;

  const getColorLabel = (value: string) =>
    COLOR_OPTIONS.find((c) => c.value === value)?.label || value;

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <span className="text-sm text-muted-foreground">Active filters:</span>

      {search && (
        <Badge variant="secondary" className="gap-1">
          Search: {search}
          <button onClick={() => setSearch(null)}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {sizes.map((size) => (
        <Badge key={size} variant="secondary" className="gap-1">
          Size: {size}
          <button onClick={() => toggleSize(size)}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {brands.map((brand) => (
        <Badge key={brand} variant="secondary" className="gap-1">
          {brand}
          <button onClick={() => toggleBrand(brand)}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {conditions.map((condition) => (
        <Badge key={condition} variant="secondary" className="gap-1">
          {getConditionLabel(condition)}
          <button onClick={() => toggleCondition(condition)}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {colors.map((color) => (
        <Badge key={color} variant="secondary" className="gap-1">
          {getColorLabel(color)}
          <button onClick={() => toggleColor(color)}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {(minPrice !== null || maxPrice !== null) && (
        <Badge variant="secondary" className="gap-1">
          {minPrice !== null && maxPrice !== null
            ? `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
            : minPrice !== null
            ? `From ${formatCurrency(minPrice)}`
            : `Up to ${formatCurrency(maxPrice!)}`}
          <button onClick={() => setPriceRange(null, null)}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={clearFilters}
        className="text-muted-foreground hover:text-foreground"
      >
        Clear all
      </Button>
    </div>
  );
}
