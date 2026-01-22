'use client';

import { useEffect, useRef } from 'react';
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
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  useEffect(() => {
    if (!isOpen) return;

    lastActiveRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const drawer = drawerRef.current;
    if (drawer) {
      const focusable = drawer.querySelectorAll<HTMLElement>(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable[0] || drawer).focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeCart();
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      lastActiveRef.current?.focus();
    };
  }, [isOpen, closeCart]);

  const lines = cart?.lines.edges.map((edge) => edge.node) || [];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black">
          <h2 id="cart-drawer-title" className="font-serif text-2xl">
            Cart{' '}
            <span className="font-mono text-sm text-gray-500 ml-1">
              ({cart?.totalQuantity || 0})
            </span>
          </h2>
          <button
            onClick={closeCart}
            className="nav-link"
            aria-label="Close cart"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {lines.length === 0 ? (
            <div className="text-center py-16">
              <p className="display-sm text-gray-600 mb-5">Your cart is empty</p>
              <Link
                href="/collections/all"
                onClick={closeCart}
                className="link-underline text-sm"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <ul className="space-y-8">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-5">
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
                        width={88}
                        height={117}
                        className="object-cover aspect-product"
                      />
                    ) : (
                      <div className="w-[88px] h-[117px] bg-gray-100" />
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${line.merchandise.product.handle}`}
                      onClick={closeCart}
                      className="product-title hover:text-gray-500 transition-colors duration-200 block line-clamp-2"
                    >
                      {line.merchandise.product.title}
                    </Link>
                    {line.merchandise.title !== 'Default Title' && (
                      <p className="caption mt-2">
                        {line.merchandise.selectedOptions
                          .map((opt) => opt.value)
                          .join(' / ')}
                      </p>
                    )}
                    <p className="price mt-3">
                      {formatPrice(
                        line.merchandise.price.amount,
                        line.merchandise.price.currencyCode
                      )}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => {
                          if (line.quantity === 1) {
                            removeLineItem(line.id);
                          } else {
                            updateLineItem(line.id, line.quantity - 1);
                          }
                        }}
                        disabled={isLoading}
                        className="w-8 h-8 border border-black font-mono text-sm hover:bg-gray-100 disabled:opacity-50 transition-colors duration-200"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="font-mono text-sm w-6 text-center font-bold tabular-nums">
                        {line.quantity}
                      </span>
                      <button
                        onClick={() => updateLineItem(line.id, line.quantity + 1)}
                        disabled={isLoading}
                        className="w-8 h-8 border border-black font-mono text-sm hover:bg-gray-100 disabled:opacity-50 transition-colors duration-200"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeLineItem(line.id)}
                        disabled={isLoading}
                        className="text-xs text-gray-400 hover:text-black ml-auto disabled:opacity-50 transition-colors duration-200"
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
          <div className="border-t border-black px-6 py-6">
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="price-xl">
                {formatPrice(
                  cart.cost.subtotalAmount.amount,
                  cart.cost.subtotalAmount.currencyCode
                )}
              </span>
            </div>
            <p className="caption mb-6">
              Shipping and taxes calculated at checkout.
            </p>
            <a
              href={cart.checkoutUrl}
              className="btn-primary btn-lg w-full text-center block"
            >
              Checkout
            </a>
          </div>
        )}
      </div>
    </>
  );
}
