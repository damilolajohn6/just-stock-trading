import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <Heart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Save items you love by clicking the heart icon. 
        They&apos;ll be waiting for you here!
      </p>
      <Button asChild size="lg">
        <Link href="/products">
          Discover Products
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
