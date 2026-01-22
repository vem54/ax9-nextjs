'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { ShopifyImage } from '@/lib/shopify/types';

interface ImageLightboxProps {
  images: ShopifyImage[];
  productTitle: string;
  initialIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  productTitle,
  initialIndex,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const currentImage = images[currentIndex];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsZoomed(false);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToPrevious, goToNext]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Focus trap
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Handle zoom on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
    if (!isZoomed && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    }
  };

  // Touch handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isZoomed) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isZoomed) return;
    
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
    
    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = Math.abs(touchEnd.y - touchStartRef.current.y);
    
    // Only trigger swipe if horizontal movement is significant and vertical is minimal
    if (Math.abs(deltaX) > 50 && deltaY < 100) {
      if (deltaX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    touchStartRef.current = null;
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image gallery for ${productTitle}`}
      tabIndex={-1}
      className="fixed inset-0 z-50 bg-white flex flex-col outline-none"
      onClick={handleBackdropClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
          aria-label="Close gallery"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        </button>
      </div>

      {/* Main image area */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous button */}
        {images.length > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 z-10 p-3 bg-white border border-gray-200 hover:border-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black hidden md:block"
            aria-label="Previous image"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M10 12L6 8l4-4" />
            </svg>
          </button>
        )}

        {/* Image container */}
        <div
          ref={imageRef}
          className={`relative w-full h-full max-w-4xl mx-auto px-4 md:px-16 ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
        >
          <div
            className="relative w-full h-full"
            style={
              isZoomed
                ? {
                    transform: 'scale(2.5)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : undefined
            }
          >
            <Image
              src={currentImage.url}
              alt={currentImage.altText || `${productTitle} ${currentIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
              draggable={false}
            />
          </div>
        </div>

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 z-10 p-3 bg-white border border-gray-200 hover:border-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black hidden md:block"
            aria-label="Next image"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 4l4 4-4 4" />
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="flex justify-center gap-2 overflow-x-auto scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={image.url}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsZoomed(false);
                }}
                aria-label={`View image ${index + 1}`}
                aria-current={currentIndex === index ? 'true' : undefined}
                className={`shrink-0 w-14 h-[56px] border ${
                  currentIndex === index ? 'border-black' : 'border-gray-200'
                } focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black`}
              >
                <Image
                  src={image.url}
                  alt={image.altText || `${productTitle} thumbnail ${index + 1}`}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile swipe hint */}
      <div className="md:hidden text-center py-2 text-xs text-gray-400">
        Swipe to navigate • Tap to zoom
      </div>
    </div>
  );
}

