// SettingsView.tsx (主组件)
import React, { useState, useCallback } from 'react'
import { type Account } from '@/types'
import { useToast } from './hooks/useToast'
import { useProfile } from './hooks/useProfile'
import { useSecurity } from './hooks/useSecurity'
import { useNotifications } from './hooks/useNotifications'
import { useApiKeys } from './hooks/useApiKeys'
import { useApiKeyModal } from './hooks/useApiKeyModal'
import { ToastNotification } from './components/ToastNotification'
import { AccountSwitcherBanner } from './components/AccountSwitcherBanner'
import { SidebarNavigation } from './components/SidebarNavigation'
import { ProfileSection } from './components/ProfileSection'
import { SecuritySection } from './components/SecuritySection'
import { NotificationsSection } from './components/NotificationsSection'
import { ApiKeysSection } from './components/ApiKeysSection'
import { ApiKeyModal } from './components/ApiKeyModal'

interface SettingsViewProps {
  currentAccount: Account
  accounts: Account[]
  onSwitchAccount: (accountId: string) => void
}

const SettingsView: React.FC<SettingsViewProps> = ({
  currentAccount,
  accounts,
  onSwitchAccount,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'api_keys'>('profile')
  const { showToast, toastMsg, triggerToast } = useToast()
  const { profile, updateProfile, setProfile } = useProfile(currentAccount)
  const { securityState, toggleMfa } = useSecurity()
  const { notifications, toggleNotification } = useNotifications()
  const { apiKeys, addApiKey, deleteApiKey } = useApiKeys()
  const {
    showKeyModal,
    newKeyForm,
    generatedKey,
    openModal,
    closeModal,
    updateForm,
    setGenerated,
  } = useApiKeyModal()

  const isViewer = currentAccount.role === 'viewer'

  const handleSaveProfile = () => {
    triggerToast('个人资料已更新')
  }

  const handleToggleMfa = () => {
    toggleMfa()
    triggerToast(securityState.mfaEnabled ? 'MFA 二次验证已关闭 (不推荐)' : 'MFA 二次验证已开启')
  }

  const handleToggleNotification = (key: keyof typeof notifications) => {
    const changed = toggleNotification(key)
    if (!changed) {
      triggerToast('安全与交易类通知强制开启，无法关闭')
    }
  }

  const handleLockedToggleAttempt = () => {
    triggerToast('安全与交易类通知强制开启，无法关闭')
  }

  const generateApiKey = () => {
    if (!newKeyForm.name) return

    // Simulate Key Generation
    const uuid = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
    const prefix = newKeyForm.environment === 'production' ? 'sk-prod-' : 'sk-test-'
    const fullKey = `${prefix}${uuid}`

    setGenerated(fullKey)

    // Add to list (masked)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + parseInt(newKeyForm.expiryDays))

    const newKeyEntry = {
      id: `k_${Date.now()}`,
      name: newKeyForm.name,
      prefix: `${prefix}${uuid.substring(0, 4)}...`,
      environment: newKeyForm.environment,
      ipWhitelist: newKeyForm.ipWhitelist || 'Any',
      expiration: expiryDate.toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'active' as const,
    }

    addApiKey(newKeyEntry)
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    triggerToast('已复制到剪贴板')
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-6 md:p-8 relative">
      <ToastNotification show={showToast} message={toastMsg} />
      <ApiKeyModal
        show={showKeyModal}
        generatedKey={generatedKey}
        formData={newKeyForm}
        onClose={closeModal}
        onFormChange={updateForm}
        onGenerate={generateApiKey}
        onCopy={handleCopyKey}
      />

      <div className="max-w-5xl mx-auto pb-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">系统设置 (Settings)</h1>

        <AccountSwitcherBanner
          currentAccount={currentAccount}
          accounts={accounts}
          onSwitchAccount={onSwitchAccount}
          isViewer={isViewer}
        />

        <div className="flex flex-col md:flex-row gap-8">
          <SidebarNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showApiKeys={!isViewer}
          />

          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <ProfileSection
                currentAccount={currentAccount}
                profile={profile}
                onProfileChange={updateProfile}
                isViewer={isViewer}
                onSave={handleSaveProfile}
              />
            )}
            {activeTab === 'security' && (
              <SecuritySection
                securityState={securityState}
                onToggleMfa={handleToggleMfa}
              />
            )}
            {activeTab === 'notifications' && (
              <NotificationsSection
                notifications={notifications}
                onToggle={handleToggleNotification}
                isViewer={isViewer}
                onLockedToggleAttempt={handleLockedToggleAttempt}
              />
            )}
            {activeTab === 'api_keys' && !isViewer && (
              <ApiKeysSection
                apiKeys={apiKeys}
                isViewer={isViewer}
                onCreateKey={openModal}
                onDeleteKey={deleteApiKey}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsView