import React, { useState } from 'react';
import { Activity, CheckCircle } from 'lucide-react';
import { HEALTH_METRICS } from '../../constants/profile';

interface SellerHealthProps {
  onOpenModal: (type: string, item?: any) => void;
}

export const SellerHealth: React.FC<SellerHealthProps> = ({ onOpenModal }) => {
  const [diagStep, setDiagStep] = useState(0);
  const [activeModal, setActiveModal] = useState<'none' | 'health_diag'>('none');

  const handleStartDiagnosis = () => {
    setActiveModal('health_diag');
    setDiagStep(0);
    // Simulate steps
    setTimeout(() => setDiagStep(1), 500);
    setTimeout(() => setDiagStep(2), 1500);
    setTimeout(() => setDiagStep(3), 2500);
    setTimeout(() => setDiagStep(4), 3500);
  };

  const handleCloseDiagnosis = () => {
    setActiveModal('none');
  };

  if (activeModal === 'health_diag') {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-2xl animate-in fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="text-green-400 animate-pulse" />
          <h3 className="font-bold text-lg">系统深度诊断中...</h3>
        </div>
        <div className="space-y-4 font-mono text-sm">
          <div className={`flex items-center gap-3 ${diagStep >= 1 ? 'text-green-400' : 'text-gray-600'}`}>
            {diagStep >= 1 ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border border-gray-600" />}
            检查节点连通性... {diagStep >= 1 && 'OK'}
          </div>
          <div className={`flex items-center gap-3 ${diagStep >= 2 ? 'text-green-400' : 'text-gray-600'}`}>
            {diagStep >= 2 ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border border-gray-600" />}
            验证数据库一致性... {diagStep >= 2 && 'OK'}
          </div>
          <div className={`flex items-center gap-3 ${diagStep >= 3 ? 'text-green-400' : 'text-gray-600'}`}>
            {diagStep >= 3 ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border border-gray-600" />}
            分析 API 响应延迟... {diagStep >= 3 && 'OK'}
          </div>
          {diagStep >= 4 && (
            <div className="mt-4 pt-4 border-t border-gray-700 text-green-400 font-bold">
              诊断完成，系统运行正常。
              <button onClick={handleCloseDiagnosis} className="ml-4 text-white underline text-xs">
                关闭
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-900">服务健康状态</h3>
        <button onClick={handleStartDiagnosis} className="text-indigo-600 text-sm font-bold hover:underline">
          开始诊断
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HEALTH_METRICS.map((metric, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-sm text-gray-800">{metric.name}</div>
              <div
                className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                  metric.status === 'healthy' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${metric.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                {metric.status === 'healthy' ? '正常' : '降级'}
              </div>
            </div>
            <div className="h-16 flex items-end justify-between gap-1 mt-2">
              {metric.latency.map((val, idx) => (
                <div
                  key={idx}
                  className="w-full bg-indigo-100 rounded-t-sm relative group"
                  style={{ height: `${Math.min(100, (val / 300) * 100)}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {val}ms
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right text-xs text-gray-400 mt-2">Avg: {metric.avg}</div>
          </div>
        ))}
      </div>
    </div>
  );
};