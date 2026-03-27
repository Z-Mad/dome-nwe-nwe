// components/profile/modals/ConfirmTakedownModal.tsx
import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmTakedownModalProps {
  assetTitle: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const ConfirmTakedownModal: React.FC<ConfirmTakedownModalProps> = ({
  assetTitle,
  onClose,
  onConfirm,
  isLoading,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className="font-bold text-xl text-gray-900 mb-2">确认下架资产？</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          下架后，该资产将不再在市场中公开展示，新用户无法搜索或购买。已有用户的服务不受影响。
          <br />
          <span className="text-xs text-red-400 mt-2 block">(操作不可逆，需重新审核上架)</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl hover:bg-red-700 shadow-md flex items-center justify-center gap-2 disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : '确认下架'}
          </button>
        </div>
      </div>
    </div>
  );
};