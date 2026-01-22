import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { shopifyFetch } from '@/lib/shopify/client';
import { GET_PRODUCT_BY_HANDLE, GET_PRODUCTS } from '@/lib/shopify/queries';
import { Product } from '@/lib/shopify/types';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductGrid from '@/components/product/ProductGrid';
import Link from 'next/link';

const STORE_COUNTRY = 'US';

interface Props {
  params: Promise<{ handle: string }>;
}

async function getProduct(handle: string): Promise<Product | null> {
  try {
    const response = await shopifyFetch<{ product: Product }>({
      query: GET_PRODUCT_BY_HANDLE,
      variables: { handle, country: STORE_COUNTRY },
      tags: ['products', handle],
      revalidate: 60,
    });
    return response.data.product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

async function getRelatedProducts(productId: string): Promise<Product[]> {
  try {
    const response = await shopifyFetch<{
      products: { edges: { node: Product }[] };
    }>({
      query: GET_PRODUCTS,
      variables: { first: 4, sortKey: 'BEST_SELLING', country: STORE_COUNTRY },
      tags: ['products'],
      revalidate: 60,
    });
    return response.data.products.edges
      .map((edge) => edge.node)
      .filter((p) => p.id !== productId);
  } catch (error) {
    console.error('Failed to fetch related products:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.title,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id);
  const images = product.images.edges.map((edge) => edge.node);

  return (
    <div className="container py-6">
      <nav className="text-xs text-gray-500 mb-4 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link href="/collections/all" className="hover:text-black">Shop</Link>
        <span>/</span>
        <span className="text-black">{product.title}</span>
      </nav>
      {/* Main product section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6 lg:gap-12 items-start">
        {/* Gallery */}
        <div className="md:sticky md:top-20 self-start">
          <ProductGallery images={images} productTitle={product.title} />
        </div>

        {/* Info */}
        <ProductInfo product={product} />
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-10 pt-10 border-t border-gray-100">
          <h2 className="text-xl font-medium mb-6">You May Also Like</h2>
          <ProductGrid products={relatedProducts.slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
