import { useState, useEffect, useCallback } from 'react'
import { chatService } from '@/services/chat'
import type { IContact } from '../types'
import { convertSessionToContact } from '../utils'

const CURRENT_USER_ID = localStorage.getItem('market_userId')

export const useContacts = (initialActiveChatId?: string) => {
  const [contacts, setContacts] = useState<IContact[]>([])
  const [activeChatId, setActiveChatId] = useState<string>(initialActiveChatId || '')
  const [loading, setLoading] = useState(false)

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true)
      const res = await chatService.getSessionList(1, 100)
      if (res.data?.records) {
        const mappedContacts = res.data.records.map(convertSessionToContact)
        setContacts(mappedContacts)
        if (!activeChatId && mappedContacts.length > 0) {
          setActiveChatId(mappedContacts[0].id)
        }
      }
    } catch (error) {
      console.error('获取会话列表失败', error)
    } finally {
      setLoading(false)
    }
  }, [activeChatId])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const getContactById = useCallback((id: string) => {
    return contacts.find((c) => c.id === id)
  }, [contacts])

  return {
    contacts,
    activeChatId,
    setActiveChatId,
    loading,
    fetchSessions,
    getContactById,
  }
}