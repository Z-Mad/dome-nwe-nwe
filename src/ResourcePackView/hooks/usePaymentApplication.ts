// hooks/usePaymentApplication.ts
import { useState } from 'react'

export const usePaymentApplication = () => {
  const [showPaymentApplicationModal, setShowPaymentApplicationModal] = useState(false)
  return { showPaymentApplicationModal, setShowPaymentApplicationModal }
}