import { Download, Receipt, X } from 'lucide-react'

export const PreviewImageModal = ({ previewImageUrl, selectedItem, setActiveModal }: any) => {
  if (!previewImageUrl) return null
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Receipt size={18} className="text-indigo-600" />
            付款凭证预览
          </h3>
          <button
            onClick={() => setActiveModal('order_detail')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 bg-gray-100 flex justify-center items-center min-h-[400px]">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-lg">
            <div className="text-center mb-6 border-b border-dashed border-gray-200 pb-4">
              <h4 className="text-xl font-bold text-gray-900 tracking-widest">电子付款凭证</h4>
              <p className="text-sm text-gray-500 mt-1">Electronic Payment Voucher</p>
            </div>

            {selectedItem && (
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">订单编号：</span>
                  <span className="font-mono text-gray-900">{selectedItem.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">商品名称：</span>
                  <span className="text-gray-900">{selectedItem.appName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">交易金额：</span>
                  <span className="font-mono font-bold text-gray-900">
                    ¥ {selectedItem.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">交易日期：</span>
                  <span className="font-mono text-gray-900">{selectedItem.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">支付方式：</span>
                  <span className="text-gray-900">
                    {selectedItem.paymentMethod === 'Alipay'
                      ? '支付宝'
                      : selectedItem.paymentMethod === 'WeChat'
                        ? '微信支付'
                        : selectedItem.paymentMethod === 'CorporateRemittance'
                          ? '企业汇款'
                          : '其他'}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-2 rounded border border-gray-100 flex justify-center">
              <img
                src={previewImageUrl}
                alt="Preview"
                className="max-w-full h-auto max-h-[40vh] object-contain rounded"
              />
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center text-xs text-gray-400">
              <span>仅供参考，不作为发票使用</span>
              <span>AI Studio 平台生成</span>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={() => {
              const link = document.createElement('a')
              link.href = previewImageUrl
              link.download = 'receipt.jpg'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 text-sm"
          >
            <Download size={16} />
            下载凭证
          </button>
        </div>
      </div>
    </div>
  )
}
export default PreviewImageModal
