'use client';

import { useState, useEffect } from 'react';

// Increment version when announcement content changes to show it again to all users
const ANNOUNCEMENT_VERSION = '1';
const STORAGE_KEY = `announcement-dismissed-v${ANNOUNCEMENT_VERSION}`;
const ANNOUNCEMENT_MESSAGE = 'Free shipping on orders over $200 · All duties prepaid';

type Status = 'loading' | 'entering' | 'visible' | 'closing' | 'hidden';

export default function AnnouncementBar() {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    if (dismissed) {
      setStatus('hidden');
    } else {
      // Start collapsed, then expand after a frame
      setStatus('entering');
      const timer = setTimeout(() => setStatus('visible'), 50);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setStatus('closing');
    localStorage.setItem(STORAGE_KEY, 'true');
    setTimeout(() => setStatus('hidden'), 300);
  };

  if (status === 'loading' || status === 'hidden') {
    return null;
  }

  const isCollapsed = status === 'entering' || status === 'closing';

  return (
    <div
      role="banner"
      aria-label="Store announcement"
      className={`bg-black text-white overflow-hidden transition-all duration-300 ease-out-expo ${
        isCollapsed ? 'max-h-0 opacity-0' : 'max-h-14 opacity-100'
      }`}
    >
      <div className="relative flex items-center justify-center py-2.5 px-10 sm:px-12 md:px-16">
        <p className="text-[11px] sm:text-xs text-center tracking-wide font-sans leading-tight">
          {ANNOUNCEMENT_MESSAGE}
        </p>
        <button
          onClick={handleDismiss}
          className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white transition-colors duration-150"
          aria-label="Dismiss announcement"
        >
          <svg 
            className="w-3.5 h-3.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

