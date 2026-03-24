import React, { useState } from 'react';
import { 
  X, Download, FileText, Settings, Plus, CreditCard, Wallet, Building, 
  Upload, ShieldCheck, Activity, AlertCircle, Edit3, Terminal, TrendingUp, 
  CheckCircle, Loader2, Scale, Box, Receipt, Scan
} from 'lucide-react';

export default function SellerRefundAuditModal(props: any) {
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

  return (

    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <ShieldCheck size={20} className="text-orange-500" /> 退款审核处理
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">关联订单</span>
            <span className="text-xs text-gray-500">申请金额</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">
                {selectedItem?.orderId}
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 rounded border border-blue-100">
                企业版订阅
              </span>
            </div>
            <span className="font-bold text-red-600 text-lg">
              ¥ {selectedItem?.amount}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 block mb-1">买家账户</span>
              <span className="text-gray-800 font-medium">
                {selectedItem?.buyer}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block mb-1">申请时间</span>
              <span className="text-gray-800 font-medium">
                {selectedItem?.date}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={16} className="text-blue-600" />
            <span className="text-sm font-bold text-gray-900">
              使用情况评估 (Usage Assessment)
            </span>
          </div>
          <div className="space-y-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">运行时长 (Runtime)</span>
                <span className="font-bold text-gray-900">
                  2天 / 30天 (6.7%)
                </span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[6.7%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">API 调用量 (Token Usage)</span>
                <span className="font-bold text-gray-900">
                  1,240 / 10,000 (12.4%)
                </span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[12.4%]"></div>
              </div>
            </div>
          </div>
          <div className="mt-2 bg-orange-50 border border-orange-100 p-3 rounded-lg flex items-start gap-2">
            <AlertCircle
              size={14}
              className="text-orange-600 mt-0.5 flex-shrink-0"
            />
            <p className="text-xs text-orange-700 leading-relaxed">
              提示：买家在使用期间产生过 3 次 4xx
              错误调用，可能遇到兼容性问题。建议参考买家描述。
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            买家申请理由
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
            {selectedItem?.reason}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            审核意见 (必填/Optional)
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-xl p-3 text-sm h-20 focus:border-blue-500 outline-none resize-none"
            placeholder="若是拒绝申请，请务必在此说明原因，以便买家理解..."
            value={auditComment}
            onChange={(e) => setAuditComment(e.target.value)}
          ></textarea>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleSellerRefundAudit(false)}
            className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            拒绝申请
          </button>
          <button
            onClick={() => handleSellerRefundAudit(true)}
            className="flex-1 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors shadow-lg"
          >
            同意退款
          </button>
        </div>
      </div>
    </div>
  
  );
}
