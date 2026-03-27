// develop.ts
import { get, post } from '../utils/request'
import type { ApiResponse } from '@/types'

/**
 * 发布应用基础信息
 */
export interface PublishAgentVO {
  agentId: number
  agentType: string
  applicationPackageType: number
  configList: string
  createTime: string
  currentVersion: string
  description: string
  detailContent: string
  developerId: number
  freeTrialConfig: string
  id: number
  industryCode: string
  industryTypeCode: string
  initialReleaseTime: string
  isFreeTrial: number
  lastUpdateTime: string
  logoUrl: string
  name: string
  offlineTime: string
  pricingConfig: string
  productDisplay: string
  riskControlStrategy: string
  status: number
  step: number
  submissionTime: string
  tag: string
  tenantId: string
  updateExplanation: string
  updateTime: string
  versionType: string
  [key: string]: any
}

/**
 * 发布应用 DTO（用于保存/发布）
 */
export interface PublishAgentDTO {
  agentId?: number
  agentType?: string
  applicationPackageType?: number
  configList?: string
  currentVersion?: string
  description?: string
  detailContent?: string
  developerId?: number
  freeTrialConfig?: string
  id?: number
  industryCode?: string
  industryTypeCode?: string
  isFreeTrial?: number
  logoUrl?: string
  name?: string
  pricingConfig?: string
  productDisplay?: string
  riskControlStrategy?: string
  status?: number
  step?: number
  tag?: string
  updateExplanation?: string
  versionType?: string
  [key: string]: any
}



/**
 * 根据条件获取发布应用列表
 * @param name 名称
 * @param status 状态
 */
export const getApplicationListByCondition = (name: string, status: number) => {
  return get<ApiResponse<PublishAgentVO[]>>(
    `${__SCS_MARKET_CENTER__}/develop/application/getListByCondition`,
    { name, status }
  )
}

/**
 * 保存应用信息-草稿
 * @param applicationDTO 应用信息
 */
export const saveApplication = (applicationDTO: PublishAgentDTO) => {
  return post<ApiResponse<string>>(
    `${__SCS_MARKET_CENTER__}/develop/application/saveApplication`,
    applicationDTO
  )
}

/**
 * 发布应用
 * @param applicationDTO 应用信息
 */
export const publishApplication = (applicationDTO: PublishAgentDTO) => {
  return post<ApiResponse<string>>(
    `${__SCS_MARKET_CENTER__}/develop/application/publishApplication`,
    applicationDTO
  )
}

/**
 * 应用包下架
 * @param agentId 应用ID
 */
export const offlineAppPackage = (agentId: number) => {
  return post<ApiResponse<number>>(
    `${__SCS_MARKET_CENTER__}/develop/application/offlineAppPackage?agentId=${agentId}`,
  )
}