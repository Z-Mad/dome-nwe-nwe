// components/profile/modals/RefundRequestModal.tsx
import React, { useState } from 'react';
import { X, RefreshCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import type { BuyerOrder } from '../types/profile';
import { REFUND_REASONS } from '../constants/profile';

interface RefundRequestModalProps {
  order: BuyerOrder;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({ order, onClose, onSubmit }) => {
  const [refundReason, setRefundReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isResourcePack = order.type === 'ResourcePack';

  // Mock refund calculation
  const usedDays = 4;
  const totalDays = 365;
  const usageRatio = usedDays / totalDays;
  const penaltyRatio = 0.15;
  const baseRefund = order.amount * (1 - usageRatio);
  const penalty = order.amount * penaltyRatio;
  const refundAmount = Math.max(0, baseRefund - penalty);

  const handleSubmit = () => {
    if (!refundReason) return;
    setIsLoading(true);
    onSubmit(refundReason);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex justify-end animate-in fade-in">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <RefreshCcw size={20} className="text-orange-500" /> 申请售后 / 退款服务
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
            <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
              <AlertTriangle size={18} /> 服务终止规则 (Termination Rules)
            </h4>
            <ul className="space-y-2 text-xs text-orange-700 list-disc pl-4">
              <li>
                <span className="font-bold">基础订阅：</span>
                按剩余天数折算，并收取剩余价值 <span className="font-bold">15%</span> 的违约金。
              </li>
              <li>
                <span className="font-bold">资源包：</span>
                未通过资源包全额退款；已使用（哪怕仅用1%）的资源包<span className="font-bold">不予退款</span>。
              </li>
              <li>
                <span className="font-bold">数据安全：</span>
                退款申请通过后，云端存储的工艺数据将保留<span className="font-bold">7天后永久擦除</span>。
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">退款明细预估</h4>
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
              {!isResourcePack ? (
                <div className="flex justify-between items-start pb-4 border-b border-gray-50">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">基础订阅 (Base Plan)</div>
                    <div className="text-xs text-gray-400 mt-1">- 已使用时长 (Usage)</div>
                    <div className="text-xs text-gray-400">- 违约金 (Penalty 15%)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">原价 ¥{order.amount.toLocaleString()}</div>
                    <div className="text-xs text-red-500">
                      - ¥{(order.amount * usageRatio).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-red-500">
                      - ¥{penalty.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div className="font-bold text-gray-900 mt-1">
                      ¥{refundAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">资源包 (Resource Pack)</div>
                    <div className="text-xs text-gray-400 mt-1">{order.productName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">原价 ¥{order.amount.toLocaleString()}</div>
                    <div className="text-xs text-green-600 font-bold flex items-center justify-end gap-1">
                      <CheckCircle size={10} /> 全额可退
                    </div>
                    <div className="text-xs text-green-600 font-bold">+ ¥{order.amount.toLocaleString()}</div>
                  </div>
                </div>
              )}

              {!isResourcePack && (
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">资源包处置 (RESOURCE DISPOSITION)</div>
                    <div className="text-xs text-gray-400 mt-1">大语言模型算力包 (20k)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">状态</div>
                    <div className="text-xs text-green-600 font-bold flex items-center justify-end gap-1">
                      <CheckCircle size={10} /> 全额可退
                    </div>
                    <div className="text-xs text-green-600 font-bold">+ ¥699</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 bg-green-50 rounded-xl p-4 flex justify-between items-center border border-green-100">
              <span className="font-bold text-green-800 text-sm">预计原路退回总额</span>
              <span className="font-bold text-green-700 text-2xl font-mono">
                ¥ {(isResourcePack ? order.amount : refundAmount + 699).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">退款原因 (Reason)</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {REFUND_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setRefundReason(reason)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                    refundReason === reason
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
            <textarea
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
              rows={4}
              placeholder="请补充详细说明..."
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!refundReason || isLoading}
            className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {isLoading ? '提交中...' : '确认并提交申请'}
          </button>
        </div>
      </div>
    </div>
  );
};