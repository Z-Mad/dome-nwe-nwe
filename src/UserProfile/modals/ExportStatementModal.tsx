// components/profile/modals/ExportStatementModal.tsx
import React, { useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import type { BuyerBill } from '../types/profile';

interface ExportStatementModalProps {
  bills: BuyerBill[];
  onClose: () => void;
  onExport: (period: string, format: string) => void;
  isLoading: boolean;
}

export const ExportStatementModal: React.FC<ExportStatementModalProps> = ({ bills, onClose, onExport, isLoading }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [format, setFormat] = useState('xlsx');

  const periods = Array.from(new Set(bills.map((b) => b.period)));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Download size={18} className="text-blue-600" /> 导出综合月度对账单
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
            综合对账单包含您在选定月份内的<strong>所有消费记录</strong>，包括：
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>预付费订单（包年/包月订阅、资源包购买等）</li>
              <li>后付费账单（按量计费的资源消耗）</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择账单月份</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="">请选择月份</option>
              {periods.map((period) => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="exportFormat" value="xlsx" checked={format === 'xlsx'} onChange={() => setFormat('xlsx')} className="text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Excel (.xlsx)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="exportFormat" value="csv" checked={format === 'csv'} onChange={() => setFormat('csv')} className="text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">CSV (.csv)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="exportFormat" value="pdf" checked={format === 'pdf'} onChange={() => setFormat('pdf')} className="text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">PDF (.pdf)</span>
              </label>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
            取消
          </button>
          <button
            onClick={() => onExport(selectedPeriod, format)}
            disabled={isLoading || !selectedPeriod}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : '确认导出'}
          </button>
        </div>
      </div>
    </div>
  );
};