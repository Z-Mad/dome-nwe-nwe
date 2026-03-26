import { ArrowRight, Briefcase, Clock, DollarSign, MapPin, Plus, Search, Tag } from 'lucide-react'
import React from 'react'

const DemandSquare: React.FC = () => {
  const demands = [
    {
      id: 1,
      title: '寻：热连轧卷取机助卷辊压力模型',
      enterprise: '某大型国有钢企',
      budget: '¥500k - 800k',
      location: '辽宁·鞍山',
      deadline: '29天后截止',
      tags: ['控制算法', '热轧', '机理模型'],
      desc: '现有的卷取机助卷辊压力控制精度不足，导致头部卷形不良。急需一套基于现场数据的优化压力设定模型，要求支持西门子TDC系统。',
      status: 'open',
    },
    {
      id: 2,
      title: '急需：O5级汽车外板表面缺陷数据集',
      enterprise: '机器视觉初创公司',
      budget: '¥50k - 100k',
      location: '上海·张江',
      deadline: '7天后截止',
      tags: ['数据集', '视觉检测', '汽车板'],
      desc: '需要包含麻点、色差、辊印等微小缺陷的高清样本（2000张+），用于训练高精度质检模型。要求标注格式为COCO或YOLO。',
      status: 'urgent',
    },
    {
      id: 3,
      title: '外包：IBA PDA数据分析插件开发',
      enterprise: '工业互联网平台商',
      budget: '¥100k - 150k',
      location: '远程',
      deadline: '15天后截止',
      tags: ['IBA', '数据分析', '轧制波形'],
      desc: '开发基于IBA PDA系统的自定义分析插件，能够自动提取轧破瞬间的毫秒级波形数据并生成报告。',
      status: 'open',
    },
    {
      id: 4,
      title: '轧机油雾回收系统效能提升方案',
      enterprise: '环保科技公司',
      budget: '议价',
      location: '江苏·南京',
      deadline: '长期有效',
      tags: ['环保', '油雾回收', '工艺优化'],
      desc: '针对高速冷轧机组产生的油雾，寻求高效的二级过滤与回收技术，降低车间PM2.5浓度并回收轧制油。',
      status: 'open',
    },
  ]

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">需求广场 (Demand Square)</h1>
            <p className="text-gray-500 mt-2">
              连接钢企真实痛点与开发者解决方案，总需求金额超{' '}
              <span className="text-blue-600 font-bold">¥1.2亿</span>
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-colors">
            <Plus size={18} />
            发布需求
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索需求关键词，如：视觉模型、PLC、轧辊..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none">
              <option>所有预算</option>
              <option>¥10w以下</option>
              <option>¥10w - 50w</option>
              <option>¥50w以上</option>
            </select>
            <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none">
              <option>所有状态</option>
              <option>急需</option>
              <option>招标中</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {demands.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
            >
              {item.status === 'urgent' && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-bl-xl font-bold">
                  急需
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded flex items-center gap-1">
                      <Briefcase size={12} /> {item.enterprise}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 flex items-center gap-1"
                      >
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:w-60 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  <div>
                    <div className="flex items-center gap-2 text-green-600 font-bold text-lg mb-1">
                      <DollarSign size={18} />
                      {item.budget}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <Clock size={12} />
                      {item.deadline}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <MapPin size={12} />
                      {item.location}
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors flex items-center justify-center gap-2">
                    投递方案 <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DemandSquare
