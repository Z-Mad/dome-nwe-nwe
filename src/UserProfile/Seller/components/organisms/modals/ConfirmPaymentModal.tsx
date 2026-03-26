import { AlertCircle, CheckCircle, Upload, X } from 'lucide-react'
import { useState } from 'react'

export const ConfirmPaymentModal = ({
  selectedItem,
  showToast,
  setLocalOrders,
  setMonitoringData,
  processSuccessfulPayment,
  setActiveModal,
}: any) => {
  const [receiptForm, setReceiptForm] = useState({
    companyName: '',
    phone: '',
    file: null as File | null,
    transactionId: '',
    bankAccount: '',
    paymentAmount: '',
    paymentDate: '',
    remark: '',
    rejectReason: '',
  })

  if (!selectedItem) return null
  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="text-green-600" />
            确认收款
          </h3>
          <button
            onClick={() => setActiveModal('none')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            请确认您已通过线下对公账户收到来自{' '}
            <span className="font-bold text-gray-900">{selectedItem.buyer || '买家'}</span> 的款项{' '}
            <span className="font-bold text-indigo-600 font-mono">
              ¥ {selectedItem.amount.toFixed(2)}
            </span>
            。
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>确认后，该账单将标记为“已支付”，代表您已完成该笔款项的线下核销。此操作不可逆。</p>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  收款公司名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={receiptForm.companyName}
                  onChange={(e) => setReceiptForm({ ...receiptForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="请输入收款公司全称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  联系电话 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={receiptForm.phone}
                  onChange={(e) => setReceiptForm({ ...receiptForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="请输入联系电话"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                收款银行流水号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={receiptForm.transactionId}
                onChange={(e) => setReceiptForm({ ...receiptForm, transactionId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                placeholder="请输入银行收款流水号"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                收款凭证单 <span className="text-red-500">*</span>
              </label>
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer group block">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setReceiptForm({ ...receiptForm, file: e.target.files?.[0] || null })
                  }
                />
                <Upload
                  className="mx-auto text-gray-400 group-hover:text-green-500 mb-2"
                  size={20}
                />
                <div className="text-sm text-gray-600 group-hover:text-green-600">
                  {receiptForm.file ? receiptForm.file.name : '点击上传收款凭证'}
                </div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                驳回原因 (仅驳回时需要)
              </label>
              <input
                type="text"
                value={receiptForm.rejectReason || ''}
                onChange={(e) => setReceiptForm({ ...receiptForm, rejectReason: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                placeholder="如果驳回，请填写驳回原因"
              />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => setActiveModal('none')}
            className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              if (!receiptForm.rejectReason) {
                showToast('请填写驳回原因')
                return
              }
              showToast('已驳回付款申请')
              setMonitoringData((prev) =>
                prev.map((item) =>
                  item.id === selectedItem.id || item.orderId === selectedItem.id
                    ? { ...item, status: 'rejected' }
                    : item,
                ),
              )
              setLocalOrders((prev) =>
                prev.map((o) =>
                  o.id === (selectedItem.orderId || selectedItem.id)
                    ? {
                        ...o,
                        paymentStatus: 'Rejected',
                        status: 'Rejected',
                        rejectReason: receiptForm.rejectReason,
                      }
                    : o,
                ),
              )
              setActiveModal('none')
            }}
            className="px-5 py-2.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors shadow-sm border border-red-200"
          >
            驳回申请
          </button>
          <button
            onClick={() => {
              if (!receiptForm.companyName || !receiptForm.phone || !receiptForm.transactionId) {
                showToast('请填写完整的公司信息和流水号')
                return
              }
              showToast('收款已确认，状态已更新')
              setMonitoringData((prev) =>
                prev.map((item) =>
                  item.id === selectedItem.id || item.orderId === selectedItem.id
                    ? { ...item, status: 'paid' }
                    : item,
                ),
              )
              let updatedOrderToProcess = null
              setLocalOrders((prev) => {
                const newOrders = prev.map((o) => {
                  if (o.id === (selectedItem.orderId || selectedItem.id)) {
                    // Use selectedItem.orderId or id since it maps to localOrders now
                    // Extend expire date by 30 days for mock
                    const currentExpire = new Date(o.expireDate || new Date())
                    currentExpire.setDate(currentExpire.getDate() + 30)

                    // Add to history
                    const newHistory = [...(o.history || [])]
                    newHistory.push({
                      date: new Date().toLocaleString(),
                      event: '线下付款已确认，服务已顺延',
                    })

                    const updatedOrder = {
                      ...o,
                      status: 'Paid', // Set status to Paid
                      paymentStatus: 'Paid', // Also update paymentStatus
                      expireDate: currentExpire.toISOString().split('T')[0],
                      history: newHistory,
                      payTime: new Date().toLocaleString(),
                      paymentMethod: 'CorporateRemittance',
                    }
                    updatedOrderToProcess = updatedOrder
                    return updatedOrder
                  }
                  return o
                })
                return newOrders
              })
              if (updatedOrderToProcess) {
                processSuccessfulPayment(updatedOrderToProcess)
              }
              setActiveModal('none')
            }}
            className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm"
          >
            确认已收款
          </button>
        </div>
      </div>
    </div>
  )
}
export default ConfirmPaymentModal
