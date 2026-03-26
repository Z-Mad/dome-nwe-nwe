import { get } from '../utils/request';


export interface Agent {
  id: string;
  type: 'method' | 'analysis';
  title: string;
  author: string;
  desc: string;
  price: string;
  downloads: number;
  rating: number;
  image: string;
  isTarget?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  msg: string;
}

/**
 * 获取智能体列表
 * @param params 查询参数
 */
export const getAgentList = (params?: Record<string, any>) => {
  return get<ApiResponse<Agent[]>>(`${__SCS_SERVICE__}/agent/list`, params);
};
