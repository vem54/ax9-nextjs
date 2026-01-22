'use client';

import { useState, useMemo } from 'react';
import { Product, ProductVariant } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/shopify/client';
import VariantSelector from './VariantSelector';
import AddToCart from './AddToCart';
import SizeChart from './SizeChart';
import ProductTabs from './ProductTabs';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const variants = product.variants.edges.map((edge) => edge.node);

  // Initialize selected options with first available variant
  const firstAvailableVariant = variants.find((v) => v.availableForSale) || variants[0];
  const initialOptions: Record<string, string> = {};
  firstAvailableVariant?.selectedOptions.forEach((opt) => {
    initialOptions[opt.name] = opt.value;
  });

  const [selectedOptions, setSelectedOptions] = useState(initialOptions);

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

  return (
    <div className="flex flex-col">
      {/* Vendor */}
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
        {product.vendor}
      </p>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-medium leading-tight mb-4">
        {product.title}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-6">
        <p className="text-xl md:text-2xl">
          {formatPrice(price.amount, price.currencyCode)}
        </p>
        {hasDiscount && (
          <p className="text-sm text-gray-500 line-through">
            {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
          </p>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-xl">
          {product.description}
        </p>
      )}

      {/* Variant selector */}
      <div className="mb-6">
        <VariantSelector
          options={product.options}
          variants={variants}
          selectedOptions={selectedOptions}
          onOptionChange={handleOptionChange}
        />
      </div>

      {/* Size chart */}
      {product.sizeChart?.value && (
        <div className="mb-4">
          <SizeChart data={product.sizeChart.value} />
        </div>
      )}

      {/* Add to cart */}
      <div className="mb-6">
        <AddToCart
          variantId={selectedVariant?.id || ''}
          availableForSale={selectedVariant?.availableForSale || false}
        />
      </div>

      {/* Trust module */}
      <div className="border-t border-gray-100 pt-4 mb-6">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
          Shipping and Returns
        </p>
        <ul className="text-xs text-gray-500 space-y-2">
          <li>Fast, free shipping. All customs and taxes prepaid.</li>
          <li>14-day refunds on eligible items.</li>
          <li>100% original, curated Chinese designers.</li>
        </ul>
        <div className="flex gap-4 mt-3">
          <a href="/pages/shipping" className="text-xs underline hover:no-underline">
            Shipping
          </a>
          <a href="/pages/returns" className="text-xs underline hover:no-underline">
            Returns
          </a>
        </div>
      </div>

      {/* Product tabs */}
      <ProductTabs
        description={product.descriptionHtml}
        materials={product.materials?.value}
        careInstructions={product.careInstructions?.value}
      />
    </div>
  );
}
