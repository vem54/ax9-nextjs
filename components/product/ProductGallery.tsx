'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShopifyImage } from '@/lib/shopify/types';

interface ProductGalleryProps {
  images: ShopifyImage[];
  productTitle: string;
}

export default function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-product bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500">No image</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px]">
          {images.map((image, index) => (
            <button
              key={image.url}
              onClick={() => setSelectedIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={selectedIndex === index}
              className={`shrink-0 w-16 h-[85px] md:w-20 md:h-[107px] border ${
                selectedIndex === index ? 'border-black' : 'border-transparent'
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText || `${productTitle} ${index + 1}`}
                width={80}
                height={107}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 relative aspect-product bg-gray-100">
        <Image
          src={selectedImage.url}
          alt={selectedImage.altText || productTitle}
          fill
          sizes="(min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
