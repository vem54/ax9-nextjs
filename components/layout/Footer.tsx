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
