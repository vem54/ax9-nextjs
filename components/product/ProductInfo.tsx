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
      <p className="text-sm text-gray-500 mb-1">{product.vendor}</p>

      {/* Title */}
      <h1 className="text-2xl font-medium mb-3">{product.title}</h1>

      {/* Price */}
      <div className="flex items-center gap-3 mb-6">
        <p className="text-lg">
          {formatPrice(price.amount, price.currencyCode)}
        </p>
        {hasDiscount && (
          <p className="text-lg text-gray-500 line-through">
            {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
          </p>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
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

      {/* Product tabs */}
      <ProductTabs
        description={product.descriptionHtml}
        materials={product.materials?.value}
        careInstructions={product.careInstructions?.value}
      />
    </div>
  );
}
