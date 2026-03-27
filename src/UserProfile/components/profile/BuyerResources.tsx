import React from 'react';
import { Box, Heart, Edit3, Check, X, Zap, ExternalLink, PlusCircle, Database } from 'lucide-react';
import { StatusBadge } from '@/components/Badges';
import type { BuyerResource } from '../../types/profile';

interface BuyerResourcesProps {
  resources: BuyerResource[];
  resourceSubTab: 'purchased' | 'favorites';
  setResourceSubTab: (tab: 'purchased' | 'favorites') => void;
  editingInstanceId: string | null;
  setEditingInstanceId: (id: string | null) => void;
  editingInstanceName: string;
  setEditingInstanceName: (name: string) => void;
  activatingInstanceId: string | null;
  setActivatingInstanceId: (id: string | null) => void;
  activatingInstanceName: string;
  setActivatingInstanceName: (name: string) => void;
  onUpdateResource: (id: string, updates: any) => void;
  onNavigate: (view: string, params?: any) => void;
}

export const BuyerResources: React.FC<BuyerResourcesProps> = ({
  resources,
  resourceSubTab,
  setResourceSubTab,
  editingInstanceId,
  setEditingInstanceId,
  editingInstanceName,
  setEditingInstanceName,
  activatingInstanceId,
  setActivatingInstanceId,
  activatingInstanceName,
  setActivatingInstanceName,
  onUpdateResource,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex gap-8 border-b border-gray-200">
        <button
          onClick={() => setResourceSubTab('purchased')}
          className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all ${
            resourceSubTab === 'purchased'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Box size={18} /> 已购资源 (Purchased)
        </button>
        <button
          onClick={() => setResourceSubTab('favorites')}
          className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all ${
            resourceSubTab === 'favorites'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Heart size={18} /> 我的收藏 (Favorites)
        </button>
      </div>

      {resourceSubTab === 'purchased' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources
            .filter((r) => r.status !== 'Expired')
            .map((resource) => {
              const totalTokens = resource.quota?.tokens || 10000;
              const usedTokens = resource.usage?.tokens || 0;
              const usagePercent = Math.floor((usedTokens / totalTokens) * 100);
              const totalStorage = resource.quota?.storage || 50;
              const usedStorage = resource.usage?.storage || 0;
              const storageUsagePercent = Math.floor((usedStorage / totalStorage) * 100);

              return (
                <div
                  key={resource.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Box size={24} />
                    </div>
                    <StatusBadge status={resource.status} expireDate={resource.expireDate} />
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                      {resource.productName}
                    </h3>
                    {editingInstanceId === resource.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingInstanceName}
                          onChange={(e) => setEditingInstanceName(e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:border-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            if (onUpdateResource && editingInstanceName.trim()) {
                              onUpdateResource(resource.id, { instanceName: editingInstanceName.trim() });
                            }
                            setEditingInstanceId(null);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingInstanceId(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <p className="text-xs text-gray-500">
                          {resource.instanceName !== '-' ? resource.instanceName : '未分配实例'}
                        </p>
                        {resource.status !== 'PendingActivation' && (
                          <button
                            onClick={() => {
                              setEditingInstanceId(resource.id);
                              setEditingInstanceName(resource.instanceName !== '-' ? resource.instanceName : '');
                            }}
                            className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit3 size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-6 flex-1">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>有效至</span>
                      <span className="font-medium text-gray-900">{resource.expireDate}</span>
                    </div>

                    {resource.status !== 'PendingActivation' && (
                      <>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">
                              Token 用量 ({(usedTokens / 1000).toFixed(1)}k / {(totalTokens / 1000).toFixed(1)}k)
                            </span>
                            <span className="font-bold text-gray-900">{usagePercent}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`${usagePercent > 80 ? 'bg-red-500' : 'bg-blue-600'} h-full rounded-full`}
                              style={{ width: `${usagePercent}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="border-t border-gray-50 pt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500 flex items-center gap-1">
                              <Database size={12} /> 存储空间 ({usedStorage}GB / {totalStorage}GB)
                            </span>
                            <span className="font-bold text-gray-900">{storageUsagePercent}%</span>
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
                                });
                              }
                              setActivatingInstanceId(null);
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
                            setActivatingInstanceId(resource.id);
                            setActivatingInstanceName('');
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
              );
            })}
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
          <button onClick={() => onNavigate('discovery')} className="mt-4 text-blue-600 text-sm font-bold hover:underline">
            去市场看看
          </button>
        </div>
      )}
    </div>
  );
};