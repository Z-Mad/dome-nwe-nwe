// components/ResourcePackHeader.tsx
import React from 'react'
import { Package } from 'lucide-react'

export const ResourcePackHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-10 text-white mb-8 relative overflow-hidden shadow-lg">
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-3">资源包中心</h1>
        <p className="text-blue-200 max-w-2xl text-sm leading-relaxed">
          为您的智能体实例灵活补充算力与存储。即买即用，自动挂载，支持跨周期抵扣。
        </p>
      </div>
      <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform origin-bottom-right"></div>
      <Package className="absolute right-20 bottom-[-20px] text-white/10 w-64 h-64 rotate-12" />
    </div>
  )
}