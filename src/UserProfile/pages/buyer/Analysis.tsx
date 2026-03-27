import React from 'react';
import { PieChart, TrendingUp } from 'lucide-react';
import { COST_BREAKDOWN } from '../../constants/profile';

const BuyerAnalysis: React.FC = () => {
  const chartData = [
    { month: '1月', sub: 9800, pack: 0, usage: 200, total: 10000 },
    { month: '2月', sub: 9800, pack: 0, usage: 300, total: 10100 },
    { month: '3月', sub: 9800, pack: 2000, usage: 400, total: 12200 },
    { month: '4月', sub: 5800, pack: 2000, usage: 650, total: 8450 },
    { month: '5月', sub: 5800, pack: 2000, usage: 300, total: 8100 },
    { month: '6月', sub: 5800, pack: 1000, usage: 500, total: 7300 },
  ];
  const maxTotal = Math.max(...chartData.map((d) => d.total)) * 1.1;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <PieChart size={20} className="text-purple-600" />
          <h3 className="font-bold text-gray-900">成本与用量分析 (Cost Analysis)</h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-gray-800">月度支出趋势</h4>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>订阅费
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>资源包
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>按量付费
                </div>
              </div>
            </div>

            <div className="h-48 flex items-end justify-between gap-3 relative border-b border-gray-100 pb-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-dashed border-gray-100 w-full h-0"></div>
                ))}
              </div>
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end h-full gap-0.5 relative group cursor-pointer">
                  <div
                    className="w-full bg-orange-400 rounded-t-sm opacity-90 group-hover:opacity-100 transition-opacity"
                    style={{ height: `${(d.usage / maxTotal) * 100}%` }}
                  ></div>
                  <div
                    className="w-full bg-purple-400 rounded-sm opacity-90 group-hover:opacity-100 transition-opacity"
                    style={{ height: `${(d.pack / maxTotal) * 100}%` }}
                  ></div>
                  <div
                    className="w-full bg-blue-500 rounded-b-sm opacity-90 group-hover:opacity-100 transition-opacity"
                    style={{ height: `${(d.sub / maxTotal) * 100}%` }}
                  ></div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded shadow-lg z-10 whitespace-nowrap">
                    <div className="font-bold mb-1">{d.month} 总计: ¥{d.total}</div>
                    <div>订阅: {d.sub}</div>
                    <div>资源包: {d.pack}</div>
                    <div>按量: {d.usage}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 px-2 text-xs text-gray-400">
              {chartData.map((d) => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-72 border-l border-gray-100 pl-8 pt-2">
            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-1">本月总支出</div>
              <div className="text-3xl font-bold text-gray-900">¥ 12,450.00</div>
              <div className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> ↑ 12% 环比增长
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">基础订阅费</span>
                  <span className="font-bold text-gray-900">¥ 9,800</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[80%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">资源包增购</span>
                  <span className="font-bold text-gray-900">¥ 2,000</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full w-[20%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">按量付费</span>
                  <span className="font-bold text-gray-900">¥ 650</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-400 h-full w-[5%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-4">成本构成明细 (Cost Breakdown)</h3>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">费用项 (Item)</th>
                <th className="px-6 py-4">计费模式</th>
                <th className="px-6 py-4 text-right">用量 (Usage)</th>
                <th className="px-6 py-4 text-right">金额 (Amount)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {COST_BREAKDOWN.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-800">{item.item}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{item.type}</td>
                  <td className="px-6 py-4 text-right font-mono text-gray-600">{item.usage}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                    ¥ {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerAnalysis;