// components/ApiKeyModal.tsx
import React from 'react'
import { X, Check, Copy } from 'lucide-react'

interface NewKeyForm {
  name: string
  environment: 'production' | 'sandbox'
  ipWhitelist: string
  expiryDays: string
}

interface ApiKeyModalProps {
  show: boolean
  generatedKey: string | null
  formData: NewKeyForm
  onClose: () => void
  onFormChange: (updates: Partial<NewKeyForm>) => void
  onGenerate: () => void
  onCopy: (key: string) => void
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  show,
  generatedKey,
  formData,
  onClose,
  onFormChange,
  onGenerate,
  onCopy,
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900">新建 API 密钥</h3>
          <button onClick={onClose}>
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
                  value={formData.name}
                  onChange={e => onFormChange({ name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">
                    环境 (Environment)
                  </label>
                  <select
                    value={formData.environment}
                    onChange={e => onFormChange({ environment: e.target.value as any })}
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
                    value={formData.expiryDays}
                    onChange={e => onFormChange({ expiryDays: e.target.value })}
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
                  value={formData.ipWhitelist}
                  onChange={e => onFormChange({ ipWhitelist: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  为了安全起见，建议仅允许可信服务器的 IP 地址访问生产环境 Key。
                </p>
              </div>

              <button
                onClick={onGenerate}
                disabled={!formData.name}
                className={`w-full py-2.5 rounded-xl font-bold mt-4 transition-colors ${!formData.name ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`}
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
                    onClick={() => onCopy(generatedKey)}
                    className="bg-white border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600 px-3 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
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
}