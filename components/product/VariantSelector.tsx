'use client';

import { ProductVariant } from '@/lib/shopify/types';

interface Option {
  id: string;
  name: string;
  values: string[];
}

interface VariantSelectorProps {
  options: Option[];
  variants: ProductVariant[];
  selectedOptions: Record<string, string>;
  onOptionChange: (name: string, value: string) => void;
}

export default function VariantSelector({
  options,
  variants,
  selectedOptions,
  onOptionChange,
}: VariantSelectorProps) {
  const isOptionAvailable = (optionName: string, optionValue: string): boolean => {
    const testOptions = { ...selectedOptions, [optionName]: optionValue };
    return variants.some((variant) => {
      const matches = variant.selectedOptions.every(
        (opt) => testOptions[opt.name] === opt.value
      );
      return matches && variant.availableForSale;
    });
  };

  if (options.length === 1 && options[0].values.length === 1 && options[0].values[0] === 'Default Title') {
    return null;
  }

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id}>
          <label className="block text-sm font-medium mb-2">
            {option.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const isAvailable = isOptionAvailable(option.name, value);

              return (
                <button
                  key={value}
                  onClick={() => onOptionChange(option.name, value)}
                  disabled={!isAvailable}
                  className={`px-4 py-2 text-sm border ${
                    isSelected
                      ? 'border-black bg-black text-white'
                      : isAvailable
                      ? 'border-black bg-white text-black hover:bg-gray-100'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
