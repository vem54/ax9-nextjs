'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';

export default function Header() {
  const { totalQuantity, openCart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black">
      <div className="container">
        <div className="grid grid-cols-[auto,1fr,auto] items-center h-14">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -ml-2 hover:text-gray-500 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/collections/all" className="text-sm hover:text-gray-500 transition-colors">
                Shop
              </Link>
              <Link href="/collections/new-arrivals" className="text-sm hover:text-gray-500 transition-colors">
                New Arrivals
              </Link>
              <Link href="/about" className="text-sm hover:text-gray-500 transition-colors">
                About
              </Link>
            </nav>
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/" className="text-xl font-medium tracking-tight">
              AXENT
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4 justify-end">
            <Link href="/search" className="p-2 hover:text-gray-500 transition-colors" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link href="/account" className="hidden sm:block p-2 hover:text-gray-500 transition-colors" aria-label="Account">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <button
              onClick={openCart}
              className="p-2 hover:text-gray-500 transition-colors flex items-center gap-1"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalQuantity > 0 && (
                <span className="text-xs font-medium">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="container py-4">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/collections/all"
                  className="block text-lg font-medium hover:text-gray-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/new-arrivals"
                  className="block text-lg font-medium hover:text-gray-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  New Arrivals
                </Link>
              </li>
              <li className="pt-2 border-t border-gray-100">
                <Link
                  href="/collections/outerwear"
                  className="block text-sm hover:text-gray-500 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Outerwear
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/tops"
                  className="block text-sm hover:text-gray-500 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tops
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/bottoms"
                  className="block text-sm hover:text-gray-500 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bottoms
                </Link>
              </li>
              <li className="pt-4 border-t border-gray-100">
                <Link
                  href="/about"
                  className="block text-sm hover:text-gray-500 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block text-sm hover:text-gray-500 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="block text-sm hover:text-gray-500 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
