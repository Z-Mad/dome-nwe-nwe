import React, { useState } from 'react';
import { 
  X, Download, FileText, Settings, Plus, CreditCard, Wallet, Building, 
  Upload, ShieldCheck, Activity, AlertCircle, Edit3, Terminal, TrendingUp, 
  CheckCircle, Loader2, Scale, Box, Receipt, Scan
} from 'lucide-react';

export default function UploadReceiptModal(props: any) {
  const {
    selectedItem, closeModal, showToast, isLoading, setIsLoading, 
    handleSimulatePayment, invoiceHeaders, showInvoiceHeaderForm, 
    setShowInvoiceHeaderForm, editingInvoiceHeader, setEditingInvoiceHeader, 
    setInvoiceHeaders, paymentMethod, setPaymentMethod, setBills, 
    receiptForm, setReceiptForm, setLocalOrders, setMonitoringData, 
    invoiceForm, setInvoiceForm, selectedHeaderId, setSelectedHeaderId, 
    openModal, setInvoices, refundReason, setRefundReason, refundReasonTag, 
    setRefundReasonTag, handleTakedownAsset, editAssetForm, setEditAssetForm, 
    handleSaveAssetInfo, selectedVersion, handleVersionAction, onUpgrade, 
    previewImageUrl, setActiveModal, invoiceStartDate, invoiceEndDate, 
    dateError, isQueryingUsage, localOrders, processSuccessfulPayment,
    auditComment, setAuditComment, handleSellerRefundAudit
  } = props;


    if (!selectedItem) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Upload size={18} className="text-blue-600" /> 上传付款回执
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left side: Bank Info */}
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
                    <div className="font-bold text-blue-600 text-lg font-mono">¥{selectedItem.amount.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Right side: Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">付款公司名称 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={receiptForm.companyName}
                      onChange={(e) => setReceiptForm({ ...receiptForm, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="请输入打款公司全称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">付款银行账号 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={receiptForm.bankAccount}
                      onChange={(e) => setReceiptForm({ ...receiptForm, bankAccount: e.target.value })}
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
                      value={receiptForm.paymentAmount}
                      onChange={(e) => setReceiptForm({ ...receiptForm, paymentAmount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="请输入实际付款金额"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">付款日期 <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={receiptForm.paymentDate}
                      onChange={(e) => setReceiptForm({ ...receiptForm, paymentDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">银行流水号 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={receiptForm.transactionId}
                    onChange={(e) => setReceiptForm({ ...receiptForm, transactionId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="请输入银行转账流水号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <input
                    type="text"
                    value={receiptForm.remark}
                    onChange={(e) => setReceiptForm({ ...receiptForm, remark: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="选填，如有其他说明请填写"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">付款回执单 <span className="text-red-500">*</span></label>
                  <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer group block">
                    <input type="file" className="hidden" onChange={(e) => setReceiptForm({ ...receiptForm, file: e.target.files?.[0] || null })} />
                    <Upload className="mx-auto text-gray-400 group-hover:text-blue-500 mb-2" size={24} />
                    <div className="text-sm text-gray-600 group-hover:text-blue-600">
                      {receiptForm.file ? receiptForm.file.name : "点击上传或拖拽文件到此处"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">支持 JPG, PNG, PDF 格式，最大 5MB</div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmitReceipt}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : "提交审核"}
            </button>
          </div>
        </div>
      </div>
    );
  
}
