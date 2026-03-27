import { post } from '../utils/request'
import type { ApiResponse } from '@/types'
export interface TokenRefreshParams {
  grant_type: string
  scope: string
  refresh_token: string
  [key: string]: any
}

export interface TokenResponseData {
  access_token: string
  refresh_token: string
  token_type?: string
  user_id?: string
  [key: string]: any
}


/**
 * 刷新 Token
 */
export const refreshToken = (data: TokenRefreshParams, options?: any) => {
  return post<ApiResponse<TokenResponseData>>(`${__SCS_AUTH__}/oauth/token`, undefined, { ...options, params: data })
}

/**
 * 退出登录
 */
export const logout = () => {
  return post(`${__SCS_AUTH__}/oauth/logout`)
}
