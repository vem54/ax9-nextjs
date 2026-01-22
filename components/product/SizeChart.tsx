'use client';

import { useState } from 'react';

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

  let chartData: SizeChartData;
  try {
    chartData = JSON.parse(data);
  } catch {
    return null;
  }

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
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-white z-50 overflow-auto max-h-[90vh]">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Size Guide</h3>
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
