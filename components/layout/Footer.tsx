import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-10">
      <div className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-medium tracking-tight">
              AXENT
            </Link>
            <p className="text-sm text-gray-500 mt-3 max-w-xs">
              Curated Chinese fashion for the discerning global customer.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-medium mb-3">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/collections/all" className="text-sm text-gray-500 hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections/new-arrivals" className="text-sm text-gray-500 hover:text-white">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections/outerwear" className="text-sm text-gray-500 hover:text-white">
                  Outerwear
                </Link>
              </li>
              <li>
                <Link href="/collections/tops" className="text-sm text-gray-500 hover:text-white">
                  Tops
                </Link>
              </li>
              <li>
                <Link href="/collections/bottoms" className="text-sm text-gray-500 hover:text-white">
                  Bottoms
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-medium mb-3">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-sm text-gray-500 hover:text-white">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-gray-500 hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-sm text-gray-500 hover:text-white">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-medium mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-500/30 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Axent. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-500">
              Ships worldwide from China
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
