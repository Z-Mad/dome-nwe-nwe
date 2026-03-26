// components/AccountSwitcherBanner.tsx
import React from 'react'
import { Shield, AlertTriangle } from 'lucide-react'
import type { Account } from '@/types'

interface AccountSwitcherBannerProps {
  currentAccount: Account
  accounts: Account[]
  onSwitchAccount: (accountId: string) => void
  isViewer: boolean
}

export const AccountSwitcherBanner: React.FC<AccountSwitcherBannerProps> = ({
  currentAccount,
  accounts,
  onSwitchAccount,
  isViewer,
}) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 shadow-sm border border-indigo-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
          <Shield size={20} className="text-indigo-600" /> 当前身份: {currentAccount.name}
        </h2>
        <div className="flex gap-2 mt-2">
          {accounts.map(acc => (
            <button
              key={acc.id}
              onClick={() => onSwitchAccount(acc.id)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                currentAccount.id === acc.id
                  ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                  : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              {acc.name} ({acc.role})
            </button>
          ))}
        </div>
      </div>
      {isViewer && (
        <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-2 rounded-lg flex items-center gap-2 border border-yellow-200 font-bold">
          <AlertTriangle size={14} /> 访客模式：仅查看，无法修改关键配置
        </div>
      )}
    </div>
  )
}