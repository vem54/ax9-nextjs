'use client';

import { useWishlistStore } from '@/lib/store/wishlist';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/shopify/client';

export default function WishlistContent() {
  const { items, removeItem, clearWishlist } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div className="max-w-md mx-auto">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 text-sm mb-8">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link
            href="/collections/all"
            className="inline-block bg-black text-white px-8 py-3 text-sm hover:bg-gray-800"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Actions */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-gray-500">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>
        <button
          onClick={clearWishlist}
          className="text-sm text-gray-500 underline hover:text-black hover:no-underline"
        >
          Clear all
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <div key={item.id} className="group relative">
            {/* Remove button */}
            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-2 right-2 z-10 p-2 bg-white hover:bg-gray-100"
              aria-label="Remove from wishlist"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
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

            <Link href={`/products/${item.handle}`} className="block">
              {/* Image */}
              <div className="relative aspect-product bg-gray-100 overflow-hidden mb-3">
                {item.image ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.altText || item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover group-hover:opacity-90"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    No image
                  </div>
                )}
                {!item.availableForSale && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1">
                    Sold out
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <p className="text-xs text-gray-500 mb-1">{item.vendor}</p>
                <h3 className="text-sm font-medium mb-1 group-hover:text-gray-500 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm">
                  {formatPrice(item.price.amount, item.price.currencyCode)}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

