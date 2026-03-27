import React from 'react';
import { Search, Download, Upload, Repeat, FileText, Clock, CheckCircle, Trash2, AlertCircle, AlertTriangle } from 'lucide-react';
import { PaymentStatusBadge } from '@/components/Badges'; // 自定义徽章组件，需实现
import type { BuyerOrder } from '../../types/profile';

interface BuyerOrdersProps {
  orders: BuyerOrder[];
  orderSearch: string;
  setOrderSearch: (val: string) => void;
  orderStatusFilter: string;
  setOrderStatusFilter: (val: string) => void;
  onOpenModal: (type: string, item: any) => void;
  onDeleteOrder: (id: string) => void;
  onNavigate: (view: string, params?: any) => void;
}

export const BuyerOrders: React.FC<BuyerOrdersProps> = ({
  orders,
  orderSearch,
  setOrderSearch,
  orderStatusFilter,
  setOrderStatusFilter,
  onOpenModal,
  onDeleteOrder,
  onNavigate,
}) => {
  const filteredOrders = orders.filter(
    (o) =>
      (orderStatusFilter === 'all' || o.paymentStatus === orderStatusFilter) &&
      (o.productName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.id.toLowerCase().includes(orderSearch.toLowerCase()))
  );

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            'all',
            'PendingPayment',
            'UnderReview',
            'Rejected',
            'Paid',
            'PaymentFailed',
            'Cancelled',
          ].map((status) => (
            <button
              key={status}
              onClick={() => setOrderStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                orderStatusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'all'
                ? '全部订单'
                : status === 'PendingPayment'
                  ? '待支付'
                  : status === 'UnderReview'
                    ? '审核中'
                    : status === 'Rejected'
                      ? '已驳回'
                      : status === 'Paid'
                        ? '已支付'
                        : status === 'PaymentFailed'
                          ? '支付失败'
                          : '已取消'}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="搜索订单号或产品..."
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
          >
            {/* Order Header: ID, Time, Status */}
            <div className="bg-gray-50/50 px-4 py-2.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="font-mono text-gray-600">订单号: {order.id}</span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <span>{order.createTime}</span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <span>
                  支付方式:{' '}
                  {order.paymentMethod === 'Alipay'
                    ? '支付宝'
                    : order.paymentMethod === 'WeChat'
                      ? '微信支付'
                      : order.paymentMethod === 'CorporateRemittance'
                        ? '对公转账'
                        : order.paymentMethod === 'Free'
                          ? '体验试用'
                          : order.paymentMethod}
                </span>
              </div>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>

            <div className="p-5 flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Left: Product Info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 mt-1 bg-white text-blue-600">
                  {/* 此处可使用图标 */}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 leading-tight mb-1">
                      {order.productName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-medium">
                        {order.version}
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-600">
                        {order.orderType === 'Trial'
                          ? '试用订单'
                          : order.orderType === 'Renewal'
                            ? '续费订单'
                            : order.orderType === 'ResourcePack'
                              ? '扩展资源包订单'
                              : '新购订单'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Price & Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-end xl:items-center gap-4 lg:gap-6 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0">
                <div className="text-left sm:text-right lg:text-right min-w-[100px]">
                  <div className="font-bold text-gray-900 text-lg font-mono">
                    ¥ {order.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {order.orderType === 'ResourcePack' ? '一次性支付' : '实付金额'}
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
                    {order.paymentStatus === 'PendingPayment' && order.paymentMethod === 'CorporateRemittance' && (
                      <button
                        onClick={() => onOpenModal('upload_receipt', order)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap flex items-center gap-1"
                      >
                        <Upload size={12} /> 上传付款回执
                      </button>
                    )}
                    {order.paymentStatus === 'PendingPayment' && order.paymentMethod !== 'CorporateRemittance' && (
                      <button
                        onClick={() => onOpenModal('payment_application', order)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700 transition-colors shadow-sm whitespace-nowrap flex items-center gap-1"
                      >
                        <Download size={12} /> 去支付
                      </button>
                    )}
                    {order.paymentStatus === 'PaymentFailed' && (
                      <button
                        onClick={() =>
                          onNavigate('detail', {
                            id: order.resourceId,
                            action: 'purchase',
                          })
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap flex items-center gap-1"
                      >
                        <Repeat size={12} /> 重新支付
                      </button>
                    )}
                    {order.paymentStatus === 'UnderReview' && (
                      <button
                        onClick={() => onOpenModal('upload_receipt', order)}
                        className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap"
                      >
                        重新上传回执
                      </button>
                    )}
                    {order.paymentStatus === 'Rejected' && (
                      <button
                        onClick={() => onOpenModal('upload_receipt', order)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap"
                      >
                        重新上传回执
                      </button>
                    )}
                    {order.paymentStatus === 'Paid' &&
                      (order.orderType === 'Trial' || order.orderType === 'New' || order.orderType === 'Renewal') && (
                        <button
                          onClick={() =>
                            onNavigate('detail', {
                              id: order.resourceId,
                              action: 'purchase',
                              upgrade_instance_id: order.id,
                            })
                          }
                          className="px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm border border-blue-200 whitespace-nowrap"
                        >
                          续费
                        </button>
                      )}
                    {order.paymentStatus === 'Paid' &&
                      order.orderType !== 'ResourcePack' &&
                      order.orderType !== 'Trial' && (
                        <button
                          onClick={() =>
                            onNavigate('resource_packs', {
                              id: order.resourceId,
                              action: 'purchase',
                            })
                          }
                          className="px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm border border-blue-200 whitespace-nowrap"
                        >
                          补充资源包
                        </button>
                      )}
                    {order.invoiceStatus === 'Unissued' && order.paymentStatus === 'Paid' && order.amount > 0 && (
                      <button
                        onClick={() => onOpenModal('request_invoice', order)}
                        className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap flex items-center gap-1"
                      >
                        <FileText size={12} /> 申请发票
                      </button>
                    )}
                    {order.invoiceStatus === 'Pending' && (
                      <div className="px-3 py-2 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1">
                        <Clock size={12} /> 开票中
                      </div>
                    )}
                    {order.invoiceStatus === 'Issued' && (
                      <div className="px-3 py-2 bg-green-50 text-green-600 border border-green-100 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1">
                        <CheckCircle size={12} /> 已开票
                      </div>
                    )}
                    <button
                      onClick={() => onOpenModal('order_detail', order)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors whitespace-nowrap"
                    >
                      详情
                    </button>
                    <button
                      onClick={() => onDeleteOrder(order.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除记录"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Status Banners */}
                  {order.status === 'Pending' && order.paymentMethod === 'CorporateRemittance' && (
                    <div className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-md border border-orange-100 flex items-center gap-1 justify-end">
                      <AlertCircle size={12} /> 如已线下付款，请及时上传付款回执
                    </div>
                  )}
                  {order.status === 'UnderReview' && (
                    <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 flex items-center gap-1 justify-end">
                      <Clock size={12} /> 付款回执审核中，请耐心等待
                    </div>
                  )}
                  {order.status === 'Rejected' && (
                    <div className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-md border border-red-100 flex items-center gap-1 justify-end">
                      <AlertTriangle size={12} /> 驳回原因：{order.rejectReason || '回执信息有误'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-gray-400 font-bold">暂无相关订单</div>
          </div>
        )}
      </div>
    </div>
  );
};