/**
 * Currency Conversion Service
 *
 * Fetches CNY to USD exchange rate.
 * Caches the rate to avoid excessive API calls.
 */

import { EXCHANGE_RATE_CACHE_MS } from '../config.js';

let cachedRate: number | null = null;
let cacheTimestamp: number = 0;

/**
 * Get current CNY to USD exchange rate
 * Uses a free API, caches result for 1 hour
 */
export async function getExchangeRate(): Promise<number> {
  const now = Date.now();

  // Return cached rate if still valid
  if (cachedRate && now - cacheTimestamp < EXCHANGE_RATE_CACHE_MS) {
    return cachedRate;
  }

  console.log('[Currency] Fetching exchange rate...');

  try {
    // Using Frankfurt Exchange API (free, no API key required)
    const response = await fetch(
      'https://api.frankfurter.app/latest?from=CNY&to=USD'
    );

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    const data = await response.json() as { rates?: { USD?: number } };
    const rate = data.rates?.USD;

    if (!rate) {
      throw new Error('USD rate not found in response');
    }

    cachedRate = rate;
    cacheTimestamp = now;

    console.log(`[Currency] CNY to USD rate: ${rate}`);
    return rate;
  } catch (error) {
    console.error('[Currency] Failed to fetch rate, using fallback:', error);

    // Fallback rate (approximately accurate as of 2025)
    // 1 CNY ≈ 0.14 USD
    return 0.14;
  }
}

/**
 * Convert CNY to USD
 */
export async function convertCnyToUsd(cny: number): Promise<number> {
  const rate = await getExchangeRate();
  return cny * rate;
}

/**
 * Convert and apply markup
 */
export async function convertWithMarkup(cny: number, markup: number): Promise<number> {
  const usd = await convertCnyToUsd(cny);
  return Math.ceil(usd * markup); // Round up to whole dollar
}
