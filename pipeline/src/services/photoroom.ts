/**
 * PhotoRoom API Service
 *
 * Handles background removal for product images.
 * Creates clean white background images.
 */

import { config } from '../config.js';

// Use the v2/edit endpoint which supports imageUrl directly
const API_BASE = 'https://image-api.photoroom.com/v2';

/**
 * Remove background from an image and replace with white
 * Uses the PhotoRoom Image Editing API v2 which accepts image URLs
 */
export async function removeBackground(imageUrl: string): Promise<string> {
  console.log(`[PhotoRoom] Processing image...`);

  // Build the URL with query parameters for the GET endpoint
  const params = new URLSearchParams({
    imageUrl: imageUrl,
    'background.color': 'F5F5F5',  // Light grey background (editorial, not clinical)
    outputSize: 'originalImage',   // Keep original size
  });

  const response = await fetch(`${API_BASE}/edit?${params.toString()}`, {
    method: 'GET',
    headers: {
      'x-api-key': config.photoroom.apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PhotoRoom API error: ${response.status} - ${errorText}`);
  }

  // PhotoRoom returns the processed image directly as binary
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('image/')) {
    // Convert binary to base64 data URL for Shopify
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = contentType.split(';')[0];
    return `data:${mimeType};base64,${base64}`;
  }

  // Unexpected response format
  throw new Error(`PhotoRoom returned unexpected content type: ${contentType}`);
}

/**
 * Process multiple images in parallel with rate limiting
 */
export async function processImages(
  images: { url: string; needsProcessing: boolean }[]
): Promise<string[]> {
  const results: string[] = [];

  // Process in batches of 3 to avoid rate limits
  const batchSize = 3;

  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async ({ url, needsProcessing }) => {
        if (needsProcessing) {
          try {
            return await removeBackground(url);
          } catch (error) {
            console.error(`[PhotoRoom] Failed to process ${url}:`, error);
            return url; // Return original if processing fails
          }
        }
        return url; // Already fine, use as-is
      })
    );

    results.push(...batchResults);

    // Small delay between batches
    if (i + batchSize < images.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return results;
}

/**
 * Test PhotoRoom connection
 * Note: We just verify the API key format to avoid wasting credits
 */
export async function testConnection(): Promise<boolean> {
  try {
    // Just verify the API key is set and has correct format
    if (!config.photoroom.apiKey) {
      console.error('[PhotoRoom] API key not set');
      return false;
    }

    if (!config.photoroom.apiKey.startsWith('sandbox_') &&
        !config.photoroom.apiKey.startsWith('sk_pr_')) {
      console.error('[PhotoRoom] API key format invalid');
      return false;
    }

    console.log('[PhotoRoom] API key valid (skipping test call to save credits)');
    return true;
  } catch (error) {
    console.error('[PhotoRoom] Connection check failed:', error);
    return false;
  }
}
