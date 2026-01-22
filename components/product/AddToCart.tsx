'use client';

import { useCartStore } from '@/lib/store/cart';
import Button from '@/components/ui/Button';

interface AddToCartProps {
  variantId: string;
  availableForSale: boolean;
}

export default function AddToCart({ variantId, availableForSale }: AddToCartProps) {
  const { addToCart, isLoading } = useCartStore();

  const handleAddToCart = () => {
    addToCart(variantId);
  };

  if (!availableForSale) {
    return (
      <Button variant="secondary" disabled className="w-full">
        Sold Out
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
