import React, { useState } from 'react';
import { 
  X, Download, FileText, Settings, Plus, CreditCard, Wallet, Building, 
  Upload, ShieldCheck, Activity, AlertCircle, Edit3, Terminal, TrendingUp, 
  CheckCircle, Loader2, Scale, Box, Receipt, Scan
} from 'lucide-react';

export default function UpgradeModal(props: any) {
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
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" /> 升级至付费版
          </h3>
          <button onClick={closeModal}>
            <X size={20} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h4 className="font-bold text-blue-900 text-sm mb-1">
              无缝升级说明
            </h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              升级后，您的实例 ID、API Key
              及所有历史数据将完整保留。无需重新部署或迁移数据。
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 cursor-pointer transition-all ring-2 ring-transparent hover:ring-blue-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-900">
                  企业版订阅
                </span>
                <span className="text-blue-600 font-bold">¥5,800 / 月</span>
              </div>
              <ul className="text-xs text-gray-500 space-y-1">
                <li className="flex items-center gap-1">
                  <CheckCircle size={10} className="text-green-500" /> 100,000
                  Tokens/月
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle size={10} className="text-green-500" /> 500GB
                  向量存储
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle size={10} className="text-green-500" /> 20
                  用户并发
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 cursor-pointer transition-all ring-2 ring-transparent hover:ring-blue-100 opacity-60">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-900">
                  私有化部署 (永久授权)
                </span>
                <span className="text-gray-900 font-bold">¥128,000</span>
              </div>
              <div className="text-xs text-gray-400">
                需联系销售顾问进行部署评估
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onUpgrade && selectedItem) {
                setIsLoading(true);
                setTimeout(() => {
                  onUpgrade(selectedItem.id, {
                    planName: "企业版订阅",
                    period: "Monthly",
                    amount: 5800,
                    quota: { tokens: 100000, storage: 500, users: 20 },
                  });
                  setIsLoading(false);
                  showToast("升级成功！实例已自动切换至企业版配置。");
                  closeModal();
                }, 1500);
              }
            }}
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "确认升级并支付 ¥5,800"
            )}
          </button>
        </div>
      </div>
    </div>
  
  );
}
