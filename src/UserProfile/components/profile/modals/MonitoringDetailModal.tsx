import React from 'react';
import { X, FileText, Box, Scale } from 'lucide-react';
import type { SellerMonitoringItem } from '../../../types/profile';

interface MonitoringDetailModalProps {
  item: SellerMonitoringItem;
  onClose: () => void;
}

export const MonitoringDetailModal: React.FC<MonitoringDetailModalProps> = ({
  item,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex justify-end animate-in fade-in">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" /> 监控与订单详情 (Monitoring & Order Details)
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Box size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-gray-900">{item.asset}</h2>
                    <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                      {item.version}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono mb-1">
                    监控ID: {item.id} <span className="mx-1">|</span> 客户: {item.buyer}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {item.status === 'unbilled' && <span className="text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full text-xs font-medium border border-orange-100">待请款</span>}
                {item.status === 'under_review' && <span className="text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full text-xs font-medium border border-purple-100">待确认收款</span>}
                {item.status === 'rejected' && <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-medium border border-red-100">已驳回</span>}
                {item.status === 'paid' && <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium border border-green-100">已支付</span>}
                {item.status === 'running' && <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-100">正常运行中</span>}
                <div className="text-2xl font-bold text-gray-900 mt-2 font-mono">
                  ¥ {item.estimatedCost?.toLocaleString() || '0.00'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div>
                <div className="text-xs text-gray-400 mb-1">计费规则</div>
                <div className="font-bold text-gray-900 text-sm">{item.plan}</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-xs text-gray-400 mb-1">实例名称</div>
                <div className="font-bold text-gray-900 text-sm break-all">{item.instanceName || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">实例ID</div>
                <div className="font-bold text-gray-900 text-sm font-mono">{item.instanceId}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">关联订单</div>
                <div className="font-bold text-gray-900 text-sm font-mono">{item.orderId}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Scale size={18} className="text-orange-500" /> 用量与费用明细 (USAGE & FEES)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">当前计费周期</div>
                <div className="font-bold text-gray-900 text-lg font-mono">{item.period}</div>
                <div className="text-xs text-gray-400 mt-1">单价: {item.unitPrice}</div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">计费项</th>
                    <th className="px-4 py-3 text-right">用量</th>
                    <th className="px-4 py-3 text-right">费用小计</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {item.usage?.tokens && (
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900">Token 消耗</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-600">{item.usage.tokens}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-gray-900">¥ {item.feeBreakdown?.tokens?.toFixed(2) || '0.00'}</td>
                    </tr>
                  )}
                  {item.usage?.storage && (
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900">存储占用</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-600">{item.usage.storage}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-gray-900">¥ {item.feeBreakdown?.storage?.toFixed(2) || '0.00'}</td>
                    </tr>
                  )}
                  <tr className="bg-gray-50/50 font-bold">
                    <td colSpan={2} className="px-4 py-4 text-right text-gray-900">合计 (Total)</td>
                    <td className="px-4 py-4 text-right text-indigo-600 font-mono text-lg">¥ {item.estimatedCost?.toFixed(2) || '0.00'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};