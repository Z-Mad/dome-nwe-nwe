import { X } from 'lucide-react'
import React from 'react'

export const BillDetailModal = ({ selectedItem, closeModal, openModal }: any) => {
  if (!selectedItem) return null
  const bill = selectedItem

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-lg">账单明细</h3>
            <span className="text-sm text-gray-500 font-medium">({bill.period})</span>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 shadow-sm flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500 mb-1 font-medium">本期账单金额</div>
              <div className="text-3xl font-bold font-mono text-gray-900">
                ¥
                {bill.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1 font-medium">状态</div>
              <div
                className={`text-lg font-bold ${bill.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}
              >
                {bill.status === 'paid' ? '已结清' : '待支付'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h4 className="font-bold text-gray-900">费用明细</h4>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-medium">实例名称</th>
                  <th className="px-6 py-3 font-medium">应用/资源包</th>
                  <th className="px-6 py-3 font-medium">计费类型</th>
                  <th className="px-6 py-3 font-medium text-right">金额</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bill.details?.map((detail: any, index: number) => (
                  <React.Fragment key={index}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{detail.instanceName}</td>
                      <td className="px-6 py-4 text-gray-600">{detail.productName}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                          {detail.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                        ¥
                        {detail.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                    {detail.usageItems && detail.usageItems.length > 0 && (
                      <tr className="bg-gray-50/30">
                        <td colSpan={4} className="px-6 py-3 border-t border-gray-50">
                          <div className="pl-4 border-l-2 border-blue-200">
                            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                              资源消耗明细
                            </div>
                            <div className="space-y-2">
                              {detail.usageItems.map((item: any, itemIdx: number) => (
                                <div
                                  key={itemIdx}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <div className="flex items-center gap-4">
                                    <span className="text-gray-700 font-medium w-32">
                                      {item.name}
                                    </span>
                                    <span className="text-gray-500 text-xs bg-white px-2 py-0.5 rounded border border-gray-200">
                                      {item.usage}
                                    </span>
                                  </div>
                                  <span className="text-gray-600 font-mono">
                                    ¥
                                    {item.amount.toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                    })}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-bold border-t border-gray-100">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right text-gray-600">
                    合计：
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-gray-900 text-base">
                    ¥
                    {bill.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm"
          >
            关闭
          </button>
          {bill.status === 'unpaid' && (
            <button
              onClick={() => openModal('pay_bill', bill)}
              className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md text-sm flex items-center gap-2"
            >
              去支付
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
