import { Metadata } from 'next';
import WishlistContent from './WishlistContent';

export const metadata: Metadata = {
  title: 'Wishlist | AXENT',
  description: 'Your saved items from AXENT.',
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="container py-8 md:py-12">
          <nav className="text-xs text-gray-500 mb-4">
            <a href="/" className="hover:text-black">Home</a>
            <span className="mx-2">/</span>
            <span className="text-black">Wishlist</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-medium">Wishlist</h1>
        </div>
      </div>

      {/* Content */}
      <WishlistContent />
    </main>
  );
}

