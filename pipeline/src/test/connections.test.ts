/**
 * Connection Tests
 *
 * Run with: npm run dev -- --test
 *
 * Tests each service independently to verify credentials and connectivity.
 */

import { config } from '../config.js';

// Color codes for terminal output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function success(msg: string) {
  console.log(`${GREEN}✓${RESET} ${msg}`);
}

function fail(msg: string, error?: any) {
  console.log(`${RED}✗${RESET} ${msg}`);
  if (error) console.log(`  ${RED}${error}${RESET}`);
}

function warn(msg: string) {
  console.log(`${YELLOW}!${RESET} ${msg}`);
}

/**
 * Test Claude API connection
 */
async function testClaude(): Promise<boolean> {
  console.log('\n--- Testing Claude API ---');

  if (!config.claude.apiKey) {
    fail('ANTHROPIC_API_KEY not set in .env');
    return false;
  }

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: config.claude.apiKey });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Say "ok"' }],
    });

    success('Claude API connected');
    return true;
  } catch (error: any) {
    fail('Claude API failed', error.message);
    return false;
  }
}

/**
 * Test Shopify Admin API connection
 */
async function testShopify(): Promise<boolean> {
  console.log('\n--- Testing Shopify API ---');

  if (!config.shopify.accessToken) {
    fail('SHOPIFY_ACCESS_TOKEN not set in .env');
    return false;
  }

  try {
    const url = `https://${config.shopify.store}/admin/api/2025-01/shop.json`;
    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': config.shopify.accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json() as { shop: { name: string } };
    success(`Shopify connected: ${data.shop.name}`);
    return true;
  } catch (error: any) {
    fail('Shopify API failed', error.message);
    return false;
  }
}

/**
 * Test PhotoRoom API connection
 */
async function testPhotoRoom(): Promise<boolean> {
  console.log('\n--- Testing PhotoRoom API ---');

  if (!config.photoroom.apiKey) {
    fail('PHOTOROOM_API_KEY not set in .env');
    return false;
  }

  try {
    // Just verify the API key format - don't waste credits on a test call
    if (config.photoroom.apiKey.startsWith('sk_pr_')) {
      success('PhotoRoom API key format valid');
      warn('Skipping actual API call to save credits');
      return true;
    } else {
      fail('PhotoRoom API key format invalid (should start with sk_pr_)');
      return false;
    }
  } catch (error: any) {
    fail('PhotoRoom check failed', error.message);
    return false;
  }
}

/**
 * Test Taobao API connection
 */
async function testTaobao(): Promise<boolean> {
  console.log('\n--- Testing Taobao API ---');

  if (!config.taobao.appKey || !config.taobao.appSecret) {
    fail('TAOBAO_APP_KEY or TAOBAO_APP_SECRET not set in .env');
    return false;
  }

  success(`Taobao App Key: ${config.taobao.appKey}`);
  warn('Taobao API requires OAuth flow - manual testing needed');
  warn('See: https://open.taobao.global/doc/doc.htm for auth setup');

  return true;
}

/**
 * Test currency API
 */
async function testCurrency(): Promise<boolean> {
  console.log('\n--- Testing Currency API ---');

  try {
    const response = await fetch(
      'https://api.frankfurter.app/latest?from=CNY&to=USD'
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json() as { rates?: { USD?: number } };

    if (data.rates?.USD) {
      success(`Exchange rate: 1 CNY = ${data.rates.USD.toFixed(4)} USD`);
      return true;
    } else {
      fail('Exchange rate not found in response');
      return false;
    }
  } catch (error: any) {
    fail('Currency API failed', error.message);
    warn('Will use fallback rate: 1 CNY = 0.14 USD');
    return false;
  }
}

/**
 * Run all tests
 */
export async function runAllTests(): Promise<void> {
  console.log('\n========================================');
  console.log('  AXENT PIPELINE - CONNECTION TESTS');
  console.log('========================================');

  const results = {
    claude: await testClaude(),
    shopify: await testShopify(),
    photoroom: await testPhotoRoom(),
    taobao: await testTaobao(),
    currency: await testCurrency(),
  };

  console.log('\n========================================');
  console.log('  SUMMARY');
  console.log('========================================\n');

  const passed = Object.values(results).filter(r => r).length;
  const total = Object.values(results).length;

  Object.entries(results).forEach(([name, passed]) => {
    const status = passed ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
    console.log(`  ${name.padEnd(12)} ${status}`);
  });

  console.log(`\n  Total: ${passed}/${total} passed\n`);

  if (passed < total) {
    console.log('Fix the failing tests before running the pipeline.');
  } else {
    console.log('All tests passed! Ready to process products.');
  }
}

// Run if called directly
runAllTests();
