import 'dotenv/config';

const PUBLICATION_ID = 'gid://shopify/Publication/177086529588';

async function publishProduct(productId) {
  const gid = `gid://shopify/Product/${productId}`;

  const mutation = `
    mutation publishProduct($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        publishable { ... on Product { id title } }
        userErrors { field message }
      }
    }
  `;

  const res = await fetch('https://nextjsax9.myshopify.com/admin/api/2024-01/graphql.json', {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        id: gid,
        input: [{ publicationId: PUBLICATION_ID }]
      }
    })
  });

  const data = await res.json();
  return data.data?.publishablePublish;
}

async function main() {
  // Get all Y OFFICIAL products
  const res = await fetch('https://nextjsax9.myshopify.com/admin/api/2024-01/products.json?limit=50&vendor=Y%20OFFICIAL', {
    headers: { 'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN }
  });
  const { products } = await res.json();

  console.log(`Publishing ${products.length} products to Headless channel...`);

  for (const p of products) {
    const result = await publishProduct(p.id);
    if (result?.publishable) {
      console.log('✓', result.publishable.title?.substring(0, 45));
    } else {
      console.log('✗', p.id, result?.userErrors?.[0]?.message || 'Unknown error');
    }
  }

  console.log('\nDone! Check https://ax9-nextjs.vercel.app/');
}

main().catch(console.error);
