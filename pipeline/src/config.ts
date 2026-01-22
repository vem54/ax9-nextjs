import 'dotenv/config';
import type { Config } from './types/index.js';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config: Config = {
  taobao: {
    appKey: requireEnv('TAOBAO_APP_KEY'),
    appSecret: requireEnv('TAOBAO_APP_SECRET'),
    accessToken: requireEnv('TAOBAO_ACCESS_TOKEN'),
  },
  claude: {
    apiKey: requireEnv('ANTHROPIC_API_KEY'),
  },
  photoroom: {
    apiKey: requireEnv('PHOTOROOM_API_KEY'),
  },
  shopify: {
    store: requireEnv('SHOPIFY_STORE'),
    accessToken: requireEnv('SHOPIFY_ACCESS_TOKEN'),
  },
  // Price markup multiplier - adjust based on margin needs
  // 2.0 = 100% markup, 2.5 = 150% markup
  markup: parseFloat(process.env.PRICE_MARKUP || '2.0'),
};

// Shopify API rate limit: 2 calls per second
export const SHOPIFY_RATE_LIMIT_MS = 500;

// Exchange rate cache duration (1 hour)
export const EXCHANGE_RATE_CACHE_MS = 60 * 60 * 1000;
