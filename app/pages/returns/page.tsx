import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Returns & Exchanges',
  description: 'Learn about Axent return policy, exchange process, and refund information.',
};

export default function ReturnsPage() {
  return (
    <div className="container py-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-medium mb-6">Returns & Exchanges</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-medium mb-3">Return Policy</h2>
            <p className="text-sm text-gray-500">
              Returns are accepted within 14 days of delivery. Items must be unworn, unwashed, and returned with all tags.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">How to Return</h2>
            <ol className="text-sm text-gray-500 space-y-3">
              <li className="flex gap-3">
                <span className="font-medium text-black">1.</span>
                <span>Contact us at support@axent.com with your order number and reason.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium text-black">2.</span>
                <span>We will send a return label within 24 hours.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium text-black">3.</span>
                <span>Pack the item securely in its original packaging if possible.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium text-black">4.</span>
                <span>Drop off the package at your nearest shipping location.</span>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Refunds</h2>
            <p className="text-sm text-gray-500 mb-4">
              Once your return is inspected, we process refunds within 5-7 business days to the original payment method.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>Original shipping costs are non-refundable</li>
              <li>Return shipping is free for defective or incorrect items</li>
              <li>Sale items are final sale and cannot be returned</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Exchanges</h2>
            <p className="text-sm text-gray-500">
              We do not offer direct exchanges. If you need a different size or color, please return your item for a refund and place a new order. This ensures you receive your new item as quickly as possible.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Damaged or Defective Items</h2>
            <p className="text-sm text-gray-500">
              If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos of the damage. We will arrange a free return and send a replacement or full refund.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Need help with a return?{' '}
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
