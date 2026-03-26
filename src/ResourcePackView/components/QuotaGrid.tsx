// components/QuotaGrid.tsx
import React from 'react'
import { CheckCircle } from 'lucide-react'
import { QuotaOption } from '../types/resourcePack'

interface QuotaGridProps {
  quotas: QuotaOption[]
  selectedIdx: number
  onSelect: (idx: number) => void
}

export const QuotaGrid: React.FC<QuotaGridProps> = ({ quotas, selectedIdx, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4 text-base border-l-4 border-blue-600 pl-3">
        2. 资源规格 (Specification)
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quotas.map((quota, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`relative py-3 px-4 rounded-xl border transition-all text-left group ${
              selectedIdx === idx
                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {quota.tag && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm z-10">
                {quota.tag}
              </span>
            )}
            <div className={`text-sm font-bold mb-1 ${selectedIdx === idx ? 'text-blue-700' : 'text-gray-800'}`}>
              {quota.label}
            </div>
            <div className="text-xs text-gray-400 group-hover:text-gray-500">
              基准价: ¥{quota.price}
            </div>
            {selectedIdx === idx && (
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px] border-b-blue-600 rounded-br-xl">
                <CheckCircle size={10} className="text-white absolute right-[-17px] bottom-[-17px]" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}