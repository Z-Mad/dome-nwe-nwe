// components/profile/modals/EditAssetModal.tsx
import React, { useState } from 'react';
import { X, Edit3, Loader2 } from 'lucide-react';
import type { SellerAsset } from '../types/profile';

interface EditAssetModalProps {
  asset: SellerAsset;
  onClose: () => void;
  onSave: (assetId: string, data: { title: string; desc: string; tags: string }) => void;
  isLoading: boolean;
}

export const EditAssetModal: React.FC<EditAssetModalProps> = ({ asset, onClose, onSave, isLoading }) => {
  const [form, setForm] = useState({
    title: asset.title,
    desc: asset.desc,
    tags: '',
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg mb-6 text-gray-900 flex items-center gap-2">
          <Edit3 size={20} className="text-blue-600" /> 编辑资产信息
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">资产名称 (Title)</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">分类 (Category)</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              disabled
            >
              <option>{asset.category === 'method' ? '方法智能体' : '分析智能体'}</option>
            </select>
            <p className="text-[10px] text-gray-400 mt-1">分类一旦创建不可修改，如需变更请重新发布。</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">简介 (Description)</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm h-24 focus:border-blue-500 outline-none resize-none"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">标签 (Tags)</label>
            <input
              type="text"
              placeholder="输入标签，用逗号分隔..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50">
            取消
          </button>
          <button
            onClick={() => onSave(asset.id, form)}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 shadow-md flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : '保存修改'}
          </button>
        </div>
      </div>
    </div>
  );
};