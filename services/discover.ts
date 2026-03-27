import { get } from '../utils/request'
import type { ApiResponse } from '@/types'

export interface Agent {
  id: string
  type: 'method' | 'analysis'
  title: string
  author: string
  desc: string
  price: string
  downloads: number
  rating: number
  image: string
  isTarget?: boolean
}

export interface AgentDetail {
  id: string
  type: 'method' | 'analysis'
  category: string
  title: string
  provider: string
  rating: number
  reviewCount: number
  version: string
  versions: string[]
  tags: string[]
  detailsModules: any[]
  pricing: {
    saas: {
      price: string
      unit: string
      features: string[]
      quota?: { tokens: number; storage: number; users: number }
      monthlyDiscount?: number
      yearlyDiscount?: number
    }
    buyout: {
      price: string
      unit: string
      features: string[]
      quota?: { tokens: number; storage: number; users: number | '不限' }
    }
  }
  meta: {
    publishDate: string
    downloads: number
  }
  related: string[]
  deliverables: any[]
  dataPreview: {
    columns: any[]
    rows: any[]
  }
  compliance: {
    text: string
    tags: string[]
  }
  trialConfig?: {
    enabled: boolean
    duration: number
    tokenLimit: number
    storageLimit: number
    installationFee?: number
  }
}

/**
 * 获取智能体列表
 * @param params 查询参数
 */
export const getAgentList = (params?: Record<string, any>) => {
  return get<ApiResponse<Agent[]>>('/agent/list', params)
}

/**
 * 获取智能体详情
 * @param id 智能体 ID
 */
export const getAgentDetail = (id: string) => {
  return get<ApiResponse<AgentDetail>>(`/agent/detail/${id}`)
}
