/**
 * Axent Product Pipeline
 *
 * Main entry point for processing products from Taobao to Shopify.
 *
 * Usage:
 *   npm run dev                    # Run the pipeline
 *   npm run dev -- --test          # Test all connections
 *   npm run dev -- --item 12345    # Process a single item
 */

import { config } from './config.js';
import * as taobao from './services/taobao.js';
import * as claude from './services/claude.js';
import * as photoroom from './services/photoroom.js';
import * as shopify from './services/shopify.js';
import { getExchangeRate } from './services/currency.js';
import { loadBrandContext, extractBrandSummary } from './services/brands.js';
import type {
  TaobaoProduct,
  TranslatedProduct,
  ClassifiedImage,
  ProcessedImage,
  FinalProduct,
  PipelineResult,
  SizeChart,
} from './types/index.js';

/**
 * Process a single product from Taobao to Shopify
 */
async function processProduct(itemId: string): Promise<PipelineResult> {
  const startTime = Date.now();
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Processing item: ${itemId}`);
  console.log('='.repeat(50));

  try {
    // Step 1: Fetch from Taobao
    console.log('\n[1/5] Fetching from Taobao...');
    const raw = await taobao.getProduct(itemId);
    console.log(`  → Title: ${raw.title}`);
    console.log(`  → Images: ${raw.images.length}`);
    console.log(`  → SKUs: ${raw.skus.length}`);

    // Step 2: Get exchange rate
    console.log('\n[2/5] Getting exchange rate...');
    const exchangeRate = await getExchangeRate();

    // Step 3: Translate product data
    console.log('\n[3/5] Translating product data...');
    const translated = await claude.translateProduct(raw, exchangeRate);
    console.log(`  → Title: ${translated.title}`);
    console.log(`  → Vendor: ${translated.vendor}`);
    console.log(`  → Gender: ${translated.gender}`);

    // Step 4: PARALLEL - Size chart, brand context, and image processing
    console.log('\n[4/5] Processing in parallel: size chart + brand context + images...');

    const [sizeChartResult, brandContextResult, processedImages] = await Promise.all([
      // Extract size chart from description images
      claude.extractSizeChart(raw.description_images).then(result => {
        if (result.sizeChart) {
          console.log(`  → Size chart: ${result.sizeChart.measurements.length} sizes`);
        }
        if (result.materials) console.log(`  → Materials: ${result.materials}`);
        return result;
      }),

      // Load brand context
      loadBrandContext(translated.vendor).then(fullContext => {
        const summary = extractBrandSummary(fullContext);
        console.log(`  → Brand context: ${fullContext ? 'loaded' : 'using generic'}`);
        return summary;
      }),

      // Process product images (classify + bg removal)
      // Include SKU images with their color info for proper variant linking
      processImages(raw.images, translated.variants).then(images => {
        console.log(`  → Images: ${images.length} processed`);
        return images;
      }),
    ]);

    const { sizeChart, materials, careInstructions } = sizeChartResult;
    const brandContext = brandContextResult;

    // Step 5: Generate description (needs processedImages for main image)
    console.log('\n[5/5] Generating description + uploading to Shopify...');
    const mainImage = processedImages[0]?.original_url;
    const { title, body_html } = await claude.generateDescription(
      translated,
      mainImage,
      brandContext,
      { materials, careInstructions }
    );
    console.log(`  → Title: ${title}`);

    // Create in Shopify
    console.log('  → Uploading to Shopify...');
    const finalProduct = buildFinalProduct(translated, title, body_html, processedImages, {
      sizeChart,
      materials,
      careInstructions,
    });
    const shopifyProduct = await shopify.createProduct(finalProduct);

    const processingTime = Date.now() - startTime;
    console.log(`\n✓ SUCCESS in ${(processingTime / 1000).toFixed(1)}s`);
    console.log(`  Shopify ID: ${shopifyProduct.id}`);
    console.log(`  URL: https://${config.shopify.store}/products/${shopifyProduct.id}`);

    return {
      success: true,
      taobao_item_id: itemId,
      shopify_product_id: shopifyProduct.id,
      shopify_url: `https://${config.shopify.store}/products/${shopifyProduct.id}`,
      processing_time_ms: processingTime,
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error(`\n✗ FAILED: ${errorMessage}`);

    return {
      success: false,
      taobao_item_id: itemId,
      error: errorMessage,
      processing_time_ms: processingTime,
    };
  }
}

/**
 * Process all images: classify and remove backgrounds as needed
 * NOW PARALLELIZED for speed
 *
 * Also includes SKU-specific images and tracks which colors they belong to
 * for proper variant linking (fixes duplicate images issue)
 */
