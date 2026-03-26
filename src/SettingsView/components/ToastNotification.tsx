// components/ToastNotification.tsx
import React from 'react'
import { CheckCircle } from 'lucide-react'

interface ToastNotificationProps {
  show: boolean
  message: string
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ show, message }) => {
  if (!show) return null

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-[70] animate-in fade-in slide-in-from-top-2">
      <CheckCircle size={16} className="text-green-400" />
      <span className="text-sm font-bold">{message}</span>
    </div>
  )
}