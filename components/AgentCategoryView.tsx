
import React, { useState } from 'react';
import { Search, Filter, Download, Star, Cpu, ArrowRight, Box, LineChart, Wrench, ChevronRight, ArrowUpRight } from 'lucide-react';

interface AgentCategoryViewProps {
  category: 'method' | 'analysis' | 'service';
  onNavigateToDetail: (id: string) => void;
}

const AgentCategoryView: React.FC<AgentCategoryViewProps> = ({ category, onNavigateToDetail }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [serviceSubCategory, setServiceSubCategory] = useState('all');

  // --- Production Service Specific Layout ---
  if (category === 'service') {
    const serviceCategories = [
      { id: 'all', label: '全部服务', count: 42 },
      { id: 'finance', label: '金融服务', count: 15 },
      { id: 'maintenance', label: '加工维保', count: 18 },
      { id: 'logistics', label: '物流服务', count: 14 },
    ];

    const services = [
      {
        id: 1,
        tag: '金融服务',
        title: '钢卷质押监管融资',
        desc: '结合“数字冷轧质量管理”智能体的实时质量数据，对仓库中的钢卷进行资产确权与价值评估，提供低息质押贷款。',
        tags: ['#动产质押', '#资产评估', '#供应链金融'],
        priceLabel: '预期价值/报价',
        price: '授信 ¥1000万+',
        provider: '维观金科',
        btnText: '查看详情',
        catId: 'finance'
      },
      {
        id: 2,
        tag: '加工维保',
        title: '轧辊激光毛化加工',
        desc: '提供高精度的轧辊表面激光毛化服务，确保冷轧板表面Ra值的均匀性，延长轧辊使用寿命。',
        tags: ['#轧辊加工', '#表面处理', '#延寿'],
        priceLabel: '预期价值/报价',
        price: '¥5,000/支',
        provider: '精工轧辊',
        btnText: '查看详情',
        catId: 'maintenance'
      },
      {
        id: 3,
        tag: '物流服务',
        title: '成品卷框架车短驳',
        desc: '提供厂区内至码头的重型框架车短驳服务，包含防雨、防潮包装检查，确保最后一公里交付质量。',
        tags: ['#重载运输', '#成品保护', '#准时达'],
        priceLabel: '预期价值/报价',
        price: '¥25/吨',
        provider: '维观物流',
        btnText: '查看详情',
        catId: 'logistics'
      },
      {
        id: 4,
        tag: '加工维保',
        title: '纵切机组刀片修磨',
        desc: '针对硅钢与高强钢分切产线，提供高精度的圆盘剪刀片修磨与涂层服务，减少毛刺产生。',
        tags: ['#精密磨削', '#刀具管理', '#硅钢'],
        priceLabel: '预期价值/报价',
        price: '¥800/组 起',
        provider: '精密刀具中心',
        btnText: '查看详情',
        catId: 'maintenance'
      },
      {
        id: 5,
        tag: '物流服务',
        title: '废钢回收与分类运输',
        desc: '提供产线切边废料的自动收集、打包与分类回炉运输服务，最大化废钢残值。',
        tags: ['#循环经济', '#废钢打包', '#分类回收'],
        priceLabel: '预期价值/报价',
        price: '¥2800/吨(回收)',
        provider: '环资科技',
        btnText: '查看详情',
        catId: 'logistics'
      }
    ];

    const filteredServices = serviceSubCategory === 'all' 
      ? services 
      : services.filter(s => s.catId === serviceSubCategory);

    return (
      <div className="flex-1 bg-gray-50 overflow-y-auto h-full">
         {/* Hero Section for Services */}
         <div className="bg-black text-white h-64 relative overflow-hidden flex items-center">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/80 z-10"></div>
             <img src="https://picsum.photos/seed/service_hero_steel/1600/600" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Hero" />
             <div className="container mx-auto px-8 relative z-20">
                <span className="text-blue-300 text-xs font-bold tracking-wider mb-2 block">维观推荐</span>
                <h1 className="text-4xl font-bold mb-4">钢铁供应链增值服务</h1>
                <p className="text-gray-300 max-w-lg text-sm">从AI能力到实体交易。连接金融、维保、物流的钢铁产业生态。</p>
             </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 px-2">
                    <Filter size={16} /> 服务分类
                  </h3>
                  <div className="space-y-1">
                     {serviceCategories.map(cat => (
                       <button
                         key={cat.id}
                         onClick={() => setServiceSubCategory(cat.id)}
                         className={`w-full flex justify-between items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                           serviceSubCategory === cat.id 
                             ? 'bg-yellow-50 text-yellow-700 font-bold border border-yellow-100' 
                             : 'text-gray-600 hover:bg-gray-50'
                         }`}
                       >
                          <span>{cat.label}</span>
                          <span className={`text-xs ${serviceSubCategory === cat.id ? 'text-yellow-600' : 'text-gray-400'}`}>{cat.count}</span>
                       </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
               {/* Header */}
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 border-l-4 border-orange-500 pl-3">
                     <h2 className="text-xl font-bold text-gray-900">推荐服务</h2>
                  </div>
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input 
                        type="text" 
                        placeholder="搜索服务..." 
                        className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 w-64"
                      />
                  </div>
               </div>

               {/* Service List */}
               <div className="space-y-4">
                  {filteredServices.map(service => (
                    <div key={service.id} onClick={() => onNavigateToDetail(service.id.toString())} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                           <div className="flex-1">
                               <div className="flex items-center gap-2 mb-2">
                                   <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{service.tag}</span>
                                   <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                               </div>
                               <p className="text-sm text-gray-600 mb-4 leading-relaxed">{service.desc}</p>
                               <div className="flex gap-2">
                                   {service.tags.map(tag => (
                                       <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{tag}</span>
                                   ))}
                               </div>
                           </div>
                           <div className="md:text-right flex flex-col items-start md:items-end justify-between self-stretch min-w-[140px]">
                               <div>
                                   <div className="text-xs text-gray-400 mb-1">{service.priceLabel}</div>
                                   <div className="text-lg font-bold text-gray-900">{service.price}</div>
                               </div>
                               <div className="mt-4 flex flex-col items-end gap-2">
                                   <div className="text-xs text-gray-500 flex items-center gap-1">
                                      {service.provider}
                                      <img src={`https://picsum.photos/seed/${service.provider}/20/20`} className="w-5 h-5 rounded-full" alt="provider" />
                                   </div>
                                   <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                      {service.btnText} <ChevronRight size={14} />
                                   </button>
                               </div>
                           </div>
                        </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    );
  }

  // Fallback for Method/Analysis
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-8">
        <div className="max-w-7xl mx-auto">
             <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {category === 'method' ? '方法智能体 (Method Agents)' : '分析智能体 (Analysis Agents)'}
                    </h1>
                    <p className="text-gray-500">
                        {category === 'method' 
                            ? '封装了特定工业机理或控制逻辑，直接用于闭环控制。' 
                            : '专注于从海量数据中挖掘规律，提供诊断与预测。'
                        }
                    </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {[1,2,3,4,5,6].map(i => (
                     <div key={i} onClick={() => onNavigateToDetail(i.toString())} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category === 'method' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                {category === 'method' ? <Box size={20}/> : <LineChart size={20}/>}
                            </div>
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                {category === 'method' ? 'Method' : 'Analysis'}
                            </span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {category === 'method' ? '智能体示例标题 ' + i : '分析模型示例 ' + i}
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">宝信软件 (Baosight)</p>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                             这是一个示例描述。该智能体能够帮助企业解决...
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-400 pt-4 border-t border-gray-50">
                            <span className="flex items-center gap-1"><Download size={12}/> {100 * i + 23}</span>
                            <span className="flex items-center gap-1 text-yellow-500"><Star size={12} fill="#eab308"/> 4.8</span>
                        </div>
                     </div>
                 ))}
             </div>
        </div>
    </div>
  );
};

export default AgentCategoryView;
