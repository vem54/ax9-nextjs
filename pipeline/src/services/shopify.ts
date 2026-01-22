/**
 * Shopify Admin API Service
 *
 * Handles product creation with proper variant-image linking.
 * THIS IS WHERE WE FIX THE DUPLICATE IMAGE BUG.
 */

import { config, SHOPIFY_RATE_LIMIT_MS } from '../config.js';
import type {
  FinalProduct,
  ShopifyProduct,
  ShopifyVariant,
  ShopifyImage,
} from '../types/index.js';

const API_VERSION = '2025-01';
const API_BASE = `https://${config.shopify.store}/admin/api/${API_VERSION}`;

/**
 * Make a request to Shopify Admin API
 */
async function shopifyRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': config.shopify.accessToken,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
  }

  // Rate limiting
  await new Promise(resolve => setTimeout(resolve, SHOPIFY_RATE_LIMIT_MS));

  return response.json() as Promise<T>;
}

/**
 * Create a product with variants and images
 *
 * CRITICAL: Images are linked to COLOR variants to prevent duplicates.
 * When a user selects a color, only images for that color show.
 */
export async function createProduct(product: FinalProduct): Promise<ShopifyProduct> {
  console.log(`[Shopify] Creating product: ${product.title}`);

  // Step 1: Create product with variants (no images yet)
  const productPayload = {
    product: {
      title: product.title,
      body_html: product.body_html,
      vendor: product.vendor,
      product_type: product.product_type,
      tags: product.tags.join(', '),
      options: [
        { name: 'Size', values: [...new Set(product.variants.map(v => v.option1))] },
        { name: 'Color', values: [...new Set(product.variants.map(v => v.option2))] },
      ],
      variants: product.variants.map(v => ({
        option1: v.option1,
        option2: v.option2,
        price: v.price,
        sku: v.sku,
        inventory_quantity: v.inventory_quantity,
        inventory_management: 'shopify',
      })),
    },
  };

  const { product: createdProduct } = await shopifyRequest<{ product: ShopifyProduct }>(
    '/products.json',
    'POST',
    productPayload
  );

  console.log(`[Shopify] Product created with ID: ${createdProduct.id}`);

  // Step 2: Upload images and link to correct color variants
  // Group variants by color
  const variantsByColor = new Map<string, number[]>();
  for (const variant of createdProduct.variants) {
    const color = variant.option2; // Color is option2
    if (!variantsByColor.has(color)) {
      variantsByColor.set(color, []);
    }
    variantsByColor.get(color)!.push(variant.id);
  }

  // Upload images in batches of 3 (Shopify rate limits)
  // Link images to color variants to prevent duplicates when switching sizes
  console.log(`[Shopify] Uploading ${product.images.length} images...`);
  const BATCH_SIZE = 3;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < product.images.length; i += BATCH_SIZE) {
    const batch = product.images.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(image => {
        // Map color names to variant IDs
        let variantIds: number[] = [];

        if (image.variant_colors && image.variant_colors.length > 0) {
          // Image is linked to specific colors - get their variant IDs
          for (const color of image.variant_colors) {
            const ids = variantsByColor.get(color);
            if (ids) {
              variantIds.push(...ids);
            }
          }
        }
        // If no colors specified, image shows for all variants (variantIds stays empty)

        return uploadImage(
          createdProduct.id,
          image.src,
          image.position,
          variantIds
        );
      })
    );

    // Count successes and failures
    for (const result of results) {
      if (result) {
        successCount++;
      } else {
        failCount++;
      }
    }
  }

  console.log(`[Shopify] Images: ${successCount} uploaded, ${failCount} failed`);

  // Step 3: Add metafields
  await addMetafields(createdProduct.id, product.metafields);

  console.log(`[Shopify] Product complete: ${createdProduct.id}`);

  return createdProduct;
}

/**
 * Upload an image to a product, optionally linked to variants
 *
 * THIS IS THE KEY FIX:
 * By passing variant_ids, we link the image to specific color variants.
 * When variant_ids is set, the image only shows when those variants are selected.
 *
 * Supports both URLs (src) and base64 data URLs (attachment).
 * Includes retry logic for transient failures (520s, timeouts, etc.)
 */
