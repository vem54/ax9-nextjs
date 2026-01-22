import Link from 'next/link';
import Image from 'next/image';
import { shopifyFetch } from '@/lib/shopify/client';
import { GET_PRODUCTS, GET_COLLECTIONS } from '@/lib/shopify/queries';
import { Product, Collection } from '@/lib/shopify/types';
import ProductGrid from '@/components/product/ProductGrid';

const STORE_COUNTRY = 'US';

// Force dynamic rendering to always fetch fresh data from Shopify
export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  try {
    const response = await shopifyFetch<{
      products: { edges: { node: Product }[] };
    }>({
      query: GET_PRODUCTS,
      variables: {
        first: 8,
        sortKey: 'CREATED_AT',
        reverse: true,
        country: STORE_COUNTRY,
      },
      tags: ['products'],
      revalidate: 60,
    });
    return response.data.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

async function getCollections(): Promise<Collection[]> {
  try {
    const response = await shopifyFetch<{
      collections: { edges: { node: Collection }[] };
    }>({
      query: GET_COLLECTIONS,
      variables: { first: 6 },
      tags: ['collections'],
      revalidate: 300,
    });
    return response.data.collections.edges
      .map((edge) => edge.node)
      .filter((c) => c.handle !== 'frontpage');
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
}

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);
  const heroVideoSrc = '/videos/axent_hero.mp4';
  const lookbookProduct = products[3] || products[1] || products[0];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gray-100">
        <div className="container">
          <div className="grid lg:grid-cols-2 min-h-[70vh]">
            {/* Left - Content */}
            <div className="flex flex-col justify-center py-10 lg:py-7 lg:pr-8">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
                Curated Fashion from China
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-[48px] font-medium leading-tight mb-4">
                Discover designers
                <br />
                the world hasn&apos;t
                <br />
                seen yet.
              </h1>
              <p className="text-gray-500 mb-6 max-w-md">
                We source exceptional pieces from Shanghai, Beijing, and beyond.
                Original design. Disciplined construction. Limited runs.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/collections/all" className="btn-primary">
                  Shop All
                </Link>
                <Link href="/collections/new-arrivals" className="btn-secondary">
                  New Arrivals
                </Link>
              </div>

              {/* Mobile featured image */}
              <div className="relative mt-6 lg:hidden">
                {products[0]?.featuredImage ? (
                  <Link href={`/products/${products[0].handle}`} className="block">
                    <div className="relative aspect-product bg-gray-100">
                      <Image
                        src={products[0].featuredImage.url}
                        alt={products[0].featuredImage.altText || products[0].title}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">{products[0].vendor}</p>
                      <p className="text-sm font-medium">{products[0].title}</p>
                    </div>
                  </Link>
                ) : (
                  <div className="aspect-product bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">Featured Product</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Featured Media */}
            <div className="relative hidden lg:block">
              {products[0]?.featuredImage ? (
                <Link href={`/products/${products[0].handle}`} className="block h-full">
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster={products[0].featuredImage.url}
                  >
                    <source src={heroVideoSrc} type="video/mp4" />
                  </video>
                  <div className="absolute bottom-6 left-6 bg-white px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">{products[0].vendor}</p>
                    <p className="text-sm font-medium">{products[0].title}</p>
                  </div>
                </Link>
              ) : (
                <div className="h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500">Featured Product</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="border-b border-gray-100">
        <div className="container">
          <nav className="flex items-center gap-6 py-4 overflow-x-auto scrollbar-hide">
            <Link
              href="/collections/all"
              className="text-sm whitespace-nowrap hover:text-gray-500"
            >
              All Products
            </Link>
            <Link
              href="/collections/new-arrivals"
              className="text-sm whitespace-nowrap hover:text-gray-500"
            >
              New Arrivals
            </Link>
            <Link
              href="/collections/outerwear"
              className="text-sm whitespace-nowrap hover:text-gray-500"
            >
              Outerwear
            </Link>
            <Link
              href="/collections/tops"
              className="text-sm whitespace-nowrap hover:text-gray-500"
            >
              Tops
            </Link>
            <Link
              href="/collections/bottoms"
              className="text-sm whitespace-nowrap hover:text-gray-500"
            >
              Bottoms
            </Link>
          </nav>
        </div>
      </section>

      {/* Editorial Modules */}
      <section className="container py-10">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              Editorial
            </p>
            <h2 className="text-2xl font-medium">City studies</h2>
          </div>
          <Link href="/about" className="text-sm hover:text-gray-500">
            Our curation
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] bg-gray-100">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Editorial</span>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-medium">{product.vendor || 'Axent'}</h3>
                <p className="text-xs text-gray-500 mt-1">{product.title}</p>
              </div>
            </Link>
          ))}
          {products.length === 0 && (
            <>
              {['Studio', 'Material', 'Street'].map((label) => (
                <div key={label} className="bg-gray-100 aspect-[3/4] flex items-center justify-center">
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Lookbook Feature */}
      <section className="bg-gray-100">
        <div className="container py-10">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                Lookbook
              </p>
              <h2 className="text-2xl md:text-3xl font-medium mb-4">
                Modern East, clear lines.
              </h2>
              <p className="text-sm text-gray-500 max-w-md">
                A curated edit of Chinese streetwear with a luxury frame.
                Clean silhouettes, deliberate proportions, and material depth.
              </p>
              {lookbookProduct && (
                <Link
                  href={`/products/${lookbookProduct.handle}`}
                  className="text-xs text-gray-500 mt-4 inline-block underline hover:no-underline"
                >
                  Featured: {lookbookProduct.vendor} - {lookbookProduct.title}
                </Link>
              )}
            </div>
            <div className="relative aspect-[3/4] bg-gray-100">
              {lookbookProduct?.featuredImage ? (
                <Link href={`/products/${lookbookProduct.handle}`} className="block h-full">
                  <Image
                    src={lookbookProduct.featuredImage.url}
                    alt={lookbookProduct.featuredImage.altText || lookbookProduct.title}
                    fill
                    className="object-cover"
                  />
                </Link>
              ) : (
                <Image
                  src="/images/editorial/silhouette.jpg"
                  alt="Lookbook silhouette"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container py-8">
        <div className="flex justify-between items-baseline mb-6">
          <div>
            <h2 className="text-2xl font-medium">New Arrivals</h2>
            <p className="text-sm text-gray-500 mt-1">The latest from our curated selection</p>
          </div>
          <Link
            href="/collections/new-arrivals"
            className="text-sm hover:text-gray-500 hidden sm:block"
          >
            View All
          </Link>
        </div>

          {products.length > 0 ? (
            <ProductGrid products={products.slice(0, 4)} columns={4} />
          ) : (
            <div className="text-center py-10 bg-gray-100">
              <p className="text-gray-500 mb-4">New drops land weekly.</p>
              <p className="text-sm text-gray-500">
                Follow the edit for the next release.
              </p>
            </div>
          )}

        <div className="mt-6 text-center sm:hidden">
          <Link href="/collections/new-arrivals" className="btn-secondary">
            View All New Arrivals
          </Link>
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="bg-black text-white">
        <div className="container py-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
              The Axent Difference
            </p>
            <h2 className="text-2xl md:text-3xl font-medium mb-4">
              Chinese designers set the tone for modern streetwear.
              We bring their work to you.
            </h2>
            <p className="text-gray-500 mb-6">
              Every piece is hand-selected from independent studios and emerging labels.
              Limited production. Verified originality. Construction that holds its shape.
            </p>
            <Link href="/about" className="inline-block text-sm underline hover:no-underline">
              Learn about our curation process
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      {collections.length > 0 && (
        <section className="container py-8">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="text-2xl font-medium">Shop by Category</h2>
            <Link
              href="/collections"
              className="text-sm hover:text-gray-500"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.slice(0, 3).map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group block"
              >
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden mb-3">
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      className="object-cover group-hover:opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl font-medium text-gray-500 group-hover:text-gray-500">
                        {collection.title}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-medium group-hover:text-gray-500">
                  {collection.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* If no real collections, show virtual category links */}
      {collections.length === 0 && (
        <section className="container py-8">
          <h2 className="text-2xl font-medium mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'All Products', handle: 'all' },
              { title: 'Outerwear', handle: 'outerwear' },
              { title: 'Tops', handle: 'tops' },
              { title: 'Bottoms', handle: 'bottoms' },
            ].map((cat) => (
              <Link
                key={cat.handle}
                href={`/collections/${cat.handle}`}
                className="group block"
              >
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-black">
                  <span className="text-xl font-medium text-gray-500 group-hover:text-white">
                    {cat.title}
                  </span>
                </div>
                <h3 className="text-sm font-medium group-hover:text-gray-500">
                  {cat.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-gray-100">
        <div className="container py-10">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-medium mb-2">Join the List</h2>
            <p className="text-sm text-gray-500 mb-6">
              Be the first to know about new arrivals and exclusive offers.
              No spam, ever.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="input flex-1"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              By subscribing, you agree to our{' '}
              <Link href="/privacy" className="underline hover:no-underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
