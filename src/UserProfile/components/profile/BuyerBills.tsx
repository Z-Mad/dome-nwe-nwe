import React from 'react';
import { FileText, Download, CheckCircle } from 'lucide-react';
import type { BuyerBill } from '../../types/profile';

interface BuyerBillsProps {
  bills: BuyerBill[];
  onOpenModal: (type: string, item: any) => void;
  onPayBill: (bill: BuyerBill) => void;
}

export const BuyerBills: React.FC<BuyerBillsProps> = ({ bills, onOpenModal, onPayBill }) => {
  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <FileText size={20} className="text-blue-600" /> 账单管理 (Bills)
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => onOpenModal('export_statement', null)}
            className="text-gray-600 text-sm font-medium hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <Download size={14} /> 导出综合月度对账单
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">账期 (Period)</th>
              <th className="px-6 py-4 font-medium">出账日期</th>
              <th className="px-6 py-4 font-medium">账单金额</th>
              <th className="px-6 py-4 font-medium">包含订单数</th>
              <th className="px-6 py-4 font-medium">状态</th>
              <th className="px-6 py-4 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bills.map((bill) => (
              <tr key={bill.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-bold text-gray-900">{bill.period}</td>
                <td className="px-6 py-4 text-gray-600">{bill.date}</td>
                <td className="px-6 py-4 font-mono font-bold text-gray-900">
                  ¥{bill.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-gray-600">{bill.count}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded font-bold ${
                      bill.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {bill.status === 'paid' ? '已结清' : '待支付'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-4">
                    <button
                      onClick={() => onOpenModal('bill_detail', bill)}
                      className="text-blue-600 font-bold hover:text-blue-800 transition-colors text-xs"
                    >
                      账单明细
                    </button>
                    {bill.status === 'unpaid' ? (
                      <>
                        <button
                          onClick={() => onOpenModal('pay_bill', bill)}
                          className="text-red-600 font-bold hover:text-red-700 text-xs"
                        >
                          去支付
                        </button>
                        <button
                          onClick={() => onOpenModal('payment_application', bill)}
                          className="text-orange-600 font-bold hover:text-orange-700 text-xs flex items-center gap-1"
                        >
                          <Download size={12} /> 支付申请单
                        </button>
                      </>
                    ) : (
                      <>
                        {bill.invoiceStatus === 'unissued' && (
                          <button
                            onClick={() => onOpenModal('request_invoice', bill)}
                            className="text-blue-600 font-bold hover:text-blue-800 text-xs transition-colors"
                          >
                            申请发票
                          </button>
                        )}
                        {bill.invoiceStatus === 'Pending' && (
                          <span className="text-orange-500 font-bold text-xs">开票中</span>
                        )}
                        {bill.invoiceStatus === 'issued' && (
                          <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                            <CheckCircle size={12} /> 已开票
                          </span>
                        )}
                        <button
                          onClick={() => {
                            // 下载账单逻辑
                          }}
                          className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-xs transition-colors"
                        >
                          <Download size={12} /> 下载账单
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};