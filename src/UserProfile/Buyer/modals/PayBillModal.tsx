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

export const PayBillModal = ({
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
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [isLoading, setIsLoading] = useState(false)

  if (!selectedItem) return null
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" /> 支付账单
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">支付金额</div>
            <div className="text-3xl font-bold text-gray-900 font-mono">
              ¥{selectedItem.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-400 mt-1">账单编号: {selectedItem.id}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">选择支付方式</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('online')}
                className={`p-3 rounded-xl border-2 text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'online' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                <Wallet
                  size={24}
                  className={paymentMethod === 'online' ? 'text-blue-600' : 'text-gray-400'}
                />
                企业网银 / 支付宝
              </button>
              <button
                onClick={() => setPaymentMethod('offline')}
                className={`p-3 rounded-xl border-2 text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'offline' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                <Building
                  size={24}
                  className={paymentMethod === 'offline' ? 'text-blue-600' : 'text-gray-400'}
                />
                对公银行汇款
              </button>
            </div>
          </div>

          {paymentMethod === 'offline' && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 text-sm animate-in slide-in-from-top-2">
              <div className="font-bold text-gray-900 mb-2">平台收款账户信息</div>
              <div className="flex justify-between">
                <span className="text-gray-500">公司名称：</span>
                <span className="font-medium">上海维观科技有限公司</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">开户银行：</span>
                <span className="font-medium">招商银行上海分行</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">银行账号：</span>
                <span className="font-medium font-mono">1234 5678 9012 3456</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  上传付款凭证 (必填)
                </label>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => {
                setIsLoading(false)
                setBills((prev) =>
                  prev.map((b) =>
                    b.id === selectedItem.id
                      ? { ...b, status: paymentMethod === 'online' ? 'paid' : 'under_review' }
                      : b,
                  ),
                )
                showToast(paymentMethod === 'online' ? '支付成功！' : '凭证已提交，等待财务审核')
                closeModal()
              }, 1500)
            }}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : '确认支付'}
          </button>
        </div>
      </div>
    </div>
  )
}
export default PayBillModal
