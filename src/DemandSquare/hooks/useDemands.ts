// hooks/useDemands.ts
import { useState, useMemo } from 'react'
import type { Demand } from '../types/demand'

// 静态数据，实际可从 API 获取
const initialDemands: Demand[] = [
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

export const useDemands = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [budgetFilter, setBudgetFilter] = useState('所有预算')
  const [statusFilter, setStatusFilter] = useState('所有状态')

  // 模拟过滤逻辑（可根据实际需求扩展）
  const filteredDemands = useMemo(() => {
    let result = initialDemands

    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase()
      result = result.filter(
        d =>
          d.title.toLowerCase().includes(kw) ||
          d.desc.toLowerCase().includes(kw) ||
          d.tags.some(tag => tag.toLowerCase().includes(kw))
      )
    }

    if (budgetFilter !== '所有预算') {
      // 此处为模拟，实际可根据预算范围过滤
      if (budgetFilter === '¥10w以下') {
        result = result.filter(d => d.budget.includes('k') && parseInt(d.budget.replace(/[^0-9]/g, '')) < 100)
      } else if (budgetFilter === '¥10w - 50w') {
        result = result.filter(d => d.budget.includes('k') && parseInt(d.budget.replace(/[^0-9]/g, '')) >= 100 && parseInt(d.budget.replace(/[^0-9]/g, '')) <= 500)
      } else if (budgetFilter === '¥50w以上') {
        result = result.filter(d => d.budget.includes('k') && parseInt(d.budget.replace(/[^0-9]/g, '')) > 500)
      }
    }

    if (statusFilter !== '所有状态') {
      result = result.filter(d => statusFilter === '急需' ? d.status === 'urgent' : d.status === 'open')
    }

    return result
  }, [searchKeyword, budgetFilter, statusFilter])

  return {
    demands: filteredDemands,
    searchKeyword,
    setSearchKeyword,
    budgetFilter,
    setBudgetFilter,
    statusFilter,
    setStatusFilter,
  }
}