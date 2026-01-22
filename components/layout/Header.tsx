'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';

export default function Header() {
  const { totalQuantity, openCart } = useCartStore();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-medium tracking-tight">
            AXENT
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/collections/all" className="text-sm hover:text-gray-500">
              Shop
            </Link>
            <Link href="/collections/new-arrivals" className="text-sm hover:text-gray-500">
              New Arrivals
            </Link>
            <Link href="/about" className="text-sm hover:text-gray-500">
              About
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link href="/search" className="text-sm hover:text-gray-500">
              Search
            </Link>
            <Link href="/account" className="text-sm hover:text-gray-500">
              Account
            </Link>
            <button
              onClick={openCart}
              className="text-sm hover:text-gray-500 flex items-center gap-1"
            >
              Cart
              {totalQuantity > 0 && (
                <span className="bg-black text-white text-xs px-1.5 py-0.5">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav - simple for now */}
      <nav className="md:hidden border-t border-gray-100">
        <div className="container flex items-center gap-6 py-3 overflow-x-auto">
          <Link href="/collections/all" className="text-sm whitespace-nowrap">
            Shop
          </Link>
          <Link href="/collections/new-arrivals" className="text-sm whitespace-nowrap">
            New Arrivals
          </Link>
          <Link href="/about" className="text-sm whitespace-nowrap">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
