import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/shopify/client';
import QuickAdd from '@/components/product/QuickAdd';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  const compareAtPrice = product.variants.edges[0]?.node.compareAtPrice;
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const hasRange = maxPrice && parseFloat(maxPrice.amount) > parseFloat(price.amount);
  const primaryImage = product.featuredImage || product.images.edges[0]?.node || null;
  const hoverImage =
    product.images.edges.find((image) => image.node.url !== primaryImage?.url)?.node || null;

  return (
    <div className="group block">
      {/* Image */}
      <div className="relative aspect-product bg-gray-100 overflow-hidden mb-5">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className={`object-cover transition-opacity duration-400 ${hoverImage ? 'group-hover:opacity-0' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="caption">No image</span>
          </div>
        )}
        {hoverImage && (
          <Image
            src={hoverImage.url}
            alt={hoverImage.altText || `${product.title} alternate view`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            aria-hidden
          />
        )}
        {!product.availableForSale && (
          <div className="absolute top-4 left-4 badge">
            Sold out
          </div>
        )}
        <Link
          href={`/products/${product.handle}`}
          className="absolute inset-0 z-10"
          aria-label={product.title}
        >
          <span className="sr-only">{product.title}</span>
        </Link>
        <QuickAdd variants={product.variants.edges.map((edge) => edge.node)} />
      </div>

      {/* Info */}
      <Link href={`/products/${product.handle}`} className="block">
        <p className="product-vendor mb-2">{product.vendor}</p>
        <h3 className="product-title group-hover:text-gray-500 transition-colors duration-300 mb-3 line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-3">
          <p className="price">
            {hasRange
              ? `From ${formatPrice(price.amount, price.currencyCode)}`
              : formatPrice(price.amount, price.currencyCode)}
          </p>
          {hasDiscount && (
            <p className="price-strike">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
