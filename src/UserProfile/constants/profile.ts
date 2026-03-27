import type {
  BuyerBill,
  BuyerInvoice,
  BuyerOrder,
  BuyerResource,
  HealthMetric,
  InvoiceHeader,
  SellerAsset,
  SellerMonitoringItem,
  SellerRefund,
  SellerTransaction,
  SupportTicket,
} from '../types/profile';

// ========== 买家 Mock ==========
export const BUYER_STATS = {
  spend: '¥ 12,450',
  spendTrend: '+12%',
  activeInstances: 3,
  unpaid: 1,
  tickets: 2,
};

export const RESOURCE_TREND_DATA = [
  { token: 20, storage: 10 },
  { token: 35, storage: 15 },
  { token: 30, storage: 12 },
  { token: 45, storage: 20 },
  { token: 50, storage: 25 },
  { token: 60, storage: 30 },
  { token: 70, storage: 35 },
  { token: 65, storage: 32 },
  { token: 55, storage: 28 },
  { token: 80, storage: 40 },
  { token: 90, storage: 45 },
  { token: 85, storage: 42 },
  { token: 75, storage: 38 },
  { token: 65, storage: 35 },
  { token: 70, storage: 36 },
  { token: 60, storage: 30 },
  { token: 50, storage: 25 },
  { token: 55, storage: 28 },
  { token: 65, storage: 32 },
  { token: 75, storage: 38 },
  { token: 80, storage: 40 },
];

export const INITIAL_BILLS: BuyerBill[] = [
  {
    id: '202504',
    period: '2025年4月',
    date: '2025-05-01',
    amount: 12450.0,
    count: 3,
    status: 'unpaid',
    invoiceStatus: 'unissued',
    details: [
      {
        instanceName: '冷轧1线 (正式生产)',
        productName: '数字冷轧质量管理',
        type: '包月订阅',
        amount: 5800.0,
        usageItems: [
          { name: '基础订阅费', usage: '1个月', amount: 5000.0 },
          { name: '超额存储费', usage: '160GB', amount: 800.0 },
        ],
      },
      {
        instanceName: '冷轧2线 (测试环境)',
        productName: '数字冷轧质量管理',
        type: '按量付费',
        amount: 2650.0,
        usageItems: [
          { name: '模型推理 (Tokens)', usage: '12.5M', amount: 2500.0 },
          { name: '对象存储', usage: '30GB', amount: 150.0 },
        ],
      },
      {
        instanceName: '高炉3号监控',
        productName: '高炉热平衡模型',
        type: '包年订阅 (分摊)',
        amount: 4000.0,
        usageItems: [{ name: '月度分摊费', usage: '1个月', amount: 4000.0 }],
      },
    ],
  },
  {
    id: '202503',
    period: '2025年3月',
    date: '2025-04-01',
    amount: 11200.0,
    count: 3,
    status: 'paid',
    invoiceStatus: 'unissued',
    details: [
      {
        instanceName: '冷轧1线 (正式生产)',
        productName: '数字冷轧质量管理',
        type: '包月订阅',
        amount: 5800.0,
        usageItems: [
          { name: '基础订阅费', usage: '1个月', amount: 5000.0 },
          { name: '超额存储费', usage: '160GB', amount: 800.0 },
        ],
      },
      {
        instanceName: '冷轧2线 (测试环境)',
        productName: '数字冷轧质量管理',
        type: '按量付费',
        amount: 1400.0,
        usageItems: [
          { name: '模型推理 (Tokens)', usage: '6.5M', amount: 1300.0 },
          { name: '对象存储', usage: '20GB', amount: 100.0 },
        ],
      },
      {
        instanceName: '高炉3号监控',
        productName: '高炉热平衡模型',
        type: '包年订阅 (分摊)',
        amount: 4000.0,
        usageItems: [{ name: '月度分摊费', usage: '1个月', amount: 4000.0 }],
      },
    ],
  },
  {
    id: '202502',
    period: '2025年2月',
    date: '2025-03-01',
    amount: 9800.0,
    count: 2,
    status: 'paid',
    invoiceStatus: 'issued',
    details: [
      {
        instanceName: '冷轧1线 (正式生产)',
        productName: '数字冷轧质量管理',
        type: '包月订阅',
        amount: 5800.0,
        usageItems: [
          { name: '基础订阅费', usage: '1个月', amount: 5000.0 },
          { name: '超额存储费', usage: '160GB', amount: 800.0 },
        ],
      },
      {
        instanceName: '高炉3号监控',
        productName: '高炉热平衡模型',
        type: '包年订阅 (分摊)',
        amount: 4000.0,
        usageItems: [{ name: '月度分摊费', usage: '1个月', amount: 4000.0 }],
      },
    ],
  },
  {
    id: '202501',
    period: '2025年1月',
    date: '2025-02-01',
    amount: 9800.0,
    count: 2,
    status: 'paid',
    invoiceStatus: 'issued',
    details: [
      {
        instanceName: '冷轧1线 (正式生产)',
        productName: '数字冷轧质量管理',
        type: '包月订阅',
        amount: 5800.0,
        usageItems: [
          { name: '基础订阅费', usage: '1个月', amount: 5000.0 },
          { name: '超额存储费', usage: '160GB', amount: 800.0 },
        ],
      },
      {
        instanceName: '高炉3号监控',
        productName: '高炉热平衡模型',
        type: '包年订阅 (分摊)',
        amount: 4000.0,
        usageItems: [{ name: '月度分摊费', usage: '1个月', amount: 4000.0 }],
      },
    ],
  },
];

