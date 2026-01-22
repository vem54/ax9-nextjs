import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { shopifyFetch } from '@/lib/shopify/client';
import { GET_COLLECTIONS } from '@/lib/shopify/queries';
import { Collection } from '@/lib/shopify/types';

export const metadata: Metadata = {
  title: 'Collections | Axent',
  description: 'Browse our curated collections of Chinese fashion.',
};

export const dynamic = 'force-dynamic';

async function getCollections(): Promise<Collection[]> {
  try {
    const response = await shopifyFetch<{
      collections: { edges: { node: Collection }[] };
    }>({
      query: GET_COLLECTIONS,
      variables: { first: 20 },
      tags: ['collections'],
      revalidate: 300,
    });
    return response.data.collections.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  // Filter out the "Home page" collection which is internal
  const displayCollections = collections.filter(
    (c) => c.handle !== 'frontpage'
  );

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Collections</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl">
          Focused edits across outerwear, knits, and structured staples from independent Chinese studios.
        </p>
      </div>

      {displayCollections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayCollections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group block"
            >
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden mb-3">
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    fill
                    className="object-cover group-hover:opacity-90"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-medium text-gray-500">
                      {collection.title}
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-lg font-medium group-hover:text-gray-500">
                {collection.title}
              </h2>
              {collection.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {collection.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-6">
            Explore our core edits while curated collections go live.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'All Products', handle: 'all' },
              { title: 'New Arrivals', handle: 'new-arrivals' },
              { title: 'Outerwear', handle: 'outerwear' },
              { title: 'Tops', handle: 'tops' },
              { title: 'Bottoms', handle: 'bottoms' },
            ].map((cat) => (
              <Link
                key={cat.handle}
                href={`/collections/${cat.handle}`}
                className="group block"
              >
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-black">
                  <span className="text-xl font-medium text-gray-500 group-hover:text-white">
                    {cat.title}
                  </span>
                </div>
                <h3 className="text-sm font-medium group-hover:text-gray-500">
                  {cat.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Always show All Products link */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <Link
          href="/collections/all"
          className="inline-flex items-center text-sm font-medium hover:text-gray-500"
        >
          View All Products
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
