// components/DemandList.tsx
import React from 'react'
import type { Demand } from '../types/demand'
import { DemandCard } from './DemandCard'

interface DemandListProps {
  demands: Demand[]
  onProposalClick?: (demand: Demand) => void
}

export const DemandList: React.FC<DemandListProps> = ({ demands, onProposalClick }) => {
  return (
    <div className="space-y-4">
      {demands.map((demand) => (
        <DemandCard key={demand.id} demand={demand} onProposalClick={onProposalClick} />
      ))}
    </div>
  )
}