export const INITIAL_INVOICE_HEADERS: InvoiceHeader[] = [
  {
    id: 'h1',
    type: 'enterprise',
    title: '宝武钢铁集团有限公司',
    taxId: '91310000132200821H',
    address: '上海市浦东新区世博大道1859号',
    phone: '021-20658888',
    bank: '工行上海市宝山支行',
    account: '1001260409006666666',
    isDefault: true,
  },
  {
    id: 'h2',
    type: 'personal',
    title: '王工程师',
    taxId: '',
    address: '',
    phone: '',
    bank: '',
    account: '',
    isDefault: false,
  },
];

export const COST_BREAKDOWN = [
  {
    item: '数字冷轧质量管理 - 企业版',
    type: '包月订阅',
    usage: '1 个月',
    amount: 5800.0,
  },
  {
    item: '高炉热平衡模型 - 订阅',
    type: '包年订阅',
    usage: '1/12 年',
    amount: 4000.0,
  },
  {
    item: '大模型算力加油包 (50k)',
    type: '一次性',
    usage: '1 个',
    amount: 299.0,
  },
  {
    item: 'API 调用超额费',
    type: '按量付费',
    usage: '15,420 Tokens',
    amount: 350.5,
  },
  {
    item: '向量数据库存储费',
    type: '按量付费',
    usage: '250 GB',
    amount: 2000.5,
  },
];

export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'T-20250410-01',
    title: 'API 鉴权失败 401',
    status: 'processing',
    date: '2025-04-10',
    type: '故障',
  },
  {
    id: 'T-20250328-05',
    title: '发票抬头修改申请',
    status: 'closed',
    date: '2025-03-28',
    type: '财务',
  },
];

export const FAQ_ITEMS = [
  '如何重置 API Key?',
  '私有化部署的硬件要求是什么?',
  '发票开具需要多久?',
  '如何申请退款?',
];

// ========== 卖家 Mock ==========
export const SELLER_STATS = {
  revenue: '¥ 45,200.00',
  pending: '¥ 12,800.00',
  total: '¥ 258,000.00',
  revenueTrend: '+24.5%',
  subs: 128,
  subsTrend: '+12',
  calls: '1.2M',
  callsTrend: '+8%',
  health: 98,
};

export const SELLER_REVENUE_CHART_DATA = [
  { month: 'May', value: 18000 },
  { month: 'Jun', value: 22000 },
  { month: 'Jul', value: 28000 },
  { month: 'Aug', value: 24000 },
  { month: 'Sep', value: 32000 },
  { month: 'Oct', value: 35000 },
  { month: 'Nov', value: 40000 },
  { month: 'Dec', value: 38000 },
  { month: 'Jan', value: 42000 },
  { month: 'Feb', value: 45000 },
  { month: 'Mar', value: 52000 },
  { month: 'Apr', value: 58000 },
];

