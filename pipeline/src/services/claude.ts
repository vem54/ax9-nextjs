/**
 * Claude API Service
 *
 * Handles all AI operations:
 * - Translation (Chinese → English)
 * - Image classification (delete/remove/fine)
 * - Product description generation
 */

import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';
import type {
  TaobaoProduct,
  TranslatedProduct,
  TranslatedVariant,
  ImageClassification,
  ClassifiedImage,
  StandardColor,
  SizeChart,
  SizeChartMeasurement,
  SizeChartType,
  ModelInfo,
} from '../types/index.js';
import { STANDARD_COLORS } from '../types/index.js';
import { TRANSLATE_PROMPT, CLASSIFY_IMAGE_PROMPT, DESCRIBE_PRODUCT_PROMPT, EXTRACT_SIZE_CHART_PROMPT } from '../prompts/index.js';
import { fetchImageAsBase64 } from './image-utils.js';

const client = new Anthropic({
  apiKey: config.claude.apiKey,
});

const MODEL = 'claude-sonnet-4-20250514';

/**
 * Translate and structure product data from Chinese to English
 */
export async function translateProduct(
  product: TaobaoProduct,
  exchangeRate: number
): Promise<TranslatedProduct> {
  // Get unique colors from SKUs for translation
  const uniqueColors = [...new Set(product.skus.map(s => s.properties.color).filter(Boolean))];

  const prompt = TRANSLATE_PROMPT
    .replace('{{TITLE}}', product.title)
    .replace('{{DESCRIPTION}}', product.description)
    .replace('{{SHOP_NAME}}', product.shop_name)
    .replace('{{SKUS}}', JSON.stringify(product.skus.slice(0, 3), null, 2)) // Only show first 3 SKUs as examples
    .replace('{{STANDARD_COLORS}}', STANDARD_COLORS.join(', '))
    + `\n\n## COLOR TRANSLATIONS NEEDED\nTranslate these color names to English and map to standard colors:\n${uniqueColors.map(c => `- "${c}"`).join('\n')}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Parse JSON response
  const parsed = JSON.parse(extractJson(content.text));

  // Build color translation map from Claude's response
  const colorMap = new Map<string, { english: string; standard: string }>();
  if (parsed.color_translations && Array.isArray(parsed.color_translations)) {
    for (const ct of parsed.color_translations) {
      if (ct.original && ct.english) {
        colorMap.set(ct.original, {
          english: ct.english,
          standard: ct.color_standardized || 'Multicolor',
        });
      }
    }
  }
  // Also check if variants have color mappings (legacy format)
  if (parsed.variants && Array.isArray(parsed.variants)) {
    for (const v of parsed.variants) {
      if (v.original_color && v.color) {
        colorMap.set(v.original_color, {
          english: v.color,
          standard: v.color_standardized || 'Multicolor',
        });
      }
    }
  }

  // Build translated variants with USD prices
  const variants: TranslatedVariant[] = product.skus.map((sku) => {
    const priceUsd = Math.ceil(sku.price * exchangeRate * config.markup);
    const colorInfo = colorMap.get(sku.properties.color);

    // Clean up size - remove Chinese descriptors
    let size = sku.properties.size || 'One Size';
    size = cleanSize(size);

    // Get translated color or use original
    let color = colorInfo?.english || sku.properties.color || 'Default';
    color = cleanColor(color);
    const colorStd = colorInfo?.standard || guessStandardColor(color);

    return {
      sku_id: sku.sku_id,
      size,
      color,
      color_standardized: colorStd,
      price_cny: sku.price,
      price_usd: priceUsd,
      stock: sku.stock,
      image: sku.image,
    };
  });

  return {
    title: parsed.title,
    description: parsed.description,
    vendor: parsed.vendor,
    product_type: parsed.product_type,
    gender: parsed.gender || 'Unisex',
    variants,
    original: product,
  };
}

/**
 * Clean up size string - remove Chinese descriptors
 */
function cleanSize(size: string): string {
  // Remove common Chinese size descriptors
  return size
    .replace(/模特码/g, '')
    .replace(/预售/g, '')
    .replace(/现货/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/（.*?）/g, '')
    .trim() || 'One Size';
}

/**
 * Clean up color string - remove order/stock info
 * Returns empty string for invalid colors (size guides, etc) which will be filtered out
 */
function cleanColor(color: string): string {
  // Skip entries that are size guides, not actual colors
  const lowerColor = color.toLowerCase();
  if (color.includes('尺码推荐') || color.includes('详细尺码') ||
      color.includes('尺码') || color.includes('联系客服') ||
      lowerColor.includes('size guide') ||
      lowerColor.includes('size recommend') ||
      lowerColor.includes('size chart') ||
      lowerColor === 'size guide' ||
      lowerColor === 'default') {
    return ''; // Will be filtered out
  }

  const cleaned = color
    .replace(/现货/g, '')
    .replace(/预售/g, '')
    .replace(/预\d+.*?发货/g, '')
    .replace(/\d+小时内发货/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/（.*?）/g, '')
    .replace(/-$/g, '')
    .trim();

  // Final check - if result looks like a size guide, filter it out
  if (cleaned.toLowerCase().includes('size') && cleaned.toLowerCase().includes('guide')) {
    return '';
  }

  return cleaned || '';
}

/**
 * Guess standard color from English color name
 */
function guessStandardColor(color: string): string {
  const lower = color.toLowerCase();
  for (const std of STANDARD_COLORS) {
    if (lower.includes(std.toLowerCase())) {
      return std;
    }
  }
  // Common mappings
  if (lower.includes('grey') || lower.includes('gray') || lower.includes('灰')) return 'Gray';
  if (lower.includes('cream') || lower.includes('ivory') || lower.includes('米')) return 'Beige';
  if (lower.includes('navy')) return 'Navy';
  if (lower.includes('khaki') || lower.includes('tan') || lower.includes('卡其')) return 'Brown';
  return 'Multicolor';
}

/**
 * Classify an image to determine processing needed
 */
export async function classifyImage(imageUrl: string): Promise<ClassifiedImage> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'url',
              url: imageUrl,
            },
          },
          {
            type: 'text',
            text: CLASSIFY_IMAGE_PROMPT,
          },
        ],
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  const parsed = JSON.parse(extractJson(content.text));

  return {
    url: imageUrl,
    classification: parsed.classification as ImageClassification,
    reason: parsed.reason,
  };
}

/**
 * Generate product title and HTML description
 */
export async function generateDescription(
  product: TranslatedProduct,
  mainImageUrl?: string,
  brandContext?: string,
  productDetails?: { materials?: string; careInstructions?: string }
): Promise<{ title: string; body_html: string }> {
  const prompt = DESCRIBE_PRODUCT_PROMPT
    .replace('{{TITLE}}', product.title)
    .replace(/\{\{VENDOR\}\}/g, product.vendor)
    .replace('{{PRODUCT_TYPE}}', product.product_type)
    .replace('{{GENDER}}', product.gender)
    .replace('{{COLORS}}', [...new Set(product.variants.map(v => v.color))].join(', '))
    .replace('{{SIZES}}', [...new Set(product.variants.map(v => v.size))].join(', '))
    .replace('{{MATERIALS}}', productDetails?.materials || 'Not specified')
    .replace('{{CARE_INSTRUCTIONS}}', productDetails?.careInstructions || 'Not specified')
    .replace('{{BRAND_CONTEXT}}', brandContext || 'No brand context available. Write in a general elevated fashion voice.');

  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content: mainImageUrl
        ? [
            { type: 'image', source: { type: 'url', url: mainImageUrl } },
            { type: 'text', text: prompt },
          ]
        : prompt,
    },
  ];

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    messages,
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  const parsed = JSON.parse(extractJson(content.text));

  return {
    title: parsed.title,
    body_html: parsed.description,
  };
}

/**
 * Extract size chart data from description images using Claude Vision
 *
 * Analyzes multiple images at once to find and extract:
 * - Size measurements (chest, length, shoulder, sleeve, etc.)
 * - Model information (height, weight, size worn)
 * - Fit notes and recommendations
 * - Materials and care instructions (if visible)
 *
 * Downloads images and converts to base64 to handle AVIF/WebP formats
 * and avoid Taobao CDN blocking issues.
 */
export async function extractSizeChart(
  imageUrls: string[],
  maxImages: number = 10
): Promise<{ sizeChart?: SizeChart; materials?: string; careInstructions?: string }> {
  // Limit number of images to avoid token limits
  const imagesToAnalyze = imageUrls.slice(0, maxImages);

  if (imagesToAnalyze.length === 0) {
    console.log('[Claude] No description images to analyze for size chart');
    return {};
  }

  console.log(`[Claude] Analyzing ${imagesToAnalyze.length} images for size chart...`);

  // Download and convert images to base64 (handles AVIF, WebP, etc.)
  console.log('[Claude] Downloading and converting images...');
  const imageData: { url: string; base64: string }[] = [];

  for (const url of imagesToAnalyze) {
    try {
      const base64 = await fetchImageAsBase64(url);
      imageData.push({ url, base64 });
    } catch (error: any) {
      console.log(`[Claude] Skipping image (failed to download): ${url.substring(0, 50)}...`);
    }
  }

  if (imageData.length === 0) {
    console.log('[Claude] No images could be downloaded for size chart analysis');
    return {};
  }

  console.log(`[Claude] Successfully downloaded ${imageData.length} images`);

  // Build content array with all images as base64
  const content: Anthropic.MessageParam['content'] = [];

  for (let i = 0; i < imageData.length; i++) {
    const { base64 } = imageData[i];
    // Extract the base64 data and media type from data URL
    const match = base64.match(/^data:image\/(\w+);base64,(.+)$/);
    const mediaType = match ? `image/${match[1]}` : 'image/jpeg';
    const base64Data = match ? match[2] : base64.replace(/^data:image\/\w+;base64,/, '');

    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
        data: base64Data,
      },
    });
    content.push({
      type: 'text',
      text: `Image ${i + 1} of ${imageData.length}`,
    });
  }

  content.push({
    type: 'text',
    text: EXTRACT_SIZE_CHART_PROMPT,
  });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content }],
    });

    const responseContent = response.content[0];
    if (responseContent.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const parsed = JSON.parse(extractJson(responseContent.text));

    if (!parsed.found_size_chart) {
      console.log('[Claude] No size chart found in images');
      return {};
    }

    console.log('[Claude] Size chart extracted successfully');

    // Build SizeChart object
    const sizeChart: SizeChart = {
      type: (parsed.type as SizeChartType) || 'tops',
      measurements: parsed.measurements || [],
      source_image_url: imageData[parsed.source_image_index || 0]?.url,
    };

    if (parsed.model_info) {
      sizeChart.model_info = parsed.model_info;
    }

    if (parsed.fit_notes) {
      sizeChart.fit_notes = parsed.fit_notes;
    }

    return {
      sizeChart,
      materials: parsed.materials,
      careInstructions: parsed.care_instructions,
    };
  } catch (error) {
    console.error('[Claude] Error extracting size chart:', error);
    return {};
  }
}

/**
 * Extract JSON from Claude's response (handles markdown code blocks)
 */
function extractJson(text: string): string {
  // Try to extract from code block first
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Otherwise assume the whole thing is JSON
  return text.trim();
}

/**
 * Test Claude connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Say "ok"' }],
    });
    console.log('[Claude] Connection successful');
    return true;
  } catch (error) {
    console.error('[Claude] Connection failed:', error);
    return false;
  }
}
