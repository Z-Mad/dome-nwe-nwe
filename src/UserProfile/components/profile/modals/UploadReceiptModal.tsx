// components/profile/modals/UploadReceiptModal.tsx
import React, { useState } from 'react';
import { X, Upload, Building, Loader2 } from 'lucide-react';
import type { BuyerOrder } from '../../../types/profile';

interface UploadReceiptModalProps {
  order: BuyerOrder;
  onClose: () => void;
  onSubmit: (data: {
    companyName: string;
    bankAccount: string;
    paymentAmount: string;
    paymentDate: string;
    transactionId: string;
    remark: string;
    file: File | null;
  }) => void;
  isLoading: boolean;
}

export const UploadReceiptModal: React.FC<UploadReceiptModalProps> = ({ order, onClose, onSubmit, isLoading }) => {
  const [form, setForm] = useState({
    companyName: '',
    bankAccount: '',
    paymentAmount: '',
    paymentDate: '',
    transactionId: '',
    remark: '',
    file: null as File | null,
  });

  const handleSubmit = () => {
    if (!form.companyName || !form.bankAccount || !form.paymentAmount || !form.paymentDate || !form.transactionId) {
      alert('请填写完整的付款信息和流水号');
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Upload size={18} className="text-blue-600" /> 上传付款回执
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Building size={16} /> 收款方信息
              </h4>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-blue-600/70 mb-1">公司名称</div>
                  <div className="font-medium text-blue-900">上海维观科技有限公司</div>
                </div>
                <div>
                  <div className="text-blue-600/70 mb-1">开户银行</div>
                  <div className="font-medium text-blue-900">招商银行上海分行</div>
                </div>
                <div>
                  <div className="text-blue-600/70 mb-1">银行账号</div>
                  <div className="font-medium text-blue-900 font-mono">1234 5678 9012 3456</div>
                </div>
                <div>
                  <div className="text-blue-600/70 mb-1">应付金额</div>
                  <div className="font-bold text-blue-600 text-lg font-mono">¥{order.amount.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">付款公司名称 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="请输入打款公司全称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">付款银行账号 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.bankAccount}
                    onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="请输入付款银行账号"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">付款金额 <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={form.paymentAmount}
                    onChange={(e) => setForm({ ...form, paymentAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="请输入实际付款金额"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">付款日期 <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.paymentDate}
                    onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">银行流水号 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.transactionId}
                  onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="请输入银行转账流水号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                <input
                  type="text"
                  value={form.remark}
                  onChange={(e) => setForm({ ...form, remark: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="选填，如有其他说明请填写"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">付款回执单 <span className="text-red-500">*</span></label>
                <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer group block">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                  />
                  <Upload className="mx-auto text-gray-400 group-hover:text-blue-500 mb-2" size={24} />
                  <div className="text-sm text-gray-600 group-hover:text-blue-600">
                    {form.file ? form.file.name : '点击上传或拖拽文件到此处'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">支持 JPG, PNG, PDF 格式，最大 5MB</div>
                </label>
              </div>
            </div>
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
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : '提交审核'}
          </button>
        </div>
      </div>
    </div>
  );
};