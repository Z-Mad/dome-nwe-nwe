import React, { useState, useEffect } from 'react'
import {
  X,
  Download,
  FileText,
  Settings,
  Plus,
  CreditCard,
  Wallet,
  Building,
  Upload,
  ShieldCheck,
  Activity,
  AlertCircle,
  Edit3,
  Terminal,
  TrendingUp,
  CheckCircle,
  Loader2,
  Scale,
  Box,
  Receipt,
  Scan,
} from 'lucide-react'

export const PaymentModal = ({
  selectedItem,
  closeModal,
  showToast,
  localOrders,
  setLocalOrders,
  setMonitoringData,
  processSuccessfulPayment,
  setActiveModal,
  setBills,
  onNavigate,
  setPreviewImageUrl,
  selectedVersion,
  handleVersionAction,
  handleSaveAssetInfo,
  handleTakedownAsset,
  handleSellerRefundAudit,
  openModal,
  handleSimulatePayment,
}: any) => {
  if (!selectedItem) return null
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg mb-6 text-gray-900 flex items-center gap-2">
          <Wallet size={20} className="text-blue-600" /> 支付收银台
        </h3>
        <div className="mb-6 text-center">
          <div className="text-sm text-gray-500 mb-1">支付金额</div>
          <div className="text-3xl font-bold font-mono text-gray-900">
            ¥{selectedItem.amount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-2">订单号: {selectedItem.id}</div>
        </div>

        <div className="space-y-4">
          <div
            onClick={() => handleSimulatePayment(true)}
            className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <Scan size={18} />
                </div>
                微信/支付宝扫码直付
              </div>
            </div>
            <p className="text-xs text-gray-500 pl-10">
              资金将直接结算至卖家/平台商户号，不经过平台余额。
            </p>
          </div>

          <div
            onClick={() => handleSimulatePayment(false)}
            className="border border-gray-200 rounded-xl p-4 hover:border-indigo-500 cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Building size={18} />
                </div>
                线下对公转账
              </div>
            </div>
            <p className="text-xs text-gray-500 pl-10">
              请在提交订单后，下载《支付申请单》并进行对公转账，支付成功后请上传付款回执凭证。款项确认到账后请前往已购资源激活智能体。
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={closeModal}
            className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            稍后支付
          </button>
        </div>
      </div>
    </div>
  )
}
export default PaymentModal
