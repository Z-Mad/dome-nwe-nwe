// components/ApiKeysSection.tsx
import React from 'react'
import { Key, Plus, Network, Calendar, Trash2 } from 'lucide-react'
import type { ApiKey } from '../types/settings'

interface ApiKeysSectionProps {
  apiKeys: ApiKey[]
  isViewer: boolean
  onCreateKey: () => void
  onDeleteKey: (id: string) => void
}

export const ApiKeysSection: React.FC<ApiKeysSectionProps> = ({
  apiKeys,
  isViewer,
  onCreateKey,
  onDeleteKey,
}) => {
  const handleDelete = (id: string) => {
    if (confirm('确定要删除此API密钥吗？删除后使用该密钥的集成将立即失效。')) {
      onDeleteKey(id)
    }
  }

  return (
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
              onClick={onCreateKey}
              className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg"
            >
              <Plus size={16} /> 新建密钥
            </button>
          )}
        </div>

        <div className="space-y-3">
          {apiKeys.map(key => (
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
                    onClick={() => handleDelete(key.id)}
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
}