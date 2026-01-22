import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
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

// Editorial content for virtual collections
interface CollectionEditorial {
  title: string;
  displayTitle: string;
  subtitle: string;
  description: string;
  theme: 'light' | 'dark';
}

const VIRTUAL_COLLECTIONS: Record<string, CollectionEditorial> = {
  all: {
    title: 'All Products',
    displayTitle: 'The Full Edit',
    subtitle: 'Every piece we\'ve curated, in one place.',
    description: 'A comprehensive collection of Chinese streetwear and contemporary design, selected for distinction and lasting style.',
    theme: 'light',
  },
  'new-arrivals': {
    title: 'New Arrivals',
    displayTitle: 'Just Landed',
    subtitle: 'The latest from our network of designers.',
    description: 'Fresh perspectives from emerging labels and established ateliers. Updated weekly with pieces that define the season.',
    theme: 'dark',
  },
  outerwear: {
    title: 'Outerwear',
    displayTitle: 'Outerwear',
    subtitle: 'Structured silhouettes for every season.',
    description: 'Coats, jackets, and layering pieces engineered for form and function. Built to last, designed to impress.',
    theme: 'light',
  },
  tops: {
    title: 'Tops',
    displayTitle: 'Tops',
    subtitle: 'From knits to shirts, the foundations.',
    description: 'Essential pieces and statement makers. Precision cuts and considered details for everyday wear.',
    theme: 'light',
  },
  bottoms: {
    title: 'Bottoms',
    displayTitle: 'Bottoms',
    subtitle: 'Trousers, shorts, and everything below.',
    description: 'Clean lines and modern proportions. From tailored trousers to relaxed fits, each piece crafted with intention.',
    theme: 'light',
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
  let displayTitle: string;
  let subtitle: string | undefined;
  let description: string | undefined;
  let products: Product[];
  let collectionImage: { url: string; altText?: string | null } | null = null;
  let theme: 'light' | 'dark' = 'light';

  if (virtual) {
    title = virtual.title;
    displayTitle = virtual.displayTitle;
    subtitle = virtual.subtitle;
    description = virtual.description;
    theme = virtual.theme;

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
    displayTitle = collection.title;
    subtitle = undefined;
    description = collection.description;
    collectionImage = collection.image || null;
    products = collection.products.edges.map((edge) => edge.node);
  }

  // Filter by availability
  if (availability === 'in-stock') {
    products = products.filter((p) => p.availableForSale);
  }

  // Determine hero styling based on theme and image
  const isDark = theme === 'dark' || collectionImage;
  const heroTextColor = isDark ? 'text-white' : 'text-black';
  const heroBgColor = collectionImage ? '' : (theme === 'dark' ? 'bg-black' : 'bg-gray-100');

  return (
    <>
      {/* Editorial Hero Section */}
      <section className={`relative w-full ${heroBgColor}`}>
        {/* Background Image */}
        {collectionImage && (
          <div className="absolute inset-0">
            <Image
              src={collectionImage.url}
              alt={collectionImage.altText || displayTitle}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        {/* Hero Content */}
        <div className="container relative">
          <div className="py-20 md:py-28 lg:py-36">
            {/* Breadcrumb */}
            <nav className={`caption mb-8 flex flex-wrap items-center gap-2 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
              <Link 
                href="/" 
                className={`${isDark ? 'hover:text-white' : 'hover:text-black'} transition-colors duration-200`}
              >
                Home
              </Link>
              <span className={isDark ? 'text-white/30' : 'text-gray-300'}>/</span>
              <Link 
                href="/collections" 
                className={`${isDark ? 'hover:text-white' : 'hover:text-black'} transition-colors duration-200`}
              >
                Collections
              </Link>
              <span className={isDark ? 'text-white/30' : 'text-gray-300'}>/</span>
              <span className={heroTextColor}>{title}</span>
            </nav>

            {/* Editorial Header */}
            <div className="max-w-3xl">
              <p className={`eyebrow mb-6 ${isDark ? 'text-white/50' : 'text-gray-400'}`}>
                Collection
              </p>
              <h1 className={`display-hero mb-6 ${heroTextColor}`}>
                {displayTitle}
              </h1>
              {subtitle && (
                <p className={`text-xl md:text-2xl font-serif italic mb-6 ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
                  {subtitle}
                </p>
              )}
              {description && (
                <p className={`text-base md:text-lg max-w-xl ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <div className="container py-12 lg:py-16">
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
    </>
  );
}
