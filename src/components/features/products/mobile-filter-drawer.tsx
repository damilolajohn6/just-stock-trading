'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { ProductFilters } from './product-filters';
import { useUIStore } from '@/store/ui-store';
import { useFilterStore } from '@/store/filter-store';

export function MobileFilterDrawer() {
  const { isFilterOpen, openFilter, closeFilter } = useUIStore();
  const { getActiveFilterCount, clearFilters } = useFilterStore();
  const filterCount = getActiveFilterCount();

  return (
    <Sheet open={isFilterOpen} onOpenChange={(open) => open ? openFilter() : closeFilter()}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {filterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {filterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span>Filters</span>
            {filterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                Clear all
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
          <ProductFilters />
        </div>

        <SheetFooter className="p-4 border-t">
          <Button className="w-full" onClick={closeFilter}>
            Show Results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
