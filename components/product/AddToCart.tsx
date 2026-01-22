'use client';

import { useCartStore } from '@/lib/store/cart';
import Button from '@/components/ui/Button';

interface AddToCartProps {
  variantId: string;
  availableForSale: boolean;
  quantity?: number;
}

export default function AddToCart({ variantId, availableForSale, quantity = 1 }: AddToCartProps) {
  const { addToCart, isLoading } = useCartStore();

  const handleAddToCart = () => {
    addToCart(variantId, quantity);
  };

  if (!variantId || !availableForSale) {
    const label = !variantId ? 'Select Option' : 'Sold Out';
    return (
      <Button variant="secondary" disabled className="w-full">
        {label}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      loading={isLoading}
      className="w-full"
    >
      Add to Cart
    </Button>
  );
}
