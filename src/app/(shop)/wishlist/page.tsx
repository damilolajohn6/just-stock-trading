'use client';

import { Share2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Container } from '@/components/shared/container';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  WishlistItemCard,
  EmptyWishlist,
} from '@/components/features/wishlist';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addToCart({
      productId: item.productId,
      variantId: null,
      name: item.name,
      slug: item.slug,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: 1,
      image: item.image,
      maxQuantity: 10,
    });
    removeItem(item.productId);
    toast.success(`${item.name} moved to cart`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Thrift Factory Wishlist',
        text: `Check out my wishlist with ${items.length} items!`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Wishlist link copied!');
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-8">
        <Breadcrumb items={[{ label: 'Wishlist' }]} className="mb-6" />
        <EmptyWishlist />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Breadcrumb items={[{ label: 'Wishlist' }]} className="mb-6" />

      <PageHeader
        title={`Wishlist (${items.length})`}
        description="Items you've saved for later"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear your wishlist?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all items from your wishlist. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearWishlist}>
                  Clear wishlist
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </PageHeader>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <WishlistItemCard
            key={item.id}
            item={item}
            onRemove={removeItem}
            onMoveToCart={handleMoveToCart}
          />
        ))}
      </div>
    </Container>
  );
}
