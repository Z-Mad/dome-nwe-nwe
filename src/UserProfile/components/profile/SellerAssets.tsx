import React from 'react';
import { Plus, Edit3, Trash2, Activity } from 'lucide-react';
import type { SellerAsset } from '../../types/profile';

interface SellerAssetsProps {
  assets: SellerAsset[];
  filter: string;
  setFilter: (filter: string) => void;
  onEditAsset: (asset: SellerAsset) => void;
  onTakedown: (asset: SellerAsset) => void;
  onPublishNewVersion: (asset: SellerAsset) => void;
  onPublishNewAsset: () => void;
}

export const SellerAssets: React.FC<SellerAssetsProps> = ({
  assets,
  filter,
  setFilter,
  onEditAsset,
  onTakedown,
  onPublishNewVersion,
  onPublishNewAsset,
}) => {
  const filteredAssets = assets.filter((a) => filter === 'all' || a.status === filter);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex gap-1 border-b border-gray-200">
        {[
          { id: 'all', label: '全部' },
          { id: 'live', label: '已发布' },
          { id: 'review', label: '审核中' },
          { id: 'draft', label: '草稿箱' },
          { id: 'takedown', label: '已下架' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
              filter === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-1 text-right pb-2">
          <button
            onClick={onPublishNewAsset}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2 ml-auto shadow-md"
          >
            <Plus size={16} /> 发布新资产
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {asset.status === 'live' && <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>}
                {asset.status === 'review' && <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>}
                {asset.status === 'draft' && <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>}
                {asset.status === 'takedown' && <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>}
                <h3 className="text-lg font-bold text-gray-900">{asset.title}</h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${
                    asset.status === 'live'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : asset.status === 'review'
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        : asset.status === 'takedown'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {asset.status === 'takedown' ? '已下架' : asset.status}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => onEditAsset(asset)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-indigo-600 bg-white border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors"
                >
                  <Edit3 size={12} /> 编辑信息
                </button>
                {asset.status === 'live' && (
                  <button
                    onClick={() => onTakedown(asset)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={12} /> 下架
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white text-gray-500 font-bold border-b border-gray-50 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-40">版本 (Version)</th>
                    <th className="px-6 py-4 w-40">发布日期</th>
                    <th className="px-6 py-4 w-40">获取数 (Installs)</th>
                    <th className="px-6 py-4 w-32">状态</th>
                    <th className="px-6 py-4 text-right">管理</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {asset.versions.map((ver, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-indigo-600 font-mono">{ver.ver}</td>
                      <td className="px-6 py-4 text-gray-500">{ver.date}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{ver.installs}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            ver.status === 'active' || ver.status === 'stable'
                              ? 'bg-green-50 text-green-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {ver.status === 'active' || ver.status === 'stable' ? '正常' : '弃用'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onPublishNewVersion(asset)}
                          className="text-gray-400 hover:text-indigo-600 font-medium transition-colors"
                        >
                          管理
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50/30 p-4 border-t border-gray-100 text-center">
              <button
                onClick={() => onPublishNewVersion(asset)}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                + 发布新版本 (Release New Version)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};