import type { MetadataRoute } from 'next';
import { shopifyFetch } from '@/lib/shopify/client';
import { GET_PRODUCTS, GET_COLLECTIONS } from '@/lib/shopify/queries';

const STORE_COUNTRY = 'US';
const PAGE_SIZE = 250;

async function fetchAllProducts(): Promise<{ handle: string }[]> {
  const products: { handle: string }[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await shopifyFetch<{
      products: {
        edges: { node: { handle: string } }[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    }>({
      query: GET_PRODUCTS,
      variables: {
        first: PAGE_SIZE,
        after: cursor,
        country: STORE_COUNTRY,
      },
      cache: 'no-store',
    });

    const { edges, pageInfo } = response.data.products;
    edges.forEach((edge) => products.push({ handle: edge.node.handle }));
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  return products;
}

async function fetchAllCollections(): Promise<{ handle: string }[]> {
  const response = await shopifyFetch<{
    collections: { edges: { node: { handle: string } }[] };
  }>({
    query: GET_COLLECTIONS,
    variables: { first: PAGE_SIZE },
    cache: 'no-store',
  });

  return response.data.collections.edges.map((edge) => ({
    handle: edge.node.handle,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ax9-nextjs.vercel.app';
  const now = new Date();

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/collections',
    '/collections/all',
    '/collections/new-arrivals',
    '/collections/outerwear',
    '/collections/tops',
    '/collections/bottoms',
    '/search',
    '/shipping',
    '/returns',
    '/size-guide',
    '/privacy',
    '/terms',
    '/account/login',
    '/account/register',
  ];

  const [products, collections] = await Promise.all([
    fetchAllProducts().catch(() => []),
    fetchAllCollections().catch(() => []),
  ]);

  const productRoutes = products.map((product) => `/products/${product.handle}`);
  const collectionRoutes = collections
    .filter((collection) => collection.handle !== 'frontpage')
    .map((collection) => `/collections/${collection.handle}`);

  return [...staticRoutes, ...collectionRoutes, ...productRoutes].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }));
}
