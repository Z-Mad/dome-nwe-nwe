import React from "react";
import { Activity, TrendingUp } from "lucide-react";
import { BUYER_STATS, RESOURCE_TREND_DATA } from "../constants";

const BuyerDashboard: React.FC = () => {
  const chartMax = Math.max(...RESOURCE_TREND_DATA.map((d) => d.token + d.storage)) * 1.1;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
            本月已付款 (PAID)
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {BUYER_STATS.spend}
          </div>
          <div className="text-xs text-red-500 font-bold flex items-center gap-1">
            <TrendingUp size={12} /> {BUYER_STATS.spendTrend}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs font-bold mb-2">活跃实例</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {BUYER_STATS.activeInstances}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs font-bold mb-2">待支付</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {BUYER_STATS.unpaid}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs font-bold mb-2">工单</div>
          <div className="text-3xl font-bold text-orange-500 mb-1">
            {BUYER_STATS.tickets}
          </div>
        </div>
      </div>

      {/* Resource Overview Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <Activity size={20} className="text-blue-600" />
          <h3 className="font-bold text-gray-900">
            资源概览 (Resource Overview)
          </h3>
        </div>

        {/* Chart Container */}
        <div className="h-48 flex items-end justify-between gap-2 px-4 pb-2 border-b border-gray-100 relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-4 pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="border-t border-dashed border-gray-100 w-full h-0 last:border-0"
              ></div>
            ))}
          </div>

          {RESOURCE_TREND_DATA.map((d, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col justify-end group h-full relative z-10"
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-lg z-20 transition-all">
                <div className="font-bold mb-0.5">Day {i + 1}</div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Token: {d.token}k
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-200 rounded-full"></div>
                  Storage: {d.storage}GB
                </div>
              </div>

              <div
                className="w-full bg-[#fcd3a4] rounded-t-sm hover:brightness-95 transition-all relative z-0"
                style={{ height: `${(d.storage / chartMax) * 100}%` }}
              ></div>
              <div
                className="w-full bg-[#3b82f6] rounded-t-sm hover:brightness-110 transition-all relative z-10 -mt-0.5 pt-0.5"
                style={{ height: `${(d.token / chartMax) * 100}%` }}
              ></div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#3b82f6] rounded-sm"></div>
            <span>Token 消耗</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#fcd3a4] rounded-sm"></div>
            <span>存储占用</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;