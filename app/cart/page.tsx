'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/shopify/client';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const {
    cart,
    isLoading,
    updateLineItem,
    removeLineItem,
    initializeCart,
  } = useCartStore();

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  const lines = cart?.lines.edges.map((edge) => edge.node) || [];

  if (lines.length === 0) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-medium mb-4">Your Cart</h1>
          <div className="py-10">
            <svg
              className="w-16 h-16 mx-auto mb-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-gray-500 mb-2">Your cart is empty.</p>
            <p className="text-sm text-gray-500 mb-6">
              Discover our curated selection of Chinese fashion.
            </p>
            <Link href="/collections/all" className="btn-primary inline-block">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-medium mb-6">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            {/* Header - desktop only */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <ul className="divide-y divide-gray-100">
              {lines.map((line) => (
                <li key={line.id} className="py-4">
                  <div className="grid md:grid-cols-12 gap-4 items-start">
                    {/* Product info */}
                    <div className="md:col-span-6 flex gap-4">
                      <Link
                        href={`/products/${line.merchandise.product.handle}`}
                        className="shrink-0"
                      >
                        {line.merchandise.product.featuredImage ? (
                          <Image
                            src={line.merchandise.product.featuredImage.url}
                            alt={line.merchandise.product.title}
                            width={80}
                            height={107}
                            className="object-cover aspect-product"
                          />
                        ) : (
                          <div className="w-20 h-[107px] bg-gray-100" />
                        )}
                      </Link>
                      <div className="min-w-0">
                        <Link
                          href={`/products/${line.merchandise.product.handle}`}
                          className="font-medium hover:text-gray-500 block"
                        >
                          {line.merchandise.product.title}
                        </Link>
                        {line.merchandise.title !== 'Default Title' && (
                          <p className="text-sm text-gray-500 mt-1">
                            {line.merchandise.selectedOptions
                              .map((opt) => opt.value)
                              .join(' / ')}
                          </p>
                        )}
                        {/* Mobile price */}
                        <p className="text-sm mt-1 md:hidden">
                          {formatPrice(
                            line.merchandise.price.amount,
                            line.merchandise.price.currencyCode
                          )}
                        </p>
                        {/* Mobile remove */}
                        <button
                          onClick={() => removeLineItem(line.id)}
                          disabled={isLoading}
                          className="text-xs text-gray-500 hover:text-black mt-2 md:hidden disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2 flex justify-center">
                      <div className="flex items-center border border-black">
                        <button
                          onClick={() => {
                            if (line.quantity === 1) {
                              removeLineItem(line.id);
                            } else {
                              updateLineItem(line.id, line.quantity - 1);
                            }
                          }}
                          disabled={isLoading}
                          className="w-8 h-8 text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-sm">{line.quantity}</span>
                        <button
                          onClick={() => updateLineItem(line.id, line.quantity + 1)}
                          disabled={isLoading}
                          className="w-8 h-8 text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price - desktop */}
                    <div className="hidden md:block md:col-span-2 text-right text-sm">
                      {formatPrice(
                        line.merchandise.price.amount,
                        line.merchandise.price.currencyCode
                      )}
                    </div>

                    {/* Total - desktop */}
                    <div className="hidden md:block md:col-span-2 text-right">
                      <p className="font-medium">
                        {formatPrice(
                          (parseFloat(line.merchandise.price.amount) * line.quantity).toString(),
                          line.merchandise.price.currencyCode
                        )}
                      </p>
                      <button
                        onClick={() => removeLineItem(line.id)}
                        disabled={isLoading}
                        className="text-xs text-gray-500 hover:text-black mt-1 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          {cart && (
            <div className="lg:col-span-1">
              <div className="border border-black p-4 sticky top-20">
                <h2 className="font-medium mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>
                      {formatPrice(
                        cart.cost.subtotalAmount.amount,
                        cart.cost.subtotalAmount.currencyCode
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gray-500">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        cart.cost.totalAmount.amount,
                        cart.cost.totalAmount.currencyCode
                      )}
                    </span>
                  </div>
                </div>

                <a href={cart.checkoutUrl} className="btn-primary w-full text-center block">
                  Checkout
                </a>

                <Link
                  href="/collections/all"
                  className="block text-center text-sm mt-4 text-gray-500 hover:text-black"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