async function uploadImage(
  productId: number,
  src: string,
  position: number,
  variantIds: number[]
): Promise<ShopifyImage | null> {
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 2000;

  const payload: any = {
    image: {
      position,
    },
  };

  // Check if src is a base64 data URL
  if (src.startsWith('data:')) {
    // Extract base64 content (remove data:image/png;base64, prefix)
    const base64Data = src.replace(/^data:image\/\w+;base64,/, '');
    payload.image.attachment = base64Data;
  } else {
    payload.image.src = src;
  }

  // Link to variants if provided
  if (variantIds.length > 0) {
    payload.image.variant_ids = variantIds;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Shopify] Uploading image position ${position}${attempt > 1 ? ` (attempt ${attempt})` : ''}...`);

      const { image } = await shopifyRequest<{ image: ShopifyImage }>(
        `/products/${productId}/images.json`,
        'POST',
        payload
      );

      return image;
    } catch (error: any) {
      const isRetryable = error.message?.includes('520') ||
                          error.message?.includes('502') ||
                          error.message?.includes('503') ||
                          error.message?.includes('timeout');

      if (isRetryable && attempt < MAX_RETRIES) {
        console.log(`[Shopify] Image ${position} failed (${error.message?.substring(0, 50)}...), retrying in ${RETRY_DELAY_MS}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempt));
      } else {
        console.error(`[Shopify] Image ${position} failed permanently: ${error.message?.substring(0, 100)}`);
        return null; // Return null instead of throwing - allows other images to continue
      }
    }
  }

  return null;
}

/**
 * Add metafields to a product (gender, colors, size chart, materials, care)
 * NOW PARALLELIZED for speed
 */
async function addMetafields(
  productId: number,
  metafields: FinalProduct['metafields']
): Promise<void> {
  // Build array of metafields to add
  const metafieldRequests: Array<{ key: string; value: string; type: string }> = [
    { key: 'gender', value: metafields.gender, type: 'single_line_text_field' },
    { key: 'colors', value: JSON.stringify(metafields.colors), type: 'list.single_line_text_field' },
  ];

  if (metafields.size_chart) {
    metafieldRequests.push({
      key: 'size_chart',
      value: JSON.stringify(metafields.size_chart),
      type: 'json',
    });
  }

  if (metafields.materials) {
    metafieldRequests.push({
      key: 'materials',
      value: metafields.materials,
      type: 'single_line_text_field',
    });
  }

  if (metafields.care_instructions) {
    metafieldRequests.push({
      key: 'care_instructions',
      value: metafields.care_instructions,
      type: 'single_line_text_field',
    });
  }

  // Upload all metafields in parallel
  console.log(`[Shopify] Adding ${metafieldRequests.length} metafields in parallel...`);
  await Promise.all(
    metafieldRequests.map(mf =>
      shopifyRequest(
        `/products/${productId}/metafields.json`,
        'POST',
        {
          metafield: {
            namespace: 'custom',
            key: mf.key,
            value: mf.value,
            type: mf.type,
          },
        }
      )
    )
  );
}

/**
 * Get variant IDs for a specific color
 * Useful when you need to link images to color variants
 */
export function getVariantIdsByColor(
  variants: ShopifyVariant[],
  color: string
): number[] {
  return variants
    .filter(v => v.option2.toLowerCase() === color.toLowerCase())
    .map(v => v.id);
}

/**
 * Delete a product (for testing/cleanup)
 */
export async function deleteProduct(productId: number): Promise<void> {
  await shopifyRequest(`/products/${productId}.json`, 'DELETE');
  console.log(`[Shopify] Product deleted: ${productId}`);
}

/**
 * Test Shopify connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    await shopifyRequest('/shop.json');
    console.log('[Shopify] Connection successful');
    return true;
  } catch (error) {
    console.error('[Shopify] Connection failed:', error);
    return false;
  }
}
