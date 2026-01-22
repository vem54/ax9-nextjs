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
    <div className="border-t border-black mt-12 pt-10">
      {/* Tab headers */}
      <div className="flex flex-wrap gap-10 border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${
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
      <div className="product-richtext text-base text-gray-600 leading-relaxed max-w-prose">
        {activeIsHtml ? (
          <div dangerouslySetInnerHTML={{ __html: activeContent || '' }} />
        ) : (
          <p>{activeContent}</p>
        )}
      </div>
    </div>
  );
}
