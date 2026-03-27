// developConfig.ts
import { get } from '../utils/request'
import type { ApiResponse } from '@/types'

/**
 * 配置检查项详情
 */
export interface PickDetailVO {
  name: string // 名称
  reasons: string[] // 失败原因列表
  status: number // 检查状态：1-通过，2-忽略，3-失败
}

/**
 * 配置检查结果
 */
export interface CheckConfigurationNewVO {
  dataMap: Record<string, any> // 参数
  detailVOS: PickDetailVO[] // 检查项
  modelName: string // 模块名称
  modelReason: string // 整个模块都未检验的原因
}

export interface AnalysisConfigurationDTO {
  id: string // 应用ID
  tenantId: string // 租户ID
  userId: string // 用户ID
}
export interface UninstallApplicationDTO {
  type: string // 应用ID
  tenantId: string // 租户ID
  uninstallAppId: string // 用户ID
}


/**
 * 检查应用配置完整性
 * @param appId 应用ID
 * @param type 类型
 */
export const checkExtractConfig = (appId: number, type: string) => {
  return get<ApiResponse<CheckConfigurationNewVO[]>>(
    `${__SCS_MARKET_CENTER__}/develop/config/checkExtractConfig`,
    { appId, type }
  )
}
/**
 * 检查应用配置完整性
 * @param data 配置检查参数
 */
export const analysisConfiguration = (data:AnalysisConfigurationDTO) => {
  return get<ApiResponse<any>>(
    `${__SCS_MARKET_CENTER__}/develop/config/analysisConfiguration`,
    data
  )
}

/**
 * 检查应用配置完整性
 * @param data 配置检查参数
 */
export const uninstallApplication = (data:UninstallApplicationDTO) => {
  return get<ApiResponse<any>>(
    `${__SCS_MARKET_CENTER__}/develop/config/uninstallApplication`,
    data
  )
}
