
import React from 'react';
import { Search, Filter, Star, Download, Box, LineChart, Cpu, ArrowRight } from 'lucide-react';

interface DiscoveryProps {
    onNavigateToDetail: (id: string) => void;
    extraAgents?: any[]; // Prop for dynamic agents
}

const Discovery: React.FC<DiscoveryProps> = ({ onNavigateToDetail, extraAgents = [] }) => {
  const defaultAgents = [
    {
      id: '1',
      type: 'method',
      title: '数字冷轧质量管理',
      author: '宝信软件(Baosight)',
      desc: '针对冷轧产线的全链路质量管理解决方案。集成了“冷轧机组对象图谱”与“表面缺陷视觉识别模型”。',
      price: '获取',
      downloads: 128,
      rating: 4.9,
      image: 'https://picsum.photos/seed/agent_avatar_new/100/100',
      isTarget: true
    },
    {
      id: '2',
      type: 'method',
      title: '高炉热力学对象图谱',
      author: '宝信软件(Baosight)',
      desc: '定义了高炉炼铁过程中的核心实体关系。包含：炉腹、炉腰、炉身温度场结构定义。',
      price: '获取',
      downloads: 89,
      rating: 4.5,
      image: 'https://picsum.photos/seed/blast_furnace/100/100'
    },
    {
      id: 'crane',
      type: 'method',
      title: '钢卷库区无人天车调度',
      author: '华为云(Huawei Cloud)',
      desc: '基于3D视觉与路径规划算法，实现冷轧成品库天车的全自动无人化作业，减少吊运损伤与等待时间。',
      price: '获取',
      downloads: 64,
      rating: 4.7,
      image: 'https://picsum.photos/seed/crane/100/100'
    },
    {
      id: 'chatter',
      type: 'analysis',
      title: '连轧机组颤振预测模型',
      author: '西门子(Siemens)',
      desc: '针对高速轧制过程中的第三倍频程振动进行监测与抑制，有效预防“振动纹”缺陷，提升轧制速度。',
      price: '¥299/月',
      downloads: 45,
      rating: 4.8,
      image: 'https://picsum.photos/seed/vibration/100/100'
    },
    {
        id: 'acid',
        type: 'method',
        title: '酸再生站运行优化图谱',
        author: '中冶赛迪(CISDI)',
        desc: '包含废酸焙烧、氧化铁粉回收全流程的工艺参数定义，通过机理模型优化酸回收率与能耗。',
        price: '获取',
        downloads: 32,
        rating: 4.6,
        image: 'https://picsum.photos/seed/acid/100/100'
    },
    {
        id: 'edge_drop',
        type: 'method',
        title: '硅钢边部减薄(Edge Drop)控制',
        author: '首钢技术研究院',
        desc: '针对高牌号无取向硅钢，通过Taper辊形与窜辊策略优化，精确控制边部厚度衰减，提升叠片系数。',
        price: '获取',
        downloads: 78,
        rating: 4.9,
        image: 'https://picsum.photos/seed/silicon_steel/100/100'
    },
    {
        id: 'price_index',
        type: 'analysis',
        title: '2025年全球钢铁行业价格趋势',
        author: '钢联数据',
        desc: '订阅式数据服务。提供全球主要港口铁矿石现货价格、国内螺纹钢、热卷实时成交价及预测。',
        price: '获取',
        downloads: 210,
        rating: 4.5,
        image: 'https://picsum.photos/seed/steel_price/100/100'
    },
    {
        id: 'zinc',
        type: 'method',
        title: '镀锌锌锅锌渣视觉检测',
        author: '宝钢工程',
        desc: '利用耐高温工业相机实时监控锌液表面，自动识别底渣与浮渣积聚情况，指导捞渣机器人作业。',
        price: '获取',
        downloads: 56,
        rating: 4.4,
        image: 'https://picsum.photos/seed/zinc/100/100'
    }
  ];

  // Merge default and extra agents, mapping extra format to display format
  const allAgents = [
      ...extraAgents.map(a => ({
          id: a.id,
          type: a.type,
          title: a.title,
          author: a.provider || '当前用户',
          desc: a.desc,
          price: a.price,
          downloads: 0,
          rating: 5.0,
          image: 'https://picsum.photos/seed/new_agent/100/100',
          isTarget: false
      })),
      ...defaultAgents
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full">
      {/* Hero Banner */}
      <div className="bg-black text-white h-80 relative overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        <img 
            src="https://picsum.photos/seed/steel_mill_hero/1600/600" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-60" 
        />
        <div className="container mx-auto px-8 relative z-20">
            <span className="text-gray-400 text-sm tracking-widest uppercase mb-2 block">维观推荐</span>
            <h1 className="text-5xl font-bold mb-4">钢铁工业智能体精选</h1>
            <p className="text-gray-300 max-w-lg text-lg mb-8">从高炉到冷轧，从设备到工艺，这些出色的智能体正在重新定义钢铁智造的未来。</p>
            <button className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors">
                发布智能体 <ArrowRight size={18} />
            </button>
        </div>
        
        {/* Right side abstract graphic (CSS only) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-900/50 to-transparent z-10 hidden lg:block"></div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm px-8 py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="搜索智能体、数据集、或图谱..." 
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>
            <div className="flex gap-4">
                <div className="relative min-w-[160px]">
                    <select className="w-full appearance-none bg-white border border-gray-200 px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-50 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer font-medium">
                        <option value="all">全行业</option>
                        <option value="汽车零配件">汽车零配件</option>
                        <option value="新能源">新能源</option>
                        <option value="钢铁冶炼">钢铁冶炼</option>
                        <option value="航空航天">航空航天</option>
                        <option value="医疗器械">医疗器械</option>
                        <option value="电力装备">电力装备</option>
                        <option value="其他">其他</option>
                    </select>
                    <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative min-w-[160px]">
                    <select className="w-full appearance-none bg-white border border-gray-200 px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-50 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer font-medium">
                        <option value="all">全类型</option>
                        <option value="研发">研发</option>
                        <option value="供应链">供应链</option>
                        <option value="生产">生产</option>
                        <option value="销售">销售</option>
                        <option value="其他">其他</option>
                    </select>
                    <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="max-w-7xl mx-auto px-8 py-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allAgents.map((agent) => (
                <div 
                    key={agent.id} 
                    onClick={agent.isTarget ? () => onNavigateToDetail(agent.id.toString()) : undefined}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full animate-in fade-in zoom-in-95"
                >
                    <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] px-2 py-1 rounded font-medium ${
                            agent.type === 'method' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                        }`}>
                            {agent.type === 'method' ? '方法智能体' : '分析智能体'}
                        </span>
                        <span className="text-[10px] text-gray-400">钢铁冶金/生产</span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{agent.title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                        <Cpu size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-500">{agent.author}</span>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                        {agent.desc}
                    </p>

                    <div className="flex items-end justify-between mt-auto">
                        <div className="space-y-2">
                             <button className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                                {agent.price}
                             </button>
                             <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1"><Download size={12}/> {agent.downloads}</span>
                                <span className="flex items-center gap-1 text-yellow-500"><Star size={12} fill="#eab308" /> {agent.rating}</span>
                             </div>
                        </div>
                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm bg-gray-100">
                            <img src={agent.image} alt="icon" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Discovery;
