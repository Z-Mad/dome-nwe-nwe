// components/RulesTabs.tsx
import React from 'react'
import type { RuleTab } from '../types/resourcePack'

interface RulesTabsProps {
  tabs: RuleTab[]
  activeId: string
  onTabChange: (id: string) => void
}

export const RulesTabs: React.FC<RulesTabsProps> = ({ tabs, activeId, onTabChange }) => {
  const activeContent = tabs.find(tab => tab.id === activeId)?.content

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-4 text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeId === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6 bg-gray-50/30 min-h-[160px]">
        {activeContent}
      </div>
    </div>
  )
}