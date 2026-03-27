import { http, HttpResponse } from 'msw'
import type { Agent } from '../services/discover'

const mockAgents: Agent[] = [
  {
    id: '1',
    type: 'method',
    title: '数字冷轧质量管理',
    author: '宝信软件(Baosight)',
    desc: '针对冷轧产线的全链路质量管理解决方案。集成了"冷轧机组对象图谱"与"表面缺陷视觉识别模型"。',
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
    desc: '针对高速轧制过程中的第三倍频程振动进行监测与抑制，有效预防"振动纹"缺陷，提升轧制速度。',
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
]

/**
 * discover 服务 mock 处理器
 */
export const discoverHandlers = [
  http.get('/api/agent/list', () => {
    return HttpResponse.json({
      success: true,
      data: mockAgents,
      msg: '获取成功'
    })
  })
]
