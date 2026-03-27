// components/profile/modals/ManageVersionModal.tsx
import React from 'react';
import { X, Settings, Activity, Terminal, Loader2 } from 'lucide-react';
import type { SellerAsset } from '../types/profile';

interface ManageVersionModalProps {
  asset: SellerAsset;
  version: any;
  onClose: () => void;
  onAction: (action: 'rollback' | 'deprecate') => void;
  isLoading: boolean;
}

export const ManageVersionModal: React.FC<ManageVersionModalProps> = ({
  asset,
  version,
  onClose,
  onAction,
  isLoading,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <div className="mb-6">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Settings size={20} className="text-gray-500" /> 版本管理: {version.ver}
          </h3>
          <p className="text-xs text-gray-500 mt-1">Asset ID: {asset.id} · Published: {version.date}</p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  version.status === 'active' || version.status === 'stable'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <Activity size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">
                  当前状态: {version.status === 'active' || version.status === 'stable' ? '正常 (Normal)' : '弃用 (Deprecated)'}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {version.status === 'active' || version.status === 'stable' ? (
                <button
                  onClick={() => onAction('deprecate')}
                  disabled={isLoading}
                  className="text-xs border border-orange-200 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-50 font-bold"
                >
                  弃用版本
                </button>
              ) : (
                <button
                  onClick={() => onAction('rollback')}
                  disabled={isLoading}
                  className="text-xs border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 font-bold"
                >
                  回滚至此
                </button>
              )}
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-400 mb-1">当前获取量 (Current Installs)</div>
            <div className="font-bold text-xl text-gray-900">{version.installs}</div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Terminal size={16} /> 版本日志 (Change Log)
            </h4>
            <div className="bg-gray-900 text-gray-300 p-4 rounded-xl font-mono text-xs leading-relaxed">
              <p className="text-gray-500"># {version.date} by Developer</p>
              <p>&gt; {version.log}</p>
              <p className="mt-2 text-gray-500"># System Check</p>
              <p>&gt; Integrity: OK</p>
              <p>&gt; Security Scan: Passed</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};