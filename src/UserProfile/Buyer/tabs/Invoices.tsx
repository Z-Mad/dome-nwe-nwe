import React, { useState } from "react";
import { Receipt, Settings, CheckCircle, Download, FileText, AlertCircle, Trash2, Box, Clock } from "lucide-react";
import { useUserProfile } from "../../Core/useUserProfileStore";
import { INITIAL_INVOICE_HEADERS } from "../constants";
import { useBuyerStore } from "../useBuyerStore";

const BuyerInvoices: React.FC = () => {
  const { localOrders, openModal, showToast } = useUserProfile();
  const [invoiceSubTab, setInvoiceSubTab] = useState<"invoiceable" | "history">("invoiceable");
  const { invoices, invoiceHeaders, setInvoiceHeaders } = useBuyerStore();
  // Mock bills data for rendering "unissued" logic
  // Real implementation might need this from a global context if shared with Bills
  const bills: any[] = []; 

  const invoiceableBills = React.useMemo(() => {
    return bills.filter(b => b.status === "paid" && b.invoiceStatus === "unissued");
  }, [bills]);

  const invoiceableOrders = React.useMemo(() => {
    return localOrders.filter(o => o.paymentStatus === "Paid" && o.invoiceStatus === "Unissued" && o.amount > 0);
  }, [localOrders]);

  const hasInvoiceableItems = invoiceableBills.length > 0 || invoiceableOrders.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Invoice Headers Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Settings size={20} className="text-gray-600" /> 发票抬头管理
          </h3>
          <button
            onClick={() => openModal("invoice_header")}
            className="text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors"
          >
            + 新增抬头
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoiceHeaders.map((header) => (
            <div
              key={header.id}
              className={`p-4 rounded-xl border-2 transition-all relative ${
                header.isDefault
                  ? "border-blue-500 bg-blue-50/30"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {header.isDefault && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
                  默认
                </div>
              )}
              <div className="font-bold text-gray-900 mb-1 pr-8">
                {header.title}
              </div>
              <div className="text-xs text-gray-500 space-y-1 mb-4">
                <div>税号: {header.taxId}</div>
                <div className="truncate">类型: {header.type}</div>
              </div>
              <div className="flex justify-end gap-3 mt-auto">
                <button
                  onClick={() => openModal("invoice_header", { headerId: header.id })}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                >
                  编辑
                </button>
                {!header.isDefault && (
                  <button
                    onClick={() => {
                      setInvoiceHeaders((prev) =>
                        prev.map((h) => ({ ...h, isDefault: h.id === header.id }))
                      );
                      showToast("已设为默认抬头");
                    }}
                    className="text-xs text-gray-500 hover:text-gray-900 font-bold"
                  >
                    设为默认
                  </button>
                )}
                <button
                  onClick={() => {
                    if (window.confirm("确定删除该发票抬头吗？")) {
                      setInvoiceHeaders((prev) => prev.filter((h) => h.id !== header.id));
                      showToast("发票抬头已删除");
                    }
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-bold"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Management Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center bg-gray-50/50">
          <div className="flex gap-6">
            <button
              onClick={() => setInvoiceSubTab("invoiceable")}
              className={`font-bold text-sm transition-colors relative ${
                invoiceSubTab === "invoiceable"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              可开票订单/账单
              {invoiceSubTab === "invoiceable" && (
                <div className="absolute -bottom-4.5 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setInvoiceSubTab("history")}
              className={`font-bold text-sm transition-colors relative ${
                invoiceSubTab === "history"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              开票记录
              {invoiceSubTab === "history" && (
                <div className="absolute -bottom-4.5 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          </div>
        </div>

        <div className="p-0">
          {invoiceSubTab === "invoiceable" ? (
            <div className="divide-y divide-gray-100">
              {invoiceableBills.map((bill) => (
                <div key={`bill-${bill.id}`} className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
                  <div>
                    <div className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      账单：{bill.period}
                    </div>
                    <div className="text-xs text-gray-500 flex gap-4">
                      <span>包含 {bill.count} 个订单</span>
                      <span>结清日期：{bill.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">¥{bill.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                      <div className="text-[10px] text-gray-400">可开票金额</div>
                    </div>
                    <button
                      onClick={() => openModal("request_invoice", { billId: bill.id })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      申请开票
                    </button>
                  </div>
                </div>
              ))}
              {invoiceableOrders.map((order) => (
                <div key={`order-${order.id}`} className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
                  <div>
                    <div className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                      <Box size={16} className="text-gray-400" />
                      订单：{order.id}
                    </div>
                    <div className="text-xs text-gray-500 flex gap-4">
                      <span>产品：{order.productName}</span>
                      <span>支付时间：{order.createTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">¥{order.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                      <div className="text-[10px] text-gray-400">可开票金额</div>
                    </div>
                    <button
                      onClick={() => openModal("request_invoice", { orderId: order.id })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      申请开票
                    </button>
                  </div>
                </div>
              ))}
              {!hasInvoiceableItems && (
                <div className="py-12 text-center text-gray-400">
                  <CheckCircle size={32} className="mx-auto mb-2 text-green-400" />
                  <p>太棒了，暂无需要开票的订单/账单</p>
                </div>
              )}
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">发票编号</th>
                  <th className="px-6 py-4">关联订单/账单</th>
                  <th className="px-6 py-4">抬头/类型</th>
                  <th className="px-6 py-4">开票金额</th>
                  <th className="px-6 py-4">申请时间</th>
                  <th className="px-6 py-4">状态</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-600">
                      {inv.id}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {inv.relatedId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{inv.title}</div>
                      <div className="text-xs text-gray-500">{inv.type}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">
                      ¥{inv.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{inv.date}</td>
                    <td className="px-6 py-4">
                      {inv.status === "issued" ? (
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-bold flex items-center gap-1 w-fit">
                          <CheckCircle size={12} /> 已开具
                        </span>
                      ) : (
                        <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded font-bold flex items-center gap-1 w-fit">
                          <Clock size={12} /> 开票中
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inv.status === "issued" ? (
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              showToast("发票PDF下载中...");
                              setTimeout(() => showToast("下载成功"), 1000);
                            }}
                            className="text-blue-600 font-bold hover:text-blue-800 text-xs flex items-center gap-1"
                          >
                            <Download size={12} /> 下载
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerInvoices;