// components/DurationQuantitySelector.tsx
import React from 'react'
import { Minus, Plus } from 'lucide-react'
import { DurationOption } from '../types/resourcePack'

interface DurationQuantitySelectorProps {
  durations: DurationOption[]
  selectedDurationIdx: number
  onDurationSelect: (idx: number) => void
  quantity: number
  onQuantityChange: (quantity: number) => void
}

export const DurationQuantitySelector: React.FC<DurationQuantitySelectorProps> = ({
  durations,
  selectedDurationIdx,
  onDurationSelect,
  quantity,
  onQuantityChange,
}) => {
  const increment = () => onQuantityChange(quantity + 1)
  const decrement = () => onQuantityChange(Math.max(1, quantity - 1))

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4 text-base border-l-4 border-blue-600 pl-3">
        3. 有效期与数量 (Duration & Quantity)
      </h3>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-500 mb-2">选择有效期</label>
          <div className="flex gap-4">
            {durations.map((dur, idx) => (
              <button
                key={idx}
                onClick={() => onDurationSelect(idx)}
                className={`relative py-3 px-6 rounded-xl border transition-all flex-1 ${
                  selectedDurationIdx === idx
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {dur.label}
                {dur.tag && (
                  <span className="absolute -top-2 right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm">
                    {dur.tag}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-500 mb-2">购买数量 (个)</label>
          <div className="flex items-center gap-3">
            <button
              onClick={decrement}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
            >
              <Minus size={16} className="text-gray-600" />
            </button>
            <div className="w-16 text-center font-mono font-bold text-lg text-gray-900 bg-gray-50 py-1.5 rounded-lg border border-gray-100">
              {quantity}
            </div>
            <button
              onClick={increment}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}