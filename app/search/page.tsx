import { Metadata } from 'next';
import Link from 'next/link';
import { shopifyFetch } from '@/lib/shopify/client';
import { SEARCH_PRODUCTS } from '@/lib/shopify/queries';
import { Product } from '@/lib/shopify/types';
import ProductGrid from '@/components/product/ProductGrid';
import SearchForm from '@/components/search/SearchForm';

const STORE_COUNTRY = 'US';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: 'Search | Axent',
  description: 'Search for products at Axent',
};

async function searchProducts(query: string): Promise<Product[]> {
  if (!query) return [];

  try {
    const response = await shopifyFetch<{
      products: { edges: { node: Product }[] };
    }>({
      query: SEARCH_PRODUCTS,
      variables: { query, first: 24, country: STORE_COUNTRY },
      cache: 'no-store',
    });
    return response.data.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const products = await searchProducts(q || '');

  return (
    <div className="container py-6">
      <nav className="text-xs text-gray-500 mb-4 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <span className="text-black">Search</span>
      </nav>
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl font-medium text-center mb-6">Search</h1>
        <SearchForm initialQuery={q} />
      </div>

      {/* Results */}
      {q && (
        <div>
          <div className="flex items-baseline justify-between mb-6">
            <p className="text-sm text-gray-500">
              {products.length} result{products.length !== 1 ? 's' : ''} for &quot;{q}&quot;
            </p>
            {products.length > 0 && (
              <Link
                href="/collections/all"
                className="text-sm hover:text-gray-500 transition-colors"
              >
                Browse all
              </Link>
            )}
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-10 max-w-md mx-auto">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-500 mb-2">No products found for &quot;{q}&quot;</p>
              <p className="text-sm text-gray-500 mb-6">
                Try a different search term or browse our collections.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/collections/all" className="btn-secondary">
                  All Products
                </Link>
                <Link href="/collections/new-arrivals" className="btn-secondary">
                  New Arrivals
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {!q && (
        <div className="text-center py-10 max-w-md mx-auto">
          <p className="text-gray-500 mb-6">
            Search for products by name, brand, or category.
          </p>
          <div className="space-y-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Popular searches</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Cardigan', 'Jacket', 'Wool', 'Oversized'].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-3 py-2 text-sm border border-gray-100 hover:border-black transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
