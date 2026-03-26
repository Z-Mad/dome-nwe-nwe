import { DocType, type Message, type RelatedRecord, type ReportItem } from './types'

export const MOCK_REPORTS: ReportItem[] = [
  {
    id: '1',
    title: '酸洗线产出质量日报',
    date: '2025-04-16',
    type: DocType.PRODUCTION,
    status: 'ready',
  },
  {
    id: '2',
    title: '轧制力与厚度偏差分析',
    date: '2025-04-16',
    type: DocType.QUALITY,
    status: 'ready',
  },
  {
    id: '3',
    title: '表面缺陷预警日志',
    date: '2025-04-16',
    type: DocType.EQUIPMENT,
    status: 'alert',
  },
  {
    id: '4',
    title: '晶粒度分析报告 (批次A)',
    date: '2025-04-16',
    type: DocType.ANALYSIS,
    status: 'processing',
  },
  {
    id: '5',
    title: '退火炉温控曲线',
    date: '2025-04-15',
    type: DocType.PRODUCTION,
    status: 'ready',
  },
]

export const RELATED_RECORDS: RelatedRecord[] = [
  { id: '1', title: '轧机运行日报', category: '工厂生产', icon: 'factory' },
  { id: '2', title: '钢卷订单 #8820-8850', category: '订单管理', icon: 'list' },
  { id: '3', title: '支承辊库存状态', category: '库存管理', icon: 'database' },
  { id: '4', title: 'AGC传感器状态', category: '产线监控', icon: 'activity' },
  { id: '5', title: '缺陷图谱库 v2.4', category: '质量标准', icon: 'shield' },
]

export const INITIAL_CHAT_HISTORY: Message[] = [
  {
    id: '0',
    sender: 'ai',
    content: (
      <div className="space-y-2">
        <p className="font-medium text-gray-900">你好，我是冷轧质量AI助手。</p>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li>我可以分析测厚仪数据、板形指标及表面检测影像。</li>
          <li>生成的报告基于TCM（酸轧联合机组）实时传感器数据。</li>
          <li>关于特定钢卷缺陷的分析结果仅限当班人员查看。</li>
        </ul>
      </div>
    ),
    timestamp: new Date(),
  },
]
