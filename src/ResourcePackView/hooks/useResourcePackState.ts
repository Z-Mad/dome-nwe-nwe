// hooks/useResourcePackState.ts
import { useState } from 'react'

export const useResourcePackState = () => {
  const [selectedType, setSelectedType] = useState<'token' | 'storage'>('token')
  const [selectedQuotaIdx, setSelectedQuotaIdx] = useState(1)
  const [selectedDurationIdx, setSelectedDurationIdx] = useState(0)
  const [purchaseQuantity, setPurchaseQuantity] = useState(1)
  const [activeRuleTab, setActiveRuleTab] = useState('deduction')

  return {
    selectedType,
    setSelectedType,
    selectedQuotaIdx,
    setSelectedQuotaIdx,
    selectedDurationIdx,
    setSelectedDurationIdx,
    purchaseQuantity,
    setPurchaseQuantity,
    activeRuleTab,
    setActiveRuleTab,
  }
}