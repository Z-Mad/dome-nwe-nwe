// hooks/useNotifications.ts
import { useState } from 'react'
import type { NotificationsData } from '../types/settings'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationsData>({
    marketing: false,
    productUpdate: true,
    security: true,
    transactional: true,
  })

  const toggleNotification = (key: keyof NotificationsData) => {
    if (key === 'security' || key === 'transactional') {
      return false // 不允许修改，返回 false 表示未变更
    }
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    return true
  }

  return { notifications, toggleNotification }
}