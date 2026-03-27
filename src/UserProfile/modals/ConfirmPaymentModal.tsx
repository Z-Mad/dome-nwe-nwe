// components/profile/modals/ConfirmPaymentModal.tsx
import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import type { SellerMonitoringItem } from '../types/profile';

interface ConfirmPaymentModalProps {
  item: SellerMonitoringItem;
  onClose: () => void;
  onConfirm: (data: { companyName: string; phone: string; transactionId: string; file: File | null; rejectReason?: string }) => void;
  isLoading: boolean;
}

export const ConfirmPaymentModal: React.FC<ConfirmPaymentModalProps> = ({ item, onClose, onConfirm, isLoading }) => {
  const [form, setForm] = useState({
    companyName: '',
    phone: '',
    transactionId: '',
    file: null as File | null,
    rejectReason: '',
  });

  const handleConfirm = () => {
    if (!form.rejectReason) {
      if (!form.companyName || !form.phone || !form.transactionId) {
        alert('请填写完整的公司信息和流水号');
        return;
      }
    }
    onConfirm(form);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="text-green-600" /> 确认收款
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            请确认您已通过线下对公账户收到来自 <span className="font-bold text-gray-900">{item.buyer}</span> 的款项 <span className="font-bold text-indigo-600 font-mono">¥ {item?.estimatedCost?.toFixed?.(2) ?? '0.00'}</span>。
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>确认后，该账单将标记为“已支付”，代表您已完成该笔款项的线下核销。此操作不可逆。</p>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">收款公司名称 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="请输入收款公司全称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系电话 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="请输入联系电话"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">收款银行流水号 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.transactionId}
                onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                placeholder="请输入银行收款流水号"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">收款凭证单 <span className="text-red-500">*</span></label>
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer group block">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                />
                <Upload className="mx-auto text-gray-400 group-hover:text-green-500 mb-2" size={20} />
                <div className="text-sm text-gray-600 group-hover:text-green-600">
                  {form.file ? form.file.name : '点击上传收款凭证'}
                </div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">驳回原因 (仅驳回时需要)</label>
              <input
                type="text"
                value={form.rejectReason}
                onChange={(e) => setForm({ ...form, rejectReason: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                placeholder="如果驳回，请填写驳回原因"
              />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors">
            取消
          </button>
          <button
            onClick={() => {
              if (!form.rejectReason) {
                // 确认收款
                if (!form.companyName || !form.phone || !form.transactionId) {
                  alert('请填写完整的公司信息和流水号');
                  return;
                }
                handleConfirm();
              } else {
                // 驳回
                handleConfirm();
              }
            }}
            className={`px-5 py-2.5 font-medium rounded-xl transition-colors ${form.rejectReason ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            {form.rejectReason ? '驳回申请' : '确认已收款'}
          </button>
        </div>
      </div>
    </div>
  );
};