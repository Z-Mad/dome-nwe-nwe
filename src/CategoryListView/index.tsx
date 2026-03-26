import {
  ChevronRight,
  Droplet,
  Factory,
  Flame,
  Layers,
  ShieldAlert,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react'
import React from 'react'

const CategoryListView: React.FC = () => {
  const categories = [
    {
      name: '炼铁炼钢',
      count: 1204,
      icon: <Flame size={24} />,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      name: '热轧工艺',
      count: 856,
      icon: <Factory size={24} />,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      name: '冷轧工艺',
      count: 942,
      icon: <Layers size={24} />,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      name: '表面处理',
      count: 430,
      icon: <Droplet size={24} />,
      color: 'text-cyan-500',
      bg: 'bg-cyan-50',
    },
    {
      name: '设备运维',
      count: 642,
      icon: <Wrench size={24} />,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
    },
    {
      name: '能源环保',
      count: 320,
      icon: <Zap size={24} />,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      name: '生产物流',
      count: 210,
      icon: <Truck size={24} />,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      name: '工业安全',
      count: 560,
      icon: <ShieldAlert size={24} />,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
    },
  ]

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">全部分类 (All Categories)</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div
                className={`w-14 h-14 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                {cat.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{cat.count} 个智能体</span>
                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
          ))}

          {/* Coming Soon */}
          <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <span className="text-sm font-medium">更多工序接入中...</span>
          </div>
        </div>

        <div className="mt-12 bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">未找到适合的分类？</h2>
            <p className="text-blue-100 mb-6 max-w-xl">
              我们支持自定义工业图谱构建。如果您是行业专家，欢迎申请成为“领域架构师”，定义新的工艺标准。
            </p>
            <button className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              申请新建分类
            </button>
          </div>
          {/* Abstract Background */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-blue-500 to-transparent opacity-50 rounded-r-3xl"></div>
          <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
        </div>
      </div>
    </div>
  )
}

export default CategoryListView
