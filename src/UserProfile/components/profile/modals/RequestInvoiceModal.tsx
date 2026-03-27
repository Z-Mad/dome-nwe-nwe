// components/profile/modals/RequestInvoiceModal.tsx
import React, { useState } from 'react';
import { X, FileText, Plus, Loader2 } from 'lucide-react';
import type { InvoiceHeader } from '../../../types/profile';

interface RequestInvoiceModalProps {
  item: any;
  headers: InvoiceHeader[];
  selectedHeaderId: string;
  setSelectedHeaderId: (id: string) => void;
  onClose: () => void;
  onSubmit: (headerId: string, email: string) => void;
  onAddHeader: () => void;
  isLoading: boolean;
}

export const RequestInvoiceModal: React.FC<RequestInvoiceModalProps> = ({
  item,
  headers,
  selectedHeaderId,
  setSelectedHeaderId,
  onClose,
  onSubmit,
  onAddHeader,
  isLoading,
}) => {
  const [email, setEmail] = useState('finance@example.com');

  const handleSubmit = () => {
    if (!selectedHeaderId) {
      alert('请选择发票抬头');
      return;
    }
    onSubmit(selectedHeaderId, email);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" /> 申请发票
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">关联账单：</span>
              <span className="font-medium text-gray-900">{item.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">开票金额：</span>
              <span className="font-bold text-blue-600 font-mono">¥{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择发票抬头 <span className="text-red-500">*</span></label>
            <div className="space-y-3">
              {headers.map((header) => (
                <label
                  key={header.id}
                  className={`block border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedHeaderId === header.id
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <input
                        type="radio"
                        name="invoiceHeader"
                        checked={selectedHeaderId === header.id}
                        onChange={() => setSelectedHeaderId(header.id)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{header.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        税号: {header.taxId} | {header.type === 'special' ? '专票' : '普票'}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <button
              onClick={onAddHeader}
              className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1"
            >
              <Plus size={14} /> 新增抬头
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">接收邮箱 <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="用于接收电子发票"
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : '提交申请'}
          </button>
        </div>
      </div>
    </div>
  );
};