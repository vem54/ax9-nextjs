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
      <section className="relative bg-gray-50">
        <div className="container">
          <div className="grid lg:grid-cols-2 min-h-[70vh]">
            {/* Left - Content */}
            <div className="flex flex-col justify-center py-10 lg:py-7 lg:pr-10">
              <p className="label mb-4">
                Curated Fashion from China
              </p>
              <h1 className="display-lg mb-5">
                Discover designers
                <br />
                <span className="editorial-accent">the world hasn&apos;t</span>
                <br />
                seen yet.
              </h1>
              <p className="text-base text-gray-600 mb-8 max-w-md leading-relaxed">
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
              <div className="relative mt-8 lg:hidden">
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
                    <div className="mt-4">
                      <p className="overline mb-1">{products[0].vendor}</p>
                      <p className="font-serif text-lg">{products[0].title}</p>
                    </div>
                  </Link>
                ) : (
                  <div className="aspect-product bg-gray-100 flex items-center justify-center">
                    <span className="caption">Featured Product</span>
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
                  <div className="absolute bottom-6 left-6 bg-white px-5 py-4">
                    <p className="overline mb-1">{products[0].vendor}</p>
                    <p className="font-serif text-lg">{products[0].title}</p>
                  </div>
                </Link>
              ) : (
                <div className="h-full bg-gray-100 flex items-center justify-center">
                  <span className="caption">Featured Product</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="border-b border-gray-200">
        <div className="container">
          <nav className="flex items-center gap-8 py-4 overflow-x-auto scrollbar-hide">
            <Link href="/collections/all" className="nav-link whitespace-nowrap">
              All Products
            </Link>
            <Link href="/collections/new-arrivals" className="nav-link whitespace-nowrap">
              New Arrivals
            </Link>
            <Link href="/collections/outerwear" className="nav-link whitespace-nowrap">
              Outerwear
            </Link>
            <Link href="/collections/tops" className="nav-link whitespace-nowrap">
              Tops
            </Link>
            <Link href="/collections/bottoms" className="nav-link whitespace-nowrap">
              Bottoms
            </Link>
          </nav>
        </div>
      </section>

      {/* Editorial Modules */}
      <section className="container py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="label mb-3">Editorial</p>
            <h2 className="display-sm">City studies</h2>
          </div>
          <Link href="/about" className="nav-link">
            Our curation →
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
                    <span className="caption">Editorial</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-serif text-lg group-hover:text-gray-600 transition-colors">{product.vendor || 'Axent'}</h3>
                <p className="caption mt-1">{product.title}</p>
              </div>
            </Link>
          ))}
          {products.length === 0 && (
            <>
              {['Studio', 'Material', 'Street'].map((label) => (
                <div key={label} className="bg-gray-100 aspect-[3/4] flex items-center justify-center">
                  <span className="caption">{label}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Lookbook Feature */}
      <section className="bg-gray-50">
        <div className="container py-10">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="lg:pr-8">
              <p className="label mb-4">Lookbook</p>
              <h2 className="display-md mb-5">
                Modern East,<br />
                <span className="editorial-accent">clear lines.</span>
              </h2>
              <p className="text-base text-gray-600 max-w-md leading-relaxed mb-6">
                A curated edit of Chinese streetwear with a luxury frame.
                Clean silhouettes, deliberate proportions, and material depth.
              </p>
              <div className="divider mb-6"></div>
              {lookbookProduct && (
                <Link
                  href={`/products/${lookbookProduct.handle}`}
                  className="link-underline text-sm text-gray-500"
                >
                  Featured: {lookbookProduct.vendor} — {lookbookProduct.title}
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
      <section className="container py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="display-sm">New Arrivals</h2>
            <p className="caption mt-2">The latest from our curated selection</p>
          </div>
          <Link
            href="/collections/new-arrivals"
            className="nav-link hidden sm:block"
          >
            View All →
          </Link>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products.slice(0, 4)} columns={4} />
        ) : (
          <div className="text-center py-10 bg-gray-50">
            <p className="font-serif text-xl text-gray-600 mb-2">New drops land weekly.</p>
            <p className="caption">
              Follow the edit for the next release.
            </p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/collections/new-arrivals" className="btn-secondary">
            View All New Arrivals
          </Link>
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="bg-black text-white">
        <div className="container py-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="label text-gray-500 mb-5">
              The Axent Difference
            </p>
            <h2 className="display-md text-white mb-6">
              Chinese designers set the tone for <span className="editorial-accent">modern streetwear.</span>
              <br />We bring their work to you.
            </h2>
            <p className="text-base text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
              Every piece is hand-selected from independent studios and emerging labels.
              Limited production. Verified originality. Construction that holds its shape.
            </p>
            <Link href="/about" className="link-underline text-sm text-gray-300">
              Learn about our curation process
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      {collections.length > 0 && (
        <section className="container py-10">
          <div className="flex justify-between items-end mb-8">
            <h2 className="display-sm">Shop by Category</h2>
            <Link href="/collections" className="nav-link">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.slice(0, 3).map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group block"
              >
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden mb-4">
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      className="object-cover group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif text-2xl text-gray-400">
                        {collection.title}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-serif text-xl group-hover:text-gray-600 transition-colors">
                  {collection.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* If no real collections, show virtual category links */}
      {collections.length === 0 && (
        <section className="container py-10">
          <h2 className="display-sm mb-8">Shop by Category</h2>
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
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-black transition-colors">
                  <span className="font-serif text-xl text-gray-500 group-hover:text-white transition-colors">
                    {cat.title}
                  </span>
                </div>
                <h3 className="font-sans text-sm font-medium group-hover:text-gray-600 transition-colors">
                  {cat.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-gray-50">
        <div className="container py-12">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="display-sm mb-3">Join the List</h2>
            <p className="caption mb-8">
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
            <p className="caption mt-5">
              By subscribing, you agree to our{' '}
              <Link href="/privacy" className="link-underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
