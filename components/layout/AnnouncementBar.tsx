'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'announcement-dismissed';

export default function AnnouncementBar() {
  const [isDismissed, setIsDismissed] = useState(true); // Start hidden to prevent flash
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const dismissed = localStorage.getItem(STORAGE_KEY);
    setIsDismissed(dismissed === 'true');
    setIsHydrated(true);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  // Don't render until hydrated to prevent flash
  if (!isHydrated || isDismissed) {
    return null;
  }

  return (
    <div className="bg-black text-white relative">
      <div className="container py-2.5">
        <p className="text-xs text-center tracking-wide pr-8">
          Free shipping on orders over $200 · All duties prepaid
        </p>
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors"
          aria-label="Dismiss announcement"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

