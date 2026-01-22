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
      {/* Hero Section */}
      <section className="relative bg-cream">
        <div className="container">
          <div className="grid lg:grid-cols-2 min-h-[75vh] lg:min-h-[85vh]">
            {/* Left - Content */}
            <div className="flex flex-col justify-center py-16 lg:py-20 lg:pr-16">
              <p className="eyebrow mb-6">
                Curated Fashion from China
              </p>
              <h1 className="display-hero mb-8">
                Discover
                <br />
                <span className="editorial-accent">designers</span>
                <br />
                the world
                <br />
                hasn&apos;t seen.
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-md leading-relaxed">
                We source exceptional pieces from Shanghai, Beijing, and beyond.
                Original design. Disciplined construction. Limited runs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/collections/all" className="btn-primary btn-lg">
                  Shop All
                </Link>
                <Link href="/collections/new-arrivals" className="btn-secondary btn-lg">
                  New Arrivals
                </Link>
              </div>

              {/* Mobile featured image */}
              <div className="relative mt-12 lg:hidden">
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
                    <div className="mt-5">
                      <p className="product-vendor mb-2">{products[0].vendor}</p>
                      <p className="product-title">{products[0].title}</p>
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
                  <div className="absolute bottom-8 left-8 bg-white px-6 py-5">
                    <p className="product-vendor mb-2">{products[0].vendor}</p>
                    <p className="product-title">{products[0].title}</p>
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
      <section className="border-b border-gray-200 bg-white">
        <div className="container">
          <nav className="flex items-center gap-10 py-5 overflow-x-auto scrollbar-hide">
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
      <section className="container py-20 lg:py-28">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow mb-4">Editorial</p>
            <h2 className="display-lg">City <span className="editorial-accent">studies</span></h2>
          </div>
          <Link href="/about" className="nav-link hidden sm:block">
            Our curation →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {products.slice(0, 3).map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="group block"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-product bg-gray-100 overflow-hidden">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="caption">Editorial</span>
                  </div>
                )}
              </div>
              <div className="mt-5">
                <h3 className="font-serif text-xl group-hover:text-gray-500 transition-colors duration-300">
                  {product.vendor || 'Axent'}
                </h3>
                <p className="caption mt-1">{product.title}</p>
              </div>
            </Link>
          ))}
          {products.length === 0 && (
            <>
              {['Studio', 'Material', 'Street'].map((label) => (
                <div key={label} className="bg-gray-100 aspect-product flex items-center justify-center">
                  <span className="caption">{label}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Lookbook Feature */}
      <section className="bg-stone">
        <div className="container py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="lg:pr-12">
              <p className="eyebrow mb-5">Lookbook</p>
              <h2 className="display-xl mb-8">
                Modern East,
                <br />
                <span className="editorial-accent">clear lines.</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-md leading-relaxed mb-8">
                A curated edit of Chinese streetwear with a luxury frame.
                Clean silhouettes, deliberate proportions, and material depth.
              </p>
              <div className="divider mb-8"></div>
              {lookbookProduct && (
                <Link
                  href={`/products/${lookbookProduct.handle}`}
                  className="link-editorial text-gray-500"
                >
                  Featured: {lookbookProduct.vendor} — {lookbookProduct.title}
                </Link>
              )}
            </div>
            <div className="relative aspect-product bg-gray-100 overflow-hidden group">
              {lookbookProduct?.featuredImage ? (
                <Link href={`/products/${lookbookProduct.handle}`} className="block h-full">
                  <Image
                    src={lookbookProduct.featuredImage.url}
                    alt={lookbookProduct.featuredImage.altText || lookbookProduct.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.02]"
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
      <section className="container py-20 lg:py-28">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="eyebrow mb-4">Just In</p>
            <h2 className="display-lg">New Arrivals</h2>
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
          <div className="text-center py-16 bg-cream">
            <p className="display-sm text-gray-600 mb-3">New drops land weekly.</p>
            <p className="caption">
              Follow the edit for the next release.
            </p>
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link href="/collections/new-arrivals" className="btn-secondary">
            View All New Arrivals
          </Link>
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="bg-black text-white">
        <div className="container py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <p className="eyebrow text-gray-500 mb-8">
              The Axent Difference
            </p>
            <h2 className="display-xl text-white mb-8">
              Chinese designers set the tone for{' '}
              <span className="editorial-accent">modern streetwear.</span>
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
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
        <section className="container py-20 lg:py-28">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="eyebrow mb-4">Categories</p>
              <h2 className="display-lg">Shop by Category</h2>
            </div>
            <Link href="/collections" className="nav-link hidden sm:block">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.slice(0, 3).map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group block"
              >
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden mb-5">
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-cream">
                      <span className="font-serif text-3xl text-gray-400">
                        {collection.title}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-serif text-2xl group-hover:text-gray-500 transition-colors duration-300">
                  {collection.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* If no real collections, show virtual category links */}
      {collections.length === 0 && (
        <section className="container py-20 lg:py-28">
          <div className="mb-12">
            <p className="eyebrow mb-4">Categories</p>
            <h2 className="display-lg">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="aspect-[4/3] bg-cream flex items-center justify-center mb-5 group-hover:bg-black transition-colors duration-400 ease-out-expo">
                  <span className="font-serif text-2xl text-gray-500 group-hover:text-white transition-colors duration-300">
                    {cat.title}
                  </span>
                </div>
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wider group-hover:text-gray-500 transition-colors duration-300">
                  {cat.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-cream">
        <div className="container py-20 lg:py-28">
          <div className="max-w-xl mx-auto text-center">
            <p className="eyebrow mb-5">Stay Updated</p>
            <h2 className="display-md mb-4">Join the List</h2>
            <p className="text-gray-500 mb-10">
              Be the first to know about new arrivals and exclusive offers.
              No spam, ever.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="input input-lg flex-1"
                required
              />
              <button type="submit" className="btn-primary btn-lg whitespace-nowrap">
                Subscribe
              </button>
            </form>
            <p className="caption mt-6">
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
