import { Metadata } from 'next';
import { shopifyFetch } from '@/lib/shopify/client';
import { SEARCH_PRODUCTS } from '@/lib/shopify/queries';
import { Product } from '@/lib/shopify/types';
import ProductGrid from '@/components/product/ProductGrid';
import SearchForm from '@/components/search/SearchForm';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for products at Axent',
};

async function searchProducts(query: string): Promise<Product[]> {
  if (!query) return [];

  try {
    const response = await shopifyFetch<{
      products: { edges: { node: Product }[] };
    }>({
      query: SEARCH_PRODUCTS,
      variables: { query, first: 24 },
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
      <h1 className="text-2xl font-medium mb-6">Search</h1>

      {/* Search form */}
      <SearchForm initialQuery={q} />

      {/* Results */}
      {q && (
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-6">
            {products.length} result{products.length !== 1 ? 's' : ''} for &quot;{q}&quot;
          </p>
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No products found</p>
              <p className="text-sm text-gray-500">
                Try a different search term or browse our collections.
              </p>
            </div>
          )}
        </div>
      )}

      {!q && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            Enter a search term to find products.
          </p>
        </div>
      )}
    </div>
  );
}
