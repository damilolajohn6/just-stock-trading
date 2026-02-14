'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { SearchBar } from './search-bar';
import { useUIStore } from '@/store/ui-store';

export function SearchDrawer() {
  const { isSearchOpen, closeSearch } = useUIStore();

  return (
    <Sheet open={isSearchOpen} onOpenChange={closeSearch}>
      <SheetContent side="top" className="h-auto">
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle>Search</SheetTitle>
          </SheetHeader>
        </VisuallyHidden>
        <div className="pt-4">
          <SearchBar autoFocus onSearch={closeSearch} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
