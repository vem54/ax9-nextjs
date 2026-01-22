'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartLine } from '@/lib/shopify/types';
import { shopifyFetch } from '@/lib/shopify/client';
import {
  CREATE_CART,
  GET_CART,
  ADD_TO_CART,
  UPDATE_CART_LINE,
  REMOVE_FROM_CART,
} from '@/lib/shopify/queries';

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  totalQuantity: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateLineItem: (lineId: string, quantity: number) => Promise<void>;
  removeLineItem: (lineId: string) => Promise<void>;
  initializeCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      isLoading: false,
      totalQuantity: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      initializeCart: async () => {
        const { cart } = get();
        if (cart?.id) {
          try {
            const response = await shopifyFetch<{ cart: Cart }>({
              query: GET_CART,
              variables: { cartId: cart.id },
              cache: 'no-store',
            });
            if (response.data.cart) {
              set({
                cart: response.data.cart,
                totalQuantity: response.data.cart.totalQuantity,
              });
            }
          } catch (error) {
            console.error('Error fetching cart:', error);
            set({ cart: null, totalQuantity: 0 });
          }
        }
      },

      addToCart: async (variantId: string, quantity = 1) => {
        set({ isLoading: true });
        const { cart } = get();

        try {
          if (!cart?.id) {
            const response = await shopifyFetch<{ cartCreate: { cart: Cart } }>({
              query: CREATE_CART,
              variables: {
                input: {
                  lines: [{ merchandiseId: variantId, quantity }],
                },
              },
              cache: 'no-store',
            });
            const newCart = response.data.cartCreate.cart;
            set({
              cart: newCart,
              totalQuantity: newCart.totalQuantity,
              isOpen: true,
            });
          } else {
            const response = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>({
              query: ADD_TO_CART,
              variables: {
                cartId: cart.id,
                lines: [{ merchandiseId: variantId, quantity }],
              },
              cache: 'no-store',
            });
            const updatedCart = response.data.cartLinesAdd.cart;
            set({
              cart: updatedCart,
              totalQuantity: updatedCart.totalQuantity,
              isOpen: true,
            });
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateLineItem: async (lineId: string, quantity: number) => {
        set({ isLoading: true });
        const { cart } = get();

        if (!cart?.id) return;

        try {
          const response = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>({
            query: UPDATE_CART_LINE,
            variables: {
              cartId: cart.id,
              lines: [{ id: lineId, quantity }],
            },
            cache: 'no-store',
          });
          const updatedCart = response.data.cartLinesUpdate.cart;
          set({
            cart: updatedCart,
            totalQuantity: updatedCart.totalQuantity,
          });
        } catch (error) {
          console.error('Error updating cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeLineItem: async (lineId: string) => {
        set({ isLoading: true });
        const { cart } = get();

        if (!cart?.id) return;

        try {
          const response = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>({
            query: REMOVE_FROM_CART,
            variables: {
              cartId: cart.id,
              lineIds: [lineId],
            },
            cache: 'no-store',
          });
          const updatedCart = response.data.cartLinesRemove.cart;
          set({
            cart: updatedCart,
            totalQuantity: updatedCart.totalQuantity,
          });
        } catch (error) {
          console.error('Error removing from cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart, totalQuantity: state.totalQuantity }),
    }
  )
);
