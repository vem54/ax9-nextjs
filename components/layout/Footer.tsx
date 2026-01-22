import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="container py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="logo text-white">
              AXENT
            </Link>
            <p className="text-sm text-gray-400 mt-5 max-w-xs leading-relaxed">
              Curated Chinese fashion for the discerning global customer.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/collections/all" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections/new-arrivals" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections/outerwear" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Outerwear
                </Link>
              </li>
              <li>
                <Link href="/collections/tops" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Tops
                </Link>
              </li>
              <li>
                <Link href="/collections/bottoms" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Bottoms
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest mb-6">Help</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/shipping" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-xs text-gray-400 tracking-wide">
            <li>Secure checkout</li>
            <li>Free shipping over $200</li>
            <li>All duties prepaid</li>
          </ul>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between lg:justify-end lg:gap-10">
            <div className="flex items-center gap-3" aria-label="Accepted payment methods">
              <svg viewBox="0 0 48 28" className="h-5 w-auto text-white" role="img" aria-label="Visa">
                <rect x="0.75" y="0.75" width="46.5" height="26.5" rx="0" ry="0" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <text x="24" y="18" textAnchor="middle" fontSize="10" fontFamily="Arial, sans-serif" fontWeight="700" fill="currentColor">
                  VISA
                </text>
              </svg>
              <svg viewBox="0 0 48 28" className="h-5 w-auto text-white" role="img" aria-label="Mastercard">
                <rect x="0.75" y="0.75" width="46.5" height="26.5" rx="0" ry="0" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <text x="24" y="18" textAnchor="middle" fontSize="9" fontFamily="Arial, sans-serif" fontWeight="700" fill="currentColor">
                  MC
                </text>
              </svg>
              <svg viewBox="0 0 48 28" className="h-5 w-auto text-white" role="img" aria-label="American Express">
                <rect x="0.75" y="0.75" width="46.5" height="26.5" rx="0" ry="0" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <text x="24" y="18" textAnchor="middle" fontSize="9" fontFamily="Arial, sans-serif" fontWeight="700" fill="currentColor">
                  AMEX
                </text>
              </svg>
              <svg viewBox="0 0 48 28" className="h-5 w-auto text-white" role="img" aria-label="PayPal">
                <rect x="0.75" y="0.75" width="46.5" height="26.5" rx="0" ry="0" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <text x="24" y="18" textAnchor="middle" fontSize="9" fontFamily="Arial, sans-serif" fontWeight="700" fill="currentColor">
                  PayPal
                </text>
              </svg>
              <svg viewBox="0 0 58 28" className="h-5 w-auto text-white" role="img" aria-label="Apple Pay">
                <rect x="0.75" y="0.75" width="56.5" height="26.5" rx="0" ry="0" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <text x="29" y="18" textAnchor="middle" fontSize="9" fontFamily="Arial, sans-serif" fontWeight="700" fill="currentColor">
                  Apple Pay
                </text>
              </svg>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" role="img" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="0" ry="0" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="TikTok"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" role="img" aria-hidden="true">
                  <path
                    d="M14 4c.5 2.3 2.3 4.1 4.6 4.6V11c-1.9-.1-3.5-.8-4.6-1.9V15a4.5 4.5 0 1 1-4.5-4.5c.4 0 .8 0 1.2.1v2.3a2.1 2.1 0 1 0 1.8 2.1V4h1.5Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="https://www.pinterest.com/"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Pinterest"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" role="img" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M11.3 15.5l1.1-4.2c-.6-.3-1-.9-1-1.6 0-1 0-2.2 1.8-2.2 1.4 0 2 1 2 2.1 0 1.3-.7 2.6-1.2 3.8-.4 1-.8 2.4-1.2 3.8" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-14 pt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 tracking-wide">
            &copy; {new Date().getFullYear()} Axent. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 tracking-wide">
            Ships worldwide from China
          </p>
        </div>
      </div>
    </footer>
  );
}
