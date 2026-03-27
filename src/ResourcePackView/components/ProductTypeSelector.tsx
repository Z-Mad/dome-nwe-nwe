// components/ProductTypeSelector.tsx
import React from 'react'
import { CheckCircle, Info } from 'lucide-react'
import { CONFIG_OPTIONS } from '../constants/resourcePack.tsx'

interface ProductTypeSelectorProps {
  selectedType: 'token' | 'storage'
  onSelect: (type: 'token' | 'storage') => void
}

export const ProductTypeSelector: React.FC<ProductTypeSelectorProps> = ({ selectedType, onSelect }) => {
  const currentConfig = CONFIG_OPTIONS[selectedType]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4 text-base border-l-4 border-blue-600 pl-3">
        1. 产品类型 (Type)
      </h3>
      <div className="flex gap-4">
        {(Object.keys(CONFIG_OPTIONS) as Array<'token' | 'storage'>).map((type) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`flex-1 py-4 px-6 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
              selectedType === type
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-100 hover:border-gray-200 text-gray-600'
            }`}
          >
            <div className={`p-2 rounded-lg ${selectedType === type ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              {CONFIG_OPTIONS[type].icon}
            </div>
            <div className="text-left">
              <div className="font-bold text-sm">{CONFIG_OPTIONS[type].label}</div>
            </div>
            {selectedType === type && (
              <CheckCircle size={20} className="ml-auto text-blue-600 fill-blue-100" />
            )}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <Info size={14} className="mt-0.5 text-blue-500 flex-shrink-0" />
        {currentConfig.desc}
      </div>
    </div>
  )
}