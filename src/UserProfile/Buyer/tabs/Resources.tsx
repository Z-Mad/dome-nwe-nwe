import { Box, Cpu, Database, ExternalLink, Heart, PlusCircle, Zap } from 'lucide-react'
import React, { useState } from 'react'
import { useUserProfile } from '../../Core/useUserProfileStore'

const BuyerResources: React.FC = () => {
  const { localResources, onUpdateResource, onNavigate } = useUserProfile()
  const [resourceSubTab, setResourceSubTab] = useState<'purchased' | 'favorites'>('purchased')
  const [activatingInstanceId, setActivatingInstanceId] = useState<string | null>(null)
  const [activatingInstanceName, setActivatingInstanceName] = useState('')

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex gap-4 border-b border-gray-100">
        <button
          onClick={() => setResourceSubTab('purchased')}
          className={`pb-3 font-bold text-sm transition-colors relative ${
            resourceSubTab === 'purchased' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          已购资产
          {resourceSubTab === 'purchased' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setResourceSubTab('favorites')}
          className={`pb-3 font-bold text-sm transition-colors relative ${
            resourceSubTab === 'favorites' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          收藏资产
          {resourceSubTab === 'favorites' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
          )}
        </button>
      </div>

      {resourceSubTab === 'purchased' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {localResources
            .filter((r) => r.status !== 'favorite')
            .map((resource) => {
              const tokenUsagePercent = resource.usage.token
                ? (resource.usage.token / resource.usage.tokenLimit!) * 100
                : 0
              const storageUsagePercent = resource.usage.storage
                ? (resource.usage.storage / resource.usage.storageLimit!) * 100
                : 0

              return (
                <div
                  key={resource.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col min-h-[300px]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Box size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{resource.name}</h4>
                        <div className="text-xs text-gray-500 mt-0.5 font-mono">
                          {resource.instanceName || '未命名实例'}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-1 rounded font-bold ${
                        resource.status === 'Running'
                          ? 'bg-green-50 text-green-600'
                          : resource.status === 'Stopped'
                            ? 'bg-red-50 text-red-600'
                            : resource.status === 'Trial'
                              ? 'bg-purple-50 text-purple-600'
                              : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {resource.status === 'Running' && '运行中'}
                      {resource.status === 'Stopped' && '已停机'}
                      {resource.status === 'Trial' && '试用中'}
                      {resource.status === 'PendingActivation' && '待激活'}
                    </span>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-gray-500 mb-1">计费模式</div>
                        <div className="font-bold text-gray-800">
                          {resource.orderType === 'Trial'
                            ? '免费试用'
                            : resource.orderType === 'New'
                              ? '包年包月'
                              : '按量付费'}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-gray-500 mb-1">到期时间</div>
                        <div className="font-bold text-gray-800 font-mono">
                          {resource.expireDate}
                        </div>
                      </div>
                    </div>

                    {resource.status !== 'PendingActivation' && (
                      <>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 flex items-center gap-1">
                              <Cpu size={12} /> Token 用量
                            </span>
                            <span className="font-mono text-gray-700">
                              {resource.usage.token?.toLocaleString()} /{' '}
                              {resource.usage.tokenLimit?.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`${tokenUsagePercent > 80 ? 'bg-red-500' : 'bg-blue-500'} h-full rounded-full`}
                              style={{ width: `${tokenUsagePercent}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 flex items-center gap-1">
                              <Database size={12} /> 存储空间
                            </span>
                            <span className="font-mono text-gray-700">
                              {resource.usage.storage}GB / {resource.usage.storageLimit}GB
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`${storageUsagePercent > 80 ? 'bg-red-500' : 'bg-purple-600'} h-full rounded-full`}
                              style={{ width: `${storageUsagePercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    {resource.status === 'PendingActivation' ? (
                      activatingInstanceId === resource.id ? (
                        <div className="col-span-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={activatingInstanceName}
                            onChange={(e) => setActivatingInstanceName(e.target.value)}
                            placeholder="输入实例名称"
                            className="text-xs border border-gray-300 rounded px-2 py-2 w-full focus:outline-none focus:border-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              if (onUpdateResource && activatingInstanceName.trim()) {
                                onUpdateResource(resource.id, {
                                  status: resource.orderType === 'Trial' ? 'Trial' : 'Running',
                                  instanceName: activatingInstanceName.trim(),
                                })
                              }
                              setActivatingInstanceId(null)
                            }}
                            className="flex items-center justify-center py-2 px-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
                          >
                            确认
                          </button>
                          <button
                            onClick={() => setActivatingInstanceId(null)}
                            className="flex items-center justify-center py-2 px-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActivatingInstanceId(resource.id)
                            setActivatingInstanceName('')
                          }}
                          className="col-span-2 flex items-center justify-center gap-1 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold transition-colors shadow-sm"
                        >
                          <Zap size={14} /> 激活
                        </button>
                      )
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            onNavigate('detail', {
                              id: resource.id,
                              instance_name: resource.instanceName,
                              instance_status: resource.status,
                            })
                          }
                          className="col-span-2 flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                        >
                          <ExternalLink size={14} /> 进入维观AI平台
                        </button>
                        <button
                          onClick={() =>
                            onNavigate('detail', {
                              id: resource.id,
                              instance_name: resource.instanceName,
                              action: 'purchase',
                            })
                          }
                          className="flex items-center justify-center gap-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors"
                        >
                          续费
                        </button>
                        <button
                          onClick={() =>
                            onNavigate('resource_packs', {
                              id: resource.id,
                              action: 'purchase',
                            })
                          }
                          className="flex items-center justify-center gap-1 border border-blue-200 text-blue-600 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors"
                        >
                          补充资源包
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          {/* Add "New" Card */}
          <div
            onClick={() => onNavigate('discovery')}
            className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-500 transition-all cursor-pointer min-h-[300px]"
          >
            <PlusCircle size={40} className="mb-2 opacity-50" />
            <span className="font-bold text-sm">订阅新服务</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Heart size={48} className="mb-4 text-gray-200" />
          <p className="text-sm">暂无收藏的资产</p>
          <button
            onClick={() => onNavigate('discovery')}
            className="mt-4 text-blue-600 text-sm font-bold hover:underline"
          >
            去市场看看
          </button>
        </div>
      )}
    </div>
  )
}

export default BuyerResources
