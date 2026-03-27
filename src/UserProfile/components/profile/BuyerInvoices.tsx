// components/profile/BuyerInvoices.tsx
import React from 'react';
import { Receipt, Settings, FilePlus, History, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import type { BuyerInvoice } from '../../types/profile';

interface BuyerInvoicesProps {
  invoices: BuyerInvoice[];
  invoiceSubTab: 'invoiceable' | 'history';
  setInvoiceSubTab: (tab: 'invoiceable' | 'history') => void;
  onOpenModal: (type: string, item: any) => void;
}

export const BuyerInvoices: React.FC<BuyerInvoicesProps> = ({
  invoices,
  invoiceSubTab,
  setInvoiceSubTab,
  onOpenModal,
}) => {
  // 模拟可开票数据（实际应从父组件传入）
  const invoiceableItems = [
    { id: 'bill_202504', period: '2025年4月', amount: 12450, type: 'bill' },
    { id: 'ord_8821', productName: '数字冷轧质量管理', amount: 5800, type: 'order' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <Receipt size={20} className="text-blue-600" /> 发票管理 (Invoices)
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => onOpenModal('invoice_header', null)}
            className="text-gray-600 text-sm font-medium hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <Settings size={14} /> 发票抬头管理
          </button>
        </div>
      </div>

      <div className="flex gap-8 border-b border-gray-200">
        <button
          onClick={() => setInvoiceSubTab('invoiceable')}
          className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all ${
            invoiceSubTab === 'invoiceable'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FilePlus size={18} /> 可开票账单
        </button>
        <button
          onClick={() => setInvoiceSubTab('history')}
          className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all ${
            invoiceSubTab === 'history'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <History size={18} /> 开票记录
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {invoiceSubTab === 'invoiceable' ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">关联账单/订单</th>
                <th className="px-6 py-4 font-medium">可开票金额</th>
                <th className="px-6 py-4 font-medium">状态</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoiceableItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {item.type === 'bill' ? `${item.period} 账单` : `${item.productName} 订单`}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">
                    ¥{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-xs">未开票</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onOpenModal('request_invoice', item)}
                      className="text-blue-600 font-bold hover:text-blue-700 text-xs"
                    >
                      申请发票
                    </button>
                  </td>
                </tr>
              ))}
              {invoiceableItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    暂无可开票账单/订单
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">发票编号</th>
                <th className="px-6 py-4 font-medium">关联账单</th>
                <th className="px-6 py-4 font-medium">发票金额</th>
                <th className="px-6 py-4 font-medium">发票类型</th>
                <th className="px-6 py-4 font-medium">申请日期</th>
                <th className="px-6 py-4 font-medium">状态</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-900">{invoice.id}</td>
                  <td className="px-6 py-4 text-gray-600">{invoice.relatedId}</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">
                    ¥{invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{invoice.type}</td>
                  <td className="px-6 py-4 text-gray-600">{invoice.date}</td>
                  <td className="px-6 py-4">
                    {invoice.status === 'issued' || invoice.status === 'Issued' ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <CheckCircle size={12} /> 已开票
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-orange-600 text-xs font-medium">
                        <Clock size={12} /> 开票中
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-4">
                      {invoice.status === 'issued' || invoice.status === 'Issued' ? (
                        <button
                          onClick={() => window.open('/invoice-preview.pdf', '_blank')}
                          className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-1 text-xs transition-colors"
                        >
                          <ExternalLink size={12} /> 预览发票
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};