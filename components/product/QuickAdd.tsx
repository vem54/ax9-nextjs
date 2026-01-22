'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ProductVariant } from '@/lib/shopify/types';
import { useCartStore } from '@/lib/store/cart';

interface QuickAddProps {
  variants: ProductVariant[];
}

const getSizeOptionName = (variants: ProductVariant[]) => {
  const optionNames = new Set<string>();
  variants.forEach((variant) => {
    variant.selectedOptions.forEach((option) => optionNames.add(option.name));
  });
  return Array.from(optionNames).find((name) => name.toLowerCase().includes('size')) || null;
};

export default function QuickAdd({ variants }: QuickAddProps) {
  const { addToCart, isLoading } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [successVariantId, setSuccessVariantId] = useState<string | null>(null);
  const successTimeout = useRef<number | null>(null);

  const sizeOptionName = useMemo(() => getSizeOptionName(variants), [variants]);
  const sizeButtons = useMemo(() => {
    const byLabel = new Map<string, { id: string; label: string; available: boolean }>();
    variants.forEach((variant) => {
      const sizeOption = sizeOptionName
        ? variant.selectedOptions.find((option) => option.name === sizeOptionName)
        : null;
      const label =
        sizeOption?.value || (variant.title === 'Default Title' ? 'One Size' : variant.title);
      const normalized = label.trim();
      const existing = byLabel.get(normalized);
      if (!existing || (!existing.available && variant.availableForSale)) {
        byLabel.set(normalized, {
          id: variant.id,
          label: normalized,
          available: variant.availableForSale,
        });
      }
    });
    return Array.from(byLabel.values());
  }, [variants, sizeOptionName]);

  useEffect(() => {
    return () => {
      if (successTimeout.current) {
        window.clearTimeout(successTimeout.current);
      }
    };
  }, []);

  if (!variants.length) {
    return null;
  }

  const handleAdd = async (variantId: string) => {
    if (isLoading || activeVariantId) return;
    setActiveVariantId(variantId);
    await addToCart(variantId, 1);
    setActiveVariantId(null);
    setSuccessVariantId(variantId);
    setIsOpen(false);
    if (successTimeout.current) {
      window.clearTimeout(successTimeout.current);
    }
    successTimeout.current = window.setTimeout(() => {
      setSuccessVariantId(null);
    }, 1400);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`md:hidden absolute inset-x-0 bottom-0 z-20 bg-white border-t border-black py-3 text-xs font-sans font-semibold uppercase tracking-widest ${
          isOpen ? 'hidden' : ''
        }`}
      >
        Quick add
      </button>
      <div
        className={`absolute inset-0 z-20 flex items-end ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto'
        }`}
      >
        <div className="w-full bg-white border-t border-black p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="caption text-black">Select size</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="md:hidden text-xs font-sans uppercase tracking-widest"
            >
              Close
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizeButtons.map((size) => {
              const isActive = activeVariantId === size.id;
              const isSuccess = successVariantId === size.id;
              const label = isSuccess ? 'Added' : isActive ? 'Adding...' : size.label;

              return (
                <button
                  key={size.id}
                  type="button"
                  disabled={!size.available || isLoading}
                  onClick={() => handleAdd(size.id)}
                  className={`px-3 py-2 text-xs border font-sans ${
                    isSuccess || isActive
                      ? 'border-black bg-black text-white'
                      : size.available
                      ? 'border-black bg-white text-black hover:bg-gray-100'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <span className="sr-only" aria-live="polite">
          {successVariantId ? 'Added to cart' : ''}
        </span>
      </div>
    </>
  );
}

