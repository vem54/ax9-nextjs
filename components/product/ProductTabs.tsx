'use client';

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: string;
  isHtml?: boolean;
}

interface ProductTabsProps {
  description?: string;
  materials?: string;
  careInstructions?: string;
}

export default function ProductTabs({
  description,
  materials,
  careInstructions,
}: ProductTabsProps) {
  const tabs: Tab[] = [];

  if (description) {
    tabs.push({
      id: 'description',
      label: 'Description',
      content: description,
      isHtml: true,
    });
  }
  if (materials) {
    tabs.push({ id: 'materials', label: 'Materials', content: materials });
  }
  if (careInstructions) {
    tabs.push({ id: 'care', label: 'Care', content: careInstructions });
  }

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  if (tabs.length === 0) return null;

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;
  const activeIsHtml = tabs.find((tab) => tab.id === activeTab)?.isHtml;

  return (
    <div className="border-t border-black mt-8 pt-8">
      {/* Tab headers */}
      <div className="flex flex-wrap gap-8 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-sans text-xs font-medium uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-black text-black'
                : 'text-gray-400 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="product-richtext text-sm text-gray-600 leading-relaxed">
        {activeIsHtml ? (
          <div dangerouslySetInnerHTML={{ __html: activeContent || '' }} />
        ) : (
          activeContent
        )}
      </div>
    </div>
  );
}
