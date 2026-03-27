// src/api/instance.ts
import { get } from '../utils/request'
import type { ApiResponse } from '@/types'

/**
 * 实例信息
 */
export interface InstanceVO {
  id: number
  name: string
  productName: string
  productId: number
  status: string // Active, Trial, etc.
  version: string
  createTime: string
  expireTime: string
  [key: string]: any
}

/**
 * 查询当前用户实例列表
 */
export const getInstanceList = () => {
  return get<ApiResponse<InstanceVO[]>>(`${__SCS_MARKET_CENTER__}/instance/list`)
}