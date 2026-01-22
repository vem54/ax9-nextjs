import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { shopifyFetch } from '@/lib/shopify/client';
import { GET_COLLECTION_BY_HANDLE } from '@/lib/shopify/queries';
import { Collection, Product } from '@/lib/shopify/types';
import ProductGrid from '@/components/product/ProductGrid';
import CollectionFilters from '@/components/collection/CollectionFilters';

interface Props {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ sort?: string; availability?: string }>;
}

async function getCollection(handle: string, sortKey?: string, reverse?: boolean): Promise<Collection | null> {
  try {
    const response = await shopifyFetch<{ collection: Collection }>({
      query: GET_COLLECTION_BY_HANDLE,
      variables: {
        handle,
        first: 48,
        sortKey: sortKey || 'BEST_SELLING',
        reverse: reverse || false,
      },
      tags: ['collections', handle],
    });
    return response.data.collection;
  } catch (error) {
    console.error('Failed to fetch collection:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);

  if (!collection) {
    return { title: 'Collection Not Found' };
  }

  return {
    title: collection.title,
    description: collection.description || `Shop ${collection.title} at Axent`,
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const { sort, availability } = await searchParams;

  let sortKey = 'BEST_SELLING';
  let reverse = false;

  switch (sort) {
    case 'newest':
      sortKey = 'CREATED';
      reverse = true;
      break;
    case 'price-asc':
      sortKey = 'PRICE';
      reverse = false;
      break;
    case 'price-desc':
      sortKey = 'PRICE';
      reverse = true;
      break;
    case 'title-asc':
      sortKey = 'TITLE';
      reverse = false;
      break;
    case 'title-desc':
      sortKey = 'TITLE';
      reverse = true;
      break;
  }

  const collection = await getCollection(handle, sortKey, reverse);

  if (!collection) {
    notFound();
  }

  let products = collection.products.edges.map((edge) => edge.node);

  // Filter by availability
  if (availability === 'in-stock') {
    products = products.filter((p) => p.availableForSale);
  }

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-2">{collection.title}</h1>
        {collection.description && (
          <p className="text-sm text-gray-500 max-w-2xl">{collection.description}</p>
        )}
      </div>

      {/* Filters and Sort */}
      <CollectionFilters
        productCount={products.length}
        currentSort={sort}
        currentAvailability={availability}
      />

      {/* Products */}
      <ProductGrid products={products} />

      {/* Load More - if needed */}
      {collection.products.pageInfo.hasNextPage && (
        <div className="text-center mt-8">
          <button className="btn-secondary">Load More</button>
        </div>
      )}
    </div>
  );
}
