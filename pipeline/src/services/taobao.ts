/**
 * Taobao Global API Service
 *
 * Uses the Taobao Global Open Platform API (api.taobao.global)
 * with HMAC-SHA256 signing.
 *
 * IMPORTANT: Only works with products from the distributor portal
 * (distributor.taobao.global), NOT regular taobao.com products.
 */

import crypto from 'crypto';
import { config } from '../config.js';
import type { TaobaoProduct, TaobaoSku } from '../types/index.js';

const API_BASE = 'https://api.taobao.global/rest';

/**
 * Generate HMAC-SHA256 signature for Taobao Global API
 *
 * Signature = HMAC-SHA256(apiPath + sortedKeyValuePairs, appSecret)
 */
function generateSignature(apiPath: string, params: Record<string, string>): string {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys.map(key => `${key}${params[key]}`).join('');
  const signString = apiPath + paramString;

  return crypto
    .createHmac('sha256', config.taobao.appSecret)
    .update(signString)
    .digest('hex')
    .toUpperCase();
}

/**
 * Make a request to Taobao Global API
 */
async function taobaoRequest<T>(apiPath: string, extraParams: Record<string, string> = {}): Promise<T> {
  const timestamp = Date.now().toString();

  const params: Record<string, string> = {
    app_key: config.taobao.appKey,
    timestamp,
    sign_method: 'sha256',
    access_token: config.taobao.accessToken,
    ...extraParams,
  };

  // Generate signature
  params.sign = generateSignature(apiPath, params);

  // Build URL
  const url = new URL(API_BASE + apiPath);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  console.log(`[Taobao] Calling ${apiPath}...`);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Taobao API error: ${response.status} - ${text}`);
  }

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Taobao API returned invalid JSON: ${text.substring(0, 200)}`);
  }

  // Check for API-level errors
  if (data.error || data.error_response) {
    const err = data.error || data.error_response;
    throw new Error(`Taobao API error: ${err.msg || err.message || JSON.stringify(err)}`);
  }

  return data as T;
}

/**
 * Raw API response type from /product/get
 */
interface TaobaoApiResponse {
  item_id: string;
  title: string;
  detail_url?: string;
  price?: string;
  pic_url?: string;
  item_imgs?: Array<{ url: string }>;
  desc?: string;
  nick?: string;
  skus?: {
    sku: Array<{
      sku_id: string;
      price: string;
      quantity: string;
      properties_name?: string;
      sku_spec_id?: string;
    }>;
  };
  props_list?: Record<string, string>;
  prop_imgs?: {
    prop_img: Array<{
      properties: string;
      url: string;
    }>;
  };
}

/**
 * Get product details by Taobao item ID
 *
 * IMPORTANT: Item ID must be from distributor.taobao.global portal,
 * NOT from regular taobao.com (those return "商品不支持采购" error)
 */
export async function getProduct(itemId: string): Promise<TaobaoProduct> {
  console.log(`[Taobao] Fetching product: ${itemId}`);

  const response = await taobaoRequest<any>('/product/get', {
    item_id: itemId,
  });

  // The API nests the product data in various ways
  const product = response.data || response.result || response.item || response.product || response;

  if (!product || (!product.title && !product.item_id)) {
    console.error('[Taobao] Raw response:', JSON.stringify(response, null, 2).substring(0, 1000));
    throw new Error(`Product not found or invalid response for item: ${itemId}`);
  }

  return parseProduct(product);
}

/**
 * Parse Taobao API response into our standard format
 */
function parseProduct(raw: any): TaobaoProduct {
  // Extract images from various possible locations
  const images = extractImages(raw);

  // Extract SKUs
  const skus = extractSkus(raw);

  // Get shop/brand name
  const shopName = raw.shop_name || raw.nick || raw.seller_nick || '';

  // Price is in fen (cents), convert to yuan
  const priceInFen = parseFloat(raw.price || raw.reserve_price || '0');
  const priceInYuan = priceInFen / 100;

  // Extract description HTML and images from it
  const descriptionHtml = raw.desc || raw.description || '';
  const descriptionImages = extractImagesFromHtml(descriptionHtml);

  return {
    item_id: String(raw.item_id || raw.num_iid || ''),
    title: raw.title || '',
    description: descriptionHtml,
    description_images: descriptionImages,
    price: priceInYuan,
    images,
    skus,
    shop_name: shopName,
    category: raw.category_id || raw.cid,
    category_path: raw.category_path,
  };
}

/**
 * Extract image URLs from HTML description
 * These often contain size charts, model info, detail shots, etc.
 */
