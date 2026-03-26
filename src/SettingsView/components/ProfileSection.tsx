// components/ProfileSection.tsx
import React from 'react'
import { User, Building2, Camera, CheckCircle, Upload, ShieldCheck, Check } from 'lucide-react'
import type { Account } from '@/types'
import type { ProfileData } from '../types/settings'

interface ProfileSectionProps {
  currentAccount: Account
  profile: ProfileData
  onProfileChange: (updates: Partial<ProfileData>) => void
  isViewer: boolean
  onSave: () => void
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  currentAccount,
  profile,
  onProfileChange,
  isViewer,
  onSave,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <User size={20} className="text-gray-400" /> 基本资料 (Profile)
        </h2>

        <div className="flex items-start gap-6 mb-8">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden ring-4 ring-gray-50 border border-gray-200">
              <img
                src={currentAccount.avatar}
                className="w-full h-full rounded-full object-cover"
                alt="avatar"
              />
            </div>
            {!isViewer && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={20} className="text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                  昵称 / Display Name
                </label>
                <input
                  type="text"
                  value={profile.nickname}
                  onChange={e => onProfileChange({ nickname: e.target.value })}
                  disabled={isViewer}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none bg-gray-50/50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                  绑定邮箱 / Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile.email}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-2 text-green-600 text-xs font-bold flex items-center gap-1">
                    <CheckCircle size={12} /> 已验证
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                  联系电话 / Phone
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={e => onProfileChange({ phone: e.target.value })}
                  disabled={isViewer}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none bg-gray-50/50 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Verification */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Building2 size={20} className="text-gray-400" /> 企业认证 (Enterprise Verification)
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">企业名称</label>
              <input
                type="text"
                value={profile.orgName}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">
                统一社会信用代码
              </label>
              <input
                type="text"
                value="91310000132200821H"
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 font-mono"
              />
            </div>
          </div>

          <div className="w-full md:w-64">
            <label className="block text-xs font-bold text-gray-500 mb-2">营业执照</label>
            <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 relative overflow-hidden group">
              {profile.isVerified ? (
                <>
                  <div className="absolute inset-0 bg-green-50/50 flex items-center justify-center">
                    <div className="text-center">
                      <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                      <span className="text-xs font-bold text-green-700">已认证</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 w-full bg-white/80 py-1 text-[10px] text-center text-gray-500 cursor-pointer hover:text-blue-600">
                    查看原件
                  </div>
                </>
              ) : (
                <>
                  <Upload size={24} className="mb-2" />
                  <span className="text-xs">点击上传</span>
                </>
              )}
            </div>
          </div>
        </div>

        {profile.isVerified && (
          <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-3 flex gap-2 items-start">
            <ShieldCheck size={16} className="text-green-600 mt-0.5" />
            <div className="text-xs text-green-800">
              <span className="font-bold">认证状态：有效</span>
              <p className="mt-0.5 opacity-80">
                企业认证信息已通过平台审核，享有增值税专票开具及大额支付权限。
              </p>
            </div>
          </div>
        )}
      </div>

      {!isViewer && (
        <div className="flex justify-end">
          <button
            onClick={onSave}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Check size={18} /> 保存修改
          </button>
        </div>
      )}
    </div>
  )
}