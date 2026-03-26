// components/SearchFilterBar.tsx
import React from 'react'
import { Search } from 'lucide-react'

interface SearchFilterBarProps {
  searchKeyword: string
  onSearchChange: (value: string) => void
  budgetFilter: string
  onBudgetFilterChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchKeyword,
  onSearchChange,
  budgetFilter,
  onBudgetFilterChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="搜索需求关键词，如：视觉模型、PLC、轧辊..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500"
          value={searchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        <select
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none"
          value={budgetFilter}
          onChange={(e) => onBudgetFilterChange(e.target.value)}
        >
          <option>所有预算</option>
          <option>¥10w以下</option>
          <option>¥10w - 50w</option>
          <option>¥50w以上</option>
        </select>
        <select
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option>所有状态</option>
          <option>急需</option>
          <option>招标中</option>
        </select>
      </div>
    </div>
  )
}