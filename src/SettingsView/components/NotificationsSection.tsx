// components/NotificationsSection.tsx
import React from 'react'
import { Bell, Lock, CheckCircle } from 'lucide-react'
import type { NotificationsData } from '../types/settings'

interface NotificationsSectionProps {
  notifications: NotificationsData
  onToggle: (key: keyof NotificationsData) => void
  isViewer: boolean
  onLockedToggleAttempt: () => void
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  notifications,
  onToggle,
  isViewer,
  onLockedToggleAttempt,
}) => {
  const handleToggle = (key: keyof NotificationsData) => {
    if (isViewer) return
    if (key === 'security' || key === 'transactional') {
      onLockedToggleAttempt()
      return
    }
    onToggle(key)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Bell size={20} className="text-gray-400" /> 通知偏好 (Preferences)
        </h2>

        <div className="space-y-1">
          {/* Mandatory Notifications */}
          <div className="flex items-center justify-between py-4 border-b border-gray-50 opacity-70">
            <div>
              <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
                账户与安全 (Security) <Lock size={12} className="text-gray-400" />
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                异地登录、密码修改、API Key 操作等安全通知
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <CheckCircle size={14} className="text-gray-400" /> 已锁定开启
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-50 opacity-70">
            <div>
              <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
                交易与账单 (Transactional) <Lock size={12} className="text-gray-400" />
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                订单支付、退款进度、余额预警、发票开具通知
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <CheckCircle size={14} className="text-gray-400" /> 已锁定开启
            </div>
          </div>

          {/* Optional Notifications */}
          {[
            {
              key: 'marketing',
              label: '营销推广 (Marketing)',
              desc: '接收最新的产品活动、优惠券发放及行业动态',
            },
            {
              key: 'productUpdate',
              label: '产品更新 (Updates)',
              desc: '关注的智能体版本更新、新功能上线提醒',
            },
          ].map(item => (
            <div
              key={item.key}
              className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
            >
              <div>
                <div className="text-sm font-bold text-gray-800">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </div>
              <button
                onClick={() => handleToggle(item.key as keyof NotificationsData)}
                disabled={isViewer}
                className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                  notifications[item.key as keyof NotificationsData] ? 'bg-blue-600' : 'bg-gray-200'
                } ${isViewer ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform duration-200 ${
                    notifications[item.key as keyof NotificationsData] ? 'left-7' : 'left-1'
                  }`}
                ></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}