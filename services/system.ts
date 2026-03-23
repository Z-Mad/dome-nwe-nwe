import { get, post } from '../utils/request';

// 声明全局变量以避免 TS 报错（建议放到全局 vite-env.d.ts 中）
declare const __SCS_SERVICE__: string;

export interface UserInfo {
  userId?: string;
  userName?: string;
  [key: string]: any;
}

export interface TenantInfo {
  tenantId: string;
  tenantName: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  msg: string;
}

/**
 * 获取用户信息
 * @param userId 用户 ID
 */
export const getUserInfo = (userId: string) => {
  return post<ApiResponse<UserInfo>>(`${__SCS_SERVICE__}/user/info/${userId}`);
};

/**
 * 获取租户/组织列表
 */
export const getTenantList = () => {
  return get<ApiResponse<TenantInfo[]>>(`${__SCS_SERVICE__}/tenant/list`);
};
