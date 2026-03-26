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

export const GenerateInvoiceModal = ({
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
  const [invoiceStartDate, setInvoiceStartDate] = useState('')
  const [invoiceEndDate, setInvoiceEndDate] = useState('')
  const [isQueryingUsage, setIsQueryingUsage] = useState(false)
  const [dateError, setDateError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [isLoading, setIsLoading] = useState(false)

  if (!selectedItem) return null
  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-indigo-600" />
            生成请款单
          </h3>
          <button
            onClick={() => setActiveModal('none')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
            <div className="text-sm text-indigo-600 font-medium mb-1">用户名</div>
            <div className="text-lg font-bold text-gray-900">{selectedItem.buyer}</div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-sm">待结算账期</h4>
              <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                系统自动带出
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={invoiceStartDate}
                disabled
                className="flex-1 px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed"
              />
              <span className="text-gray-400">至</span>
              <input
                type="date"
                value={invoiceEndDate}
                disabled
                className="flex-1 px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed"
              />
            </div>
            {dateError && <div className="text-xs text-red-500">{dateError}</div>}
            {selectedItem.billedPeriods?.length > 0 && (
              <div className="text-xs text-gray-500">
                <span className="text-red-500">*</span> 以下周期已生成请款单，不可重复选择：
                <ul className="list-disc pl-4 mt-1">
                  {selectedItem.billedPeriods.map((bp: string, i: number) => (
                    <li key={i}>{bp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              账单明细
              {isQueryingUsage && (
                <span className="text-xs text-indigo-600 font-normal flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" /> 计算中...
                </span>
              )}
            </h4>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3 text-sm relative">
              {isQueryingUsage && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-xl z-10" />
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">订阅资产</span>
                <span className="font-medium text-gray-900">
                  {selectedItem.asset} ({selectedItem.version})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">订单编号</span>
                <span className="font-mono text-gray-900">{selectedItem.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">计费模式</span>
                <span className="font-medium text-gray-900">{selectedItem.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">单价</span>
                <span className="font-medium text-gray-900">{selectedItem.unitPrice}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between">
                <span className="text-gray-500">Token消耗</span>
                <span className="font-mono text-gray-900">{selectedItem.usage.tokens}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">存储占用</span>
                <span className="font-mono text-gray-900">{selectedItem.usage.storage}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between">
                <span className="text-gray-500">Token费用</span>
                <span className="font-mono text-gray-900">
                  ¥ {selectedItem.feeBreakdown.tokens.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">存储费用</span>
                <span className="font-mono text-gray-900">
                  ¥ {selectedItem.feeBreakdown.storage.toFixed(2)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-900">费用合计</span>
                <span className="text-xl font-bold text-indigo-600 font-mono">
                  ¥ {selectedItem.estimatedCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 text-orange-700 p-3 rounded-lg text-xs flex gap-2 items-start">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <p>
              请在提交订单后，下载《支付申请单》并进行对公转账，支付成功后请上传付款回执凭证。款项确认到账后请前往已购资源激活智能体。
            </p>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => setActiveModal('none')}
            className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => {
                setIsLoading(false)
                setActiveModal('none')
                showToast('请款单生成成功，已通知客户')
                setMonitoringData((prev) =>
                  prev.map((item) => {
                    if (item.id === selectedItem.id) {
                      return {
                        ...item,
                        status: 'under_review',
                        billedPeriods: [
                          ...(item.billedPeriods || []),
                          `${invoiceStartDate} ~ ${invoiceEndDate}`,
                        ],
                      }
                    }
                    return item
                  }),
                )
                setLocalOrders((prev) =>
                  prev.map((o) =>
                    o.id === selectedItem.orderId
                      ? {
                          ...o,
                          paymentStatus: 'PendingPayment',
                          status: 'PendingPayment',
                          paymentMethod: 'CorporateRemittance',
                        }
                      : o,
                  ),
                )
              }, 1500)
            }}
            disabled={
              isLoading || isQueryingUsage || !!dateError || !invoiceStartDate || !invoiceEndDate
            }
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Download size={18} />
                生成并下载请款单
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
export default GenerateInvoiceModal
