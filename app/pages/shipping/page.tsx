import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping Information | Axent',
  description: 'Learn about Axent shipping options, delivery times, and international shipping policies.',
};

export default function ShippingPage() {
  return (
    <div className="container py-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-medium mb-6">Shipping</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-medium mb-3">Delivery Times</h2>
            <p className="text-sm text-gray-500 mb-4">
              Orders are processed within 1-2 business days. Weekend and holiday orders ship the next business day.
            </p>
            <div className="border border-gray-100">
              <div className="grid grid-cols-2 border-b border-gray-100">
                <div className="p-3 text-sm font-medium">Region</div>
                <div className="p-3 text-sm font-medium">Estimated Delivery</div>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-100">
                <div className="p-3 text-sm">United States</div>
                <div className="p-3 text-sm text-gray-500">5-7 business days</div>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-100">
                <div className="p-3 text-sm">Europe</div>
                <div className="p-3 text-sm text-gray-500">7-10 business days</div>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-100">
                <div className="p-3 text-sm">Asia Pacific</div>
                <div className="p-3 text-sm text-gray-500">5-8 business days</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-3 text-sm">Rest of World</div>
                <div className="p-3 text-sm text-gray-500">10-14 business days</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Shipping Rates</h2>
            <p className="text-sm text-gray-500 mb-4">
              Shipping costs are calculated at checkout based on destination and weight.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>Free shipping on orders over $200 USD</li>
              <li>Express shipping available at checkout</li>
              <li>Duties and taxes shown at checkout when applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Tracking Your Order</h2>
            <p className="text-sm text-gray-500">
              You will receive a tracking email once your order ships. You can also track from your account dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">International Orders</h2>
            <p className="text-sm text-gray-500">
              We ship worldwide. Import duties and taxes may apply depending on your country&apos;s regulations.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Questions about shipping?{' '}
              <Link href="/contact" className="underline hover:no-underline">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
