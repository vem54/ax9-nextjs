'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/shopify/client';

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    isLoading,
    closeCart,
    updateLineItem,
    removeLineItem,
    initializeCart,
  } = useCartStore();

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  const lines = cart?.lines.edges.map((edge) => edge.node) || [];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-black">
          <h2 className="text-lg font-medium">Cart ({cart?.totalQuantity || 0})</h2>
          <button
            onClick={closeCart}
            className="text-sm hover:text-gray-500"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {lines.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link
                href="/collections/all"
                onClick={closeCart}
                className="text-sm underline"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4">
                  {/* Image */}
                  <Link
                    href={`/products/${line.merchandise.product.handle}`}
                    onClick={closeCart}
                    className="shrink-0"
                  >
                    {line.merchandise.product.featuredImage ? (
                      <Image
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title}
                        width={80}
                        height={107}
                        className="object-cover aspect-product"
                      />
                    ) : (
                      <div className="w-20 h-[107px] bg-gray-100" />
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${line.merchandise.product.handle}`}
                      onClick={closeCart}
                      className="text-sm font-medium hover:text-gray-500 block truncate"
                    >
                      {line.merchandise.product.title}
                    </Link>
                    {line.merchandise.title !== 'Default Title' && (
                      <p className="text-xs text-gray-500 mt-1">
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
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          if (line.quantity === 1) {
                            removeLineItem(line.id);
                          } else {
                            updateLineItem(line.id, line.quantity - 1);
                          }
                        }}
                        disabled={isLoading}
                        className="w-6 h-6 border border-black text-xs hover:bg-gray-100 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="text-sm w-6 text-center">{line.quantity}</span>
                      <button
                        onClick={() => updateLineItem(line.id, line.quantity + 1)}
                        disabled={isLoading}
                        className="w-6 h-6 border border-black text-xs hover:bg-gray-100 disabled:opacity-50"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeLineItem(line.id)}
                        disabled={isLoading}
                        className="text-xs text-gray-500 hover:text-black ml-auto disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && cart && (
          <div className="border-t border-black px-4 py-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Subtotal</span>
              <span className="text-sm font-medium">
                {formatPrice(
                  cart.cost.subtotalAmount.amount,
                  cart.cost.subtotalAmount.currencyCode
                )}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <a
              href={cart.checkoutUrl}
              className="btn-primary w-full text-center block"
            >
              Checkout
            </a>
          </div>
        )}
      </div>
    </>
  );
}
