import Link from 'next/link';
import Image from 'next/image';
import { shopifyFetch } from '@/lib/shopify/client';
import { GET_PRODUCTS, GET_COLLECTIONS } from '@/lib/shopify/queries';
import { Product, Collection } from '@/lib/shopify/types';
import ProductGrid from '@/components/product/ProductGrid';

async function getProducts(): Promise<Product[]> {
  try {
    const response = await shopifyFetch<{
      products: { edges: { node: Product }[] };
    }>({
      query: GET_PRODUCTS,
      variables: { first: 8, sortKey: 'CREATED_AT', reverse: true },
      tags: ['products'],
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
      variables: { first: 4 },
      tags: ['collections'],
    });
    return response.data.collections.edges.map((edge) => edge.node);
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

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-4xl font-medium mb-4">
              Curated Chinese Fashion
            </h1>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Discover emerging designers from China. Quality streetwear and contemporary pieces.
            </p>
            <Link href="/collections/all" className="btn-primary">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Collections */}
      {collections.length > 0 && (
        <section className="container py-7">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Collections</h2>
            <Link href="/collections" className="text-sm hover:text-gray-500">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collections.slice(0, 4).map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden mb-3">
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      className="object-cover group-hover:opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500 text-sm">{collection.title}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium group-hover:text-gray-500">
                  {collection.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="container py-7">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">New Arrivals</h2>
          <Link href="/collections/new-arrivals" className="text-sm hover:text-gray-500">
            View All
          </Link>
        </div>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-product bg-gray-100" />
            ))}
          </div>
        )}
      </section>

      {/* Brand Story Banner */}
      <section className="bg-black text-white py-10">
        <div className="container text-center">
          <h2 className="text-2xl font-medium mb-4">Why Axent</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-6">
            Chinese brands have mastered quality and design. We curate the best emerging designers,
            bringing fashion-forward pieces from Shanghai, Beijing, and beyond to your wardrobe.
          </p>
          <Link href="/about" className="text-sm underline hover:no-underline">
            Learn More
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl font-medium mb-3">Stay Updated</h2>
          <p className="text-sm text-gray-500 mb-4">
            New arrivals and exclusive offers, directly to your inbox.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="input flex-1"
              required
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