async function processImages(
  imageUrls: string[],
  variants: TranslatedProduct['variants']
): Promise<ProcessedImage[]> {
  // Build list of images to process with their color associations
  // Main images: no specific color (shown for all colors)
  // SKU images: linked to their specific color
  const imagesToProcess: { url: string; colors?: string[] }[] = [];
  const seenUrls = new Set<string>();

  // Add main product images (no color association - shown for all)
  for (const url of imageUrls) {
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      imagesToProcess.push({ url, colors: undefined });
    }
  }

  // Add SKU-specific images with their color
  for (const variant of variants) {
    if (variant.image && !seenUrls.has(variant.image)) {
      seenUrls.add(variant.image);
      imagesToProcess.push({ url: variant.image, colors: [variant.color] });
    }
  }

  console.log(`  → Processing ${imagesToProcess.length} images in parallel...`);

  // Process all images in parallel
  const results = await Promise.all(
    imagesToProcess.map(async ({ url, colors }, index) => {
      try {
        // Classify image
        const classified = await claude.classifyImage(url);

        if (classified.classification === 'delete') {
          return { index, status: 'deleted', reason: classified.reason, colors };
        }

        // Process if needed
        let processedUrl = url;
        if (classified.classification === 'remove') {
          processedUrl = await photoroom.removeBackground(url);
        }

        return {
          index,
          status: 'processed',
          classification: classified.classification,
          original_url: url,
          processed_url: processedUrl,
          colors,
        };
      } catch (error) {
        // Use original on error
        return {
          index,
          status: 'error',
          original_url: url,
          processed_url: url,
          colors,
        };
      }
    })
  );

  // Build array of successfully processed images
  const successfulImages: { original_url: string; processed_url: string; colors?: string[] }[] = [];

  for (const result of results) {
    if (result.status === 'deleted') {
      console.log(`    Image ${result.index + 1}: deleted (${result.reason})`);
    } else if (result.status === 'error') {
      console.log(`    Image ${result.index + 1}: error, using original`);
      successfulImages.push({
        original_url: result.original_url!,
        processed_url: result.processed_url!,
        colors: result.colors,
      });
    } else {
      console.log(`    Image ${result.index + 1}: ${result.classification}`);
      successfulImages.push({
        original_url: result.original_url!,
        processed_url: result.processed_url!,
        colors: result.colors,
      });
    }
  }

  // Sort images: shared/global images first, then grouped by color
  // This ordering is important for Shopify's variant thumbnail logic:
  // - First image for a color becomes the variant thumbnail
  // - Shared images (no color) show for all variants
  const sharedImages = successfulImages.filter(img => !img.colors);
  const colorImages = successfulImages.filter(img => img.colors);

  // Group color images by their color, maintaining order within each group
  const colorGroups = new Map<string, typeof colorImages>();
  for (const img of colorImages) {
    const color = img.colors![0]; // Use first color as grouping key
    if (!colorGroups.has(color)) {
      colorGroups.set(color, []);
    }
    colorGroups.get(color)!.push(img);
  }

  // Build final ordered array: shared first, then each color group
  const orderedImages = [
    ...sharedImages,
    ...Array.from(colorGroups.values()).flat(),
  ];

  // Assign positions
  const processed: ProcessedImage[] = orderedImages.map((img, index) => ({
    original_url: img.original_url,
    processed_url: img.processed_url,
    position: index + 1,
    variant_colors: img.colors,
  }));

  return processed;
}

/**
 * Build the final product structure for Shopify
 */
function buildFinalProduct(
  translated: TranslatedProduct,
  title: string,
  body_html: string,
  images: ProcessedImage[],
  extras: {
    sizeChart?: SizeChart;
    materials?: string;
    careInstructions?: string;
  } = {}
): FinalProduct {
  // Filter out invalid variants (empty color, size guides, etc) and deduplicate by size+color
  const variantMap = new Map<string, typeof translated.variants[0]>();
  for (const v of translated.variants) {
    // Skip variants with empty/invalid color
    if (!v.color || v.color === '' || v.color === 'Default') {
      continue;
    }

    // Skip size guide variants that slipped through
    const lowerColor = v.color.toLowerCase();
    if (lowerColor.includes('size') || lowerColor.includes('guide') ||
        lowerColor.includes('chart') || lowerColor.includes('尺码')) {
      continue;
    }

    const key = `${v.size}|${v.color}`;
    const existing = variantMap.get(key);
    if (existing) {
      // Combine stock from duplicate variants
      existing.stock += v.stock;
    } else {
      variantMap.set(key, { ...v });
    }
  }
  const dedupedVariants = Array.from(variantMap.values());

  if (dedupedVariants.length === 0) {
    throw new Error('No valid variants after filtering - all colors were invalid');
  }

  // Get unique colors for metafields
  const colors = [...new Set(dedupedVariants.map(v => v.color_standardized))];

  return {
    title,
    body_html,
    vendor: translated.vendor,
    product_type: translated.product_type,
    tags: [translated.gender, translated.vendor, translated.product_type],
    variants: dedupedVariants.map(v => ({
      option1: v.size,
      option2: v.color,
      price: v.price_usd.toString(),
      sku: v.sku_id,
      inventory_quantity: v.stock,
      inventory_management: 'shopify' as const,
    })),
    images: images.map(img => ({
      src: img.processed_url,
      position: img.position,
      variant_colors: img.variant_colors, // Link to color variants (fixes duplicate images)
    })),
    metafields: {
      gender: translated.gender,
      colors,
      size_chart: extras.sizeChart,
      materials: extras.materials,
      care_instructions: extras.careInstructions,
    },
  };
}

/**
 * Test all service connections
 */
async function testConnections(): Promise<void> {
  console.log('\nTesting connections...\n');

  const tests = [
    { name: 'Taobao', test: taobao.testConnection },
    { name: 'Claude', test: claude.testConnection },
    { name: 'PhotoRoom', test: photoroom.testConnection },
    { name: 'Shopify', test: shopify.testConnection },
  ];

  for (const { name, test } of tests) {
    try {
      const success = await test();
      console.log(`${success ? '✓' : '✗'} ${name}`);
    } catch (error) {
      console.log(`✗ ${name}: ${error}`);
    }
  }
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Test mode
  if (args.includes('--test')) {
    await testConnections();
    return;
  }

  // Single item mode
  const itemIndex = args.indexOf('--item');
  if (itemIndex !== -1 && args[itemIndex + 1]) {
    const itemId = args[itemIndex + 1];
    await processProduct(itemId);
    return;
  }

  // Default: show usage
  console.log(`
Axent Product Pipeline

Usage:
  npm run dev -- --test           Test all API connections
  npm run dev -- --item <id>      Process a single Taobao item

Examples:
  npm run dev -- --item 728349182734
  `);
}

// Run
main().catch(console.error);
