import { type Account } from '@/types'
import {
  AlertTriangle,
  Bell,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  Copy,
  Key,
  Lock,
  Network,
  Plus,
  Shield,
  ShieldCheck,
  Smartphone,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react'
import React, { useState } from 'react'

interface SettingsViewProps {
  currentAccount: Account
  accounts: Account[]
  onSwitchAccount: (accountId: string) => void
}

interface ApiKey {
  id: string
  name: string
  prefix: string
  environment: 'production' | 'sandbox'
  ipWhitelist: string // Comma separated for display
  expiration: string
  lastUsed: string
  status: 'active' | 'expired'
}

const SettingsView: React.FC<SettingsViewProps> = ({
  currentAccount,
  accounts,
  onSwitchAccount,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'api_keys'>(
    'profile',
  )
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  // --- Profile State ---
  const [profile, setProfile] = useState({
    nickname: currentAccount.name,
    email: 'engineer@baosight.com',
    phone: '138****8888',
    orgName: currentAccount.orgName,
    isVerified: true,
  })

  // --- Security State ---
  const [securityState, setSecurityState] = useState({
    mfaEnabled: true,
    lastPasswordChange: '2025-03-12',
  })

  // --- Notification State ---
  // Security & Transactional are locked (cannot be disabled)
  const [notifications, setNotifications] = useState({
    marketing: false,
    productUpdate: true,
    security: true, // Locked
    transactional: true, // Locked
  })

  // --- API Key State ---
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 'k1',
      name: 'ERP Integration',
      prefix: 'sk-prod-7f8a...',
      environment: 'production',
      ipWhitelist: '10.20.1.5',
      expiration: '2025-12-31',
      lastUsed: '2 mins ago',
      status: 'active',
    },
    {
      id: 'k2',
      name: 'Dev Sandbox',
      prefix: 'sk-test-9b2c...',
      environment: 'sandbox',
      ipWhitelist: 'Any',
      expiration: '2025-06-30',
      lastUsed: '1 day ago',
      status: 'active',
    },
  ])

  // API Key Creation Modal State
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [newKeyForm, setNewKeyForm] = useState({
    name: '',
    environment: 'sandbox' as 'production' | 'sandbox',
    ipWhitelist: '',
    expiryDays: '90', // Default 90 days rotation
  })
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)

  const isViewer = currentAccount.role === 'viewer'

  // --- Handlers ---

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSaveProfile = () => {
    triggerToast('个人资料已更新')
  }

  const handleToggleMfa = () => {
    setSecurityState((prev) => ({ ...prev, mfaEnabled: !prev.mfaEnabled }))
    triggerToast(securityState.mfaEnabled ? 'MFA 二次验证已关闭 (不推荐)' : 'MFA 二次验证已开启')
  }

  const handleToggleNotification = (key: keyof typeof notifications) => {
    if (key === 'security' || key === 'transactional') {
      triggerToast('安全与交易类通知强制开启，无法关闭')
      return
    }
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // API Key Logic
  const openCreateKeyModal = () => {
    setNewKeyForm({ name: '', environment: 'sandbox', ipWhitelist: '', expiryDays: '90' })
    setGeneratedKey(null)
    setShowKeyModal(true)
  }

  const generateApiKey = () => {
    if (!newKeyForm.name) return

    // Simulate Key Generation
    const uuid =
      Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
    const prefix = newKeyForm.environment === 'production' ? 'sk-prod-' : 'sk-test-'
    const fullKey = `${prefix}${uuid}`

    setGeneratedKey(fullKey) // Show to user once

    // Add to list (masked)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + parseInt(newKeyForm.expiryDays))

    const newKeyEntry: ApiKey = {
      id: `k_${Date.now()}`,
      name: newKeyForm.name,
      prefix: `${prefix}${uuid.substring(0, 4)}...`,
      environment: newKeyForm.environment,
      ipWhitelist: newKeyForm.ipWhitelist || 'Any',
      expiration: expiryDate.toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'active',
    }

    setApiKeys([newKeyEntry, ...apiKeys])
  }

  const handleDeleteKey = (id: string) => {
    if (confirm('确定要删除此API密钥吗？删除后使用该密钥的集成将立即失效。')) {
      setApiKeys(apiKeys.filter((k) => k.id !== id))
      triggerToast('API密钥已删除')
    }
  }

  // --- Render Sections ---

  const renderProfile = () => (
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
                  onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
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
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
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
            onClick={handleSaveProfile}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Check size={18} /> 保存修改
          </button>
        </div>
      )}
    </div>
  )

  const renderSecurity = () => (
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
                onChange={handleToggleMfa}
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

  const renderNotifications = () => (
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
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
            >
              <div>
                <div className="text-sm font-bold text-gray-800">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </div>
              <button
                onClick={() => handleToggleNotification(item.key as keyof typeof notifications)}
                disabled={isViewer}
                className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                  notifications[item.key as keyof typeof notifications]
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                } ${isViewer ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform duration-200 ${
                    notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'
                  }`}
                ></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderApiKeys = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Key size={20} className="text-gray-400" /> API 密钥管理
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              用于在第三方应用中调用您的智能体服务。请妥善保管 Secret Key。
            </p>
          </div>
          {!isViewer && (
            <button
              onClick={openCreateKeyModal}
              className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg"
            >
              <Plus size={16} /> 新建密钥
            </button>
          )}
        </div>

        <div className="space-y-3">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-800 text-sm">{key.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold ${
                      key.environment === 'production'
                        ? 'bg-orange-50 text-orange-600 border-orange-100'
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}
                  >
                    {key.environment === 'production' ? 'Prod' : 'Sandbox'}
                  </span>
                  {key.status === 'active' ? (
                    <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                      Expired
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="font-mono bg-gray-100 px-1.5 rounded">
                    {key.prefix}****************
                  </div>
                  <div className="flex items-center gap-1" title="IP Whitelist">
                    <Network size={12} /> {key.ipWhitelist}
                  </div>
                </div>
              </div>
              <div className="text-right flex items-center gap-6">
                <div className="hidden sm:block text-right">
                  <div className="text-xs text-gray-400 mb-0.5 flex items-center gap-1 justify-end">
                    <Calendar size={12} /> 有效期至 {key.expiration}
                  </div>
                  <div className="text-xs text-gray-400">最后使用: {key.lastUsed}</div>
                </div>
                {!isViewer && (
                  <button
                    onClick={() => handleDeleteKey(key.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // --- Modal Renderer ---

  const renderKeyCreationModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900">新建 API 密钥</h3>
          <button onClick={() => setShowKeyModal(false)}>
            <X size={20} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {!generatedKey ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                  密钥名称 (Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. My App Integration"
                  value={newKeyForm.name}
                  onChange={(e) => setNewKeyForm({ ...newKeyForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">
                    环境 (Environment)
                  </label>
                  <select
                    value={newKeyForm.environment}
                    onChange={(e) =>
                      setNewKeyForm({ ...newKeyForm, environment: e.target.value as any })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="sandbox">Sandbox (Test)</option>
                    <option value="production">Production</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">
                    有效期 (Expiration)
                  </label>
                  <select
                    value={newKeyForm.expiryDays}
                    onChange={(e) => setNewKeyForm({ ...newKeyForm, expiryDays: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="30">30 天 (自动轮换)</option>
                    <option value="90">90 天 (推荐)</option>
                    <option value="365">1 年</option>
                    <option value="0">永不过期 (不推荐)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                  IP 白名单 (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.1, 10.0.0.0/24 (留空允许所有IP)"
                  value={newKeyForm.ipWhitelist}
                  onChange={(e) => setNewKeyForm({ ...newKeyForm, ipWhitelist: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  为了安全起见，建议仅允许可信服务器的 IP 地址访问生产环境 Key。
                </p>
              </div>

              <button
                onClick={generateApiKey}
                disabled={!newKeyForm.name}
                className={`w-full py-2.5 rounded-xl font-bold mt-4 transition-colors ${!newKeyForm.name ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`}
              >
                生成密钥
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600">
                  <Check size={24} />
                </div>
                <h4 className="font-bold text-green-800">密钥生成成功</h4>
                <p className="text-xs text-green-700 mt-1">
                  请立即复制并保存，离开此页面后将无法再次查看。
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">API Key</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-800 break-all">
                    {generatedKey}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedKey)
                      triggerToast('已复制到剪贴板')
                    }}
                    className="bg-white border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600 px-3 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowKeyModal(false)}
                className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-bold hover:bg-black transition-colors"
              >
                我已保存，关闭窗口
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-6 md:p-8 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-[70] animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={16} className="text-green-400" />
          <span className="text-sm font-bold">{toastMsg}</span>
        </div>
      )}

      {/* API Key Modal */}
      {showKeyModal && renderKeyCreationModal()}

      <div className="max-w-5xl mx-auto pb-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">系统设置 (Settings)</h1>

        {/* Account Switcher Banner */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 shadow-sm border border-indigo-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
              <Shield size={20} className="text-indigo-600" /> 当前身份: {currentAccount.name}
            </h2>
            <div className="flex gap-2 mt-2">
              {accounts.map((acc) => (
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

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-2 sticky top-6 self-start">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                activeTab === 'profile'
                  ? 'bg-white shadow-sm text-blue-600 border border-blue-100'
                  : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
              }`}
            >
              <User size={18} /> 个人资料
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                activeTab === 'security'
                  ? 'bg-white shadow-sm text-blue-600 border border-blue-100'
                  : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
              }`}
            >
              <Lock size={18} /> 账号安全
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                activeTab === 'notifications'
                  ? 'bg-white shadow-sm text-blue-600 border border-blue-100'
                  : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
              }`}
            >
              <Bell size={18} /> 通知偏好
            </button>

            {/* API Keys - Hidden for Viewers */}
            {!isViewer && (
              <button
                onClick={() => setActiveTab('api_keys')}
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

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'security' && renderSecurity()}
            {activeTab === 'notifications' && renderNotifications()}
            {activeTab === 'api_keys' && !isViewer && renderApiKeys()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsView
