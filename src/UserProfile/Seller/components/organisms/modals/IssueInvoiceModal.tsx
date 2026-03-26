import { FileText, Loader2, Upload, X } from 'lucide-react'
import { useState } from 'react'

interface Order {
  id: string
  [key: string]: any
}

interface IssueInvoiceModalProps {
  selectedItem: Order
  closeModal: () => void
  showToast: (message: string) => void
  setLocalOrders: (orders: Order[] | ((prev: Order[]) => Order[])) => void
}

export const IssueInvoiceModal = ({ selectedItem, closeModal, showToast, setLocalOrders }: IssueInvoiceModalProps) => {
  const [isLoading, setIsLoading] = useState(false)

  if (!selectedItem) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-orange-600" /> 开具发票
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="bg-orange-50 p-4 rounded-xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">关联订单：</span>
              <span className="font-medium text-gray-900">{selectedItem.id}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">开票金额：</span>
              <span className="font-bold text-orange-600 font-mono text-lg">
                ¥{selectedItem.amount?.toLocaleString() || '0.00'}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">买方名称：</span>
              <span className="font-medium text-gray-900">
                {selectedItem.provider || '某企业客户'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">纳税人识别号：</span>
              <span className="font-medium text-gray-900 font-mono">91310000XXXXXXXXXX</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                发票号码 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="请输入发票号码"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">发票代码</label>
              <input
                type="text"
                placeholder="请输入发票代码（选填）"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                电子发票文件 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-orange-300 transition-colors cursor-pointer">
                <Upload size={24} className="mb-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">点击或拖拽上传发票文件</p>
                <p className="text-xs text-gray-400 mt-1">支持 PDF, JPG, PNG 格式，最大 5MB</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
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
                showToast('发票已开具并发送至买家邮箱')
                setLocalOrders((prev) =>
                  prev.map((o) =>
                    o.id === selectedItem.id ? { ...o, invoiceStatus: 'Issued' } : o,
                  ),
                )
                closeModal()
              }, 1500)
            }}
            disabled={isLoading}
            className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : '确认开票'}
          </button>
        </div>
      </div>
    </div>
  )
}
export default IssueInvoiceModal
