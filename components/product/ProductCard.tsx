import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/shopify/client';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  const compareAtPrice = product.variants.edges[0]?.node.compareAtPrice;
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const hasRange = maxPrice && parseFloat(maxPrice.amount) > parseFloat(price.amount);

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      {/* Image */}
      <div className="relative aspect-product bg-gray-100 overflow-hidden mb-4">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover group-hover:opacity-90 transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="caption">No image</span>
          </div>
        )}
        {!product.availableForSale && (
          <div className="absolute top-3 left-3 bg-black text-white text-micro font-sans font-medium uppercase tracking-wider px-3 py-1.5">
            Sold out
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="overline mb-1">{product.vendor}</p>
        <h3 className="font-serif text-lg group-hover:text-gray-600 transition-colors mb-2 line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <p className="price">
            {hasRange ? `From ${formatPrice(price.amount, price.currencyCode)}` : formatPrice(price.amount, price.currencyCode)}
          </p>
          {hasDiscount && (
            <p className="price-strike">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
