import type { ApiResponse, IPageResult } from '@/types'
import { post } from '../utils/request'

export interface IPublishableAppInfo {
  id: string
  name: string
  type: 'AI' | 'BI'
  backImgUrl: string
  createUser: string
  userName: string
  createTime: string
}
/**
 * 开发者-获取打包应用apps
 * @param id
 * @returns
 */
export function getPublishableAppList(data: { appName: string; page: number; pageSize: number }) {
  return post<ApiResponse<IPageResult<IPublishableAppInfo>>>(
    `${__SCS_DESKTOP__}/desktop/listApplications`,
    data,
  )
}