export const SELLER_TRANSACTIONS: SellerTransaction[] = [
  {
    id: 'TRX-20250414',
    type: 'income',
    asset: '冷轧板形控制专家',
    buyer: '张采购 (Purchaser Zhang)',
    amount: 4930.0,
    status: 'settled',
    date: '2025-04-14',
  },
  {
    id: 'TRX-TRIAL',
    type: 'income',
    asset: '热连轧机组振动预测',
    buyer: '张采购 (Purchaser Zhang)',
    amount: 0.0,
    status: 'settled',
    date: '2025-04-12',
  },
  {
    id: 'TRX-WARN',
    type: 'income',
    asset: '表面缺陷视觉检测模型',
    buyer: '张采购 (Purchaser Zhang)',
    amount: 10200.0,
    status: 'settled',
    date: '2024-05-20',
  },
  {
    id: 'TRX-PK01',
    type: 'income',
    asset: '大模型算力加油包 (50k)',
    buyer: '张采购 (Purchaser Zhang)',
    amount: 299.0,
    status: 'pending',
    date: '2025-04-18',
  },
];

export const SELLER_MONITORING_MOCK: SellerMonitoringItem[] = [
  {
    id: 'MON-1001',
    buyer: '沙钢集团',
    asset: '冷轧板形控制专家',
    version: 'v2.1.0',
    instanceName: '沙钢一厂质检实例',
    instanceId: 'ins-8a9b2c3d',
    orderId: 'ORD-20250401-001',
    plan: '按量计费',
    period: '2025-04-01 ~ 2025-04-30',
    usage: { tokens: '1,250,000', storage: '120 GB' },
    unitPrice: '¥0.001/Token, ¥0.5/GB',
    feeBreakdown: { tokens: 1250.0, storage: 60.0 },
    estimatedCost: 1310.0,
    status: 'unbilled',
    unbilledPeriod: '2025-04-01 ~ 2025-04-30',
    billedPeriods: ['2025-03-01 ~ 2025-03-31'],
  },
  {
    id: 'MON-1002',
    buyer: '宝武钢铁集团',
    asset: '数字冷轧质量管理',
    version: 'v1.0.5',
    instanceName: '宝武冷轧二期',
    instanceId: 'ins-4f5e6d7c',
    orderId: 'ORD-20250315-088',
    plan: '按量计费',
    period: '2025-03-01 ~ 2025-03-31',
    usage: { tokens: '3,400,000', storage: '350 GB' },
    unitPrice: '¥0.001/Token, ¥0.5/GB',
    feeBreakdown: { tokens: 3400.0, storage: 175.0 },
    estimatedCost: 3575.0,
    status: 'under_review',
    billedPeriods: ['2025-02-01 ~ 2025-02-28'],
  },
  {
    id: 'MON-1004',
    buyer: '某汽车制造厂',
    asset: '表面缺陷视觉检测模型',
    version: 'v3.0.1',
    instanceName: '冲压车间质检',
    instanceId: 'ins-9x8y7z6w',
    orderId: 'ORD-20250410-055',
    plan: '按量计费',
    period: '2025-03-01 ~ 2025-03-31',
    usage: { tokens: '2,100,000', storage: '200 GB' },
    unitPrice: '¥0.001/Token, ¥0.5/GB',
    feeBreakdown: { tokens: 2100.0, storage: 100.0 },
    estimatedCost: 2200.0,
    status: 'under_review',
    billedPeriods: ['2025-02-01 ~ 2025-02-28'],
  },
  {
    id: 'MON-1003',
    buyer: '某独立研究院',
    asset: '热连轧机组振动预测',
    version: 'v1.0.0',
    instanceName: '研究院测试环境',
    instanceId: 'ins-1a2b3c4d',
    orderId: 'ORD-REVIEW-008',
    plan: '包月订阅',
    period: '2025-04-15 ~ 2025-05-15',
    usage: { tokens: '500,000', storage: '50 GB' },
    unitPrice: '包含在套餐内',
    feeBreakdown: { tokens: 0.0, storage: 0.0 },
    estimatedCost: 0.0,
    status: 'running',
    billedPeriods: [],
  },
  {
    id: 'MON-1005',
    buyer: '鞍钢集团',
    asset: '高炉炉温预测模型',
    version: 'v3.2.1',
    instanceName: '鞍钢三号高炉',
    instanceId: 'ins-9x8y7z6w',
    orderId: 'ORD-20250210-045',
    plan: '按量计费',
    period: '2025-02-01 ~ 2025-02-28',
    usage: { tokens: '2,100,000', storage: '200 GB' },
    unitPrice: '¥0.001/Token, ¥0.5/GB',
    feeBreakdown: { tokens: 2100.0, storage: 100.0 },
    estimatedCost: 2200.0,
    status: 'paid',
    billedPeriods: ['2025-01-01 ~ 2025-01-31'],
  },
];

