import { AlertTriangle, CheckCircle, Loader2, RefreshCcw, X } from 'lucide-react'
import { useState } from 'react'

export const RefundRequestModal = ({ selectedItem, closeModal, showToast }: any) => {
  const [refundReason, setRefundReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!selectedItem) return null

  const isResourcePack = selectedItem.type === 'ResourcePack'

  // Mock refund calculation
  const totalAmount = selectedItem.amount || 2000
  const usedAmount = isResourcePack ? totalAmount * 0.4 : totalAmount * 0.2 // Mock usage
  const refundAmount = totalAmount - usedAmount

  const handleRefundRequest = () => {
    if (!refundReason) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      showToast('退款申请已提交，请等待审核')
      closeModal()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative flex flex-col max-h-[90vh]">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg mb-6 text-gray-900 flex items-center gap-2">
          <RefreshCcw size={20} className="text-orange-500" /> 申请售后 / 退款
        </h3>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {/* Rules Warning */}
          <div className="bg-orange-50 text-orange-800 p-4 rounded-xl border border-orange-100 flex gap-3">
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-bold">服务终止规则 (Termination Rules)</p>
              <ul className="list-disc pl-4 space-y-1 text-orange-700/80">
                <li>退款金额将根据实际已使用资源/时间按比例扣除，具体以审核结果为准。</li>
                <li>服务终止后，相关数据将保留 7 天，逾期将被永久删除，请提前备份。</li>
                <li>退款处理周期通常为 3-5 个工作日，原路退回支付账户。</li>
              </ul>
            </div>
          </div>

          {/* Refund Calculation */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">退款金额预估</h4>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">订单总额</span>
                <span className="font-medium text-gray-900">¥{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  已产生费用 ({isResourcePack ? '资源消耗' : '按时间折算'})
                </span>
                <span className="font-medium text-red-600">-¥{usedAmount.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-900">预计退回金额</span>
                <span className="text-xl font-bold text-green-600">
                  ¥{refundAmount.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">*最终退款金额以系统实际核算为准</p>
          </div>

          {/* Reason Selection */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">
              退款原因 <span className="text-red-500">*</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {['功能不满足需求', '性能/稳定性不佳', '价格原因', '不再需要该服务'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setRefundReason(reason)}
                  className={`px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                    refundReason === reason
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-200 hover:border-blue-200 text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {reason}
                    {refundReason === reason && <CheckCircle size={16} className="text-blue-500" />}
                  </div>
                </button>
              ))}
            </div>
            <textarea
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none text-sm"
              placeholder="请详细描述您的退款原因，帮助我们改进服务（选填）..."
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleRefundRequest}
            disabled={!refundReason || isLoading}
            className="px-5 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : '提交退款申请'}
          </button>
        </div>
      </div>
    </div>
  )
}
