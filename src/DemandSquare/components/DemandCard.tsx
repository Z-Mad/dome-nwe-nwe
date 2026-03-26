// components/DemandCard.tsx
import React from 'react'
import { ArrowRight, Briefcase, DollarSign, Clock, MapPin, Tag } from 'lucide-react'
import  type { Demand } from '../types/demand'

interface DemandCardProps {
  demand: Demand
  onProposalClick?: (demand: Demand) => void
}

export const DemandCard: React.FC<DemandCardProps> = ({ demand, onProposalClick }) => {
  const { title, enterprise, budget, location, deadline, tags, desc, status } = demand

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
      {status === 'urgent' && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-bl-xl font-bold">
          急需
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded flex items-center gap-1">
              <Briefcase size={12} /> {enterprise}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 flex items-center gap-1"
              >
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="md:w-60 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
          <div>
            <div className="flex items-center gap-2 text-green-600 font-bold text-lg mb-1">
              <DollarSign size={18} />
              {budget}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Clock size={12} />
              {deadline}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <MapPin size={12} />
              {location}
            </div>
          </div>
          <button
            onClick={() => onProposalClick?.(demand)}
            className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            投递方案 <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}