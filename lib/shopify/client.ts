import { ShopifyResponse } from './types';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const THB_TO_USD_RATE = Number(process.env.NEXT_PUBLIC_THB_TO_USD_RATE ?? '0.032126');

const endpoint = `https://${domain}/api/2024-01/graphql.json`;

export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'no-store',
  tags,
  revalidate,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
  revalidate?: number;
}): Promise<ShopifyResponse<T>> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache,
    next: tags || typeof revalidate === 'number'
      ? { tags, revalidate }
      : undefined,
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error('Shopify GraphQL errors:', json.errors);
    throw new Error(json.errors[0].message);
  }

  return json;
}

export function formatPrice(amount: string, currencyCode: string): string {
  let normalizedAmount = parseFloat(amount);
  let normalizedCurrency = currencyCode;

  if (currencyCode === 'THB') {
    normalizedAmount = normalizedAmount * THB_TO_USD_RATE;
    normalizedCurrency = 'USD';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: normalizedCurrency,
  }).format(normalizedAmount);
}

export function getIdFromGid(gid: string): string {
  return gid.split('/').pop() || '';
}
