'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface CollectionFiltersProps {
  productCount: number;
  currentSort?: string;
  currentAvailability?: string;
}

const sortOptions = [
  { value: '', label: 'Best Selling' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'title-asc', label: 'A-Z' },
  { value: 'title-desc', label: 'Z-A' },
];

export default function CollectionFilters({
  productCount,
  currentSort,
  currentAvailability,
}: CollectionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSortChange = (value: string) => {
    router.push(`${pathname}?${createQueryString('sort', value)}`);
  };

  const handleAvailabilityChange = (value: string) => {
    router.push(`${pathname}?${createQueryString('availability', value)}`);
  };

  return (
    <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-gray-100 md:flex-row md:items-center md:justify-between">
      {/* Product count */}
      <p className="text-xs uppercase tracking-widest text-gray-500">{productCount} products</p>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Availability filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase tracking-widest text-gray-500">Availability</label>
          <select
            value={currentAvailability || ''}
            onChange={(e) => handleAvailabilityChange(e.target.value)}
            className="select text-sm"
          >
            <option value="">All</option>
            <option value="in-stock">In Stock</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase tracking-widest text-gray-500">Sort</label>
          <select
            value={currentSort || ''}
            onChange={(e) => handleSortChange(e.target.value)}
            className="select text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
