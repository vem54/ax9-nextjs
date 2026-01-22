/**
 * Brand Context Service
 *
 * Loads brand context documents from the brands/ folder to provide
 * context for product descriptions.
 */

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BRANDS_DIR = join(__dirname, '../../brands');

/**
 * Normalize a brand/vendor name to a filename
 * "Flowery Bubble 泡沫花市" -> "flowery-bubble"
 */
function normalizeToFilename(name: string): string {
  return name
    .toLowerCase()
    // Remove Chinese characters
    .replace(/[\u4e00-\u9fff]/g, '')
    // Replace spaces and special chars with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Collapse multiple hyphens
    .replace(/-+/g, '-');
}

/**
 * Load brand context for a given vendor name
 *
 * Looks for a markdown file in brands/ that matches the vendor name.
 * Returns empty string if no brand doc found.
 */
export async function loadBrandContext(vendor: string): Promise<string> {
  const filename = normalizeToFilename(vendor);
  const filepath = join(BRANDS_DIR, `${filename}.md`);

  console.log(`[Brands] Looking for brand context: ${filepath}`);

  if (!existsSync(filepath)) {
    console.log(`[Brands] No brand doc found for "${vendor}" (tried ${filename}.md)`);
    return '';
  }

  try {
    const content = await readFile(filepath, 'utf-8');
    console.log(`[Brands] Loaded brand context for "${vendor}" (${content.length} chars)`);
    return content;
  } catch (error) {
    console.error(`[Brands] Error reading brand doc:`, error);
    return '';
  }
}

/**
 * Get a summary section from brand context (for shorter prompts)
 * Extracts just the essential sections, not the full document.
 */
export function extractBrandSummary(fullContext: string): string {
  if (!fullContext) return 'No brand context available.';

  // Extract key sections for the prompt
  const sections = [
    'Brand Summary',
    'Aesthetic & Style',
    'Materials & Quality',
    'Price Positioning',
    'Target Customer',
    'Brand Voice for Copy',
  ];

  const lines = fullContext.split('\n');
  const result: string[] = [];
  let capturing = false;
  let currentSection = '';

  for (const line of lines) {
    // Check for section headers
    const headerMatch = line.match(/^##\s+(.+)$/);
    if (headerMatch) {
      const sectionName = headerMatch[1];
      capturing = sections.some(s => sectionName.includes(s));
      currentSection = sectionName;
      if (capturing) {
        result.push(line);
      }
      continue;
    }

    // Capture content under relevant sections
    if (capturing) {
      // Stop at next major section
      if (line.startsWith('# ') || line.startsWith('---')) {
        capturing = false;
        continue;
      }
      result.push(line);
    }
  }

  return result.join('\n').trim() || 'No brand context available.';
}
