import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/shopify/client';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.variants.edges[0]?.node.compareAtPrice;
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      {/* Image */}
      <div className="relative aspect-product bg-gray-100 overflow-hidden mb-3">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover group-hover:opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No image
          </div>
        )}
        {!product.availableForSale && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1">
            Sold out
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="text-xs text-gray-500 mb-1">{product.vendor}</p>
        <h3 className="text-sm font-medium mb-1 group-hover:text-gray-500 line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-sm">
            {formatPrice(price.amount, price.currencyCode)}
          </p>
          {hasDiscount && (
            <p className="text-sm text-gray-500 line-through">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
