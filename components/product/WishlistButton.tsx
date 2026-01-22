'use client';

import { useWishlistStore, WishlistItem } from '@/lib/store/wishlist';
import { Product } from '@/lib/shopify/types';

interface WishlistButtonProps {
  product: Product;
  variant?: 'icon' | 'full';
  className?: string;
}

export default function WishlistButton({
  product,
  variant = 'icon',
  className = '',
}: WishlistButtonProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const wishlistItem: Omit<WishlistItem, 'addedAt'> = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    vendor: product.vendor,
    price: product.priceRange.minVariantPrice,
    image: product.featuredImage,
    availableForSale: product.availableForSale,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(wishlistItem);
  };

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 w-full py-3 border border-black text-sm hover:bg-gray-100 ${className}`}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <svg
          className="w-4 h-4"
          fill={inWishlist ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {inWishlist ? 'Saved' : 'Save to Wishlist'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-2 hover:bg-gray-100 ${className}`}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        className="w-5 h-5"
        fill={inWishlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}

