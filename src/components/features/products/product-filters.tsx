'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useFilterStore } from '@/store/filter-store';
import { formatCurrency } from '@/utils/format';
import {
  SIZE_OPTIONS,
  CONDITION_OPTIONS,
  COLOR_OPTIONS,
} from '@/constants/filters';
import { cn } from '@/utils/cn';

interface ProductFiltersProps {
  availableBrands?: string[];
  priceRange?: { min: number; max: number };
  className?: string;
}

export function ProductFilters({
  availableBrands = [
    'Levi\'s',
    'Zara',
    'Nike',
    'Adidas',
    'Champion',
    'Uniqlo',
    'H&M',
    'Coach',
    'Gucci',
    'Vintage',
  ],
  priceRange = { min: 0, max: 200 },
  className,
}: ProductFiltersProps) {
  const {
    sizes,
    brands,
    conditions,
    colors,
    minPrice,
    maxPrice,
    toggleSize,
    toggleBrand,
    toggleCondition,
    toggleColor,
    setPriceRange,
    clearFilters,
    hasActiveFilters,
  } = useFilterStore();

  const [localPriceRange, setLocalPriceRange] = React.useState([
    minPrice ?? priceRange.min,
    maxPrice ?? priceRange.max,
  ]);

  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange(values);
  };

  const handlePriceCommit = () => {
    setPriceRange(
      localPriceRange[0] === priceRange.min ? null : localPriceRange[0],
      localPriceRange[1] === priceRange.max ? null : localPriceRange[1]
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-muted-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      <ScrollArea className="h-[calc(100vh-200px)] lg:h-auto lg:max-h-none">
        <Accordion
          type="multiple"
          defaultValue={['size', 'condition', 'price', 'brand', 'color']}
          className="w-full"
        >
          {/* Size Filter */}
          <AccordionItem value="size">
            <AccordionTrigger className="text-sm">
              Size
              {sizes.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {sizes.length}
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-4 gap-2">
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => toggleSize(size.value)}
                    className={cn(
                      'px-3 py-2 text-sm border rounded-md transition-colors',
                      sizes.includes(size.value)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'hover:border-primary'
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Condition Filter */}
          <AccordionItem value="condition">
            <AccordionTrigger className="text-sm">
              Condition
              {conditions.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {conditions.length}
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {CONDITION_OPTIONS.map((condition) => (
                  <div key={condition.value} className="flex items-center">
                    <Checkbox
                      id={`condition-${condition.value}`}
                      checked={conditions.includes(condition.value)}
                      onCheckedChange={() => toggleCondition(condition.value)}
                    />
                    <Label
                      htmlFor={`condition-${condition.value}`}
                      className="ml-2 text-sm cursor-pointer"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price Filter */}
          <AccordionItem value="price">
            <AccordionTrigger className="text-sm">
              Price
              {(minPrice !== null || maxPrice !== null) && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  1
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider
                  value={localPriceRange}
                  onValueChange={handlePriceChange}
                  onValueCommit={handlePriceCommit}
                  min={priceRange.min}
                  max={priceRange.max}
                  step={5}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span>{formatCurrency(localPriceRange[0])}</span>
                  <span>{formatCurrency(localPriceRange[1])}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Brand Filter */}
          <AccordionItem value="brand">
            <AccordionTrigger className="text-sm">
              Brand
              {brands.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {brands.length}
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {availableBrands.map((brand) => (
                  <div key={brand} className="flex items-center">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={brands.includes(brand)}
                      onCheckedChange={() => toggleBrand(brand)}
                    />
                    <Label
                      htmlFor={`brand-${brand}`}
                      className="ml-2 text-sm cursor-pointer"
                    >
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Color Filter */}
          <AccordionItem value="color">
            <AccordionTrigger className="text-sm">
              Color
              {colors.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {colors.length}
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => toggleColor(color.value)}
                    className={cn(
                      'h-8 w-8 rounded-full border-2 transition-all',
                      colors.includes(color.value)
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-transparent hover:border-muted-foreground'
                    )}
                    style={{
                      background: color.hex,
                    }}
                    title={color.label}
                  >
                    <span className="sr-only">{color.label}</span>
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
}
