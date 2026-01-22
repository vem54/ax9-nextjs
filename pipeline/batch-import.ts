/**
 * Batch Import Script
 *
 * Imports products from the Products.xlsx spreadsheet by brand.
 *
 * Usage:
 *   npx tsx batch-import.ts --brand "Y OFFICIAL" --limit 20
 *   npx tsx batch-import.ts --brand "MASONPRINCE中国" --limit 10
 */

import XLSX from 'xlsx';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ProductRow {
  'Item ID': number;
  'Shop Name': string;
  'Title': string;
  'Inventory': number;
  'Price': number;
  'Main Image URL': string;
  'Shopify Item ID': number;
}

interface ImportResult {
  itemId: string;
  success: boolean;
  shopifyId?: string;
  error?: string;
  timeMs: number;
}

async function runPipeline(itemId: string): Promise<ImportResult> {
  const startTime = Date.now();

  return new Promise((resolve) => {
    const proc = spawn('npx', ['tsx', 'src/index.ts', '--item', itemId], {
      cwd: __dirname,
      shell: true,
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      process.stdout.write(text);
    });

    proc.stderr?.on('data', (data) => {
      const text = data.toString();
      stderr += text;
      process.stderr.write(text);
    });

    proc.on('close', (code) => {
      const timeMs = Date.now() - startTime;

      // Check for success in output
      const successMatch = stdout.match(/SUCCESS/);
      const shopifyIdMatch = stdout.match(/Shopify ID: (\d+)/);

      if (successMatch && shopifyIdMatch) {
        resolve({
          itemId,
          success: true,
          shopifyId: shopifyIdMatch[1],
          timeMs,
        });
      } else {
        // Try to extract error
        const errorMatch = stdout.match(/FAILED: (.+)/) || stderr.match(/Error: (.+)/);
        resolve({
          itemId,
          success: false,
          error: errorMatch?.[1] || `Exit code ${code}`,
          timeMs,
        });
      }
    });

    proc.on('error', (err) => {
      resolve({
        itemId,
        success: false,
        error: err.message,
        timeMs: Date.now() - startTime,
      });
    });
  });
}

async function main() {
  const args = process.argv.slice(2);

  // Parse args
  const brandIndex = args.indexOf('--brand');
  const limitIndex = args.indexOf('--limit');

  if (brandIndex === -1 || !args[brandIndex + 1]) {
    console.log(`
Batch Import Script

Usage:
  npx tsx batch-import.ts --brand "Y OFFICIAL" --limit 20
  npx tsx batch-import.ts --brand "MASONPRINCE中国" --limit 10
  npx tsx batch-import.ts --list-brands

Options:
  --brand <name>   Brand/shop name to import
  --limit <n>      Number of products to import (default: all)
  --list-brands    Show available brands and counts
`);
    return;
  }

  const brandName = args[brandIndex + 1];
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : Infinity;

  // Load spreadsheet
  const xlsxPath = path.join(__dirname, '..', 'Products.xlsx');
  console.log(`Loading ${xlsxPath}...`);

  const wb = XLSX.readFile(xlsxPath);
  const data: ProductRow[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

  // List brands mode
  if (args.includes('--list-brands')) {
    const counts: Record<string, number> = {};
    data.forEach(row => {
      const shop = row['Shop Name'] || 'Unknown';
      counts[shop] = (counts[shop] || 0) + 1;
    });

    console.log('\nAvailable brands:\n');
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([shop, count]) => console.log(`  ${count.toString().padStart(4)} ${shop}`));
    return;
  }

  // Filter by brand
  const brandProducts = data.filter(row => row['Shop Name'] === brandName);

  if (brandProducts.length === 0) {
    console.error(`No products found for brand: ${brandName}`);
    console.log('\nTry --list-brands to see available brands');
    return;
  }

  const productsToImport = brandProducts.slice(0, limit);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`BATCH IMPORT: ${brandName}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Found: ${brandProducts.length} products`);
  console.log(`Importing: ${productsToImport.length} products`);
  console.log(`${'='.repeat(60)}\n`);

  const results: ImportResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < productsToImport.length; i++) {
    const product = productsToImport[i];
    const itemId = product['Item ID'].toString();

    console.log(`\n[${'='.repeat(56)}]`);
    console.log(`[${i + 1}/${productsToImport.length}] ${product['Title'].substring(0, 50)}...`);
    console.log(`[Item ID: ${itemId}]`);
    console.log(`[${'='.repeat(56)}]`);

    const result = await runPipeline(itemId);
    results.push(result);

    // Brief pause between products to avoid rate limits
    if (i < productsToImport.length - 1) {
      console.log('\nWaiting 2 seconds before next product...');
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Summary
  const totalTime = Date.now() - startTime;
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\n${'='.repeat(60)}`);
  console.log('BATCH IMPORT COMPLETE');
  console.log(`${'='.repeat(60)}`);
  console.log(`Total time: ${(totalTime / 1000 / 60).toFixed(1)} minutes`);
  console.log(`Successful: ${successful.length}/${results.length}`);
  console.log(`Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    console.log(`\nSuccessful products:`);
    successful.forEach(r => {
      console.log(`  ✓ ${r.itemId} → Shopify ID: ${r.shopifyId}`);
    });
  }

  if (failed.length > 0) {
    console.log(`\nFailed products:`);
    failed.forEach(r => {
      console.log(`  ✗ ${r.itemId}: ${r.error}`);
    });
  }

  // Save results to file
  const resultsPath = path.join(__dirname, '..', `import-results-${Date.now()}.json`);
  fs.writeFileSync(resultsPath, JSON.stringify({
    brand: brandName,
    timestamp: new Date().toISOString(),
    totalTimeMs: totalTime,
    results,
  }, null, 2));
  console.log(`\nResults saved to: ${resultsPath}`);
}

main().catch(console.error);
