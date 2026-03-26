// components/DemandHeader.tsx
import React from 'react'
import { Plus } from 'lucide-react'

interface DemandHeaderProps {
  onPublishClick?: () => void
}

export const DemandHeader: React.FC<DemandHeaderProps> = ({ onPublishClick }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">需求广场 (Demand Square)</h1>
        <p className="text-gray-500 mt-2">
          连接钢企真实痛点与开发者解决方案，总需求金额超{' '}
          <span className="text-blue-600 font-bold">¥1.2亿</span>
        </p>
      </div>
      <button
        onClick={onPublishClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-colors"
      >
        <Plus size={18} />
        发布需求
      </button>
    </div>
  )
}