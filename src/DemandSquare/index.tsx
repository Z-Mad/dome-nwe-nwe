// DemandSquare.tsx
import React from 'react'
import { useDemands } from './hooks/useDemands'
import { DemandHeader } from './components/DemandHeader'
import { SearchFilterBar } from './components/SearchFilterBar'
import { DemandList } from './components/DemandList'
import type { Demand } from './types/demand'

const DemandSquare: React.FC = () => {
  const {
    demands,
    searchKeyword,
    setSearchKeyword,
    budgetFilter,
    setBudgetFilter,
    statusFilter,
    setStatusFilter,
  } = useDemands()

  const handlePublish = () => {
    // 发布需求逻辑（可替换为实际功能）
    console.log('发布需求')
  }

  const handleProposal = (demand: Demand) => {
    // 投递方案逻辑（可替换为实际功能）
    console.log('投递方案', demand)
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-8">
      <div className="max-w-5xl mx-auto">
        <DemandHeader onPublishClick={handlePublish} />

        <SearchFilterBar
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          budgetFilter={budgetFilter}
          onBudgetFilterChange={setBudgetFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <DemandList demands={demands} onProposalClick={handleProposal} />
      </div>
    </div>
  )
}

export default DemandSquare