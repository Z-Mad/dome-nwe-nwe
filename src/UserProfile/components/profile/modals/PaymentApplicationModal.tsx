// components/profile/modals/PaymentApplicationModal.tsx
import React from 'react';
import { X, FileText, Download } from 'lucide-react';
import type { BuyerBill, BuyerOrder } from '../../../types/profile';

interface PaymentApplicationModalProps {
  item: BuyerBill | BuyerOrder;
  onClose: () => void;
  onDownload: () => void;
}

export const PaymentApplicationModal: React.FC<PaymentApplicationModalProps> = ({ item, onClose, onDownload }) => {
  const isBill = 'period' in item;
  const id = item.id;
  const amount = item.amount;
  const purpose = isBill
    ? `${(item as BuyerBill).period} 平台服务费及资源使用费`
    : `${(item as BuyerOrder).productName} 购买费用`;
  const label = isBill ? '账单编号' : '订单编号';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" /> 支付申请单预览
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 bg-gray-50">
          <div className="bg-white p-10 shadow-sm border border-gray-200 mx-auto max-w-xl" style={{ minHeight: '600px' }}>
            <div className="text-center mb-8 border-b-2 border-gray-900 pb-4">
              <h1 className="text-2xl font-bold tracking-widest text-gray-900">支付申请单</h1>
              <p className="text-sm text-gray-500 mt-2">PAYMENT APPLICATION FORM</p>
            </div>

            <div className="flex justify-between text-sm mb-6">
              <div>
                <span className="text-gray-500">申请日期：</span> {new Date().toLocaleDateString()}
              </div>
              <div>
                <span className="text-gray-500">{label}：</span> {id}
              </div>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm mb-8">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 bg-gray-50 w-32 font-medium">收款方名称</td>
                  <td className="border border-gray-300 p-3 font-bold">AI Studio 平台运营方</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 bg-gray-50 font-medium">收款方账号</td>
                  <td className="border border-gray-300 p-3 font-mono">1234 5678 9012 3456</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 bg-gray-50 font-medium">开户银行</td>
                  <td className="border border-gray-300 p-3">招商银行股份有限公司北京分行</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 bg-gray-50 font-medium">支付金额</td>
                  <td className="border border-gray-300 p-3">
                    <span className="font-bold text-lg">
                      ¥ {amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 bg-gray-50 font-medium">款项用途</td>
                  <td className="border border-gray-300 p-3">{purpose}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 bg-gray-50 font-medium">备注说明</td>
                  <td className="border border-gray-300 p-3 text-gray-600">
                    请在汇款附言中注明{label}：{id}，以便财务及时核销。
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between mt-16 pt-8 border-t border-gray-200">
              <div className="text-center w-32">
                <div className="border-b border-gray-400 h-8 mb-2"></div>
                <span className="text-sm text-gray-500">申请人签字</span>
              </div>
              <div className="text-center w-32">
                <div className="border-b border-gray-400 h-8 mb-2"></div>
                <span className="text-sm text-gray-500">部门主管审批</span>
              </div>
              <div className="text-center w-32">
                <div className="border-b border-gray-400 h-8 mb-2"></div>
                <span className="text-sm text-gray-500">财务审批</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors">
            关闭
          </button>
          <button
            onClick={onDownload}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download size={16} /> 下载 PDF
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <FileText size={16} /> 打印单据
          </button>
        </div>
      </div>
    </div>
  );
};