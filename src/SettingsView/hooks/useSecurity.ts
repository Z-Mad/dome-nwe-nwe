// hooks/useSecurity.ts
import { useState } from 'react'
import type { SecurityData } from '../types/settings'

export const useSecurity = () => {
  const [securityState, setSecurityState] = useState<SecurityData>({
    mfaEnabled: true,
    lastPasswordChange: '2025-03-12',
  })

  const toggleMfa = () => {
    setSecurityState(prev => ({ ...prev, mfaEnabled: !prev.mfaEnabled }))
  }

  return { securityState, toggleMfa }
}