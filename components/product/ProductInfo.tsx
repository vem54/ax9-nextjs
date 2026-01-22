'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/shopify/client';
import VariantSelector from './VariantSelector';
import AddToCart from './AddToCart';
import SizeChart from './SizeChart';
import WishlistButton from './WishlistButton';

interface ProductInfoProps {
  product: Product;
}

interface SizeChartData {
  sizes: string[];
  measurements: {
    name: string;
    values: string[];
  }[];
  modelInfo?: {
    height: string;
    wears: string;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const variants = product.variants.edges.map((edge) => edge.node);
  const hasSizeOption = product.options.some((option) =>
    option.name.toLowerCase().includes('size')
  );

  // Initialize selected options with first available variant
  const firstAvailableVariant = variants.find((v) => v.availableForSale) || variants[0];
  const initialOptions: Record<string, string> = {};
  firstAvailableVariant?.selectedOptions.forEach((opt) => {
    initialOptions[opt.name] = opt.value;
  });

  const [selectedOptions, setSelectedOptions] = useState(initialOptions);
  const [quantity, setQuantity] = useState(1);

  // Find the selected variant
  const selectedVariant = useMemo(() => {
    return variants.find((variant) =>
      variant.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      )
    );
  }, [variants, selectedOptions]);

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  };

  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const displayCurrency = price.currencyCode === 'THB' ? 'USD' : price.currencyCode;

  const sizeChartData = useMemo<SizeChartData | null>(() => {
    if (!product.sizeChart?.value) return null;
    try {
      return JSON.parse(product.sizeChart.value) as SizeChartData;
    } catch {
      return null;
    }
  }, [product.sizeChart?.value]);
  const hasSizeChart = Boolean(sizeChartData);

  const detailItems = [
    { label: 'Materials', value: product.materials?.value },
    { label: 'Care', value: product.careInstructions?.value },
  ].filter((item) => item.value);

  return (
    <div className="flex flex-col">
      <div className="border-b border-gray-200 pb-6">
        {/* Vendor */}
        <p className="overline mb-3">
          {product.vendor}
        </p>

        {/* Title */}
        <h1 className="display-md mb-5">
          {product.title}
        </h1>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <p className="price-lg">
            {formatPrice(price.amount, price.currencyCode)}
          </p>
          <span className="caption">{displayCurrency}</span>
          {hasDiscount && (
            <p className="price-strike">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </p>
          )}
        </div>
      </div>

      {/* Variant selector */}
      <div className="border-b border-gray-200 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="label">
            Select Options
          </p>
          {hasSizeOption && (
            <a href="/size-guide" className="link-underline text-xs">
              Size guide
            </a>
          )}
        </div>
        <VariantSelector
          options={product.options}
          variants={variants}
          selectedOptions={selectedOptions}
          onOptionChange={handleOptionChange}
        />
      </div>

      {/* Quantity + Add to cart */}
      <div className="border-b border-gray-200 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="label">Quantity</span>
          <div className="flex items-center border border-black">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="w-10 h-10 flex items-center justify-center font-mono text-sm hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center font-mono text-sm tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
              className="w-10 h-10 flex items-center justify-center font-mono text-sm hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        <AddToCart
          variantId={selectedVariant?.id || ''}
          availableForSale={selectedVariant?.availableForSale || false}
          quantity={quantity}
        />
        <WishlistButton product={product} variant="full" />
      </div>

      {/* Fit and sizing */}
      <div className="border-b border-gray-200 py-6">
        <p className="label mb-4">
          Size and Fit
        </p>
        <div className="flex items-center justify-between">
          <span className="caption">Size guide</span>
          {hasSizeChart && product.sizeChart?.value ? (
            <SizeChart data={product.sizeChart.value} />
          ) : (
            <a href="/size-guide" className="link-underline text-sm">
              View Size Guide
            </a>
          )}
        </div>
        {sizeChartData?.modelInfo && (
          <p className="caption mt-3">
            Model is {sizeChartData.modelInfo.height} and wears size {sizeChartData.modelInfo.wears}
          </p>
        )}
        {!hasSizeChart && (
          <p className="caption mt-3">
            Use our general size guide and consider sizing up for a relaxed fit.
          </p>
        )}
      </div>

      {/* Composition and care */}
      {detailItems.length > 0 && (
        <div className="border-b border-gray-200 py-6">
          <p className="label mb-4">
            Composition and Care
          </p>
          <dl className="space-y-3 text-sm">
            {detailItems.map((item) => (
              <div key={item.label} className="flex justify-between gap-6">
                <dt className="text-gray-500">{item.label}</dt>
                <dd className="text-black text-right font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Details */}
      {product.descriptionHtml && (
        <div className="border-b border-gray-200 py-6">
          <p className="label mb-4">
            Product Details
          </p>
          <div
            className="product-richtext text-sm text-gray-600"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
      )}

      {/* Trust module */}
      <div className="pt-6">
        <p className="label mb-4">
          Shipping and Returns
        </p>
        <ul className="caption space-y-2">
          <li>Fast, free shipping. All customs and taxes prepaid.</li>
          <li>14-day refunds on eligible items.</li>
          <li>100% original, curated Chinese designers.</li>
        </ul>
        <div className="flex gap-4 mt-4">
          <a href="/shipping" className="link-underline text-xs">
            Shipping
          </a>
          <a href="/returns" className="link-underline text-xs">
            Returns
          </a>
        </div>
      </div>
    </div>
  );
}
