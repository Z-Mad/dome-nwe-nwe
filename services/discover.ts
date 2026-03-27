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

/**
 * 获取智能体列表
 * @param params 查询参数
 */
export const getAgentList = (params?: Record<string, any>) => {
  return get<ApiResponse<Agent[]>>(`${__SCS_SERVICE__}/agent/list`, params)
}