function extractImagesFromHtml(html: string): string[] {
  if (!html) return [];

  const images: string[] = [];

  // Match img src attributes (both single and double quotes)
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    let url = match[1];
    // Fix protocol-relative URLs
    if (url.startsWith('//')) {
      url = 'https:' + url;
    }
    // Filter out tiny images (likely icons/spacers) and duplicates
    if (url &&
        !url.includes('spacer') &&
        !url.includes('icon') &&
        !url.includes('1x1') &&
        url.includes('alicdn.com') &&
        !images.includes(url)) {
      images.push(url);
    }
  }

  return images;
}

/**
 * Extract all product images
 */
function extractImages(raw: any): string[] {
  const images: string[] = [];

  // pic_urls is the main image array in Taobao Global API
  if (raw.pic_urls && Array.isArray(raw.pic_urls)) {
    for (const url of raw.pic_urls) {
      if (url && !images.includes(url)) {
        images.push(url);
      }
    }
  }

  // Main image (legacy format)
  if (raw.pic_url && !images.includes(raw.pic_url)) {
    images.unshift(raw.pic_url); // Put main image first
  }

  // Item images array (legacy format)
  if (raw.item_imgs) {
    const imgArray = Array.isArray(raw.item_imgs)
      ? raw.item_imgs
      : raw.item_imgs.item_img || [];
    for (const img of imgArray) {
      const url = typeof img === 'string' ? img : img.url;
      if (url && !images.includes(url)) {
        images.push(url);
      }
    }
  }

  // SKU images (variant-specific images)
  if (raw.sku_list && Array.isArray(raw.sku_list)) {
    for (const sku of raw.sku_list) {
      if (sku.pic_url && !images.includes(sku.pic_url)) {
        images.push(sku.pic_url);
      }
    }
  }

  return images;
}

/**
 * Extract SKU variants
 */
function extractSkus(raw: any): TaobaoSku[] {
  // SKUs are in sku_list for Taobao Global API
  let skuList: any[] = [];

  if (raw.sku_list && Array.isArray(raw.sku_list)) {
    skuList = raw.sku_list;
  } else if (raw.skus?.sku) {
    skuList = Array.isArray(raw.skus.sku) ? raw.skus.sku : [raw.skus.sku];
  } else if (raw.skus && Array.isArray(raw.skus)) {
    skuList = raw.skus;
  }

  // If no SKUs, create a default one
  if (skuList.length === 0) {
    const priceInFen = parseFloat(raw.price || '0');
    return [{
      sku_id: String(raw.item_id || 'default'),
      price: priceInFen / 100, // Convert fen to yuan
      stock: parseInt(raw.quantity || raw.num || '10', 10),
      properties: { color: '', size: '' },
    }];
  }

  return skuList.map((sku: any) => {
    const { color, size } = parseSkuPropertiesFromArray(sku.properties);
    const priceInFen = parseFloat(sku.price || raw.price || '0');

    return {
      sku_id: String(sku.sku_id || sku.id || ''),
      price: priceInFen / 100, // Convert fen to yuan
      stock: parseInt(sku.quantity || sku.stock || '0', 10),
      properties: { color, size },
      image: sku.pic_url,
    };
  });
}

/**
 * Parse SKU properties from the Taobao Global API array format
 *
 * Properties are in format:
 * [
 *   { prop_name: "颜色分类", value_name: "灰-现货" },
 *   { prop_name: "尺码", value_name: "S" }
 * ]
 */
function parseSkuPropertiesFromArray(
  properties: Array<{ prop_name: string; value_name: string }> | undefined
): { color: string; size: string } {
  let color = '';
  let size = '';

  if (!properties || !Array.isArray(properties)) {
    return { color, size };
  }

  for (const prop of properties) {
    const propName = prop.prop_name || '';
    const valueName = prop.value_name || '';

    // Detect color properties
    if (propName.includes('颜色') || propName.toLowerCase().includes('color')) {
      color = valueName;
    }

    // Detect size properties
    if (propName.includes('尺码') || propName.includes('尺寸') ||
        propName.includes('规格') || propName.toLowerCase().includes('size')) {
      size = valueName;
    }
  }

  return { color, size };
}

/**
 * Test the Taobao connection with a known working item
 */
export async function testConnection(): Promise<boolean> {
  try {
    // Use a known working distributor product
    const testItemId = '846881782232'; // Flowery Bubble sweater
    const product = await getProduct(testItemId);
    console.log(`[Taobao] Connection successful - fetched: ${product.title.substring(0, 50)}...`);
    return true;
  } catch (error) {
    console.error('[Taobao] Connection failed:', error);
    return false;
  }
}
