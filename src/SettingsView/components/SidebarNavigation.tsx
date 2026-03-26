// components/SidebarNavigation.tsx
import React from 'react'
import { User, Lock, Bell, Key } from 'lucide-react'

type TabType = 'profile' | 'security' | 'notifications' | 'api_keys'

interface SidebarNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  showApiKeys: boolean
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  onTabChange,
  showApiKeys,
}) => {
  return (
    <div className="w-full md:w-64 flex-shrink-0 space-y-2 sticky top-6 self-start">
      <button
        onClick={() => onTabChange('profile')}
        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
          activeTab === 'profile'
            ? 'bg-white shadow-sm text-blue-600 border border-blue-100'
            : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
        }`}
      >
        <User size={18} /> 个人资料
      </button>
      <button
        onClick={() => onTabChange('security')}
        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
          activeTab === 'security'
            ? 'bg-white shadow-sm text-blue-600 border border-blue-100'
            : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
        }`}
      >
        <Lock size={18} /> 账号安全
      </button>
      <button
        onClick={() => onTabChange('notifications')}
        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
          activeTab === 'notifications'
            ? 'bg-white shadow-sm text-blue-600 border border-blue-100'
            : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
        }`}
      >
        <Bell size={18} /> 通知偏好
      </button>
      {showApiKeys && (
        <button
          onClick={() => onTabChange('api_keys')}
          className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
            activeTab === 'api_keys'
              ? 'bg-white shadow-sm text-blue-600 border border-blue-100'
              : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
          }`}
        >
          <Key size={18} /> API 密钥
        </button>
      )}
    </div>
  )
}