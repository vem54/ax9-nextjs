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
const THB_TO_USD_RATE = Number(process.env.NEXT_PUBLIC_THB_TO_USD_RATE ?? '0.032126');
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ax9-nextjs.vercel.app';

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
  const price = product.priceRange.minVariantPrice;
  const normalizedPrice =
    price.currencyCode === 'THB'
      ? (parseFloat(price.amount) * THB_TO_USD_RATE).toFixed(2)
      : price.amount;
  const normalizedCurrency = price.currencyCode === 'THB' ? 'USD' : price.currencyCode;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: images.map((image) => image.url),
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.vendor || 'Axent',
    },
    offers: {
      '@type': 'Offer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      price: normalizedPrice,
      priceCurrency: normalizedCurrency,
      itemCondition: 'https://schema.org/NewCondition',
      url: `${SITE_URL}/products/${product.handle}`,
    },
  };

  return (
    <div className="container py-10 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="caption mb-8 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/collections/all" className="hover:text-black transition-colors duration-200">Shop</Link>
        <span className="text-gray-300">/</span>
        <span className="text-black line-clamp-1">{product.title}</span>
      </nav>

      {/* Main product section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-10 lg:gap-16 items-start">
        {/* Gallery */}
        <div className="md:sticky md:top-28 self-start">
          <ProductGallery images={images} productTitle={product.title} />
        </div>

        {/* Info */}
        <ProductInfo product={product} />
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 lg:mt-28 pt-16 border-t border-gray-200">
          <div className="mb-12">
            <p className="eyebrow mb-4">More to Explore</p>
            <h2 className="display-md">You May Also Like</h2>
          </div>
          <ProductGrid products={relatedProducts.slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
