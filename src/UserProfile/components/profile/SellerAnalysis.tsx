import React from 'react';
import { User, LayoutDashboard, TrendingUp } from 'lucide-react';

export const SellerAnalysis: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 uppercase font-bold mb-2">总访客数 (Unique Visitors)</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">45,230</div>
          <div className="text-xs text-green-600 font-bold flex items-center gap-1">
            <TrendingUp size={12} /> +12%
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 uppercase font-bold mb-2">平均转化率 (Conversion Rate)</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">2.4%</div>
          <div className="text-xs text-green-600 font-bold flex items-center gap-1">
            <TrendingUp size={12} /> +0.3%
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 uppercase font-bold mb-2">平均停留时长 (Avg. Session)</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">4m 12s</div>
          <div className="text-xs text-gray-400 font-bold">稳定</div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-blue-600" /> 用户画像分析 (User Persona)
          </h3>
          <div className="space-y-6">
            <div>
              <div className="text-xs text-gray-500 mb-3">企业类型分布</div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">大型国企 (SOE)</span>
                    <span className="font-bold text-gray-900">45%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[45%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">民营钢企 (Private)</span>
                    <span className="font-bold text-gray-900">35%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[35%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">科研院所 (Research)</span>
                    <span className="font-bold text-gray-900">20%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[20%]"></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-2">主要用户角色</div>
              <div className="flex flex-wrap gap-2">
                {['工艺工程师', 'IT 管理员', '采购经理', '产线厂长'].map((role) => (
                  <span key={role} className="bg-gray-50 border border-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-orange-600" /> 调用场景分布 (Usage Scenarios)
          </h3>
          <div className="h-48 flex items-end justify-between px-4 gap-4">
            {[
              { name: '质量分析', val: 80, color: 'bg-blue-500' },
              { name: '工艺优化', val: 65, color: 'bg-cyan-500' },
              { name: '能耗管理', val: 45, color: 'bg-green-500' },
              { name: '设备预维', val: 30, color: 'bg-orange-500' },
              { name: '其他', val: 15, color: 'bg-gray-400' },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  className={`w-12 md:w-16 rounded-t-lg relative ${item.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                  style={{ height: `${item.val}%` }}
                ></div>
                <span className="text-xs text-gray-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">用户增长趋势</h3>
          <div className="h-48 flex items-end justify-between gap-1 md:gap-2">
            {[10, 15, 25, 20, 30, 35, 45, 40, 50, 60, 65, 75].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-green-500 rounded-t-sm hover:bg-green-600 transition-colors" style={{ height: `${val}%` }}></div>
                <span className="text-[10px] text-gray-400">{i + 1}月</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">API 错误率分布 (Error Rates)</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">401 鉴权失败 (Unauthorized)</span>
                <span className="font-bold text-gray-900">45%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full w-[45%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">429 请求过多 (Too Many Requests)</span>
                <span className="font-bold text-gray-900">30%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[30%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">500 服务器内部错误 (Internal Error)</span>
                <span className="font-bold text-gray-900">5%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[5%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};