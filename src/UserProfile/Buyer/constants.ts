export const BUYER_STATS = {
  spend: '¥ 12,450',
  spendTrend: '+12%',
  activeInstances: 3,
  unpaid: 1,
  tickets: 2,
}

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
]

export const INITIAL_BILLS = [
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
]

export const INITIAL_INVOICE_HEADERS = [
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
]

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
]

export const SUPPORT_TICKETS = [
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
]

export const FAQ_ITEMS = [
  '如何重置 API Key?',
  '私有化部署的硬件要求是什么?',
  '发票开具需要多久?',
  '如何申请退款?',
]
