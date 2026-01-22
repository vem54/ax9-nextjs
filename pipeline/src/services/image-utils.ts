/**
 * Image Utilities
 *
 * Handles downloading and converting images to formats supported by Claude Vision.
 * Converts AVIF, WebP, and other formats to PNG.
 */

import sharp from 'sharp';

// Claude Vision has a 5MB limit for base64 images
const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB to be safe
const MAX_DIMENSION = 2048; // Max width/height

/**
 * Download an image from URL and convert to base64 PNG
 * Handles AVIF, WebP, and other formats that Claude Vision might not support via URL
 * Automatically resizes images that exceed Claude's 5MB limit
 *
 * @returns base64 data URL (data:image/png;base64,...)
 */
export async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  try {
    // Download the image
    const response = await fetch(imageUrl, {
      headers: {
        // Some CDNs check user agent
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 1000;
    const height = metadata.height || 1000;

    // Start with sharp pipeline
    let pipeline = sharp(buffer);

    // Resize if dimensions are too large
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convert to JPEG (smaller than PNG) with good quality
    let outputBuffer = await pipeline.jpeg({ quality: 85 }).toBuffer();

    // If still too large, reduce quality progressively
    let quality = 85;
    while (outputBuffer.length > MAX_IMAGE_SIZE_BYTES && quality > 30) {
      quality -= 15;
      outputBuffer = await sharp(buffer)
        .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality })
        .toBuffer();
    }

    const base64 = outputBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error: any) {
    console.error(`[ImageUtils] Failed to process image ${imageUrl.substring(0, 50)}...: ${error.message}`);
    throw error;
  }
}

/**
 * Download multiple images and convert to base64
 * Returns array of base64 data URLs, skipping failed images
 */
export async function fetchImagesAsBase64(
  imageUrls: string[],
  maxConcurrent: number = 3
): Promise<{ url: string; base64: string }[]> {
  const results: { url: string; base64: string }[] = [];

  // Process in batches to avoid overwhelming the server
  for (let i = 0; i < imageUrls.length; i += maxConcurrent) {
    const batch = imageUrls.slice(i, i + maxConcurrent);

    const batchResults = await Promise.all(
      batch.map(async (url) => {
        try {
          const base64 = await fetchImageAsBase64(url);
          return { url, base64 };
        } catch {
          return null; // Skip failed images
        }
      })
    );

    for (const result of batchResults) {
      if (result) {
        results.push(result);
      }
    }
  }

  return results;
}

/**
 * Check if a URL points to a format that needs conversion
 */
export function needsConversion(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.includes('.avif') ||
    lower.includes('.webp') ||
    lower.includes('format=avif') ||
    lower.includes('format=webp') ||
    // Taobao CDN URLs often don't have extensions, safer to always convert
    lower.includes('alicdn.com')
  );
}

/**
 * Get image dimensions without fully decoding
 */
export async function getImageDimensions(
  imageBuffer: Buffer
): Promise<{ width: number; height: number }> {
  const metadata = await sharp(imageBuffer).metadata();
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
}
