// components/SecuritySection.tsx
import React from 'react'
import { Lock, Smartphone } from 'lucide-react'
import type { SecurityData } from '@/types/settings'

interface SecuritySectionProps {
  securityState: SecurityData
  onToggleMfa: () => void
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({ securityState, onToggleMfa }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Lock size={20} className="text-gray-400" /> 安全设置 (Security)
        </h2>

        <div className="space-y-6 divide-y divide-gray-50">
          {/* Password */}
          <div className="flex justify-between items-center py-2">
            <div>
              <div className="text-sm font-bold text-gray-800 mb-1">登录密码</div>
              <div className="text-xs text-gray-500">
                上次修改时间：
                <span className="font-mono text-gray-700">{securityState.lastPasswordChange}</span>
              </div>
            </div>
            <button className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 font-bold text-gray-600">
              修改密码
            </button>
          </div>

          {/* MFA */}
          <div className="flex justify-between items-center py-4">
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 p-1.5 rounded-lg ${securityState.mfaEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
              >
                <Smartphone size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800 mb-1">MFA 多因素认证</div>
                <div className="text-xs text-gray-500 max-w-sm leading-relaxed">
                  在进行敏感操作（如提现、删除API Key）时，强制要求输入手机或验证器动态口令。
                </div>
              </div>
            </div>
            <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                name="mfa"
                id="mfa-toggle"
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-500 right-6"
                checked={securityState.mfaEnabled}
                onChange={onToggleMfa}
              />
              <label
                htmlFor="mfa-toggle"
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${securityState.mfaEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
              ></label>
            </div>
          </div>

          {/* Login History (Mock) */}
          <div className="py-4">
            <div className="text-sm font-bold text-gray-800 mb-3">最近登录记录</div>
            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="text-gray-500 bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 font-medium">时间</th>
                    <th className="px-4 py-2 font-medium">设备/浏览器</th>
                    <th className="px-4 py-2 font-medium">IP 地址</th>
                    <th className="px-4 py-2 font-medium">地点</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-2 text-gray-700">2025-04-18 09:30:12</td>
                    <td className="px-4 py-2 text-gray-600">Chrome (Windows)</td>
                    <td className="px-4 py-2 font-mono text-gray-500">180.169.x.x</td>
                    <td className="px-4 py-2 text-gray-600">上海市</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-700">2025-04-17 14:22:05</td>
                    <td className="px-4 py-2 text-gray-600">Safari (iPhone)</td>
                    <td className="px-4 py-2 font-mono text-gray-500">223.104.x.x</td>
                    <td className="px-4 py-2 text-gray-600">上海市</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}