import { Container } from '@/components/shared/container';
import { PageHeader } from '@/components/shared/page-header';
import { SearchBar } from '@/components/layout/header/search-bar';

export default function SearchPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Search"
        description="Find your perfect pre-loved piece"
      />
      
      <div className="mt-8 max-w-2xl mx-auto">
        <SearchBar autoFocus />
      </div>

      <div className="mt-16 text-center text-muted-foreground">
        <p>Start typing to search for products, brands, or styles...</p>
      </div>
    </Container>
  );
}
