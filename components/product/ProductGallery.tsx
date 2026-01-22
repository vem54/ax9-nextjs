'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ShopifyImage } from '@/lib/shopify/types';
import ImageLightbox from './ImageLightbox';

interface ProductGalleryProps {
  images: ShopifyImage[];
  productTitle: string;
}

export default function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const mainImageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, []);

  const openLightbox = useCallback(() => {
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  if (images.length === 0) {
    return (
      <div className="aspect-product bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500">No image</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-4">
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px] scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={image.url}
                onClick={() => setSelectedIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-pressed={selectedIndex === index}
                className={`shrink-0 w-16 h-[85px] md:w-20 md:h-[107px] border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black ${
                  selectedIndex === index ? 'border-black' : 'border-transparent hover:border-gray-300'
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

        {/* Main image with hover zoom */}
        <div className="flex-1 relative">
          {/* Main image container */}
          <div
            ref={mainImageRef}
            className="relative aspect-product bg-gray-100 cursor-zoom-in overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            onClick={openLightbox}
            role="button"
            tabIndex={0}
            aria-label={`View ${productTitle} in full screen`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox();
              }
            }}
          >
            {/* Base image */}
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || productTitle}
              fill
              sizes="(min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw"
              className="object-contain"
              priority
            />
            
            {/* Zoom overlay - desktop only */}
            <div
              className="absolute inset-0 hidden md:block pointer-events-none"
              style={{
                opacity: isHovering ? 1 : 0,
                backgroundImage: `url(${selectedImage.url})`,
                backgroundSize: '200%',
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
            
            {/* Zoom hint */}
            <div
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1.5 text-xs text-gray-600 pointer-events-none ${
                isHovering ? 'opacity-0' : 'opacity-100'
              } hidden md:block`}
            >
              Hover to zoom • Click for full view
            </div>
            
            {/* Mobile tap hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1.5 text-xs text-gray-600 pointer-events-none md:hidden">
              Tap for full view
            </div>
          </div>

          {/* Image counter for mobile */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 text-xs text-gray-600 md:hidden">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <ImageLightbox
          images={images}
          productTitle={productTitle}
          initialIndex={selectedIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
