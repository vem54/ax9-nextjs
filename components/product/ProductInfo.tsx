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

      {/* Fit and sizing */}
      <div className="border-t border-gray-100 pt-4 mb-6">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
          Fit and Sizing
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Size guide</span>
          {hasSizeChart && product.sizeChart?.value ? (
            <SizeChart data={product.sizeChart.value} />
          ) : (
            <a href="/pages/sizing" className="text-sm underline hover:no-underline">
              Size Guide
            </a>
          )}
        </div>
        {sizeChartData?.modelInfo && (
          <p className="text-xs text-gray-500 mt-3">
            Model is {sizeChartData.modelInfo.height} and wears size {sizeChartData.modelInfo.wears}
          </p>
        )}
        {!hasSizeChart && (
          <p className="text-xs text-gray-500 mt-3">
            Use our general size guide and consider sizing up for a relaxed fit.
          </p>
        )}
      </div>

      {/* Composition and care */}
      {detailItems.length > 0 && (
        <div className="border-t border-gray-100 pt-4 mb-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
            Composition and Care
          </p>
          <dl className="space-y-2 text-sm">
            {detailItems.map((item) => (
              <div key={item.label} className="flex justify-between gap-6">
                <dt className="text-gray-500">{item.label}</dt>
                <dd className="text-black text-right">{item.value}</dd>
              </div>
            ))}
          </dl>
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
