// hooks/useApiKeys.ts
import { useState } from 'react'
import type { ApiKey } from '../types/settings'

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 'k1',
      name: 'ERP Integration',
      prefix: 'sk-prod-7f8a...',
      environment: 'production',
      ipWhitelist: '10.20.1.5',
      expiration: '2025-12-31',
      lastUsed: '2 mins ago',
      status: 'active',
    },
    {
      id: 'k2',
      name: 'Dev Sandbox',
      prefix: 'sk-test-9b2c...',
      environment: 'sandbox',
      ipWhitelist: 'Any',
      expiration: '2025-06-30',
      lastUsed: '1 day ago',
      status: 'active',
    },
  ])

  const addApiKey = (newKey: ApiKey) => {
    setApiKeys(prev => [newKey, ...prev])
  }

  const deleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id))
  }

  return { apiKeys, addApiKey, deleteApiKey }
}