export const SELLER_ORDERS_MOCK = [
  {
    id: 'ORD-8823',
    buyer: '沙钢集团',
    asset: '冷轧板形控制专家',
    plan: '订阅',
    amount: 299,
    date: '2025-04-14',
    status: 'Active',
  },
  {
    id: 'ORD-9912',
    buyer: '某独立研究院',
    asset: '热连轧机组振动预测',
    plan: '企业版',
    amount: 5800,
    date: '2025-04-15',
    status: 'Active',
  },
  {
    id: 'ORD-8821',
    buyer: '宝武钢铁集团',
    asset: '数字冷轧质量管理',
    plan: '企业版订阅',
    amount: 5800,
    date: '2025-04-16',
    status: 'Active',
  },
];

export const SELLER_REFUNDS_MOCK: SellerRefund[] = [
  {
    id: 'REF-20250414-01',
    orderId: 'ORD-8823',
    amount: 299,
    buyer: '沙钢集团',
    reason: '与现有 MES 系统接口不兼容，无法采集数据。',
    date: '2025-04-14 14:30',
    status: 'pending',
  },
  {
    id: 'REF-20250415-02',
    orderId: 'ORD-9912',
    amount: 5800,
    buyer: '某独立研究院',
    reason: '误操作购买，无需企业版功能。',
    date: '2025-04-15 09:10',
    status: 'pending',
  },
];

export const RICH_ASSETS_MOCK: SellerAsset[] = [
  {
    id: '1',
    title: '冷轧板形控制专家',
    status: 'live',
    category: 'method',
    desc: '针对冷轧产线的全链路质量管理解决方案，集成机理模型与视觉识别。',
    versions: [
      {
        ver: 'v2.1.0',
        date: '2025-04-10',
        health: 99.9,
        installs: 240,
        status: 'active',
        log: '优化了弯辊力计算模型，响应速度提升15%',
      },
      {
        ver: 'v2.0.5',
        date: '2024-11-20',
        health: 99.5,
        installs: 850,
        status: 'stable',
        log: '修复了偶尔出现的鉴权超时问题',
      },
      {
        ver: 'v1.0.0',
        date: '2023-05-15',
        health: 0,
        installs: 120,
        status: 'deprecated',
        log: '初始版本',
      },
    ],
  },
  {
    id: '2',
    title: '退火炉能耗预测',
    status: 'review',
    category: 'analysis',
    desc: '基于历史能耗数据预测退火炉未来24小时的燃气消耗量。',
    versions: [
      {
        ver: 'v1.0.0',
        date: '2025-04-15',
        health: 0,
        installs: 0,
        status: 'auditing',
        log: '首次提交审核',
      },
    ],
  },
];

export const HEALTH_METRICS: HealthMetric[] = [
  {
    name: 'API 网关响应',
    status: 'healthy',
    latency: [45, 42, 48, 44, 46, 120, 45, 43],
    avg: '45ms',
  },
  {
    name: '推理节点集群 (GPU)',
    status: 'healthy',
    latency: [210, 205, 220, 215, 210, 208, 212, 210],
    avg: '210ms',
  },
  {
    name: '鉴权与计费服务',
    status: 'degraded',
    latency: [80, 150, 300, 450, 200, 150, 100, 90],
    avg: '180ms',
  },
  {
    name: '历史数据归档',
    status: 'healthy',
    latency: [120, 110, 115, 122, 118, 120, 115, 110],
    avg: '115ms',
  },
];

export const REFUND_REASONS = [
  '模型精度未达冷轧公差',
  '与现场L2系统接口不兼容',
  '数据延迟过高影响控制',
  '功能不符合业务需求',
  '项目取消/变更',
];

// ========== 买家发票初始数据 ==========
export const INITIAL_INVOICES: BuyerInvoice[] = [
  {
    id: 'INV-20250301-001',
    relatedId: '2025年2月 账单',
    amount: 9800.0,
    type: '增值税电子普通发票',
    status: 'issued',
    date: '2025-03-05',
    title: '企业名称',
  },
  {
    id: 'INV-20250402-002',
    relatedId: '2025年3月 账单',
    amount: 11200.0,
    type: '增值税电子普通发票',
    status: 'Pending',
    date: '2025-04-02',
    title: '企业名称',
  },
];