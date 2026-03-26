// hooks/useApiKeyModal.ts
import { useState } from 'react'

interface NewKeyForm {
  name: string
  environment: 'production' | 'sandbox'
  ipWhitelist: string
  expiryDays: string
}

export const useApiKeyModal = () => {
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [newKeyForm, setNewKeyForm] = useState<NewKeyForm>({
    name: '',
    environment: 'sandbox',
    ipWhitelist: '',
    expiryDays: '90',
  })
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)

  const openModal = () => {
    setNewKeyForm({ name: '', environment: 'sandbox', ipWhitelist: '', expiryDays: '90' })
    setGeneratedKey(null)
    setShowKeyModal(true)
  }

  const closeModal = () => {
    setShowKeyModal(false)
  }

  const updateForm = (updates: Partial<NewKeyForm>) => {
    setNewKeyForm(prev => ({ ...prev, ...updates }))
  }

  const setGenerated = (key: string) => {
    setGeneratedKey(key)
  }

  return {
    showKeyModal,
    newKeyForm,
    generatedKey,
    openModal,
    closeModal,
    updateForm,
    setGenerated,
  }
}