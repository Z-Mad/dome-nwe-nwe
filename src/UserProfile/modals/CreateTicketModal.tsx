// components/profile/modals/CreateTicketModal.tsx
import React, { useState } from 'react';
import { X, LifeBuoy, Loader2 } from 'lucide-react';

interface CreateTicketModalProps {
  onClose: () => void;
  onSubmit: (type: string, desc: string) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ onClose, onSubmit }) => {
  const [type, setType] = useState('technical');
  const [desc, setDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!desc) return;
    setIsLoading(true);
    onSubmit(type, desc);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg mb-6 text-gray-900 flex items-center gap-2">
          <LifeBuoy size={20} className="text-blue-600" /> 提交工单
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">问题类型</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none bg-gray-50"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="technical">技术问题 (API/SDK)</option>
              <option value="billing">财务与账单</option>
              <option value="account">账号与安全</option>
              <option value="suggestion">产品建议</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">问题描述</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-4 text-sm h-32 focus:border-blue-500 outline-none resize-none"
              placeholder="请详细描述您遇到的问题，必要时可粘贴日志..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!desc || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : '提交工单'}
          </button>
        </div>
      </div>
    </div>
  );
};