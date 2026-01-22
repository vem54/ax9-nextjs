import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-10">
      <div className="container py-7">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-medium tracking-tight">
              AXENT
            </Link>
            <p className="text-sm text-gray-500 mt-3">
              Curated Chinese fashion for the global market.
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
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-medium mb-3">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/pages/shipping" className="text-sm text-gray-500 hover:text-white">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/pages/returns" className="text-sm text-gray-500 hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/pages/sizing" className="text-sm text-gray-500 hover:text-white">
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

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-medium mb-3">Newsletter</h4>
            <p className="text-sm text-gray-500 mb-3">
              New arrivals and exclusive offers.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-3 py-2 text-sm bg-transparent border border-gray-500 text-white placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-white text-black font-medium hover:bg-gray-100"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-500 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Axent. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/pages/privacy" className="text-xs text-gray-500 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/pages/terms" className="text-xs text-gray-500 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
