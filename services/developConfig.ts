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