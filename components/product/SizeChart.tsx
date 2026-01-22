'use client';

import { useEffect, useRef, useState } from 'react';

interface SizeChartData {
  sizes: string[];
  measurements: {
    name: string;
    values: string[];
  }[];
  modelInfo?: {
    height: string;
    wears: string;
  };
}

interface SizeChartProps {
  data: string; // JSON string from metafield
}

export default function SizeChart({ data }: SizeChartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  let chartData: SizeChartData;
  try {
    chartData = JSON.parse(data);
  } catch {
    return null;
  }

  useEffect(() => {
    if (!isOpen) return;

    lastActiveRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const modal = modalRef.current;
    if (modal) {
      const focusable = modal.querySelectorAll<HTMLElement>(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable[0] || modal).focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
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
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm underline hover:no-underline"
      >
        Size Guide
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div
            ref={modalRef}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-white z-50 overflow-auto max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-chart-title"
            tabIndex={-1}
          >
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 id="size-chart-title" className="text-lg font-medium">
                  Size Guide
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm hover:text-gray-500"
                >
                  Close
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="text-left py-2 px-2 font-medium">Size</th>
                      {chartData.sizes.map((size) => (
                        <th key={size} className="text-center py-2 px-2 font-medium">
                          {size}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.measurements.map((measurement) => (
                      <tr key={measurement.name} className="border-b border-gray-100">
                        <td className="py-2 px-2 text-gray-500">{measurement.name}</td>
                        {measurement.values.map((value, index) => (
                          <td key={index} className="text-center py-2 px-2">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Model info */}
              {chartData.modelInfo && (
                <p className="text-xs text-gray-500 mt-4">
                  Model is {chartData.modelInfo.height} and wears size {chartData.modelInfo.wears}
                </p>
              )}

              {/* Note */}
              <p className="text-xs text-gray-500 mt-2">
                All measurements are in centimeters. Sizes may vary by 1-2cm.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
