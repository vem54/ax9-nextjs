import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { shopifyFetch } from '@/lib/shopify/client';
import { GET_COLLECTION_BY_HANDLE, GET_PRODUCTS } from '@/lib/shopify/queries';
import { Collection, Product } from '@/lib/shopify/types';
import ProductGrid from '@/components/product/ProductGrid';
import CollectionFilters from '@/components/collection/CollectionFilters';
import Link from 'next/link';

const STORE_COUNTRY = 'US';

// Force dynamic rendering to always fetch fresh data from Shopify
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ sort?: string; availability?: string }>;
}

// Special virtual collections that don't exist in Shopify
const VIRTUAL_COLLECTIONS: Record<string, { title: string; description: string }> = {
  all: {
    title: 'All Products',
    description: 'A curated edit of Chinese streetwear and contemporary design.',
  },
  'new-arrivals': {
    title: 'New Arrivals',
    description: 'Fresh arrivals from emerging labels and studio favorites.',
  },
  outerwear: {
    title: 'Outerwear',
    description: 'Coats and jackets built for structure, volume, and contrast.',
  },
  tops: {
    title: 'Tops',
    description: 'Shirts, knits, and long sleeves with sharp proportion.',
  },
  bottoms: {
    title: 'Bottoms',
    description: 'Trousers and denim with clean lines and modern shape.',
  },
};

function getSortParams(sort?: string): { sortKey: string; reverse: boolean } {
  switch (sort) {
    case 'newest':
      return { sortKey: 'CREATED_AT', reverse: true };
    case 'price-asc':
      return { sortKey: 'PRICE', reverse: false };
    case 'price-desc':
      return { sortKey: 'PRICE', reverse: true };
    case 'title-asc':
      return { sortKey: 'TITLE', reverse: false };
    case 'title-desc':
      return { sortKey: 'TITLE', reverse: true };
    default:
      return { sortKey: 'CREATED_AT', reverse: true };
  }
}

async function getCollection(handle: string, sortKey: string, reverse: boolean): Promise<Collection | null> {
  try {
    const response = await shopifyFetch<{ collection: Collection }>({
      query: GET_COLLECTION_BY_HANDLE,
      variables: {
        handle,
        first: 48,
        sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey,
        reverse,
        country: STORE_COUNTRY,
      },
      tags: ['collections', handle],
      revalidate: 60,
    });
    return response.data.collection;
  } catch (error) {
    console.error('Failed to fetch collection:', error);
    return null;
  }
}

async function getAllProducts(sortKey: string, reverse: boolean): Promise<Product[]> {
  try {
    const response = await shopifyFetch<{
      products: { edges: { node: Product }[] };
    }>({
      query: GET_PRODUCTS,
      variables: {
        first: 48,
        sortKey,
        reverse,
        country: STORE_COUNTRY,
      },
      tags: ['products'],
      revalidate: 60,
    });
    return response.data.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

async function getProductsByType(productType: string, sortKey: string, reverse: boolean): Promise<Product[]> {
  // For category collections, we fetch all products and filter by productType
  // In a production app, you'd use Shopify's query filter
  const allProducts = await getAllProducts(sortKey, reverse);

  const typeMapping: Record<string, string[]> = {
    outerwear: ['jacket', 'coat', 'outerwear', 'blazer'],
    tops: ['shirt', 'top', 'sweater', 'hoodie', 'cardigan', 'tee', 't-shirt'],
    bottoms: ['pants', 'trousers', 'jeans', 'shorts', 'skirt'],
  };

  const types = typeMapping[productType] || [];
  if (types.length === 0) return allProducts;

  return allProducts.filter((product) => {
    const pt = product.productType?.toLowerCase() || '';
    const title = product.title?.toLowerCase() || '';
    return types.some((t) => pt.includes(t) || title.includes(t));
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;

  // Check virtual collections first
  const virtual = VIRTUAL_COLLECTIONS[handle];
  if (virtual) {
    return {
      title: `${virtual.title} | Axent`,
      description: virtual.description,
    };
  }

  const collection = await getCollection(handle, 'BEST_SELLING', false);

  if (!collection) {
    return { title: 'Collection Not Found' };
  }

  return {
    title: `${collection.title} | Axent`,
    description: collection.description || `Shop ${collection.title} at Axent`,
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const { sort, availability } = await searchParams;
  const { sortKey, reverse } = getSortParams(sort);

  // Check if this is a virtual collection
  const virtual = VIRTUAL_COLLECTIONS[handle];

  let title: string;
  let description: string | undefined;
  let products: Product[];

  if (virtual) {
    title = virtual.title;
    description = virtual.description;

    if (handle === 'all' || handle === 'new-arrivals') {
      products = await getAllProducts(sortKey, reverse);
    } else {
      // Category collection (outerwear, tops, bottoms)
      products = await getProductsByType(handle, sortKey, reverse);
    }
  } else {
    // Real Shopify collection
    const collection = await getCollection(
      handle,
      sortKey === 'CREATED_AT' ? 'CREATED' : sortKey,
      reverse
    );

    if (!collection) {
      notFound();
    }

    title = collection.title;
    description = collection.description;
    products = collection.products.edges.map((edge) => edge.node);
  }

  // Filter by availability
  if (availability === 'in-stock') {
    products = products.filter((p) => p.availableForSale);
  }

  return (
    <div className="container py-12 lg:py-16">
      {/* Breadcrumb */}
      <nav className="caption mb-8 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/collections" className="hover:text-black transition-colors duration-200">Collections</Link>
        <span className="text-gray-300">/</span>
        <span className="text-black">{title}</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <p className="eyebrow mb-4">Collection</p>
        <h1 className="display-lg mb-4">{title}</h1>
        {description && (
          <p className="text-lg text-gray-500 max-w-2xl">{description}</p>
        )}
      </div>

      {/* Filters and Sort */}
      <CollectionFilters
        productCount={products.length}
        currentSort={sort}
        currentAvailability={availability}
      />

      {/* Products */}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-20 bg-cream">
          <p className="display-sm text-gray-600 mb-5">No products found in this collection.</p>
          <a href="/collections/all" className="link-underline text-sm">
            Browse all products
          </a>
        </div>
      )}
    </div>
  );
}
