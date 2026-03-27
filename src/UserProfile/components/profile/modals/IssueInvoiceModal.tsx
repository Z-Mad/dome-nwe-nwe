// components/profile/modals/IssueInvoiceModal.tsx
import React, { useState } from 'react';
import { X, FileText, Upload, Loader2 } from 'lucide-react';
import type { BuyerOrder } from '../../../types/profile';

interface IssueInvoiceModalProps {
  order: BuyerOrder;
  onClose: () => void;
  onIssue: (invoiceNumber: string, invoiceCode: string, file: File | null) => void;
  isLoading: boolean;
}

export const IssueInvoiceModal: React.FC<IssueInvoiceModalProps> = ({ order, onClose, onIssue, isLoading }) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceCode, setInvoiceCode] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!invoiceNumber || !file) {
      alert('请填写发票号码并上传发票文件');
      return;
    }
    onIssue(invoiceNumber, invoiceCode, file);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-orange-600" /> 开具发票
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="bg-orange-50 p-4 rounded-xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">关联订单：</span>
              <span className="font-medium text-gray-900">{order.id}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">开票金额：</span>
              <span className="font-bold text-orange-600 font-mono text-lg">¥{order.amount?.toLocaleString() || '0.00'}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">买方名称：</span>
              <span className="font-medium text-gray-900">{order.provider || '某企业客户'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">纳税人识别号：</span>
              <span className="font-medium text-gray-900 font-mono">91310000XXXXXXXXXX</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">发票号码 <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="请输入发票号码"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">发票代码</label>
              <input
                type="text"
                placeholder="请输入发票代码（选填）"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                value={invoiceCode}
                onChange={(e) => setInvoiceCode(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电子发票文件 <span className="text-red-500">*</span></label>
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-orange-300 transition-colors cursor-pointer">
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <Upload size={24} className="mb-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">{file ? file.name : '点击或拖拽上传发票文件'}</p>
                <p className="text-xs text-gray-400 mt-1">支持 PDF, JPG, PNG 格式，最大 5MB</p>
              </label>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : '确认开票'}
          </button>
        </div>
      </div>
    </div>
  );
};