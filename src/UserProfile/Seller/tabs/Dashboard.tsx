import React from 'react'
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  Activity,
  BarChart2,
  PlusCircle,
  LifeBuoy,
  ArrowDownLeft,
  Clock,
  ShoppingBag,
  RotateCcw,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SELLER_STATS, SELLER_REVENUE_CHART_DATA } from '../constants'

const SellerDashboard: React.FC = () => {
  const navigate = useNavigate()
  const chartMax = Math.max(...SELLER_REVENUE_CHART_DATA.map((d) => d.value)) * 1.1

  const handlePublishNewAsset = () => {
    // This could open a modal or navigate to a publish page
    navigate('/profile/seller/assets?action=publish')
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* 1. Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-lg shadow-indigo-200 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
              本月预估已收款
            </div>
            <div className="text-3xl font-bold mb-2">{SELLER_STATS.revenue}</div>
            <div className="text-xs text-indigo-100 bg-indigo-500/50 px-2 py-1 rounded w-fit flex items-center gap-1">
              <TrendingUp size={12} /> {SELLER_STATS.revenueTrend} 环比
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] text-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
            <Wallet size={100} />
          </div>
        </div>

        {/* Active Subs Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">活跃订阅</div>
            <div className="bg-green-50 text-green-600 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
              <ArrowUpRight size={10} /> {SELLER_STATS.subsTrend}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{SELLER_STATS.subs}</div>
          <div className="text-xs text-gray-400">较上月增长</div>
        </div>

        {/* API Calls Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group hover:border-purple-200 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              API 调用量
            </div>
            <div className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
              <Activity size={10} /> {SELLER_STATS.callsTrend}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{SELLER_STATS.calls}</div>
          <div className="text-xs text-gray-400">本月累计</div>
        </div>

        {/* Health Score Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group hover:border-green-200 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              服务健康度
            </div>
            <div className="bg-green-50 text-green-600 text-[10px] px-1.5 py-0.5 rounded font-bold">
              运行正常
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">{SELLER_STATS.health}%</div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-green-500 h-full w-[98%]"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 2. Main Revenue Chart */}
        <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <BarChart2 size={20} className="text-indigo-600" />
              <h3 className="font-bold text-gray-900">收款趋势分析 (Collection Trend)</h3>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
                月度收款
              </div>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 relative">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-t border-dashed border-gray-100 w-full h-0"></div>
              ))}
            </div>

            {SELLER_REVENUE_CHART_DATA.map((d, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col justify-end group h-full relative z-10 cursor-pointer"
              >
                <div
                  className="w-full bg-green-400 rounded-t-sm hover:bg-green-500 transition-all relative"
                  style={{ height: `${(d.value / chartMax) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    ¥{d.value.toLocaleString()}
                  </div>
                </div>
                <div className="text-center text-xs text-gray-400 mt-2 font-medium">{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Right Sidebar: Actions & Top Assets */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">快捷操作</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePublishNewAsset}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
              >
                <PlusCircle size={20} className="text-gray-400 group-hover:text-indigo-600" />
                <span className="text-xs font-bold">发布版本</span>
              </button>
              <button
                onClick={() => navigate('/profile/seller/support')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors group"
              >
                <LifeBuoy size={20} className="text-gray-400 group-hover:text-orange-600" />
                <span className="text-xs font-bold">查看工单</span>
              </button>
              <button
                onClick={() => navigate('/profile/seller/health')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors group"
              >
                <Activity size={20} className="text-gray-400 group-hover:text-blue-600" />
                <span className="text-xs font-bold">健康诊断</span>
              </button>
            </div>
          </div>

          {/* Top Assets */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
              热销资产排行
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">本月</span>
            </h3>
            <div className="space-y-4">
              {[
                { name: '数字冷轧质量管理', income: '¥32,400', trend: 'up' },
                { name: '热连轧振动预测', income: '¥8,500', trend: 'down' },
                { name: '表面缺陷检测模型', income: '¥4,300', trend: 'up' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-700'}`}
                    >
                      {i + 1}
                    </div>
                    <span className="text-xs font-bold text-gray-700 truncate w-24">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-900">{item.income}</div>
                    <div
                      className={`text-[10px] flex items-center justify-end gap-0.5 ${item.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}
                    >
                      {item.trend === 'up' ? <ArrowUpRight size={8} /> : <ArrowDownLeft size={8} />}
                      {item.trend === 'up' ? 'Hot' : 'Cool'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Activity Feed */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-gray-400" /> 最近动态 (Recent Activity)
          </h3>
          <button className="text-xs text-blue-600 hover:underline">查看全部</button>
        </div>
        <div className="space-y-4">
          {/* Mock items mixed orders/refunds */}
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <ShoppingBag size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  新订单: 冷轧板形控制专家 (企业版)
                </div>
                <div className="text-xs text-gray-500">买家: 宝武钢铁集团 · 刚刚</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-green-600">+ ¥5,800.00</div>
              <div className="text-[10px] text-gray-400">交易成功</div>
            </div>
          </div>

          <div
            onClick={() => {
              navigate('/profile/seller/finance?subTab=transactions')
            }}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 relative">
                <RotateCcw size={18} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">退款申请: 热连轧机组振动预测</div>
                <div className="text-xs text-gray-500">买家: 某独立研究院 · 10分钟前</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">待审核</div>
              <button className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded mt-1">
                去处理
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Users size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">新用户注册试用</div>
                <div className="text-xs text-gray-500">来自: 鞍钢股份 · 30分钟前</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-gray-500">试用期 7天</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard
