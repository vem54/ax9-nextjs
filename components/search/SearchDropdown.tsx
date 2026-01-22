'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { shopifyFetch, formatPrice } from '@/lib/shopify/client';
import { SEARCH_PRODUCTS } from '@/lib/shopify/queries';
import { Product } from '@/lib/shopify/types';

const STORE_COUNTRY = 'US';
const MAX_RESULTS = 5;

interface SearchResults {
  products: { edges: { node: Product }[] };
}

function getProductImage(product: Product) {
  return product.featuredImage || product.images.edges[0]?.node || null;
}

export default function SearchDropdown() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => window.clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    let isCurrent = true;

    if (!debouncedQuery) {
      setResults([]);
      setIsLoading(false);
      return () => undefined;
    }

    setIsLoading(true);

    shopifyFetch<SearchResults>({
      query: SEARCH_PRODUCTS,
      variables: {
        query: debouncedQuery,
        first: MAX_RESULTS,
        country: STORE_COUNTRY,
      },
      cache: 'no-store',
    })
      .then((response) => {
        if (!isCurrent) return;
        const products = response.data.products.edges.map((edge) => edge.node);
        setResults(products);
      })
      .catch((error) => {
        if (!isCurrent) return;
        console.error('Failed to search products:', error);
        setResults([]);
      })
      .finally(() => {
        if (!isCurrent) return;
        setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery, results.length]);

  const itemsCount = useMemo(() => {
    return results.length + (debouncedQuery ? 1 : 0);
  }, [results.length, debouncedQuery]);

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    setActiveIndex(-1);
    router.push(href);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      if (!isOpen) setIsOpen(true);
      if (itemsCount === 0) return;
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % itemsCount);
    }

    if (event.key === 'ArrowUp') {
      if (!isOpen) setIsOpen(true);
      if (itemsCount === 0) return;
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? itemsCount - 1 : prev - 1));
    }

    if (event.key === 'Enter') {
      if (!query.trim()) return;
      event.preventDefault();

      if (activeIndex === -1) {
        handleNavigate(`/search?q=${encodeURIComponent(query.trim())}`);
        return;
      }

      if (activeIndex < results.length) {
        handleNavigate(`/products/${results[activeIndex].handle}`);
        return;
      }

      handleNavigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && containerRef.current.contains(nextTarget)) return;
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const dropdownId = 'predictive-search-results';
  const activeId =
    activeIndex >= 0
      ? `predictive-search-item-${activeIndex}`
      : undefined;

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={handleBlur}
    >
      <label htmlFor="header-search" className="sr-only">
        Search products
      </label>
      <input
        id="header-search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search"
        className="input h-9 text-sm w-36 md:w-56"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        aria-activedescendant={activeId}
        aria-autocomplete="list"
        autoComplete="off"
      />

      {isOpen && (
        <div
          id={dropdownId}
          className="absolute right-0 mt-2 w-72 sm:w-80 border border-gray-200 bg-white z-50"
          role="listbox"
        >
          <div className="px-4 py-3 border-b border-gray-100" role="status" aria-live="polite">
            <p className="caption text-gray-500">
              {isLoading
                ? 'Searching...'
                : debouncedQuery
                  ? `${results.length} result${results.length === 1 ? '' : 's'}`
                  : 'Start typing to search'}
            </p>
          </div>

          {debouncedQuery && results.length === 0 && !isLoading && (
            <div className="px-4 py-5 text-sm text-gray-500">
              No results found.
            </div>
          )}

          {results.length > 0 && (
            <ul className="max-h-80 overflow-auto">
              {results.map((product, index) => {
                const image = getProductImage(product);
                const price = product.priceRange.minVariantPrice;
                const isActive = activeIndex === index;

                return (
                  <li key={product.id}>
                    <button
                      type="button"
                      id={`predictive-search-item-${index}`}
                      role="option"
                      aria-selected={isActive}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 ${
                        isActive ? 'bg-gray-100 text-black' : 'text-gray-700'
                      }`}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => handleNavigate(`/products/${product.handle}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-14 bg-gray-100 overflow-hidden">
                          {image ? (
                            <Image
                              src={image.url}
                              alt={image.altText || product.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="caption">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">
                            {product.vendor}
                          </p>
                          <p className="text-sm text-black truncate">
                            {product.title}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            {formatPrice(price.amount, price.currencyCode)}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {debouncedQuery && (
            <div className="border-t border-gray-100">
              <button
                type="button"
                id={`predictive-search-item-${results.length}`}
                role="option"
                aria-selected={activeIndex === results.length}
                className={`w-full text-left px-4 py-3 text-sm ${
                  activeIndex === results.length
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-700'
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(results.length)}
                onClick={() =>
                  handleNavigate(`/search?q=${encodeURIComponent(debouncedQuery)}`)
                }
              >
                View all results →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

