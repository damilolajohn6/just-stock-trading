import { redirect } from 'next/navigation';

export default function AccountWishlistPage() {
  // Redirect to main wishlist page
  redirect('/wishlist');
}