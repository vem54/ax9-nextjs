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
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-medium mb-4">Your Cart</h1>
          <p className="text-gray-500 mb-6">Your cart is empty.</p>
          <Link href="/collections/all" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-medium mb-8">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <ul className="divide-y divide-gray-100">
              {lines.map((line) => (
                <li key={line.id} className="py-4 flex gap-4">
                  {/* Image */}
                  <Link
                    href={`/products/${line.merchandise.product.handle}`}
                    className="shrink-0"
                  >
                    {line.merchandise.product.featuredImage ? (
                      <Image
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.title}
                        width={100}
                        height={133}
                        className="object-cover aspect-product"
                      />
                    ) : (
                      <div className="w-[100px] h-[133px] bg-gray-100" />
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
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
                    <p className="text-sm mt-1">
                      {formatPrice(
                        line.merchandise.price.amount,
                        line.merchandise.price.currencyCode
                      )}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-3">
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
                      <button
                        onClick={() => removeLineItem(line.id)}
                        disabled={isLoading}
                        className="text-sm text-gray-500 hover:text-black disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(
                        (parseFloat(line.merchandise.price.amount) * line.quantity).toString(),
                        line.merchandise.price.currencyCode
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          {cart && (
            <div className="lg:col-span-1">
              <div className="border border-black p-4">
                <h2 className="font-medium mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
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
                    <span>Calculated at checkout</span>
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
                  className="block text-center text-sm mt-3 text-gray-500 hover:text-black"
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
